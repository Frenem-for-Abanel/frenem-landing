import { describe, expect, it } from "vitest"
import { BUILD_PAINS, parsePainIds, resolveBuildPlan, scopeFor, SCOPE_LABELS } from "./build-plan"

const ids = (plan: ReturnType<typeof resolveBuildPlan>) => plan.modules.map((m) => m.id)

describe("resolveBuildPlan", () => {
  it("returns an empty plan when nothing is chosen", () => {
    const plan = resolveBuildPlan([])
    expect(plan.modules).toEqual([])
    expect(plan.scope).toBeNull()
    expect(plan.isFullSprint).toBe(false)
  })

  it("always opens with the baseline diagnostic", () => {
    const plan = resolveBuildPlan(["bottleneck"])
    expect(ids(plan)).toEqual(["baseline", "decision-rights"])
  })

  it("pulls in the foundations a module is built on, transitively", () => {
    const plan = resolveBuildPlan(["succession"])
    expect(ids(plan)).toEqual(["baseline", "grades", "competency", "nine-box"])
    const grades = plan.modules.find((m) => m.id === "grades")!
    expect(grades.foundation).toBe(true)
    expect(grades.neededBy).toEqual(["competency"])
    const nineBox = plan.modules.find((m) => m.id === "nine-box")!
    expect(nineBox.foundation).toBe(false)
    expect(nineBox.answers).toEqual(["succession"])
  })

  it("does not flag a chosen module as a foundation", () => {
    const plan = resolveBuildPlan(["roles", "ownership"])
    const grades = plan.modules.find((m) => m.id === "grades")!
    expect(grades.foundation).toBe(false)
    expect(grades.answers).toEqual(["roles"])
  })

  it("resolves all six problems into the complete Build", () => {
    const plan = resolveBuildPlan(BUILD_PAINS.map((p) => p.id))
    expect(plan.isFullSprint).toBe(true)
    expect(plan.scope).toBe("complete")
    expect(ids(plan)).toContain("operating-model")
    expect(plan.modules).toHaveLength(10)
  })

  it("keeps the operating model for the complete Build only", () => {
    const plan = resolveBuildPlan(BUILD_PAINS.slice(0, 5).map((p) => p.id))
    expect(plan.isFullSprint).toBe(false)
    expect(ids(plan)).not.toContain("operating-model")
  })
})

describe("scopeFor", () => {
  it("describes scope in words, never in weeks", () => {
    expect(scopeFor(0)).toBeNull()
    expect(scopeFor(1)).toBe("focused")
    expect(scopeFor(2)).toBe("focused")
    expect(scopeFor(3)).toBe("broad")
    expect(scopeFor(5)).toBe("broad")
    expect(scopeFor(6)).toBe("complete")
    for (const label of Object.values(SCOPE_LABELS)) expect(label).not.toMatch(/\d|week/i)
  })
})

describe("problem copy", () => {
  it("gives every problem a short outcome with no timelines in it", () => {
    for (const pain of BUILD_PAINS) {
      expect(pain.outcome.length).toBeGreaterThan(0)
      expect(`${pain.outcome} ${pain.after}`).not.toMatch(/week|month/i)
    }
  })
})

describe("parsePainIds", () => {
  it("accepts known ids and returns them in canonical order without duplicates", () => {
    expect(parsePainIds(["succession", "bottleneck", "succession"])).toEqual(["bottleneck", "succession"])
  })

  it("rejects empty, unknown, or non-array input", () => {
    expect(parsePainIds([])).toBeNull()
    expect(parsePainIds(["bottleneck", "nope"])).toBeNull()
    expect(parsePainIds("bottleneck")).toBeNull()
    expect(parsePainIds([1, 2])).toBeNull()
    expect(parsePainIds(undefined)).toBeNull()
  })
})
