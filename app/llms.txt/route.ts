import { getAllEntries, getEssays } from "../../lib/engineering/content"
import { BUILD_FAQS, PULSE_FAQS } from "../utils/faqs"
import { SITE_URL } from "../utils/site"

export const dynamic = "force-static"

/**
 * llms.txt (llmstxt.org): a plain-text map of the site for AI assistants and
 * answer engines. Every line restates copy that is already on the pages;
 * update it when the products' positioning changes.
 */
function questions(items: Array<{ question: string; answer: string }>, path: string) {
  return items.map((item) => `- [${item.question}](${SITE_URL}${path}): ${item.answer}`).join("\n")
}

export function GET() {
  const essays = getEssays()
    .map((essay) => `- [${essay.title}](${SITE_URL}/engineering/${essay.slug}): ${essay.summary}`)
    .join("\n")
  const notes = getAllEntries()
    .filter((entry) => entry.type !== "essay")
    .map((entry) => `- [${entry.title}](${SITE_URL}/engineering/log#${entry.slug}): ${entry.summary}`)
    .join("\n")

  const body = `# Frenem

> Frenem is an organisation clarity firm for scaling companies. Pulse maps how your people actually work together, Build designs the structure your strategy needs, and Prism keeps that design current as you scale.

Frenem is built by people who have done organisation work in the room for decades, with a combined 100+ years of consulting experience. The three products work as one loop: diagnose, design, operate.

## Products

- [Pulse: relational diagnostics](${SITE_URL}/pulse): Engagement surveys measure how people feel. Pulse measures how they work together: exit risk, hidden brokers, the manager effect, and cross-functional friction. It delivers three report cuts (an Individual Report for every employee, an Org Pulse Report for leadership, and a Relational Network Map) with privacy by design and no surveillance.
- [Build: organisation design](${SITE_URL}/build): Organisation design for founder-led businesses: faster decisions, clear ownership, controls built into how the business runs, and a leadership bench ready to step up. Take the whole of Build, or only the parts you need.
- [Prism: the operating record](${SITE_URL}/prism): The organisation, kept current: live org charts, who owns what, how it's measured, governance, and a full audit trail.

## Questions about Pulse

${questions(PULSE_FAQS, "/pulse")}

## Questions about Build

${questions(BUILD_FAQS, "/build")}

## Engineering

- [Frenem Engineering](${SITE_URL}/engineering): Essays and field notes on the method, design, and trust decisions behind the clarity suite.
- [Engineering log](${SITE_URL}/engineering/log): Essays, shipped changes, and notes, newest first.
${essays}
${notes}

## Contact

- [Get in touch](${SITE_URL}/?intent=contact): Opens the contact form. Tell us what's breaking, whether that's attrition, structure, or clarity, and we'll point you at the right starting place.
`

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}
