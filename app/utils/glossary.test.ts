import { describe, expect, it } from "vitest"
import { GLOSSARY, getTerm, glossaryAlphabetical } from "./glossary"
import { getGuides } from "../../lib/guides/content"

describe("glossary", () => {
  it("has unique kebab-case slugs", () => {
    const slugs = GLOSSARY.map((entry) => entry.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  })

  it("opens every entry with one quotable sentence", () => {
    for (const entry of GLOSSARY) {
      expect(entry.definition.trim().endsWith("."), entry.slug).toBe(true)
      expect(entry.definition.length, entry.slug).toBeLessThan(260)
      expect(entry.body.length, entry.slug).toBeGreaterThan(0)
    }
  })

  it("only links to terms and guides that exist", () => {
    const guides = new Set(getGuides().map((guide) => guide.slug))
    for (const entry of GLOSSARY) {
      for (const related of entry.related) {
        expect(getTerm(related), `${entry.slug} -> ${related}`).toBeDefined()
        expect(related).not.toBe(entry.slug)
      }
      if (entry.guide) expect(guides.has(entry.guide), `${entry.slug} -> ${entry.guide}`).toBe(true)
    }
  })

  it("keeps house style: no em dashes", () => {
    const text = JSON.stringify(GLOSSARY)
    expect(text).not.toContain("—")
  })

  it("sorts alphabetically for the index", () => {
    const names = glossaryAlphabetical().map((entry) => entry.term.toLowerCase())
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)))
  })
})
