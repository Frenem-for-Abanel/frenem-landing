import { NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { buildContactEmailHtml } from "../../utils/contact-email"
import {
  buildContactEmailSubject,
  validateContactSubmission,
} from "../../utils/contact-submission"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const validated = validateContactSubmission(body)

    if (!validated.ok) {
      return NextResponse.json({ error: validated.error }, { status: 400 })
    }

    const { data } = validated

    const transporter = nodemailer.createTransport({
      host: "smtpout.secureserver.net",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    })

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: ["antony.paul@abanel.com", "sanjay.antony@abanel.com"],
      subject: buildContactEmailSubject(data.flow, data.name),
      html: buildContactEmailHtml(data),
    }

    await transporter.sendMail(mailOptions)

    return NextResponse.json(
      { message: "Email sent successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error sending email:", error)
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    )
  }
}
