import { NextRequest } from "next/server"
import { describe, expect, it } from "vitest"
import { middleware } from "../../middleware"
import {
  APEX_HOST,
  CANONICAL_HOST,
  DEFAULT_SITE_URL,
  apexToWwwRedirectLocation,
  requestHostname,
  resolveSiteUrl,
} from "./site"

describe("resolveSiteUrl", () => {
  it("defaults to the www origin", () => {
    expect(resolveSiteUrl(undefined)).toBe(DEFAULT_SITE_URL)
    expect(resolveSiteUrl("")).toBe(DEFAULT_SITE_URL)
  })

  it("rewrites the apex host to www so sitemap and canonicals stay live", () => {
    expect(resolveSiteUrl("https://frenem.com")).toBe(DEFAULT_SITE_URL)
    expect(resolveSiteUrl("https://frenem.com/")).toBe(DEFAULT_SITE_URL)
  })

  it("keeps an explicit www or preview origin", () => {
    expect(resolveSiteUrl("https://www.frenem.com")).toBe(DEFAULT_SITE_URL)
    expect(resolveSiteUrl("http://localhost:3000")).toBe("http://localhost:3000")
  })

  it("falls back when the override is not a URL", () => {
    expect(resolveSiteUrl("not a url")).toBe(DEFAULT_SITE_URL)
  })
})

describe("requestHostname", () => {
  it("strips ports and uses the first forwarded host", () => {
    expect(requestHostname("frenem.com:8080")).toBe(APEX_HOST)
    expect(requestHostname("www.frenem.com, frenem.com")).toBe(CANONICAL_HOST)
    expect(requestHostname(null)).toBe("")
  })
})

describe("apexToWwwRedirectLocation", () => {
  it("redirects every apex path, including home and query strings", () => {
    expect(apexToWwwRedirectLocation(APEX_HOST, "/")).toBe(
      "https://www.frenem.com/",
    )
    expect(apexToWwwRedirectLocation(APEX_HOST, "/pulse")).toBe(
      "https://www.frenem.com/pulse",
    )
    expect(
      apexToWwwRedirectLocation(APEX_HOST, "/engineering", "?utm=1"),
    ).toBe("https://www.frenem.com/engineering?utm=1")
  })

  it("does not redirect www, localhost, or Railway preview hosts", () => {
    expect(apexToWwwRedirectLocation(CANONICAL_HOST, "/pulse")).toBeNull()
    expect(apexToWwwRedirectLocation("localhost", "/pulse")).toBeNull()
    expect(
      apexToWwwRedirectLocation("mj63rj7s.up.railway.app", "/pulse"),
    ).toBeNull()
  })
})

describe("middleware", () => {
  function request(path: string, host: string) {
    return new NextRequest(`https://${host}${path}`, {
      headers: { host },
    })
  }

  it("308-redirects apex deep links to the same path on www", () => {
    for (const path of ["/pulse", "/build", "/prism", "/engineering"]) {
      const res = middleware(request(path, APEX_HOST))
      expect(res.status).toBe(308)
      expect(res.headers.get("location")).toBe(`https://${CANONICAL_HOST}${path}`)
    }
  })

  it("leaves www and local hosts alone", () => {
    expect(middleware(request("/pulse", CANONICAL_HOST)).status).toBe(200)
    expect(middleware(request("/pulse", "localhost")).status).toBe(200)
  })
})
