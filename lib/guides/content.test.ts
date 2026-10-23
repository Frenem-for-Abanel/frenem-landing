import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { afterEach, describe, expect, it } from "vitest"
import { getGuides, loadGuides } from "./content"
import { GLOSSARY } from "../../app/utils/glossary"

const dirs: string[] = []

function fixture(files: Record<string, string>): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "guides-"))
  dirs.push(dir)
  for (const [name, body] of Object.entries(files)) fs.writeFileSync(path.join(dir, name), body)
  return dir
}

const valid = (extra = "") => `---
title: "A guide"
summary: "A short summary of the guide."
date: "2026-10-01"
${extra}---

Body text.
`

afterEach(() => {
  for (const dir of dirs.splice(0)) fs.rmSync(dir, { recursive: true, force: true })
})

describe("loadGuides", () => {
  it("reads valid guides, newest first, with updated defaulting to date", () => {
    const dir = fixture({
      "older.mdx": valid(),
      "newer.mdx": valid('updated: "2026-10-20"\nproduct: build\n').replace("2026-10-01", "2026-10-10"),
    })
    const guides = loadGuides(dir)
    expect(guides.map((g) => g.slug)).toEqual(["newer", "older"])
    expect(guides[1].updated).toBe("2026-10-01")
    expect(guides[0]).toMatchObject({ updated: "2026-10-20", product: "build" })
  })

  it("skips drafts", () => {
    expect(loadGuides(fixture({ "draft.mdx": valid("draft: true\n") }))).toEqual([])
  })

  it("fails loudly on bad frontmatter", () => {
    expect(() => loadGuides(fixture({ "x.mdx": valid('author: "Someone"\n') }))).toThrow(/unknown frontmatter key/)
    expect(() => loadGuides(fixture({ "x.mdx": valid('product: "hr"\n') }))).toThrow(/"product"/)
    expect(() => loadGuides(fixture({ "x.mdx": valid('updated: "2026-09-01"\n') }))).toThrow(/cannot be before/)
    expect(() => loadGuides(fixture({ "Bad_Name.mdx": valid() }))).toThrow(/kebab-case/)
    expect(() => loadGuides(fixture({ "x.mdx": valid().replace("Body text.", "Body — text.") }))).toThrow(/em dashes/)
  })
})

describe("published guides", () => {
  it("validate, and every internal link points at a real page", () => {
    const guides = getGuides()
    expect(guides.length).toBeGreaterThan(0)
    const pages = new Set([
      "/",
      "/pulse",
      "/build",
      "/prism",
      "/insights",
      "/glossary",
      "/engineering",
      ...guides.map((g) => `/guides/${g.slug}`),
      ...GLOSSARY.map((t) => `/glossary/${t.slug}`),
    ])
    for (const guide of guides) {
      for (const [, href] of guide.body.matchAll(/\]\((\/[^)\s#]*)(?:#[^)]*)?\)/g)) {
        expect(pages.has(href), `${guide.slug} links to ${href}`).toBe(true)
      }
    }
  })
})
