/**
 * Build, pick and mix. The six founder problems each map to the Build
 * modules that fix them; a plan is the chosen problems resolved into modules
 * plus the foundations they depend on.
 *
 * The page only ever shows problems, outcomes, and a scope label. Modules
 * and dependencies stay internal: they go to the team in the plan email so
 * the first call starts from a sensible scope.
 *
 * Pure data and logic: shared by the planner UI, the contact email, and the
 * API's validation, so all three always agree on what a plan contains.
 */

export type PainId = "bottleneck" | "roles" | "execution" | "ownership" | "control" | "succession"

export type ModuleId =
  | "baseline"
  | "decision-rights"
  | "grades"
  | "job-architecture"
  | "raci"
  | "org-map"
  | "guardrails"
  | "competency"
  | "nine-box"
  | "operating-model"

export interface BuildModule {
  id: ModuleId
  title: string
  /** Lower-case name for running text, e.g. "Foundation for the job architecture". */
  short: string
  detail: string
  /** Modules this one is built on; pulled into any plan that needs it. */
  requires?: ModuleId[]
  /** Only produced when the whole organisation is in scope. */
  fullSprintOnly?: boolean
}

export interface BuildPain {
  id: PainId
  /** Short name for chips and emails. */
  short: string
  title: string
  description: string
  /** The same problem, after Build. */
  after: string
  /** The after state in a few words, for the plan summary. */
  outcome: string
  modules: ModuleId[]
}

export const BUILD_MODULES: Record<ModuleId, BuildModule> = {
  baseline: {
    id: "baseline",
    short: "baseline",
    title: "Baseline diagnostic",
    detail: "People maturity, employee data, employee voice, and how decisions actually flow today.",
  },
  "decision-rights": {
    id: "decision-rights",
    short: "decision-rights framework",
    title: "Decision-rights framework",
    detail: "Who decides what, at which level. Written down and delegated.",
  },
  grades: {
    id: "grades",
    short: "grade structure",
    title: "Grade structure & role catalog",
    detail: "Every role mapped to a grade, family, and owner.",
  },
  "job-architecture": {
    id: "job-architecture",
    short: "job architecture",
    title: "Complete job architecture",
    detail: "Job descriptions where every outcome has exactly one owner.",
    requires: ["grades"],
  },
  raci: {
    id: "raci",
    short: "RACI matrix",
    title: "RACI matrix",
    detail: "Accountability that kills the sign-off loops.",
  },
  "org-map": {
    id: "org-map",
    short: "org map",
    title: "Org map with spans & layers",
    detail: "Fewer layers, clearer spans of control, designed for execution.",
  },
  guardrails: {
    id: "guardrails",
    short: "governance guardrails",
    title: "Governance guardrails",
    detail: "The controls you define, with delegation built into the structure.",
    requires: ["decision-rights"],
  },
  competency: {
    id: "competency",
    short: "competency framework",
    title: "Competency framework",
    detail: "What good looks like at every grade, in your language.",
    requires: ["grades"],
  },
  "nine-box": {
    id: "nine-box",
    short: "9-box talent map",
    title: "9-box talent map & bench",
    detail: "A visible leadership pipeline and succession picture.",
    requires: ["competency"],
  },
  "operating-model": {
    id: "operating-model",
    short: "operating model",
    title: "Boardroom-ready operating model",
    detail: "Validated, documented, and live in your team's hands.",
    fullSprintOnly: true,
  },
}

/** Deliverable order, as the sprint produces them. */
export const MODULE_ORDER: ModuleId[] = [
  "baseline",
  "decision-rights",
  "grades",
  "job-architecture",
  "raci",
  "org-map",
  "guardrails",
  "competency",
  "nine-box",
  "operating-model",
]

