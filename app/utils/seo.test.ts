import { describe, expect, it } from "vitest"
import { getEssayBySlug } from "../../lib/engineering/content"
import { linkSegments } from "./faqs"
import { HOME_DESCRIPTION, essayMetaDescription } from "./seo"
import { absoluteUrl, siteGraph, toJsonLd } from "./structured-data"
import { LINKEDIN_URL, SITE_URL } from "./site"
import sitemap from "../sitemap"

describe("brand entity", () => {
  it("reads as a global organisation firm, with no city and no price", () => {
    const encoded = toJsonLd(siteGraph())
    expect(encoded).not.toContain("Bangalore")
    expect(encoded).not.toContain("India")
    expect(encoded).not.toContain("Employee management")
    expect(encoded).toContain(LINKEDIN_URL)
    expect(encoded).toContain(HOME_DESCRIPTION)
    expect(encoded).not.toContain('"price"')
    expect(HOME_DESCRIPTION.length).toBeLessThanOrEqual(160)
    expect(HOME_DESCRIPTION).not.toContain("Bangalore")
  })

  it("uses the same homepage URL as the canonical, without a trailing slash", () => {
    expect(absoluteUrl("/")).toBe(SITE_URL)
    expect(sitemap().find((entry) => entry.url === SITE_URL)?.lastModified).toBeUndefined()
  })

  it("escapes characters that would close a script tag", () => {
    expect(toJsonLd({ a: "</script><" })).toBe('{"a":"\\u003c/script>\\u003c"}')
  })
})

describe("essay snippets", () => {
  it("keeps the summary and adds the topical clause from the TL;DR", () => {
    const essay = getEssayBySlug("boring-on-purpose")
    expect(essay).toBeDefined()
    const description = essayMetaDescription(essay!)
    expect(description.startsWith(essay!.summary)).toBe(true)
    expect(description).toContain("Modelling organisations, keeping diagnostics honest.")
    expect(description.length).toBeLessThanOrEqual(160)
  })
})

describe("linkSegments", () => {
  it("links Prism without changing the answer text", () => {
    const answer = "Prism can keep it current from there."
    const segments = linkSegments(answer, [{ phrase: "Prism", href: "/prism" }])
    expect(segments.map((segment) => segment.text).join("")).toBe(answer)
    expect(segments.find((segment) => segment.href)?.href).toBe("/prism")
  })
})
