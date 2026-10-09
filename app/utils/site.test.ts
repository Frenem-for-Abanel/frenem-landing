import { NextRequest } from "next/server"
import { describe, expect, it } from "vitest"
import nextConfig from "../../next.config"
import { middleware } from "../../middleware"
import {
  APEX_HOST,
  CANONICAL_HOST,
  DEFAULT_SITE_URL,
  absoluteUrl,
  apexToWwwRedirectLocation,
  requestHostname,
  resolveSiteUrl,
} from "./site"

describe("resolveSiteUrl", () => {
  it("defaults to the www origin", () => {
    expect(resolveSiteUrl(undefined)).toBe(DEFAULT_SITE_URL)
    expect(resolveSiteUrl("")).toBe(DEFAULT_SITE_URL)
    expect(resolveSiteUrl("   ")).toBe(DEFAULT_SITE_URL)
  })

  it("rewrites every apex form to https www, dropping path and query", () => {
    for (const raw of [
      "https://frenem.com",
      "https://frenem.com/",
      "https://frenem.com/pulse",
      "https://frenem.com/pulse?utm=1",
      "http://frenem.com",
      "https://FRENEM.com",
      "https://frenem.com.",
      "https://frenem.com:443/sitemap.xml",
      "https://www.frenem.com@frenem.com/pulse",
    ]) {
      expect(resolveSiteUrl(raw)).toBe(DEFAULT_SITE_URL)
    }
  })

  it("upgrades an explicit www origin to https and drops any path", () => {
    expect(resolveSiteUrl("https://www.frenem.com")).toBe(DEFAULT_SITE_URL)
    expect(resolveSiteUrl("http://www.frenem.com/pulse")).toBe(DEFAULT_SITE_URL)
    expect(resolveSiteUrl("https://WWW.frenem.com.")).toBe(DEFAULT_SITE_URL)
  })

  it("keeps localhost and other preview origins", () => {
    expect(resolveSiteUrl("http://localhost:3000")).toBe("http://localhost:3000")
    expect(resolveSiteUrl("https://mj63rj7s.up.railway.app")).toBe("https://mj63rj7s.up.railway.app")
    expect(resolveSiteUrl("https://preview.frenem.com")).toBe("https://preview.frenem.com")
  })

  it("falls back when the override is not an http(s) URL", () => {
    expect(resolveSiteUrl("not a url")).toBe(DEFAULT_SITE_URL)
    expect(resolveSiteUrl("frenem.com")).toBe(DEFAULT_SITE_URL)
    expect(resolveSiteUrl("mailto:hello@frenem.com")).toBe(DEFAULT_SITE_URL)
  })

  it("never returns a URL whose hostname is the naked apex", () => {
    for (const raw of ["https://frenem.com/pulse", "http://frenem.com", undefined, "nope"]) {
      expect(new URL(resolveSiteUrl(raw)).hostname).not.toBe(APEX_HOST)
    }
  })
})

describe("absoluteUrl", () => {
  it("matches the no-trailing-slash canonical, including the homepage", () => {
    expect(absoluteUrl("/")).toBe(DEFAULT_SITE_URL)
    expect(absoluteUrl("/pulse")).toBe(`${DEFAULT_SITE_URL}/pulse`)
    expect(absoluteUrl("/pulse/")).toBe(`${DEFAULT_SITE_URL}/pulse`)
  })
})

describe("requestHostname", () => {
  it("strips ports, trailing dots, and uses the first forwarded host", () => {
    expect(requestHostname("frenem.com:8080")).toBe(APEX_HOST)
    expect(requestHostname("Frenem.com.")).toBe(APEX_HOST)
    expect(requestHostname("www.frenem.com, frenem.com")).toBe(CANONICAL_HOST)
    expect(requestHostname("WWW.Frenem.com:443")).toBe(CANONICAL_HOST)
    expect(requestHostname(null)).toBe("")
  })
})

