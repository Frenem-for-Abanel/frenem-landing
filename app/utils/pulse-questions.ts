export type PulseAnswerKey = "q1" | "q2" | "q3" | "q4"

export type PulseQuestion = {
  key: PulseAnswerKey
  title: string
  options: string[]
}

export const PULSE_QUESTIONS: PulseQuestion[] = [
  {
    key: "q1",
    title: "How many people are you looking to pulse-check?",
    options: ["Under 50", "50–150", "150–500", "500+"],
  },
  {
    key: "q2",
    title: "What's driving this?",
    options: [
      "Rising attrition",
      "Cross-team friction or silos",
      "Manager effectiveness concerns",
      "Just want a health check",
    ],
  },
  {
    key: "q3",
    title: "Do you currently run engagement surveys?",
    options: ["Yes, regularly", "Yes, but response rates are poor", "No"],
  },
  {
    key: "q4",
    title: "Have you had unexpected resignations in the last 6 months that surprised leadership?",
    options: ["Yes, several", "One or two", "None"],
  },
]

export const PULSE_QUESTION_LABELS: Record<PulseAnswerKey, string> = {
  q1: "How many people are you looking to pulse-check?",
  q2: "What's driving this?",
  q3: "Do you currently run engagement surveys?",
  q4: "Have you had unexpected resignations in the last 6 months that surprised leadership?",
}
