import { getEssays } from "../../lib/engineering/content"
import { SITE_URL } from "../utils/site"

export const dynamic = "force-static"

/**
 * llms.txt (llmstxt.org): a plain-text map of the site for AI assistants and
 * answer engines. Every line restates copy that is already on the pages;
 * update it when the products' positioning changes.
 */
export function GET() {
  const essays = getEssays()
    .map((essay) => `- [${essay.title}](${SITE_URL}/engineering/${essay.slug}): ${essay.summary}`)
    .join("\n")

  const body = `# Frenem

> Frenem is an organisation clarity suite for scaling companies, from Bangalore, India. Pulse maps how your people actually work together, Build designs the structure your strategy needs, and Prism keeps it current as you scale.

Frenem is built by people who have done organisation work in the room for decades, with a combined 100+ years of consulting experience. The three products work as one loop: diagnose, design, operate.

## Products

- [Pulse: relational diagnostics](${SITE_URL}/pulse): Engagement surveys measure how people feel. Pulse measures how they work together: exit risk, hidden brokers, the manager effect, and cross-functional friction. It delivers three report cuts (an Individual Report for every employee, an Org Pulse Report for leadership, and a Relational Network Map) with privacy by design and no surveillance.
- [Build: organisation design](${SITE_URL}/build): Organisation design for founder-led businesses: faster decisions, clear ownership, controls built into how the business runs, and a leadership bench ready to step up. Take the whole of Build, or only the parts you need.
- [Prism: employee management](${SITE_URL}/prism): Lightweight employee management: live org charts, transparent KRAs and KPIs, performance review cycles, moonshot ideas, a secure whistleblower channel, and full audit trails.

## Engineering

- [Frenem Engineering](${SITE_URL}/engineering): Essays and field notes on the method, design, and trust decisions behind the clarity suite.
${essays}

## Contact

- [Get in touch](${SITE_URL}/?intent=contact): Opens the contact form. Tell us what's breaking, whether that's attrition, structure, or clarity, and we'll point you at the right starting place.
`

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}
