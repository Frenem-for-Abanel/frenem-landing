import type { ProductKey } from "./product"

/**
 * The glossary: one plain sentence for each term the site uses. General
 * definitions only, never claims about clients or results. Rendered on
 * /glossary and in llms.txt, so the two always agree.
 */

export interface GlossaryTerm {
  slug: string
  term: string
  /** One sentence, quotable on its own. */
  definition: string
  /** The product the term belongs to, if any. */
  product?: ProductKey
}

export const GLOSSARY: GlossaryTerm[] = [
  {
    slug: "decision-rights",
    term: "Decision rights",
    definition:
      "The agreed answer to who makes each important kind of decision, who must be consulted, and who needs to know afterwards.",
    product: "build",
  },
  {
    slug: "delegation-of-authority",
    term: "Delegation of authority",
    definition: "A written set of limits saying which roles may approve which decisions, and up to what value or risk.",
    product: "build",
  },
  {
    slug: "rapid",
    term: "RAPID",
    definition:
      "A decision framework, developed at Bain & Company, that names who will Recommend, Agree, Perform, give Input, and Decide.",
    product: "build",
  },
  {
    slug: "raci",
    term: "RACI",
    definition: "A framework that marks who is Responsible, Accountable, Consulted, and Informed for a piece of work.",
    product: "build",
  },
  {
    slug: "founder-bottleneck",
    term: "Founder bottleneck",
    definition:
      "When a company's decisions still route through its founder after the business has outgrown that, so it can only move as fast as one calendar.",
    product: "build",
  },
  {
    slug: "leadership-bench",
    term: "Leadership bench",
    definition: "The people ready, or being prepared, to take over critical roles so the business never hinges on one person.",
    product: "build",
  },
  {
    slug: "operating-model",
    term: "Operating model",
    definition:
      "How a business turns strategy into results: who decides, who owns what, how work moves between teams, how it is measured, and how it is governed.",
    product: "build",
  },
  {
    slug: "span-of-control",
    term: "Span of control",
    definition: "The number of people who report directly to one manager.",
    product: "build",
  },
  {
    slug: "organisational-network-analysis",
    term: "Organisational network analysis (ONA)",
    definition:
      "A map of how work, information, and decisions actually move between people in a business, regardless of the formal structure.",
    product: "pulse",
  },
  {
    slug: "hidden-broker",
    term: "Hidden broker",
    definition:
      "Someone who connects parts of the business that would otherwise not work together, usually without a title that shows it.",
    product: "pulse",
  },
  {
    slug: "cross-functional-friction",
    term: "Cross-functional friction",
    definition: "The time and effort lost when work has to cross between teams that are poorly connected.",
    product: "pulse",
  },
  {
    slug: "operating-record",
    term: "Operating record",
    definition:
      "One current record of how the business is set up: reporting lines, who owns what, how it is measured, and how it is governed, with a history of every change.",
    product: "prism",
  },
  {
    slug: "governance",
    term: "Governance",
    definition: "The rules, roles, and checks by which a business directs and controls itself.",
    product: "prism",
  },
]

/** Alphabetical, for the page. */
export function glossaryAlphabetical(): GlossaryTerm[] {
  return [...GLOSSARY].sort((a, b) => a.term.localeCompare(b.term, "en", { sensitivity: "base" }))
}

/** Each term's anchor on /glossary. */
export function termPath(entry: Pick<GlossaryTerm, "slug">): string {
  return `/glossary#${entry.slug}`
}
