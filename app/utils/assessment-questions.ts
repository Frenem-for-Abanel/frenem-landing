export type AssessmentAnswerKey = "q1" | "q2" | "q3" | "q4"

export type AssessmentQuestion = {
  key: AssessmentAnswerKey
  title: string
  options: string[]
}

export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    key: "q1",
    title: "How many people are in your org?",
    options: ["Under 20", "20–50", "50–150", "150–500", "500+"],
  },
  {
    key: "q2",
    title: "How many distinct job titles do you have, roughly?",
    options: ["Fewer than headcount", "About 1:1 with headcount", "More titles than people"],
  },
  {
    key: "q3",
    title: "When were job levels or grades last formally reviewed?",
    options: ["Never had formal levels", "Over 2 years ago", "Within the last year"],
  },
  {
    key: "q4",
    title: "What's prompting this right now?",
    options: [
      "Fundraising",
      "Scaling headcount fast",
      "Attrition or pay equity concerns",
      "Just a general health check",
    ],
  },
]

export const ASSESSMENT_QUESTION_LABELS: Record<AssessmentAnswerKey, string> = {
  q1: "How many people are in your org?",
  q2: "How many distinct job titles do you have, roughly?",
  q3: "When were job levels or grades last formally reviewed?",
  q4: "What's prompting this right now?",
}
