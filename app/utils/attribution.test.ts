import { describe, expect, it } from "vitest"
import {
  ATTRIBUTION_MAX_LENGTH,
  attributionFromVisit,
  hasCampaign,
  mergeAttribution,
  sanitizeAttribution,
} from "./attribution"

const visit = (overrides: Partial<Parameters<typeof attributionFromVisit>[0]> = {}) =>
  attributionFromVisit({
    search: "",
    referrer: "",
    pathname: "/",
    host: "www.frenem.com",
    now: new Date("2026-10-23T09:00:00Z"),
    ...overrides,
  })

describe("attributionFromVisit", () => {
  it("records campaign parameters, landing page, and time", () => {
    const a = visit({ search: "?utm_source=linkedin&utm_medium=paid&utm_campaign=ceo-q4&intent=contact", pathname: "/pulse" })
    expect(a).toMatchObject({
      utm_source: "linkedin",
      utm_medium: "paid",
      utm_campaign: "ceo-q4",
      landing_page: "/pulse",
      first_seen: "2026-10-23T09:00:00.000Z",
    })
    expect(hasCampaign(a)).toBe(true)
  })

  it("keeps external referrers without their query, drops internal ones", () => {
    expect(visit({ referrer: "https://www.google.com/search?q=frenem" }).referrer).toBe("https://www.google.com/search")
    expect(visit({ referrer: "https://www.frenem.com/build" }).referrer).toBeUndefined()
    expect(visit({ referrer: "not a url" }).referrer).toBeUndefined()
  })

  it("clips long values", () => {
    const a = visit({ search: `?utm_campaign=${"x".repeat(1000)}` })
    expect(a.utm_campaign).toHaveLength(ATTRIBUTION_MAX_LENGTH)
  })
})

describe("mergeAttribution", () => {
  const direct = { landing_page: "/", first_seen: "a" }
  const paid = { utm_source: "google", landing_page: "/build", first_seen: "b" }

  it("keeps the first touch", () => {
    expect(mergeAttribution(paid, { utm_source: "linkedin", landing_page: "/", first_seen: "c" })).toBe(paid)
    expect(mergeAttribution(direct, { landing_page: "/prism", first_seen: "c" })).toBe(direct)
  })

  it("lets a campaign visit replace an earlier visit without one", () => {
    expect(mergeAttribution(direct, paid)).toBe(paid)
    expect(mergeAttribution(null, direct)).toBe(direct)
  })
})

describe("sanitizeAttribution", () => {
  it("keeps only known string fields", () => {
    expect(sanitizeAttribution({ utm_source: " linkedin ", evil: "x", gclid: 42 })).toEqual({ utm_source: "linkedin" })
  })

  it("rejects non-objects and empty results", () => {
    expect(sanitizeAttribution("utm_source=x")).toBeUndefined()
    expect(sanitizeAttribution(["x"])).toBeUndefined()
    expect(sanitizeAttribution({})).toBeUndefined()
  })
})
