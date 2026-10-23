import { describe, expect, it } from "vitest"
import { llmsFull, llmsIndex, mdxToMarkdown } from "./llms"
import { HOME_FAQS, PRISM_FAQS } from "./faqs"
import { SITE_URL } from "./site"

describe("mdxToMarkdown", () => {
  it("drops figures and comments, unwraps cards, and absolutises links", () => {
    const md = mdxToMarkdown(`{/* note */}\n<Tldr>\n\n- one\n\n</Tldr>\n\n<Figure caption="x">\n<svg />\n</Figure>\n\nSee [Pulse](/pulse).`)
    expect(md).not.toContain("Figure")
    expect(md).not.toContain("note")
    expect(md).not.toContain("Tldr")
    expect(md).toContain("- one")
    expect(md).toContain(`[Pulse](${SITE_URL}/pulse)`)
  })
})

describe("llms files", () => {
  it("index covers every FAQ set, guides, glossary, and the full-text link", () => {
    const text = llmsIndex()
    for (const item of [...HOME_FAQS, ...PRISM_FAQS]) expect(text).toContain(item.question)
    expect(text).toContain(`${SITE_URL}/llms-full.txt`)
    expect(text).toContain(`${SITE_URL}/glossary/`)
    expect(text).toContain(`${SITE_URL}/guides/`)
    expect(text).not.toContain("planner above")
  })

  it("full text carries guide bodies without MDX", () => {
    const text = llmsFull()
    expect(text).toContain("## Guides")
    expect(text).not.toMatch(/<Figure|<Tldr/)
    expect(text).not.toContain("—")
  })
})
