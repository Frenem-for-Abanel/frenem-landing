import { NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { buildContactEmailHtml } from "../../utils/contact-email"
import {
  buildContactEmailSubject,
  validateContactSubmission,
} from "../../utils/contact-submission"
import { checkRateLimit } from "../../utils/rate-limit"

const RECIPIENTS = ["antony.paul@abanel.com", "sanjay.antony@abanel.com"]

function clientKey(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for")
  return forwarded?.split(",")[0]?.trim() || "unknown"
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

    const body = await req.json()

    // Honeypot: bots fill the invisible "website" field. Pretend success.
    if (typeof body?.website === "string" && body.website.trim() !== "") {
      return NextResponse.json({ message: "Email sent successfully" }, { status: 200 })
    }

    const validated = validateContactSubmission(body)
    if (!validated.ok) {
      return NextResponse.json({ error: validated.error }, { status: 400 })
    }

    const { data } = validated

    // Without SMTP credentials (local dev), log the message instead of sending.
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

    return NextResponse.json({ message: "Email sent successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error sending email:", error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}
