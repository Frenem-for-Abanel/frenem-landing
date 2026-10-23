import { describe, expect, it } from "vitest"
import sitemap from "../sitemap"
import { languageAlternates, openGraphImagePath, pageMetadata } from "./seo"
import { absoluteUrl } from "./site"

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
