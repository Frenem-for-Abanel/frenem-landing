import type { ProductKey } from "./product"

/**
 * The organisation glossary: plain definitions of the terms Frenem's
 * products and guides use. Each entry opens with a one-sentence definition
 * that can be quoted on its own, then a short explanation. Definitions are
 * general knowledge, never claims about clients or results; product links
 * say only what the product pages already say.
 */

export interface GlossaryTerm {
  slug: string
  term: string
  /** Other names people search for. */
  aka?: string[]
  /** One sentence, quotable on its own. */
  definition: string
  /** Two or three short paragraphs. */
  body: string[]
  related: string[]
  /** The product this concept leads to. */
  product?: ProductKey
  /** A guide that goes deeper, by slug. */
  guide?: string
}

export const GLOSSARY: GlossaryTerm[] = [
  {
    slug: "organisational-network-analysis",
    term: "Organisational network analysis (ONA)",
    aka: ["ONA", "organizational network analysis", "relational diagnostics"],
    definition:
      "Organisational network analysis (ONA) maps the working relationships between people in an organisation to show how information, decisions, and help actually flow, regardless of the formal structure.",
    body: [
      "Where an org chart shows reporting lines, a network map shows who people actually depend on. The results reveal patterns the chart cannot: hidden brokers who connect groups, overloaded hubs, isolated people, and teams that rarely work together.",
      "ONA data is collected either passively, from email, calendar, and chat metadata, or actively, by asking people short questions about who they work with. Survey-based ONA captures the quality of relationships and is easier to run in a way employees trust.",
    ],
    related: ["hidden-broker", "betweenness-centrality", "cross-functional-friction", "manager-effect"],
    product: "pulse",
    guide: "what-is-organisational-network-analysis",
  },
  {
    slug: "hidden-broker",
    term: "Hidden broker",
    aka: ["network broker", "boundary spanner"],
    definition:
      "A hidden broker is a person who connects groups that would otherwise not work together, usually without a title or role that reflects it.",
    body: [
      "Brokers keep information and decisions moving between teams, functions, or locations. Because the role is informal, the organisation often does not know it depends on them until they leave and two parts of the business quietly stop coordinating.",
      "Identifying brokers lets leaders recognise the work, spread the load, and plan for their absence before it becomes a problem.",
    ],
    related: ["organisational-network-analysis", "betweenness-centrality", "regretted-attrition"],
    product: "pulse",
    guide: "what-is-organisational-network-analysis",
  },
  {
    slug: "betweenness-centrality",
    term: "Betweenness centrality",
    definition:
      "Betweenness centrality is a network measure of how often a person sits on the shortest path between two other people, and so how much the flow of work depends on them.",
    body: [
      "People with high betweenness are the bridges in a network. They are often brokers between groups, and they are also potential bottlenecks: if too much routes through one person, work slows when they are busy and stalls when they leave.",
      "It is one of several standard measures in organisational network analysis, alongside degree (how many connections someone has) and density (how connected a group is internally).",
    ],
    related: ["hidden-broker", "organisational-network-analysis", "founder-bottleneck"],
    product: "pulse",
  },
  {
    slug: "cross-functional-friction",
    term: "Cross-functional friction",
    aka: ["silos", "handoff friction"],
    definition:
      "Cross-functional friction is the effort lost when work has to move between teams or functions that are poorly connected, through unclear handoffs, slow decisions, or missing relationships.",
    body: [
      "Some separation between teams is healthy. Friction becomes costly when teams that depend on each other have thin working ties, so handoffs fail, decisions take the long way round, and problems surface late.",
      "Network analysis shows where friction clusters. The fix is usually at the interface: clearer ownership of the handoff, shared routines, or a change in structure.",
    ],
    related: ["organisational-network-analysis", "decision-rights", "operating-model"],
    product: "pulse",
  },
  {
    slug: "manager-effect",
    term: "Manager effect",
    definition:
      "The manager effect is the difference a team's manager makes to how its people work together, visible when teams with the same structure show very different collaboration patterns.",
    body: [
      "Two teams can have identical reporting lines and still work in completely different ways: one well connected inside and out, the other isolated and dependent on its manager for everything. The difference usually traces back to how each is led.",
      "Seeing the manager effect helps leaders spread good practice and support managers whose teams are becoming isolated.",
    ],
    related: ["organisational-network-analysis", "span-of-control", "regretted-attrition"],
    product: "pulse",
  },
  {
    slug: "regretted-attrition",
    term: "Regretted attrition",
    aka: ["regrettable attrition", "regretted turnover"],
    definition:
      "Regretted attrition is the loss of employees the organisation wanted to keep, as opposed to departures it expected or accepted.",
    body: [
      "Overall attrition hides what matters most. Losing a strong performer, a key broker, or the only person who understands a system costs far more than the headline turnover number suggests.",
      "Regretted exits often follow warning signs that engagement scores miss, such as growing isolation, overload, or friction with a manager. Relationship data can surface those signs while there is still time to act.",
    ],
    related: ["hidden-broker", "manager-effect", "succession-bench"],
    product: "pulse",
  },
  {
    slug: "decision-rights",
    term: "Decision rights",
    definition:
      "Decision rights are the agreed answer to who makes each important kind of decision, who must be consulted, and who needs to know afterwards.",
    body: [
      "Clear decision rights let decisions happen at the right level and speed. Without them, decisions drift upward until most of them land with the founder or CEO, and execution slows to the pace of one calendar.",
      "Frameworks such as RAPID, RACI, and DACI help make decision rights explicit. What matters most is writing the answer down, naming one decider per decision, and sticking to it.",
    ],
    related: ["rapid", "raci", "daci", "delegation-of-authority", "founder-bottleneck"],
    product: "build",
    guide: "decision-rights-frameworks-rapid-raci-daci",
  },
  {
    slug: "rapid",
    term: "RAPID",
    aka: ["RAPID decision framework", "Bain RAPID"],
    definition:
      "RAPID is a decision-making framework, developed at Bain & Company, that assigns five roles to a decision: Recommend, Agree, Perform, Input, and Decide.",
    body: [
      "Recommend proposes a course of action. Agree must sign off, usually for legal or policy reasons. Perform carries out the decision. Input gives views that are considered but not binding. Decide makes the final call; there is one.",
      "RAPID's main value is separating input from veto. Keeping the Agree list short and naming a single Decide unblocks many stalled decisions.",
    ],
    related: ["decision-rights", "raci", "daci"],
    product: "build",
    guide: "decision-rights-frameworks-rapid-raci-daci",
  },
  {
    slug: "raci",
    term: "RACI",
    aka: ["RACI matrix", "responsibility assignment matrix"],
    definition:
      "RACI is a responsibility framework that assigns four roles to a task or decision: Responsible, Accountable, Consulted, and Informed.",
    body: [
      "Responsible does the work. Accountable owns the outcome and signs it off; there should be exactly one. Consulted gives input beforehand. Informed is told afterwards.",
      "RACI is well suited to clarifying ownership of recurring work. Used for decisions, it can slow things down when too many people are marked Consulted.",
    ],
    related: ["decision-rights", "rapid", "daci", "operating-model"],
    product: "build",
    guide: "decision-rights-frameworks-rapid-raci-daci",
  },
  {
    slug: "daci",
    term: "DACI",
    aka: ["DACI framework"],
    definition:
      "DACI is a decision-making framework that assigns four roles: Driver, Approver, Contributors, and Informed.",
    body: [
      "The Driver runs the decision process and keeps it moving. The Approver makes the decision; there is one. Contributors provide expertise and input. Informed are told the outcome.",
      "DACI is light and quick to adopt, and is popular for project and product decisions.",
    ],
    related: ["decision-rights", "rapid", "raci"],
    product: "build",
    guide: "decision-rights-frameworks-rapid-raci-daci",
  },
  {
    slug: "founder-bottleneck",
    term: "Founder bottleneck",
    aka: ["founder dependency", "key person dependency"],
    definition:
      "A founder bottleneck is when a company's decisions still route through its founder after the business has outgrown that way of working, so the company can only move as fast as the founder can.",
    body: [
      "Common signs include approvals queuing when the founder travels, leaders bringing decisions they could make themselves, and decisions being made twice. It is usually the result of habit and missing structure rather than a founder's choice.",
      "Unwinding it means writing down decision rights, building control into the system instead of personal approval, making ownership explicit, and developing leaders who can take decisions on.",
    ],
    related: ["decision-rights", "delegation-of-authority", "succession-bench", "betweenness-centrality"],
    product: "build",
    guide: "founder-bottleneck",
  },
  {
    slug: "delegation-of-authority",
    term: "Delegation of authority",
    aka: ["DoA", "authority matrix", "approval matrix"],
    definition:
      "A delegation of authority sets out which roles may approve which decisions, and up to what limits of value or risk.",
    body: [
      "It turns decision rights into thresholds: a manager approves spend up to one level, a director up to the next, and only exceptions above that reach the CEO or board.",
      "A clear delegation of authority speeds up routine decisions and strengthens control at the same time, because approvals follow written rules and leave a record.",
    ],
    related: ["decision-rights", "governance", "founder-bottleneck"],
    product: "build",
  },
  {
    slug: "job-architecture",
    term: "Job architecture",
    aka: ["job framework", "role architecture"],
    definition:
      "Job architecture is the structured framework of roles in an organisation: job families, levels, and what each role is accountable for.",
    body: [
      "It gives every role a clear place, scope, and level, which makes hiring, pay, promotion, and ownership consistent as the company grows.",
      "Without it, titles drift, two people believe they own the same thing, and decisions come back to the top because nobody is sure whose they are.",
    ],
    related: ["job-levelling", "span-of-control", "operating-model"],
    product: "build",
  },
  {
    slug: "job-levelling",
    term: "Job levelling",
    aka: ["job leveling", "grading", "career levels"],
    definition:
      "Job levelling is the practice of placing roles on a consistent set of levels or grades according to their scope, complexity, and impact.",
    body: [
      "Levels make it possible to compare roles across functions, set fair pay bands, and show people what progression looks like.",
      "Levelling is one part of job architecture, alongside job families and role definitions.",
    ],
    related: ["job-architecture", "succession-bench"],
    product: "build",
  },
  {
    slug: "span-of-control",
    term: "Span of control",
    aka: ["span of management", "manager span"],
    definition:
      "Span of control is the number of people who report directly to one manager.",
    body: [
      "Spans that are too narrow add layers and slow decisions. Spans that are too wide leave managers without time to coach or decide well. The right span depends on how similar the work is, how experienced the team is, and how much the manager also does themselves.",
      "Span of control is one of the few things an org chart shows directly, which makes it a useful first check on structure.",
    ],
    related: ["job-architecture", "operating-model", "manager-effect"],
    product: "build",
    guide: "org-chart-vs-operating-model",
  },
  {
    slug: "succession-bench",
    term: "Succession bench",
    aka: ["leadership bench", "succession planning", "bench strength"],
    definition:
      "A succession bench is the set of people ready, or being developed, to step into critical roles if the current holder moves on.",
    body: [
      "A strong bench lets a business keep running through departures and lets founders hand off responsibility with confidence. A thin bench is one of the organisation risks investors look for.",
      "Building a bench means naming the critical roles, identifying who could hold each one now and later, and closing the gap deliberately.",
    ],
    related: ["founder-bottleneck", "regretted-attrition", "job-levelling"],
    product: "build",
  },
  {
    slug: "kra-vs-kpi",
    term: "KRA vs KPI",
    aka: ["KRA", "KPI", "key result area", "key performance indicator"],
    definition:
      "A key result area (KRA) is an outcome a role is responsible for; a key performance indicator (KPI) is the measure that shows how well that outcome is being delivered.",
    body: [
      "KRAs say what someone owns, such as customer retention or on-time delivery. KPIs put a number on it, such as renewal rate or percentage of orders shipped on time. Each KRA usually has one or more KPIs.",
      "Writing both down for every role makes ownership and expectations visible, rather than something people discover at review time.",
    ],
    related: ["operating-model", "operating-record", "job-architecture"],
    product: "prism",
  },
  {
    slug: "operating-model",
    term: "Operating model",
    aka: ["target operating model", "organisational operating model"],
    definition:
      "An operating model describes how a business turns strategy into results: who decides, who owns what, how work moves between teams, how performance is measured, and how the business is governed.",
    body: [
      "The org chart is one view of the operating model, and the least detailed. Most organisational problems sit in the parts a chart cannot show, such as decision rights, ownership between teams, and measurement.",
      "Designing an operating model means making those parts explicit; running one well means keeping them current as the business changes.",
    ],
    related: ["decision-rights", "operating-record", "governance", "span-of-control"],
    product: "build",
    guide: "org-chart-vs-operating-model",
  },
  {
    slug: "operating-record",
    term: "Operating record",
    definition:
      "An operating record is a single, current record of how an organisation is set up: reporting lines, who owns what, how it is measured, and how it is governed, with a history of every change.",
    body: [
      "Most companies keep these pieces in different places: a chart on a slide, KPIs in a spreadsheet, decision rights in a deck from the last restructure. Each goes out of date at its own pace.",
      "An operating record brings them together and keeps them current as part of the work, so the organisation's design does not drift back into slides.",
    ],
    related: ["operating-model", "kra-vs-kpi", "governance"],
    product: "prism",
    guide: "org-chart-vs-operating-model",
  },
  {
    slug: "governance",
    term: "Governance",
    aka: ["corporate governance", "organisational governance"],
    definition:
      "Governance is the system of rules, roles, and checks by which a business directs and controls itself.",
    body: [
      "In practice it covers who can approve what, how decisions are reviewed, how performance and risk are reported, how concerns can be raised safely, and how changes are recorded.",
      "Good governance is built into how the business runs rather than added on top, which is what lets founders delegate without losing control.",
    ],
    related: ["delegation-of-authority", "operating-record", "decision-rights"],
    product: "prism",
  },
]

const BY_SLUG = new Map(GLOSSARY.map((entry) => [entry.slug, entry]))

export function getTerm(slug: string): GlossaryTerm | undefined {
  return BY_SLUG.get(slug)
}

export function termPath(entry: Pick<GlossaryTerm, "slug">): string {
  return `/glossary/${entry.slug}`
}

/** Alphabetical, ignoring case and leading punctuation. */
export function glossaryAlphabetical(): GlossaryTerm[] {
  return [...GLOSSARY].sort((a, b) => a.term.localeCompare(b.term, "en", { sensitivity: "base" }))
}
