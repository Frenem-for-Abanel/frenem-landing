export type AssessmentAnswerKey = "q1" | "q2" | "q3" | "q4"

export type AssessmentQuestion = {
  key: AssessmentAnswerKey
  title: string
  options: string[]
}

/** The Build assessment: four business questions that size the problem before a call. */
export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    key: "q1",
    title: "How many people are in your organisation?",
    options: ["Under 20", "20–50", "50–150", "150–500", "500+"],
  },
  {
    key: "q2",
    title: "How many decisions still wait on you?",
    options: ["Most of them", "The big ones, and plenty of small ones", "Only the ones that should"],
  },
  {
    key: "q3",
    title: "When did you last rethink how the business is organised?",
    options: ["Never, it grew as we went", "Over 2 years ago", "Within the last year"],
  },
  {
    key: "q4",
    title: "What's prompting this right now?",
    options: ["Fundraising or listing plans", "Scaling fast", "Execution feels slow", "A general health check"],
  },
]

export const ASSESSMENT_QUESTION_LABELS: Record<AssessmentAnswerKey, string> = {
  q1: "How many people are in your organisation?",
  q2: "How many decisions still wait on you?",
  q3: "When did you last rethink how the business is organised?",
  q4: "What's prompting this right now?",
}
