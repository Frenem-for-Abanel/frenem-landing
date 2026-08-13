import fs from "node:fs"
import path from "node:path"
import matter from "gray-matter"
import readingTime from "reading-time"
import { parse as parseYaml } from "yaml"

/**
 * Engineering content model. MDX on the filesystem, git as the CMS,
 * filenames as slugs. Frontmatter is validated here at build time and the
 * build fails loudly on any violation.
 *
 * Content is trusted input: MDX compiles to JavaScript that runs during the
 * build, so anything committed under content/ has the privileges of the build
 * itself. Never render MDX from an untrusted source through this module.
 */

export type EntryType = "essay" | "shipped" | "note"
export type Pillar = "method" | "design" | "trust"
export type ProductTint = "pulse" | "build" | "prism"

export interface EngineeringEntry {
  slug: string
  title: string
  summary: string
  /** Calendar date, YYYY-MM-DD. The model has dates, never timestamps. */
  date: string
  type: EntryType
  pillar?: Pillar
  product?: ProductTint
  featured: boolean
  /** Raw MDX body with frontmatter stripped. */
  body: string
  /** e.g. "6 min read"; essays only. */
  readingTime?: string
  /** The essay's opening <Figure>; the cover renders it standalone. */
  openingFigure?: string
}

/** House byline. The schema has no author field by design. */
export const BYLINE = "Frenem Engineering"

export const TYPE_LABELS: Record<EntryType, string> = {
  essay: "Essay",
  shipped: "Shipped",
  note: "Note",
}

/** Shown as a caps label; independent of the tint. */
export const PILLAR_LABELS: Record<Pillar, string> = {
  method: "Method engineering",
  design: "Design engineering",
  trust: "Trust engineering",
}

const ENTRY_TYPES: EntryType[] = ["essay", "shipped", "note"]
const PILLARS: Pillar[] = ["method", "design", "trust"]
const PRODUCTS: ProductTint[] = ["pulse", "build", "prism"]

const CONTENT_ROOT = path.join(process.cwd(), "content")

const ALLOWED_KEYS = new Set([
  "title",
  "summary",
  "date",
  "type",
  "pillar",
  "product",
  "featured",
  "draft",
])

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/
const TLDR_RE = /<Tldr\b[^>]*>([\s\S]*?)<\/Tldr>/
const MIN_TLDR_BULLETS = 2
const MAX_TLDR_BULLETS = 4

/**
 * gray-matter reaches for js-yaml 3.x by default, which is unmaintained and
 * carries prototype-pollution advisories. Parse with the maintained `yaml`
 * package instead. It follows YAML 1.2, so a bare `2026-08-13` stays a string
 * rather than silently becoming a Date.
 */
const YAML_ENGINE = {
  parse: (input: string): object => (parseYaml(input) as object | null) ?? {},
  stringify: (): string => {
    throw new Error("engineering frontmatter is read-only")
  },
}

/** Tint wrapper class for an entry: the product's signature, else brand. */
export function tintClass(entry: Pick<EngineeringEntry, "product">): string {
  return entry.product ? `tint-${entry.product}` : "tint-brand"
}

/** Word count on prose alone: code blocks, JSX, and comments don't read. */
function proseOf(body: string): string {
  return body
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, " ")
    .replace(/<\/?[A-Za-z][^>]*>/g, " ")
}

/**
 * The first <Figure> in document order, in either form. Self-closing is
 * tested first: a lazy match for a closing tag would otherwise run from a
 * self-closing figure all the way to a later figure's `</Figure>`.
 */
function firstFigure(body: string): { index: number; text: string } | null {
  const index = body.search(/<Figure\b/)
  if (index === -1) return null
  const rest = body.slice(index)
  const selfClosing = /^<Figure\b[^>]*\/>/.exec(rest)
  if (selfClosing) return { index, text: selfClosing[0] }
  const block = /^<Figure\b[\s\S]*?<\/Figure>/.exec(rest)
  if (block) return { index, text: block[0] }
  return null
}

/** Figure-first: only the Tldr card and comments may precede the figure. */
function figureLeadsBody(body: string, figureIndex: number): boolean {
  const before = body
    .slice(0, figureIndex)
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
    .replace(TLDR_RE, "")
  return before.trim() === ""
}

interface RawFile {
  file: string
  slug: string
  dir: "essays" | "log"
  data: Record<string, unknown>
  body: string
}

