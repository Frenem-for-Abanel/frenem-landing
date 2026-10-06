/**
 * Questions already printed on Pulse and Build. Schema, the pages, and
 * llms.txt all read this list so an answer cannot drift from the page.
 */

export type FaqLink = { phrase: string; href: string }

export type FaqEntry = {
  question: string
  answer: string
  links?: FaqLink[]
}

export const PULSE_FAQS: FaqEntry[] = [
  {
    question: "Can leadership see individual answers?",
    answer:
      "No. Individual reports go to the individual alone. Leadership sees patterns at team level and above, protected by response thresholds, never names.",
  },
  {
    question: "What does it ask of each person?",
    answer:
      "A focused set of questions, tailored to the people each person actually works with, answered through one secure link on any device. No login, no app, no survey fatigue.",
  },
  {
    question: "What do we need to provide?",
    answer:
      "One export of how the organisation is structured (reporting lines, teams, tenure), plus a short intake about what's changing in the business. That's the whole ask.",
  },
  {
    question: "Is there a minimum team size?",
    answer:
      "Pulse enforces response thresholds, so relationship and team views only appear when enough people take part. On the intro call we'll confirm whether your headcount and structure will produce a useful read.",
  },
  {
    question: "Is this monitoring or surveillance?",
    answer:
      "No. Pulse never reads email, calendars, or chat. Every data point is an answer someone chose to give, and the privacy rules are structural, not policy.",
  },
]

export const BUILD_FAQS: FaqEntry[] = [
  {
    question: "Can we do just part of Build?",
    answer:
      "Yes. Tick the problems you recognise in the planner above and we'll shape Build around them, only the parts that fix what you ticked. We agree the scope with you on the first call, designed against how your organisation actually works today.",
  },
  {
    question: "How much of leadership's time does the sprint take?",
    answer:
      "Diagnose runs on structured interviews and data you already have, so the load comes in short, scheduled bursts rather than weeks of workshops. We agree the sprint calendar around your operating rhythm before we start.",
  },
  {
    question: "What happens when the sprint ends?",
    answer:
      "You're left with an operating model your team runs day to day: who decides, who owns what, and who leads next live in the business, not in a deck. Prism can keep it current from there.",
    links: [{ phrase: "Prism", href: "/prism" }],
  },
  {
    question: "Will this feel like consultants rebuilding my company?",
    answer:
      "No. You define the guardrails; Build makes control explicit instead of taking it away. The whole point is professionalising without losing the company's soul.",
  },
  {
    question: "We're not raising or listing right now. Is this still relevant?",
    answer:
      "Capital-readiness is a by-product, not the premise. The core outcome is founder-independent execution: decisions happening at the right level without routing through you. That pays off long before any transaction.",
  },
]

export type TextSegment = { text: string; href?: string }

/** First occurrence of each phrase, left to right. Schema quotes the plain answer. */
export function linkSegments(answer: string, links: FaqLink[] = []): TextSegment[] {
  const segments: TextSegment[] = []
  let cursor = 0
  const ordered = links
    .map((link) => ({ ...link, index: answer.indexOf(link.phrase) }))
    .filter((link) => link.index >= 0)
    .sort((a, b) => a.index - b.index)

  for (const link of ordered) {
    if (link.index < cursor) continue
    if (link.index > cursor) segments.push({ text: answer.slice(cursor, link.index) })
    segments.push({ text: link.phrase, href: link.href })
    cursor = link.index + link.phrase.length
  }
  if (cursor < answer.length) segments.push({ text: answer.slice(cursor) })
  return segments.length > 0 ? segments : [{ text: answer }]
}
