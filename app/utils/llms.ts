import { entryPath, getAllEntries, getEssays, type EngineeringEntry } from "../../lib/engineering/content"
import { BUILD_PAINS } from "./build-plan"
import { BUILD_FAQS, HOME_FAQS, PRISM_FAQS, PULSE_FAQS, type FaqEntry } from "./faqs"
import { SITE_URL } from "./site"

/**
 * The plain-text maps of the site for AI assistants and answer engines
 * (llmstxt.org): `/llms.txt` is the index, `/llms-full.txt` the full text.
 * Everything here is built from the same data the pages render (FAQs, the
 * Build planner, essay bodies), so neither file can
 * say something the site does not.
 */

const url = (path: string) => (path === "/" ? SITE_URL : `${SITE_URL}${path}`)

export const SUMMARY =
  "Frenem is an organisation clarity firm for founder-led and scaling companies. Pulse maps how work actually moves through your business, Build designs the structure your strategy needs, and Prism keeps that design current as you scale."

const PRODUCTS = [
  {
    name: "Frenem Pulse",
    path: "/pulse",
    line: "Relational diagnostics: a survey-based organisational network analysis (ONA). Engagement surveys measure sentiment; Pulse measures how the business actually runs: key-person risk, hidden brokers, the manager effect, and cross-functional friction. Three report cuts (an Individual Report for everyone who takes part, an Org Pulse Report for leadership, and a Relational Network Map), privacy by design, and no surveillance: it never reads email, calendars, or chat.",
  },
  {
    name: "Frenem Build",
    path: "/build",
    line: "Organisation design for founder-led businesses: faster decisions, clear ownership, controls built into how the business runs, and a leadership bench ready to step up. Take the whole of Build or only the parts you need, chosen in the Build planner on the page.",
  },
  {
    name: "Frenem Prism",
    path: "/prism",
    line: "The operating record: live org charts, who owns what and how it is measured (KRAs and KPIs), goals tracked on one cycle, an anonymous whistleblower channel, and a full audit trail, kept current as the business changes.",
  },
]

function faqLines(items: FaqEntry[], path: string): string {
  return items.map((item) => `- [${item.question}](${url(path)}): ${item.answer}`).join("\n")
}

/** MDX body to plain Markdown: drop comments and figures, unwrap cards, absolutise links. */
export function mdxToMarkdown(body: string): string {
  return body
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
    .replace(/<Figure\b[^>]*\/>/g, "")
    .replace(/<Figure\b[\s\S]*?<\/Figure>/g, "")
    .replace(/<\/?Tldr\b[^>]*>/g, "")
    .replace(/\]\((\/[^)]*)\)/g, (_, path: string) => `](${SITE_URL}${path})`)
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

function entryLine(entry: EngineeringEntry): string {
  return `- [${entry.title}](${url(entryPath(entry))}): ${entry.summary}`
}

export function llmsIndex(): string {
  return `# Frenem

> ${SUMMARY}

Frenem works with founders and leadership teams of growing, founder-led businesses, wherever they are. A first conversation carries no commitment: tell us what's breaking and we'll point you at the right starting place. The full text of this site is at ${url("/llms-full.txt")}.

## Products

${PRODUCTS.map((p) => `- [${p.name}](${url(p.path)}): ${p.line}`).join("\n")}

## Questions about Frenem

${faqLines(HOME_FAQS, "/")}

## Questions about Pulse

${faqLines(PULSE_FAQS, "/pulse")}

## Questions about Build

${faqLines(BUILD_FAQS, "/build")}

## Questions about Prism

${faqLines(PRISM_FAQS, "/prism")}

## Engineering

- [Frenem Engineering](${url("/engineering")}): Essays and field notes on the method, design, and trust decisions behind the products.
${getAllEntries().map(entryLine).join("\n")}

## Contact

- [Get in touch](${url("/?intent=contact")}): Opens the contact form. We reply within one business day.
- [Start a Pulse with four questions](${url("/pulse?intent=read")}): A short questionnaire about your organisation.
- [Scope a Build](${url("/build?intent=assessment")}): A short assessment, or pick problems in the Build planner and send the plan.
`
}

export function llmsFull(): string {
  const sections: string[] = [
    `# Frenem: full text\n\n> ${SUMMARY}\n\nSource: ${SITE_URL}. Index: ${url("/llms.txt")}.`,
    `## Products\n\n${PRODUCTS.map((p) => `### ${p.name}\n\n${p.line}\n\nPage: ${url(p.path)}`).join("\n\n")}`,
    `## The six problems Build addresses\n\n${BUILD_PAINS.map(
      (pain) => `### ${pain.title}\n\n${pain.description}\n\nAfter Build: ${pain.after}.`
    ).join("\n\n")}`,
    ...[
      ["Frenem", HOME_FAQS, "/"],
      ["Pulse", PULSE_FAQS, "/pulse"],
      ["Build", BUILD_FAQS, "/build"],
      ["Prism", PRISM_FAQS, "/prism"],
    ].map(
      ([name, items, path]) =>
        `## Questions about ${name}\n\nSource: ${url(path as string)}\n\n${(items as FaqEntry[])
          .map((item) => `### ${item.question}\n\n${item.answer}`)
          .join("\n\n")}`
    ),
    `## Engineering essays\n\n${getEssays()
      .map((e) => `### ${e.title}\n\nSource: ${url(entryPath(e))}\n\n${mdxToMarkdown(e.body).replace(/^## /gm, "#### ")}`)
      .join("\n\n")}`,
  ]
  return `${sections.join("\n\n")}\n`
}