describe("apexToWwwRedirectLocation", () => {
  it("redirects every apex path, including home and query strings", () => {
    expect(apexToWwwRedirectLocation(APEX_HOST, "/")).toBe("https://www.frenem.com/")
    expect(apexToWwwRedirectLocation(APEX_HOST, "/pulse")).toBe("https://www.frenem.com/pulse")
    expect(apexToWwwRedirectLocation(APEX_HOST, "/engineering", "?utm=1")).toBe(
      "https://www.frenem.com/engineering?utm=1"
    )
    expect(apexToWwwRedirectLocation(APEX_HOST, "/sitemap.xml")).toBe("https://www.frenem.com/sitemap.xml")
  })

  it("drops a search value that is not a query string and a protocol-relative path", () => {
    expect(apexToWwwRedirectLocation(APEX_HOST, "/pulse", "utm=1")).toBe("https://www.frenem.com/pulse")
    expect(apexToWwwRedirectLocation(APEX_HOST, "//evil.example/phish")).toBe("https://www.frenem.com/")
  })

  it("does not redirect www, localhost, or Railway preview hosts", () => {
    expect(apexToWwwRedirectLocation(CANONICAL_HOST, "/pulse")).toBeNull()
    expect(apexToWwwRedirectLocation("localhost", "/pulse")).toBeNull()
    expect(apexToWwwRedirectLocation("mj63rj7s.up.railway.app", "/pulse")).toBeNull()
  })
})

describe("middleware", () => {
  function request(path: string, host: string, forwarded?: string) {
    return new NextRequest(`https://${host.split(":")[0]}${path}`, {
      headers: {
        host,
        ...(forwarded ? { "x-forwarded-host": forwarded } : {}),
      },
    })
  }

  it("308-redirects apex deep links to the same path on www", () => {
    for (const path of ["/", "/pulse", "/build", "/prism", "/engineering", "/sitemap.xml", "/robots.txt"]) {
      const res = middleware(request(path, APEX_HOST))
      expect(res.status).toBe(308)
      expect(res.headers.get("location")).toBe(`https://${CANONICAL_HOST}${path}`)
    }
  })

  it("preserves the query string and normalizes host case", () => {
    const res = middleware(request("/pulse?utm=1&intent=read", "Frenem.com:443"))
    expect(res.status).toBe(308)
    expect(res.headers.get("location")).toBe("https://www.frenem.com/pulse?utm=1&intent=read")
  })

  it("trusts the first x-forwarded-host over Host", () => {
    const spoofed = middleware(request("/pulse", CANONICAL_HOST, APEX_HOST))
    expect(spoofed.status).toBe(308)
    expect(spoofed.headers.get("location")).toBe("https://www.frenem.com/pulse")

    const canonical = middleware(request("/pulse", APEX_HOST, CANONICAL_HOST))
    expect(canonical.status).toBe(200)
  })

  it("leaves www and local hosts alone", () => {
    expect(middleware(request("/pulse", CANONICAL_HOST)).status).toBe(200)
    expect(middleware(request("/pulse", "localhost:3000")).status).toBe(200)
  })
})

describe("next.config host redirects", () => {
  it("308s every apex path to a literal www URL", async () => {
    const redirects = await nextConfig.redirects?.()
    expect(redirects?.map((rule) => rule.source)).toEqual(["/", "/:path*"])
    for (const rule of redirects ?? []) {
      expect(rule.permanent).toBe(true)
      expect(rule.has).toEqual([{ type: "host", value: APEX_HOST }])
      expect(rule.destination.startsWith(`https://${CANONICAL_HOST}`)).toBe(true)
      expect(rule.destination).not.toMatch(/https:\/\/frenem\.com\b/)
      expect(rule.destination).not.toMatch(/:\d/)
    }
    expect(redirects?.[0]?.destination).toBe(`https://${CANONICAL_HOST}/`)
    expect(redirects?.[1]?.destination).toBe(`https://${CANONICAL_HOST}/:path*`)
  })

  it("sends nosniff, a referrer policy, and HSTS on every path", async () => {
    const headers = await nextConfig.headers?.()
    expect(headers?.map((rule) => rule.source)).toEqual(["/", "/:path*"])
    for (const rule of headers ?? []) {
      const keys = Object.fromEntries(rule.headers.map((header) => [header.key, header.value]))
      expect(keys["X-Content-Type-Options"]).toBe("nosniff")
      expect(keys["Referrer-Policy"]).toBe("strict-origin-when-cross-origin")
      expect(keys["Strict-Transport-Security"]).toBe("max-age=63072000")
    }
  })
})
