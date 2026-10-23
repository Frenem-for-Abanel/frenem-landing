import { describe, expect, it } from "vitest"
import sitemap from "../sitemap"
import { GLOSSARY } from "./glossary"
import { languageAlternates, openGraphImagePath, pageMetadata } from "./seo"
import { absoluteUrl } from "./site"
import { mentionsFor } from "./structured-data"

describe("entity links", () => {
  it("points every product mention at a term on the glossary page", () => {
    const ids = new Set(GLOSSARY.map((entry) => `${absoluteUrl("/glossary")}#${entry.slug}`))
    for (const product of ["pulse", "build", "prism"] as const) {
      const mentions = mentionsFor(product)
      expect(mentions.length, product).toBeGreaterThan(0)
      for (const mention of mentions) expect(ids.has(mention["@id"] as string)).toBe(true)
    }
  })
})

describe("sitemap images and language alternates", () => {
  it("lists each page's share card", () => {
    for (const entry of sitemap()) {
      const path = new URL(entry.url).pathname
      expect(entry.images).toEqual([absoluteUrl(openGraphImagePath(path))])
    }
  })

  it("declares en-GB and x-default on the canonical URL", () => {
    expect(languageAlternates("/pulse")).toEqual({ "en-GB": "/pulse", "x-default": "/pulse" })
    const meta = pageMetadata({ path: "/build", title: "Build", description: "Organisation design." })
    expect(meta.alternates?.languages).toEqual({ "en-GB": "/build", "x-default": "/build" })
    expect(meta.alternates?.types).toHaveProperty("text/plain")
  })
})