export const BUILD_PAINS: BuildPain[] = [
  {
    id: "bottleneck",
    short: "Founder bottleneck",
    title: "Everything depends on you",
    description:
      "Every decision, every escalation, every fire. It all routes back to you. You're the bottleneck in your own company.",
    after: "Calls get made at the right level, without waiting on you",
    outcome: "Decisions without the bottleneck",
    modules: ["decision-rights"],
  },
  {
    id: "roles",
    short: "Unclear roles",
    title: "Roles are unclear as you grow",
    description:
      "People have titles, but nobody knows who owns what. Accountability is a conversation, not a system.",
    after: "Everyone knows what they own, and what they answer for",
    outcome: "Clear ownership",
    modules: ["grades"],
  },
  {
    id: "execution",
    short: "Slow execution",
    title: "Good people, slow execution",
    description:
      'You have the talent. But decisions crawl through layers, sign-offs, and "let me check with…" loops.',
    after: "Fewer handoffs and sign-offs, so good people move at the speed of the market",
    outcome: "Faster execution",
    modules: ["org-map", "raci"],
  },
  {
    id: "ownership",
    short: "Overlapping work",
    title: "Overlapping work, unclear ownership",
    description:
      "Multiple people doing the same thing. Nobody quite sure where their remit ends and another's begins.",
    after: "Every outcome has one owner, so work stops falling through the cracks",
    outcome: "One owner per outcome",
    modules: ["job-architecture"],
  },
  {
    id: "control",
    short: "Keeping control",
    title: "Professionalise, but keep control",
    description:
      'You know you need structure. But you\'ve seen what "consultants" do. You don\'t want to lose your company\'s soul.',
    after: "Controls you define, built into how the business runs, so you let go without losing grip",
    outcome: "Control, built in",
    modules: ["guardrails"],
  },
  {
    id: "succession",
    short: "Succession risk",
    title: "Succession feels risky",
    description:
      "There's no visible pipeline. No structured bench. If a key person walks, the plan walks with them.",
    after: "A leadership bench ready to step up, so the business never hinges on one person",
    outcome: "A bench ready to lead",
    modules: ["competency", "nine-box"],
  },
]

const PAIN_IDS = new Set<string>(BUILD_PAINS.map((p) => p.id))

export interface PlannedModule extends BuildModule {
  /** Pulled in because another chosen module is built on it. */
  foundation: boolean
  /** Chosen modules that depend on this one (for foundations). */
  neededBy: ModuleId[]
  /** The selected problems this module answers. */
  answers: PainId[]
}

/** How much of Build a plan covers, in words rather than weeks. */
export type BuildScope = "focused" | "broad" | "complete"

export const SCOPE_LABELS: Record<BuildScope, string> = {
  focused: "A focused Build",
  broad: "A broader Build",
  complete: "The complete Build",
}

export interface BuildPlan {
  pains: BuildPain[]
  modules: PlannedModule[]
  scope: BuildScope | null
  isFullSprint: boolean
}

export function scopeFor(count: number): BuildScope | null {
  if (count <= 0) return null
  if (count >= BUILD_PAINS.length) return "complete"
  return count <= 2 ? "focused" : "broad"
}

/** Resolve chosen problems into modules and the foundations they rest on. */
export function resolveBuildPlan(selected: readonly PainId[]): BuildPlan {
  const chosenPains = new Set(selected)
  const pains = BUILD_PAINS.filter((p) => chosenPains.has(p.id))
  const isFullSprint = pains.length === BUILD_PAINS.length

  const chosen = new Set<ModuleId>(pains.flatMap((p) => p.modules))
  const included = new Set<ModuleId>(chosen)
  const queue = [...chosen]
  while (queue.length) {
    const id = queue.pop()!
    for (const dep of BUILD_MODULES[id].requires ?? []) {
      if (!included.has(dep)) {
        included.add(dep)
        queue.push(dep)
      }
    }
  }
  if (isFullSprint) included.add("operating-model")
  if (included.size > 0) included.add("baseline")

  const modules: PlannedModule[] = MODULE_ORDER.filter((id) => included.has(id)).map((id) => {
    const m = BUILD_MODULES[id]
    return {
      ...m,
      foundation: !chosen.has(id) && id !== "baseline" && !m.fullSprintOnly,
      neededBy: MODULE_ORDER.filter((other) => included.has(other) && BUILD_MODULES[other].requires?.includes(id)),
      answers: pains.filter((p) => p.modules.includes(id)).map((p) => p.id),
    }
  })

  return { pains, modules, scope: scopeFor(pains.length), isFullSprint }
}

/**
 * Validate an untrusted list of problem ids (API payloads, URL params).
 * Returns the ids in canonical order with duplicates removed, or null when
 * the input isn't a non-empty list of known ids.
 */
export function parsePainIds(input: unknown): PainId[] | null {
  if (!Array.isArray(input) || input.length === 0 || input.length > BUILD_PAINS.length * 2) return null
  if (!input.every((v) => typeof v === "string" && PAIN_IDS.has(v))) return null
  const set = new Set(input as PainId[])
  return BUILD_PAINS.map((p) => p.id).filter((id) => set.has(id))
}
