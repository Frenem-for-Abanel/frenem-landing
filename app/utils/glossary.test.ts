import { describe, expect, it } from "vitest"
import { GLOSSARY, glossaryAlphabetical } from "./glossary"

describe("glossary", () => {
  it("has unique kebab-case slugs", () => {
    const slugs = GLOSSARY.map((entry) => entry.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  })

  it("defines every term in one short sentence", () => {
    for (const entry of GLOSSARY) {
      expect(entry.definition.trim().endsWith("."), entry.slug).toBe(true)
      expect(entry.definition.split(/\.\s/).length, entry.slug).toBe(1)
      expect(entry.definition.length, entry.slug).toBeLessThan(180)
    }
  })

  it("keeps house style: no em dashes", () => {
    expect(JSON.stringify(GLOSSARY)).not.toContain("—")
  })

  it("sorts alphabetically for the page", () => {
    const names = glossaryAlphabetical().map((entry) => entry.term.toLowerCase())
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)))
  })
})