/** Missing directories read as empty: git cannot track an empty content dir. */
function readDir(root: string, kind: "essays" | "log", problems: string[]): RawFile[] {
  const dir = path.join(root, kind)
  if (!fs.existsSync(dir)) return []

  const out: RawFile[] = []
  for (const name of fs.readdirSync(dir).sort()) {
    if (name.startsWith(".")) continue
    const file = `content/${kind}/${name}`
    if (!name.endsWith(".mdx")) {
      problems.push(`${file}: only .mdx files belong in content/ (filenames are slugs)`)
      continue
    }
    const raw = fs.readFileSync(path.join(dir, name), "utf8")
    const { data, content } = matter(raw, { engines: { yaml: YAML_ENGINE } })
    out.push({
      file,
      slug: name.slice(0, -".mdx".length),
      dir: kind,
      data: data as Record<string, unknown>,
      body: content,
    })
  }
  return out
}

/** A real calendar date, or null. Timestamps are rejected on purpose. */
function asDateString(value: unknown): string | null {
  if (typeof value !== "string" || !DATE_RE.test(value)) return null
  const parsed = new Date(`${value}T00:00:00.000Z`)
  if (Number.isNaN(parsed.getTime())) return null
  return parsed.toISOString().slice(0, 10) === value ? value : null
}

function validateTldr(body: string, issues: string[]): void {
  const match = TLDR_RE.exec(body)
  if (!match) {
    issues.push(
      `essays open with an authored <Tldr> card (${MIN_TLDR_BULLETS}-${MAX_TLDR_BULLETS} bullets)`
    )
    return
  }

  const inner = match[1]
  const blankLineAfterOpen = /^[^\S\n]*\n\s*\n/.test(inner)
  const blankLineBeforeClose = /\n\s*\n[^\S\n]*$/.test(inner)
  if (!blankLineAfterOpen || !blankLineBeforeClose) {
    issues.push(
      `<Tldr> needs a blank line above and below its list, or MDX renders the bullets as one paragraph`
    )
  }

  const bullets = inner.split("\n").filter((line) => /^\s*[-*]\s+\S/.test(line)).length
  if (bullets < MIN_TLDR_BULLETS || bullets > MAX_TLDR_BULLETS) {
    issues.push(
      `<Tldr> takes ${MIN_TLDR_BULLETS}-${MAX_TLDR_BULLETS} bullets, found ${bullets}`
    )
  }
}

function validate(raw: RawFile, problems: string[]): EngineeringEntry | null {
  const issues: string[] = []
  const { data, body } = raw

  for (const key of Object.keys(data)) {
    if (key === "author") {
      issues.push(`the schema has no author field; the house byline is "${BYLINE}"`)
    } else if (!ALLOWED_KEYS.has(key)) {
      issues.push(`unknown frontmatter key "${key}"`)
    }
  }

  if (!SLUG_RE.test(raw.slug)) {
    issues.push(`filename must be a kebab-case slug, got "${raw.slug}"`)
  }
  if (typeof data.title !== "string" || data.title.trim() === "") {
    issues.push(`"title" is required and must be a non-empty string`)
  }
  if (typeof data.summary !== "string" || data.summary.trim() === "") {
    issues.push(`"summary" is required and must be a non-empty string (one sentence)`)
  }

  const date = asDateString(data.date)
  if (date === null) {
    issues.push(`"date" is required as a calendar date "YYYY-MM-DD" (dates, never timestamps)`)
  }

  const type = data.type
  if (typeof type !== "string" || !ENTRY_TYPES.includes(type as EntryType)) {
    issues.push(`"type" is required and must be one of: ${ENTRY_TYPES.join(" | ")}`)
  } else if (raw.dir === "essays" && type !== "essay") {
    issues.push(`content/essays/ may only hold type "essay", got "${type}"`)
  } else if (raw.dir === "log" && type === "essay") {
    issues.push(`essays live in content/essays/, not content/log/`)
  }

  if (data.pillar !== undefined && !PILLARS.includes(data.pillar as Pillar)) {
    issues.push(`"pillar" must be one of: ${PILLARS.join(" | ")}`)
  }
  if (type === "essay" && data.pillar === undefined) {
    issues.push(`essays require a "pillar" (${PILLARS.join(" | ")})`)
  }
  if (data.product !== undefined && !PRODUCTS.includes(data.product as ProductTint)) {
    issues.push(`"product" must be one of: ${PRODUCTS.join(" | ")}`)
  }
  if (data.featured !== undefined) {
    if (typeof data.featured !== "boolean") {
      issues.push(`"featured" must be a boolean`)
    } else if (data.featured && type !== "essay") {
      issues.push(`only essays may set "featured"`)
    }
  }

  const figure = type === "essay" ? firstFigure(body) : null
  if (type === "essay") {
    validateTldr(body, issues)
    if (!figure) {
      issues.push(`figure-first rule: every essay opens with a <Figure>`)
    } else if (!figureLeadsBody(body, figure.index)) {
      issues.push(
        `figure-first rule: the opening <Figure> must come before the prose (only <Tldr> may precede it)`
      )
    }
  }

  if (issues.length > 0) {
    problems.push(...issues.map((issue) => `${raw.file}: ${issue}`))
    return null
  }

  const isEssay = type === "essay"
  return {
    slug: raw.slug,
    title: (data.title as string).trim(),
    summary: (data.summary as string).trim(),
    date: date as string,
    type: type as EntryType,
    pillar: data.pillar as Pillar | undefined,
    product: data.product as ProductTint | undefined,
    featured: data.featured === true,
    body,
    readingTime: isEssay ? readingTime(proseOf(body)).text : undefined,
    openingFigure: figure?.text,
  }
}

