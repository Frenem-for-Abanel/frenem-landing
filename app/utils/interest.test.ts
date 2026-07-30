import { describe, expect, it } from "vitest"
import { getInterestForProduct, INTEREST_BY_PRODUCT } from "./interest"

describe("interest map", () => {
  it("maps pulse to Relational Diagnostics", () => {
    expect(getInterestForProduct("pulse")).toBe("Pulse · Relational Diagnostics")
    expect(INTEREST_BY_PRODUCT.pulse).toBe("Pulse · Relational Diagnostics")
  })

  it("maps build and prism products", () => {
    expect(getInterestForProduct("build")).toBe("Build · Org Design Sprint")
    expect(getInterestForProduct("prism")).toBe("Prism · Employee Management")
  })
})
