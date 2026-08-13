import { describe, expect, it } from "vitest"
import { modalModeForIntent } from "./intent"

describe("modalModeForIntent", () => {
  it("opens the product questionnaire for read/assessment intents", () => {
    expect(modalModeForIntent("pulse", "read")).toBe("pulseQuestionnaire")
    expect(modalModeForIntent("build", "read")).toBe("assessment")
    expect(modalModeForIntent("build", "assessment")).toBe("assessment")
  })

  it("opens the quick contact flow for contact intents", () => {
    expect(modalModeForIntent("pulse", "contact")).toBe("pulseContact")
    expect(modalModeForIntent("build", "contact")).toBe("contact")
    expect(modalModeForIntent("prism", "contact")).toBe("default")
    expect(modalModeForIntent(null, "contact")).toBe("default")
  })

  it("ignores unknown or missing intents", () => {
    expect(modalModeForIntent("pulse", null)).toBeNull()
    expect(modalModeForIntent("pulse", "banana")).toBeNull()
    expect(modalModeForIntent("prism", "read")).toBeNull()
  })
})
