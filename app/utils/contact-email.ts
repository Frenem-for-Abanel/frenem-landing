import { escapeHtml } from "./escape-html"
import { ASSESSMENT_QUESTION_LABELS } from "./assessment-questions"
import {
  contactFlowHeading,
  contactFlowLabel,
  type ValidatedContactSubmission,
} from "./contact-submission"

export function buildContactEmailHtml(data: ValidatedContactSubmission): string {
  const safeName = escapeHtml(data.name)
  const safeEmail = escapeHtml(data.email)
  const safeCompany = escapeHtml(data.company)
  const safeTeamSize = data.team_size ? escapeHtml(data.team_size) : ""
  const safeInterest = data.interest ? escapeHtml(data.interest) : ""
  const safeNotes = data.notes ? escapeHtml(data.notes) : ""

  const teamSizeRow = safeTeamSize ? `<p><strong>Team size:</strong> ${safeTeamSize}</p>` : ""
  const interestRow = safeInterest ? `<p><strong>Interested in:</strong> ${safeInterest}</p>` : ""
  const messageRow = safeNotes ? `<p><strong>Message:</strong></p><p>${safeNotes}</p>` : ""

  const flowRow =
    data.flow !== "default"
      ? `<p><strong>Flow:</strong> ${escapeHtml(contactFlowLabel(data.flow))}</p>`
      : ""

  let answersBlock = ""
  if (data.flow === "assessment" && data.answers) {
    const rows = (["q1", "q2", "q3", "q4"] as const)
      .map((key) => {
        const label = ASSESSMENT_QUESTION_LABELS[key]
        const value = escapeHtml(data.answers![key])
        return `<p><strong>${escapeHtml(label)}</strong><br/>${value}</p>`
      })
      .join("")
    answersBlock = `<h3>Assessment answers</h3>${rows}`
  }

  return `
        <h2>${contactFlowHeading(data.flow)}</h2>
        ${flowRow}
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Company:</strong> ${safeCompany}</p>
        ${teamSizeRow}
        ${interestRow}
        ${messageRow}
        ${answersBlock}
      `
}
