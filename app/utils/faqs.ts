/**
 * Questions printed on the home page, Pulse, Build, and Prism. Schema, the
 * pages, and llms.txt all read this list so an answer cannot drift from the
 * page. Answers restate what the pages already say; never add a claim here
 * that the site doesn't make elsewhere.
 */

export type FaqLink = { phrase: string; href: string }

export type FaqEntry = {
  question: string
  answer: string
  links?: FaqLink[]
}

export const HOME_FAQS: FaqEntry[] = [
  {
    question: "What is Frenem?",
    answer:
      "Frenem is an organisation clarity firm for scaling companies. Pulse maps how work actually moves through your business, Build designs the structure your strategy needs, and Prism keeps that design current as you scale.",
    links: [
      { phrase: "Pulse", href: "/pulse" },
      { phrase: "Build", href: "/build" },
      { phrase: "Prism", href: "/prism" },
    ],
  },
  {
    question: "Who is Frenem for?",
    answer:
      "Founders and leadership teams of growing, founder-led businesses. Typically the company has outgrown the way it was first run: decisions still route through a few people, key people leave without warning, or nobody is quite sure who owns what anymore.",
  },
  {
    question: "How is Frenem different from an engagement survey or a traditional consultancy?",
    answer:
      "Engagement surveys measure sentiment; Pulse measures how the business actually runs. And where traditional consulting hands over a slide deck after months of work, Build leaves a live operating system your team uses every day.",
  },
  {
    question: "Where should we start?",
    answer:
      "Start with what's breaking. If key people keep leaving, or work stalls when one person is out, start with Pulse. If the company still can't run without you, start with Build. If nobody's sure who owns what, start with Prism. Not sure? Tell us what's breaking and we'll point you at the right starting place.",
  },
  {
    question: "Do the three products work together?",
    answer:
      "Yes. They run as one loop: diagnose, design, operate. Pulse shows how the business actually runs, Build redesigns it, and Prism keeps that design current and checked against reality. You can start with any one of them.",
  },
]

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
      "Yes. Tick the problems you recognise in the Build planner and we'll shape Build around them, only the parts that fix what you ticked. We agree the scope with you on the first call, designed against how your organisation actually works today.",
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

export const PRISM_FAQS: FaqEntry[] = [
  {
    question: "What is Prism?",
    answer:
      "Prism is the operating record: one place for who does what, how it's measured, and where the organisation stands. Live org charts, KRAs and KPIs, goals and reviews, governance, and a full audit trail, in a tool your team will actually use.",
  },
  {
    question: "How is Prism different from an org chart in a slide deck?",
    answer:
      "A slide deck is out of date the day it's made. Prism's org charts and reporting chains update as the team grows, and every change is tracked, so the record keeps itself instead of waiting for a quarterly clean-up.",
  },
  {
    question: "What are KRAs, and how does Prism use them?",
    answer:
      "KRAs (key result areas) are the outcomes a role is responsible for. In Prism everyone can see what they own, what they're measured on, and what success looks like in their role, alongside the KPIs that track it.",
  },
  {
    question: "Can people raise concerns anonymously?",
    answer:
      "Yes. Prism includes a secure, anonymous whistleblower channel, built into the operating record rather than bolted on.",
  },
  {
    question: "How does Prism fit with Pulse and Build?",
    answer:
      "Pulse diagnoses how the business actually runs and Build designs the structure it needs. Prism keeps that design current once it's live, so it doesn't drift back into slides and spreadsheets.",
    links: [
      { phrase: "Pulse", href: "/pulse" },
      { phrase: "Build", href: "/build" },
    ],
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
