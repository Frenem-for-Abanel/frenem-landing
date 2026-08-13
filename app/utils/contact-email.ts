import { escapeHtml } from "./escape-html"
import { ASSESSMENT_QUESTION_LABELS } from "./assessment-questions"
import { PULSE_QUESTION_LABELS } from "./pulse-questions"
import {
  contactFlowHeading,
  contactFlowLabel,
  type ValidatedContactSubmission,
} from "./contact-submission"

const ACCENT = "#ff5b1f"
const INK = "#0a0a0a"
const MUTED = "#6e6e6a"

function row(label: string, value: string): string {
  return `
    <tr>
      <td style="padding:8px 16px 8px 0;color:${MUTED};font-size:13px;white-space:nowrap;vertical-align:top;">${label}</td>
      <td style="padding:8px 0;color:${INK};font-size:14px;font-weight:600;">${value}</td>
    </tr>`
}

/** Internal notification email for a validated contact submission. */
export function buildContactEmailHtml(data: ValidatedContactSubmission): string {
  const safeName = escapeHtml(data.name)
  const safeEmail = escapeHtml(data.email)
  const safeCompany = escapeHtml(data.company)

  const rows = [
    data.flow !== "default" ? row("Flow", escapeHtml(contactFlowLabel(data.flow))) : "",
    row("Name", safeName),
    row("Email", `<a href="mailto:${safeEmail}" style="color:${ACCENT};">${safeEmail}</a>`),
    row("Company", safeCompany),
    data.team_size ? row("Team size", escapeHtml(data.team_size)) : "",
    data.interest ? row("Interested in", escapeHtml(data.interest)) : "",
  ].join("")

  const notesBlock = data.notes
    ? `
      <p style="margin:20px 0 6px;color:${MUTED};font-size:13px;">Message</p>
      <p style="margin:0;padding:12px 16px;background:#f5f5f2;border-radius:8px;color:${INK};font-size:14px;line-height:1.5;">${escapeHtml(
        data.notes
      )}</p>`
    : ""

  let answersBlock = ""
  if (data.answers && (data.flow === "assessment" || data.flow === "pulseQuestionnaire")) {
    const labels =
      data.flow === "pulseQuestionnaire" ? PULSE_QUESTION_LABELS : ASSESSMENT_QUESTION_LABELS
    const heading = data.flow === "pulseQuestionnaire" ? "Pulse answers" : "Assessment answers"
    const answerRows = (["q1", "q2", "q3", "q4"] as const)
      .map((key) => {
        const label = escapeHtml(labels[key])
        const value = escapeHtml(data.answers![key])
        return `
          <p style="margin:0 0 12px;">
            <span style="display:block;color:${MUTED};font-size:12px;margin-bottom:2px;">${label}</span>
            <span style="color:${INK};font-size:14px;font-weight:600;">${value}</span>
          </p>`
      })
      .join("")
    answersBlock = `
      <p style="margin:24px 0 10px;padding-top:16px;border-top:1px solid #ececea;color:${MUTED};font-size:13px;text-transform:uppercase;letter-spacing:0.06em;">${heading}</p>
      ${answerRows}`
  }

  return `
    <div style="font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;">
      <div style="border-left:3px solid ${ACCENT};padding-left:14px;margin-bottom:20px;">
        <p style="margin:0;color:${MUTED};font-size:12px;text-transform:uppercase;letter-spacing:0.08em;">frenem — website</p>
        <h2 style="margin:4px 0 0;color:${INK};font-size:20px;">${contactFlowHeading(data.flow)}</h2>
      </div>
      <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;">${rows}</table>
      ${notesBlock}
      ${answersBlock}
    </div>`
}
