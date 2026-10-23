import fs from "node:fs"
import path from "node:path"
import matter from "gray-matter"
import readingTime from "reading-time"
import { asDateString, proseOf, SLUG_RE, YAML_ENGINE } from "../engineering/content"

/**
 * Guides: buyer-facing explainers on organisation design and diagnostics,
 * written for the people who run companies rather than for engineers. MDX
 * on the filesystem like Engineering, validated at build time; the build
 * fails loudly on any violation.
 *
 * Guides teach. They make no client claims and quote no statistics the
 * site cannot source; product mentions link to the product pages.
 */

export type GuideProduct = "pulse" | "build" | "prism"

export interface Guide {
  slug: string
  title: string
  /** One or two sentences: the meta description and the hub card. */
  summary: string
  /** First published, YYYY-MM-DD. */
  date: string
  /** Last meaningful revision, YYYY-MM-DD. Defaults to `date`. */
  updated: string
  /** The product this guide leads to; sets the tint and the closing CTA. */
  product?: GuideProduct
  body: string
  readingTime: string
  wordCount: number
}

const ALLOWED_KEYS = new Set(["title", "summary", "date", "updated", "product", "draft"])
const PRODUCTS: GuideProduct[] = ["pulse", "build", "prism"]
const CONTENT_DIR = path.join(process.cwd(), "content", "guides")
const MAX_SUMMARY = 170

function validate(file: string, slug: string, data: Record<string, unknown>, body: string, problems: string[]): Guide | null {
  const issues: string[] = []
  for (const key of Object.keys(data)) {
    if (!ALLOWED_KEYS.has(key)) issues.push(`unknown frontmatter key "${key}"`)
  }
  if (!SLUG_RE.test(slug)) issues.push(`filename must be a kebab-case slug, got "${slug}"`)
  if (typeof data.title !== "string" || !data.title.trim()) issues.push(`"title" is required`)
  if (typeof data.summary !== "string" || !data.summary.trim()) {
    issues.push(`"summary" is required`)
  } else if (data.summary.trim().length > MAX_SUMMARY) {
    issues.push(`"summary" must fit a search snippet (${MAX_SUMMARY} characters or fewer)`)
  }
  const date = asDateString(data.date)
  if (!date) issues.push(`"date" is required as "YYYY-MM-DD"`)
  const updated = data.updated === undefined ? date : asDateString(data.updated)
  if (data.updated !== undefined && !updated) issues.push(`"updated" must be "YYYY-MM-DD"`)
  if (date && updated && updated < date) issues.push(`"updated" cannot be before "date"`)
  if (data.product !== undefined && !PRODUCTS.includes(data.product as GuideProduct)) {
    issues.push(`"product" must be one of: ${PRODUCTS.join(" | ")}`)
  }
  if (/—/.test(body) || /—/.test(String(data.title)) || /—/.test(String(data.summary))) {
    issues.push(`house style: no em dashes`)
  }

  if (issues.length) {
    problems.push(...issues.map((issue) => `${file}: ${issue}`))
    return null
  }
  const prose = proseOf(body)
  return {
    slug,
    title: (data.title as string).trim(),
    summary: (data.summary as string).trim(),
    date: date as string,
    updated: updated as string,
    product: data.product as GuideProduct | undefined,
    body,
    readingTime: readingTime(prose).text,
    wordCount: prose.split(/\s+/).filter(Boolean).length,
  }
}

/** Read and validate a guides directory, newest first. Exported for tests. */
export function loadGuides(dir: string): Guide[] {
  if (!fs.existsSync(dir)) return []
  const problems: string[] = []
  const guides: Guide[] = []
  for (const name of fs.readdirSync(dir).sort()) {
    if (name.startsWith(".")) continue
    const file = `content/guides/${name}`
    if (!name.endsWith(".mdx")) {
      problems.push(`${file}: only .mdx files belong in content/guides/`)
      continue
    }
    const { data, content } = matter(fs.readFileSync(path.join(dir, name), "utf8"), {
      engines: { yaml: YAML_ENGINE },
    })
    const record = data as Record<string, unknown>
    if (record.draft === true) continue
    if (record.draft !== undefined && record.draft !== false) {
      problems.push(`${file}: "draft" must be a boolean`)
      continue
    }
    const guide = validate(file, name.slice(0, -".mdx".length), record, content, problems)
    if (guide) guides.push(guide)
  }
  if (problems.length) {
    throw new Error(`Guide content validation failed:\n${problems.map((p) => `  - ${p}`).join("\n")}`)
  }
  return guides.sort((a, b) => (a.date === b.date ? a.slug.localeCompare(b.slug) : b.date.localeCompare(a.date)))
}

let cache: Guide[] | null = null

export function getGuides(): Guide[] {
  if (cache && process.env.NODE_ENV === "production") return cache
  cache = loadGuides(CONTENT_DIR)
  return [...cache]
}

export function getGuideBySlug(slug: string): Guide | undefined {
  return getGuides().find((guide) => guide.slug === slug)
}

export function guidePath(guide: Pick<Guide, "slug">): string {
  return `/guides/${guide.slug}`
}
