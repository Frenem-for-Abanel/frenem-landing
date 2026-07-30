import { describe, expect, it } from "vitest"
import { getHowSectionId } from "./how-section"

describe("getHowSectionId", () => {
  it("returns how-pulse for pulse", () => {
    expect(getHowSectionId("pulse")).toBe("how-pulse")
  })

  it("returns how-build for build", () => {
    expect(getHowSectionId("build")).toBe("how-build")
  })

  it("returns null for prism", () => {
    expect(getHowSectionId("prism")).toBeNull()
  })
})
