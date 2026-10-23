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

/**
 * Optional second delivery path: the lead as JSON to a webhook (Slack, a
 * CRM, Zapier). With both configured, a lead is safe if either one lands.
 */
async function postToWebhook(data: ValidatedContactSubmission): Promise<boolean> {
  const url = process.env.LEAD_WEBHOOK_URL
  if (!url) return false
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: `${buildContactEmailSubject(data.flow, data.name)} <${data.email}>`,
        lead: data,
        receivedAt: new Date().toISOString(),
      }),
      signal: AbortSignal.timeout(5000),
    })
    if (!res.ok) console.error(`[contact] Lead webhook answered ${res.status}`)
    return res.ok
  } catch (error) {
    console.error("[contact] Lead webhook failed:", error)
    return false
  }
}

/** Notification email to the team. In local dev without SMTP, logs it instead. */
async function sendEmail(data: ValidatedContactSubmission): Promise<boolean> {
  if (!process.env.EMAIL_USER && process.env.NODE_ENV === "production") return false
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

    if (!process.env.EMAIL_USER) {
      // jsonTransport puts the rendered mail on `message`; log it for dev visibility.
      const rendered = (info as { message?: string }).message ?? info.messageId
      console.info("[contact] SMTP not configured; logged submission instead:", rendered)
    }
    return true
  } catch (error) {
    console.error("[contact] Error sending email:", error)
    return false
  }
}

export async function POST(req: Request) {
  try {
    const { allowed } = checkRateLimit(clientKey(req))
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again in a few minutes." },
        { status: 429 }
      )
    }

    const declared = Number(req.headers.get("content-length") ?? 0)
    if (declared > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "That message is too long to send." }, { status: 413 })
    }
    const raw = await req.text()
    if (raw.length > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "That message is too long to send." }, { status: 413 })
    }
    let body: Record<string, unknown>
    try {
      const parsed: unknown = JSON.parse(raw)
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("not an object")
      body = parsed as Record<string, unknown>
    } catch {
      return NextResponse.json({ error: "The form data couldn't be read. Please try again." }, { status: 400 })
    }

    // Honeypot: bots fill the invisible "website" field. Pretend success.
    if (typeof body?.website === "string" && body.website.trim() !== "") {
      return NextResponse.json({ message: "Email sent successfully" }, { status: 200 })
    }

    const validated = validateContactSubmission(body)
    if (!validated.ok) {
      return NextResponse.json({ error: validated.error }, { status: 400 })
    }

    const { data } = validated

    // A missing delivery path in production must fail loudly: returning 200
    // without sending would silently drop leads.
    if (!process.env.EMAIL_USER && !process.env.LEAD_WEBHOOK_URL && process.env.NODE_ENV === "production") {
      console.error(
        "[contact] Neither EMAIL_USER/EMAIL_PASSWORD nor LEAD_WEBHOOK_URL is configured; rejecting submission instead of dropping it."
      )
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
    }

    const [emailed, posted] = await Promise.all([sendEmail(data), postToWebhook(data)])
    if (!emailed && !posted) {
      return NextResponse.json(
        { error: "We couldn't send your message just now. Please try again in a minute." },
        { status: 502 }
      )
    }

    return NextResponse.json({ message: "Email sent successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error sending email:", error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}
