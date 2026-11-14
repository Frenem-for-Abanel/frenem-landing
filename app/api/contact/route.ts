import { randomUUID } from "node:crypto"
import * as Sentry from "@sentry/nextjs"
import { NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { buildContactEmailHtml } from "../../utils/contact-email"
import {
  buildContactEmailSubject,
  validateContactSubmission,
  type ValidatedContactSubmission,
} from "../../utils/contact-submission"
import { checkRateLimit, clientKey } from "../../utils/rate-limit"

const RECIPIENTS = ["antony.paul@abanel.com", "sanjay.antony@abanel.com"]

/** Generous for the largest real payload (a 4,000-character message plus attribution). */
const MAX_BODY_BYTES = 16 * 1024

function logContactEvent(
  level: "INFO" | "WARNING" | "ERROR",
  message: string,
  meta: Record<string, string | number | boolean | undefined> = {}
): void {
  const entry = JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    logger: "frenem-landing.contact",
    service: "frenem-landing",
    process_role: "web",
    message,
    ...meta,
  })
  if (level === "ERROR") {
    console.error(entry)
  } else if (level === "WARNING") {
    console.warn(entry)
  } else {
    console.info(entry)
  }
}

function captureContactError(
  error: unknown,
  tags: { channel: string; flow?: string; requestId: string }
): void {
  Sentry.withScope((scope) => {
    scope.setTag("service", "frenem-landing")
    scope.setTag("contact.channel", tags.channel)
    scope.setTag("request_id", tags.requestId)
    if (tags.flow) scope.setTag("contact.flow", tags.flow)
    scope.setUser(null)
    Sentry.captureException(error instanceof Error ? error : new Error(String(error)))
  })
}

/**
 * Optional second delivery path: the lead as JSON to a webhook (Slack, a
 * CRM, Zapier). With both configured, a lead is safe if either one lands.
 */
async function postToWebhook(
  data: ValidatedContactSubmission,
  requestId: string
): Promise<boolean> {
  const url = process.env.LEAD_WEBHOOK_URL
  if (!url) return false
  const start = performance.now()
  return Sentry.startSpan({ op: "http.client.lead_webhook", name: "contact.lead_webhook" }, async () => {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Request-ID": requestId,
        },
        body: JSON.stringify({
          text: `${buildContactEmailSubject(data.flow, data.name)} <${data.email}>`,
          lead: data,
          receivedAt: new Date().toISOString(),
        }),
        signal: AbortSignal.timeout(5000),
      })
      const durationMs = Math.round(performance.now() - start)
      if (!res.ok) {
        logContactEvent("ERROR", "Lead webhook returned non-OK status", {
          request_id: requestId,
          flow: data.flow,
          status_code: res.status,
          duration_ms: durationMs,
        })
        captureContactError(new Error(`Lead webhook HTTP ${res.status}`), {
          channel: "webhook",
          flow: data.flow,
          requestId,
        })
      }
      return res.ok
    } catch (error) {
      logContactEvent("ERROR", "Lead webhook request failed", {
        request_id: requestId,
        flow: data.flow,
        duration_ms: Math.round(performance.now() - start),
      })
      captureContactError(error, {
        channel: "webhook",
        flow: data.flow,
        requestId,
      })
      return false
    }
  })
}

/** Notification email to the team. In local dev without SMTP, logs it instead. */
async function sendEmail(
  data: ValidatedContactSubmission,
  requestId: string
): Promise<boolean> {
  if (!process.env.EMAIL_USER && process.env.NODE_ENV === "production") return false
  const start = performance.now()
  return Sentry.startSpan({ op: "smtp.send", name: "contact.send_email" }, async () => {
    try {
      const transporter = process.env.EMAIL_USER
        ? nodemailer.createTransport({
            host: "smtpout.secureserver.net",
            port: 465,
            secure: true,
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASSWORD,
            },
          })
        : nodemailer.createTransport({ jsonTransport: true })

      const info = await transporter.sendMail({
        from: process.env.EMAIL_USER || "dev@localhost",
        to: RECIPIENTS,
        replyTo: data.email,
        subject: buildContactEmailSubject(data.flow, data.name),
        html: buildContactEmailHtml(data),
      })

      if (!process.env.EMAIL_USER && process.env.NODE_ENV !== "production") {
        // jsonTransport puts the rendered mail on `message`; log messageId only to keep PII out of stdout.
        logContactEvent("INFO", "SMTP not configured in dev; captured submission via jsonTransport", {
          request_id: requestId,
          flow: data.flow,
          message_id: info.messageId,
          duration_ms: Math.round(performance.now() - start),
        })
      }
      return true
    } catch (error) {
      logContactEvent("ERROR", "Contact SMTP delivery failed", {
        request_id: requestId,
        flow: data.flow,
        duration_ms: Math.round(performance.now() - start),
      })
      captureContactError(error, {
        channel: "smtp",
        flow: data.flow,
        requestId,
      })
      return false
    }
  })
}

