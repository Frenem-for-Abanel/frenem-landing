import { ASSESSMENT_QUESTIONS, type AssessmentAnswerKey } from "./assessment-questions"
import { PULSE_QUESTIONS, type PulseAnswerKey } from "./pulse-questions"

export type ContactFlow =
  | "assessment"
  | "contact"
  | "pulseQuestionnaire"
  | "pulseContact"
  | "default"

export type QuestionnaireAnswerKey = AssessmentAnswerKey | PulseAnswerKey

export type ContactSubmissionInput = {
  name?: unknown
  email?: unknown
  company?: unknown
  team_size?: unknown
  interest?: unknown
  notes?: unknown
  message?: unknown
  flow?: unknown
  answers?: unknown
}

export type ValidatedContactSubmission = {
  flow: ContactFlow
  name: string
  email: string
  company: string
  team_size?: string
  interest?: string
  notes?: string
  answers?: Record<QuestionnaireAnswerKey, string>
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const BUILD_ALLOWED_ANSWERS: Record<AssessmentAnswerKey, Set<string>> = {
  q1: new Set(ASSESSMENT_QUESTIONS[0].options),
  q2: new Set(ASSESSMENT_QUESTIONS[1].options),
  q3: new Set(ASSESSMENT_QUESTIONS[2].options),
  q4: new Set(ASSESSMENT_QUESTIONS[3].options),
}

const PULSE_ALLOWED_ANSWERS: Record<PulseAnswerKey, Set<string>> = {
  q1: new Set(PULSE_QUESTIONS[0].options),
  q2: new Set(PULSE_QUESTIONS[1].options),
  q3: new Set(PULSE_QUESTIONS[2].options),
  q4: new Set(PULSE_QUESTIONS[3].options),
}

function asTrimmedString(value: unknown): string {
  return typeof value === "string" ? value.trim() : ""
}

/** Strip control characters that can break email headers (e.g. subject injection). */
export function sanitizeSubjectPart(value: string): string {
  return value
    .replace(/[\r\n\u0000-\u001f\u007f]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

export function parseContactFlow(flow: unknown): ContactFlow {
  if (
    flow === "assessment" ||
    flow === "contact" ||
    flow === "pulseQuestionnaire" ||
    flow === "pulseContact"
  ) {
    return flow
  }
  return "default"
}

function parseQuestionnaireAnswers(
  answers: unknown,
  allowed: Record<"q1" | "q2" | "q3" | "q4", Set<string>>
): { ok: true; data: Record<"q1" | "q2" | "q3" | "q4", string> } | { ok: false; error: string } {
  if (!answers || typeof answers !== "object" || Array.isArray(answers)) {
    return { ok: false, error: "Questionnaire answers are required." }
  }

  const raw = answers as Record<string, unknown>
  const parsed = {} as Record<"q1" | "q2" | "q3" | "q4", string>

  for (const key of ["q1", "q2", "q3", "q4"] as const) {
    const value = asTrimmedString(raw[key])
    if (!value || !allowed[key].has(value)) {
      return { ok: false, error: `Invalid or missing answer for ${key}.` }
    }
    parsed[key] = value
  }

  return { ok: true, data: parsed }
}

export function validateContactSubmission(
  input: ContactSubmissionInput
): { ok: true; data: ValidatedContactSubmission } | { ok: false; error: string } {
  const flow = parseContactFlow(input.flow)
  const name = asTrimmedString(input.name)
  const email = asTrimmedString(input.email)
  const company = asTrimmedString(input.company)

  if (name.length < 2) {
    return { ok: false, error: "Name must be at least 2 characters." }
  }
  if (!EMAIL_RE.test(email)) {
    return { ok: false, error: "Please enter a valid email address." }
  }
  if (company.length < 2) {
    return { ok: false, error: "Company name must be at least 2 characters." }
  }

  const team_size = asTrimmedString(input.team_size) || undefined
  const interest = asTrimmedString(input.interest) || undefined
  const notes =
    asTrimmedString(input.notes) || asTrimmedString(input.message) || undefined

  let answers: Record<QuestionnaireAnswerKey, string> | undefined

  if (flow === "assessment") {
    const parsed = parseQuestionnaireAnswers(input.answers, BUILD_ALLOWED_ANSWERS)
    if (!parsed.ok) return parsed
    answers = parsed.data
  }

  if (flow === "pulseQuestionnaire") {
    const parsed = parseQuestionnaireAnswers(input.answers, PULSE_ALLOWED_ANSWERS)
    if (!parsed.ok) return parsed
    answers = parsed.data
  }

  return {
    ok: true,
    data: {
      flow,
      name,
      email,
      company,
      team_size,
      interest,
      notes,
      answers,
    },
  }
}

export function contactFlowLabel(flow: ContactFlow): string {
  if (flow === "assessment") return "HR Maturity Assessment"
  if (flow === "contact") return "Build Contact"
  if (flow === "pulseQuestionnaire") return "Pulse Read"
  if (flow === "pulseContact") return "Pulse Contact"
  return "Contact Form"
}

export function contactFlowHeading(flow: ContactFlow): string {
  if (flow === "assessment") return "New HR Maturity Assessment"
  if (flow === "contact") return "New Build Contact Request"
  if (flow === "pulseQuestionnaire") return "New Pulse Read"
  if (flow === "pulseContact") return "New Pulse Contact Request"
  return "New Contact Form Submission"
}

export function buildContactEmailSubject(flow: ContactFlow, name: string): string {
  return `New ${contactFlowLabel(flow)} from ${sanitizeSubjectPart(name)}`
}
