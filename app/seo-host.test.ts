import { describe, expect, it } from "vitest"
import robots from "./robots"
import sitemap from "./sitemap"
import { DEFAULT_SITE_URL, SITE_URL } from "./utils/site"

describe("seo host", () => {
  it("uses the www origin for every sitemap loc", () => {
    expect(SITE_URL).toBe(DEFAULT_SITE_URL)
    for (const entry of sitemap()) {
      expect(entry.url.startsWith(`${DEFAULT_SITE_URL}/`)).toBe(true)
      expect(entry.url.includes("://frenem.com/")).toBe(false)
    }
  })

  it("points robots.txt at the www sitemap", () => {
    expect(robots().sitemap).toBe(`${DEFAULT_SITE_URL}/sitemap.xml`)
  })
})