export async function POST(req: Request) {
  const requestId = req.headers.get("x-request-id")?.trim() || randomUUID()
  const startedAt = performance.now()

  const jsonWithRequestId = (payload: Record<string, unknown>, status: number) =>
    NextResponse.json(
      status >= 500 ? { ...payload, request_id: requestId } : payload,
      {
        status,
        headers: { "X-Request-ID": requestId },
      }
    )

  try {
    const { allowed } = checkRateLimit(clientKey(req))
    if (!allowed) {
      logContactEvent("WARNING", "Contact rate limit exceeded", {
        request_id: requestId,
        status_code: 429,
      })
      return jsonWithRequestId(
        { error: "Too many requests. Please try again in a few minutes." },
        429
      )
    }

    const declared = Number(req.headers.get("content-length") ?? 0)
    if (declared > MAX_BODY_BYTES) {
      return jsonWithRequestId({ error: "That message is too long to send." }, 413)
    }
    const raw = await req.text()
    if (raw.length > MAX_BODY_BYTES) {
      return jsonWithRequestId({ error: "That message is too long to send." }, 413)
    }
    let body: Record<string, unknown>
    try {
      const parsed: unknown = JSON.parse(raw)
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("not an object")
      body = parsed as Record<string, unknown>
    } catch {
      return jsonWithRequestId(
        { error: "The form data couldn't be read. Please try again." },
        400
      )
    }

    // Honeypot: bots fill the invisible "website" field. Pretend success.
    if (typeof body?.website === "string" && body.website.trim() !== "") {
      return jsonWithRequestId({ message: "Email sent successfully" }, 200)
    }

    const validated = validateContactSubmission(body)
    if (!validated.ok) {
      return jsonWithRequestId({ error: validated.error }, 400)
    }

    const { data } = validated

    // A missing delivery path in production must fail loudly: returning 200
    // without sending would silently drop leads.
    if (!process.env.EMAIL_USER && !process.env.LEAD_WEBHOOK_URL && process.env.NODE_ENV === "production") {
      const configError = new Error(
        "Neither EMAIL_USER/EMAIL_PASSWORD nor LEAD_WEBHOOK_URL is configured in production"
      )
      logContactEvent("ERROR", configError.message, {
        request_id: requestId,
        flow: data.flow,
        status_code: 500,
      })
      captureContactError(configError, {
        channel: "configuration",
        flow: data.flow,
        requestId,
      })
      return jsonWithRequestId({ error: "Failed to send email" }, 500)
    }

    const [emailed, posted] = await Promise.all([
      sendEmail(data, requestId),
      postToWebhook(data, requestId),
    ])
    if (!emailed && !posted) {
      logContactEvent("ERROR", "All contact delivery channels failed", {
        request_id: requestId,
        flow: data.flow,
        status_code: 502,
        duration_ms: Math.round(performance.now() - startedAt),
      })
      return jsonWithRequestId(
        { error: "We couldn't send your message just now. Please try again in a minute." },
        502
      )
    }

    logContactEvent("INFO", "Contact lead delivered", {
      request_id: requestId,
      flow: data.flow,
      emailed,
      webhook_posted: posted,
      status_code: 200,
      duration_ms: Math.round(performance.now() - startedAt),
    })
    return jsonWithRequestId({ message: "Email sent successfully" }, 200)
  } catch (error) {
    logContactEvent("ERROR", "Unhandled exception in /api/contact", {
      request_id: requestId,
      status_code: 500,
      duration_ms: Math.round(performance.now() - startedAt),
    })
    captureContactError(error, { channel: "unhandled", requestId })
    return jsonWithRequestId({ error: "Failed to send email" }, 500)
  }
}
