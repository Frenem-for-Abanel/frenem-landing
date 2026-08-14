import path from "node:path"
import { describe, expect, it } from "vitest"
import { loadEngineeringContent } from "./content"
import {
  LOG_SLUG_ALIASES,
  aliasesForSlug,
  logAliasRedirects,
} from "./slug-aliases"

describe("log slug aliases", () => {
  it("rewrites retired hashes onto the notes that replaced them", () => {
    expect(logAliasRedirects()).toEqual({
      "hashing-otps-at-rest": "the-backup-test",
      "saved-views-in-prism": "the-chart-is-not-a-slide",
    })
    expect(aliasesForSlug("the-backup-test")).toEqual(["hashing-otps-at-rest"])
    expect(aliasesForSlug("unknown")).toEqual([])
  })

  it("points at published slugs, and never at another live slug", () => {
    const slugs = new Set(
      loadEngineeringContent(path.join(process.cwd(), "content")).map(
        (entry) => entry.slug
      )
    )
    for (const [slug, aliases] of Object.entries(LOG_SLUG_ALIASES)) {
      expect(slugs.has(slug), `alias target "${slug}" is not published`).toBe(true)
      for (const alias of aliases) {
        expect(slugs.has(alias), `alias "${alias}" collides with a live slug`).toBe(
          false
        )
      }
    }
  })
})
