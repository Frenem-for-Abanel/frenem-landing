import { beforeEach, describe, expect, it } from "vitest"
import { checkRateLimit, clientKey, resetRateLimits } from "./rate-limit"

describe("checkRateLimit", () => {
  beforeEach(() => {
    resetRateLimits()
  })

  it("allows requests under the limit", () => {
    for (let i = 0; i < 5; i++) {
      expect(checkRateLimit("a", { limit: 5, windowMs: 1000, now: 1000 + i }).allowed).toBe(true)
    }
  })

  it("blocks once the limit is reached within the window", () => {
    for (let i = 0; i < 5; i++) {
      checkRateLimit("a", { limit: 5, windowMs: 1000, now: 1000 })
    }
    expect(checkRateLimit("a", { limit: 5, windowMs: 1000, now: 1500 }).allowed).toBe(false)
  })

  it("allows again after the window slides past old requests", () => {
    for (let i = 0; i < 5; i++) {
      checkRateLimit("a", { limit: 5, windowMs: 1000, now: 1000 })
    }
    expect(checkRateLimit("a", { limit: 5, windowMs: 1000, now: 2500 }).allowed).toBe(true)
  })

  it("tracks keys independently", () => {
    for (let i = 0; i < 5; i++) {
      checkRateLimit("a", { limit: 5, windowMs: 1000, now: 1000 })
    }
    expect(checkRateLimit("b", { limit: 5, windowMs: 1000, now: 1000 }).allowed).toBe(true)
  })
})

describe("clientKey", () => {
  const req = (headers: Record<string, string>) => ({ headers: new Headers(headers) })

  it("prefers X-Real-IP", () => {
    expect(clientKey(req({ "x-real-ip": "203.0.113.9", "x-forwarded-for": "1.1.1.1, 203.0.113.9" }))).toBe("203.0.113.9")
  })

  it("uses the proxy-appended last hop, not the client-supplied first one", () => {
    expect(clientKey(req({ "x-forwarded-for": "6.6.6.6, 198.51.100.4" }))).toBe("198.51.100.4")
  })

  it("falls back to a shared key", () => {
    expect(clientKey(req({}))).toBe("unknown")
  })
})
