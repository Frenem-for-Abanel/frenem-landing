import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

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

    const teamSizeRow = team_size ? `<p><strong>Team size:</strong> ${team_size}</p>` : ""
    const interestRow = interest ? `<p><strong>Interested in:</strong> ${interest}</p>` : ""
    const messageRow = messageContent
      ? `<p><strong>Message:</strong></p><p>${messageContent}</p>`
      : ""

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: ['antony.paul@abanel.com','sanjay.antony@abanel.com'], // Multiple recipients
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company}</p>
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
