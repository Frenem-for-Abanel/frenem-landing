import { describe, expect, it } from "vitest"
import { productFromPathname } from "./product"

describe("productFromPathname", () => {
  it("maps product routes to product keys", () => {
    expect(productFromPathname("/pulse")).toBe("pulse")
    expect(productFromPathname("/build")).toBe("build")
    expect(productFromPathname("/prism")).toBe("prism")
  })

  it("handles trailing slashes and casing", () => {
    expect(productFromPathname("/pulse/")).toBe("pulse")
    expect(productFromPathname("/Build")).toBe("build")
  })

  it("returns null for the homepage and unknown routes", () => {
    expect(productFromPathname("/")).toBeNull()
    expect(productFromPathname("")).toBeNull()
    expect(productFromPathname("/about")).toBeNull()
  })
})
