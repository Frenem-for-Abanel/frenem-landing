import { beforeEach, describe, expect, it } from "vitest"
import { checkRateLimit, resetRateLimits } from "./rate-limit"

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
