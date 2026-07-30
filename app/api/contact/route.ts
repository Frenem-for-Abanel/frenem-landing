import { NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { escapeHtml } from "../../utils/escape-html"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      name,
      email,
      company,
      message,
      team_size,
      interest,
      notes,
    } = body

    const messageContent = notes ?? message ?? ""

    // Create a transporter using GoDaddy SMTP settings
    const transporter = nodemailer.createTransport({
      host: "smtpout.secureserver.net",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    })

    const safeName = escapeHtml(String(name ?? ""))
    const safeEmail = escapeHtml(String(email ?? ""))
    const safeCompany = escapeHtml(String(company ?? ""))
    const safeTeamSize = team_size ? escapeHtml(String(team_size)) : ""
    const safeInterest = interest ? escapeHtml(String(interest)) : ""
    const safeMessage = messageContent ? escapeHtml(String(messageContent)) : ""

    const teamSizeRow = safeTeamSize ? `<p><strong>Team size:</strong> ${safeTeamSize}</p>` : ""
    const interestRow = safeInterest ? `<p><strong>Interested in:</strong> ${safeInterest}</p>` : ""
    const messageRow = safeMessage
      ? `<p><strong>Message:</strong></p><p>${safeMessage}</p>`
      : ""

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: ['antony.paul@abanel.com','sanjay.antony@abanel.com'], // Multiple recipients
      // to: ['arjun.ravikumar@abanel.com'], // Multiple recipients
      subject: `New Contact Form Submission from ${String(name ?? "")}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Company:</strong> ${safeCompany}</p>
        ${teamSizeRow}
        ${interestRow}
        ${messageRow}
      `,
    }

    // Send email
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
