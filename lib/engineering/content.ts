import fs from "node:fs"
import path from "node:path"
import matter from "gray-matter"
import readingTime from "reading-time"

/**
 * Engineering content model. MDX on the filesystem, git as the CMS,
 * filenames as slugs. Frontmatter is validated here at build time and the
 * build fails loudly on any violation.
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
  /** The essay's opening <Figure> block; the cover renders it standalone. */
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

const ESSAYS_DIR = path.join(process.cwd(), "content", "essays")
const LOG_DIR = path.join(process.cwd(), "content", "log")

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
const FIGURE_BLOCK_RE = /<Figure\b[\s\S]*?<\/Figure>/
const FIGURE_SELF_CLOSING_RE = /<Figure\b[^>]*\/>/

/** Tint wrapper class for an entry: the product's signature, else brand. */
export function tintClass(entry: Pick<EngineeringEntry, "product">): string {
  return entry.product ? `tint-${entry.product}` : "tint-brand"
}

function toUtcDate(date: string): Date {
  return new Date(`${date}T00:00:00.000Z`)
}

/** Neutral instant for feeds and sitemaps: midnight UTC, never a real time. */
export function neutralUtcInstant(date: string): Date {
  return toUtcDate(date)
}

/** "3 Aug 2026" - day-first, en-GB, date only. */
export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(toUtcDate(date))
}

/** "3 Aug" - for log rows, where the year marker carries the year. */
export function formatDayMonth(date: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(toUtcDate(date))
}

export function yearOf(date: string): string {
  return date.slice(0, 4)
}

/** Word count on prose only: JSX tags and MDX comments don't read. */
function proseOf(body: string): string {
  return body
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, " ")
    .replace(/<[^>]+>/g, " ")
}

interface RawFile {
  file: string
  slug: string
  dir: "essays" | "log"
  data: Record<string, unknown>
  body: string
}

function readDir(dir: string, kind: "essays" | "log", problems: string[]): RawFile[] {
  if (!fs.existsSync(dir)) {
    problems.push(`missing content directory: ${path.relative(process.cwd(), dir)}`)
    return []
  }
  const out: RawFile[] = []
  for (const name of fs.readdirSync(dir).sort()) {
    if (name.startsWith(".")) continue
    const file = path.join(path.relative(process.cwd(), dir), name)
    if (!name.endsWith(".mdx")) {
      problems.push(`${file}: only .mdx files belong in content/ (filenames are slugs)`)
      continue
    }
    const slug = name.slice(0, -".mdx".length)
    const raw = fs.readFileSync(path.join(dir, name), "utf8")
    const { data, content } = matter(raw)
    out.push({ file, slug, dir: kind, data, body: content })
  }
  return out
}

function asDateString(value: unknown): string | null {
  if (typeof value === "string" && DATE_RE.test(value)) {
    const parsed = toUtcDate(value)
    if (!Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value) {
      return value
    }
    return null
  }
  // Unquoted YAML dates parse as Date objects at midnight UTC; accept those,
  // but reject anything carrying a time component.
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    const isMidnightUtc =
      value.getUTCHours() === 0 &&
      value.getUTCMinutes() === 0 &&
      value.getUTCSeconds() === 0 &&
      value.getUTCMilliseconds() === 0
    return isMidnightUtc ? value.toISOString().slice(0, 10) : null
  }
  return null
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
  if (data.draft !== undefined && typeof data.draft !== "boolean") {
    issues.push(`"draft" must be a boolean`)
  }

  if (type === "essay") {
    if (!/<Tldr\b/.test(body)) {
      issues.push(`essays open with an authored <Tldr> card (2-4 bullets)`)
    }
    if (!FIGURE_BLOCK_RE.test(body) && !FIGURE_SELF_CLOSING_RE.test(body)) {
      issues.push(`figure-first rule: every essay opens with a <Figure>`)
    }
  }

  if (issues.length > 0) {
    problems.push(...issues.map((issue) => `${raw.file}: ${issue}`))
    return null
  }

  const isEssay = type === "essay"
  const openingFigure = isEssay
    ? (body.match(FIGURE_BLOCK_RE)?.[0] ?? body.match(FIGURE_SELF_CLOSING_RE)?.[0])
    : undefined

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
    openingFigure,
  }
}

let cache: EngineeringEntry[] | null = null

function loadEntries(): EngineeringEntry[] {
  if (cache) return cache

  const problems: string[] = []
  const raws = [
    ...readDir(ESSAYS_DIR, "essays", problems),
    ...readDir(LOG_DIR, "log", problems),
  ]

  const seen = new Map<string, string>()
  for (const raw of raws) {
    const first = seen.get(raw.slug)
    if (first) {
      problems.push(`${raw.file}: duplicate slug "${raw.slug}" (also in ${first})`)
    } else {
      seen.set(raw.slug, raw.file)
    }
  }

  const drafts = new Set(
    raws.filter((raw) => raw.data.draft === true).map((raw) => raw.slug)
  )
  const entries = raws
    .map((raw) => validate(raw, problems))
    .filter((entry): entry is EngineeringEntry => entry !== null)
    .filter((entry) => !drafts.has(entry.slug))

  const pinned = entries.filter((entry) => entry.featured)
  if (pinned.length === 0) {
    problems.push(`exactly one essay must set "featured: true"; none is pinned`)
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

  entries.sort((a, b) =>
    a.date === b.date ? a.slug.localeCompare(b.slug) : b.date.localeCompare(a.date)
  )
  cache = entries
  return entries
}

/** Every published entry, newest first. */
export function getAllEntries(): EngineeringEntry[] {
  return loadEntries()
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

/** Newest-first entries grouped by year, for the ledger's year markers. */
export function groupByYear(
  entries: EngineeringEntry[]
): { year: string; entries: EngineeringEntry[] }[] {
  const groups: { year: string; entries: EngineeringEntry[] }[] = []
  for (const entry of entries) {
    const year = yearOf(entry.date)
    const last = groups[groups.length - 1]
    if (last && last.year === year) {
      last.entries.push(entry)
    } else {
      groups.push({ year, entries: [entry] })
    }
  }
  return groups
}