/**
 * Read and validate a content root, newest first. Exported so the rules can
 * be tested against fixtures; application code goes through getAllEntries.
 */
export function loadEngineeringContent(root: string): EngineeringEntry[] {
  const problems: string[] = []
  const raws = [...readDir(root, "essays", problems), ...readDir(root, "log", problems)]

  // Drafts still own their slug, so conflicts are caught before they publish.
  const seen = new Map<string, string>()
  for (const raw of raws) {
    const first = seen.get(raw.slug)
    if (first) {
      problems.push(`${raw.file}: duplicate slug "${raw.slug}" (also in ${first})`)
    } else {
      seen.set(raw.slug, raw.file)
    }
  }

  // Parked work is skipped before validation: a draft is exactly the state in
  // which frontmatter is expected to be incomplete.
  const published: RawFile[] = []
  for (const raw of raws) {
    const draft = raw.data.draft
    if (draft === undefined || draft === false) {
      published.push(raw)
    } else if (draft !== true) {
      problems.push(`${raw.file}: "draft" must be a boolean`)
    }
  }

  const entries = published
    .map((raw) => validate(raw, problems))
    .filter((entry): entry is EngineeringEntry => entry !== null)

  const pinned = entries.filter((entry) => entry.featured)
  if (pinned.length === 0) {
    problems.push(
      `exactly one published essay must set "featured: true"; none is pinned (a pinned essay left in draft counts as unpinned)`
    )
  } else if (pinned.length > 1) {
    problems.push(
      `exactly one essay may set "featured: true"; found ${pinned
        .map((entry) => entry.slug)
        .join(", ")}`
    )
  }

  if (problems.length > 0) {
    throw new Error(
      `Engineering content validation failed:\n${problems
        .map((problem) => `  - ${problem}`)
        .join("\n")}`
    )
  }

  return entries.sort((a, b) =>
    a.date === b.date ? a.slug.localeCompare(b.slug) : b.date.localeCompare(a.date)
  )
}

let cache: EngineeringEntry[] | null = null

function loadEntries(): EngineeringEntry[] {
  // Only cache in production. MDX files sit outside the module graph, so in
  // dev nothing else would notice an edit short of restarting the server.
  if (cache && process.env.NODE_ENV === "production") return cache
  cache = loadEngineeringContent(CONTENT_ROOT)
  return cache
}

/** Every published entry, newest first. */
export function getAllEntries(): EngineeringEntry[] {
  return [...loadEntries()]
}

export function getEssays(): EngineeringEntry[] {
  return loadEntries().filter((entry) => entry.type === "essay")
}

export function getEssayBySlug(slug: string): EngineeringEntry | undefined {
  return getEssays().find((entry) => entry.slug === slug)
}

/** The manually pinned essay; validation guarantees exactly one. */
export function getFeaturedEssay(): EngineeringEntry {
  const pinned = getEssays().find((entry) => entry.featured)
  if (!pinned) throw new Error(`no essay sets "featured: true"`)
  return pinned
}
