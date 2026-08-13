import { describe, expect, it } from "vitest"
import { hrefWithoutIntent, modalModeForIntent } from "./intent"

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

describe("hrefWithoutIntent", () => {
  it("removes only the intent param and keeps campaign params", () => {
    expect(hrefWithoutIntent("/pulse", "intent=read&utm_source=linkedin&utm_campaign=q3")).toBe(
      "/pulse?utm_source=linkedin&utm_campaign=q3"
    )
  })

  it("returns the bare path when intent was the only param", () => {
    expect(hrefWithoutIntent("/pulse", "intent=read")).toBe("/pulse")
    expect(hrefWithoutIntent("/build", "")).toBe("/build")
  })

  it("accepts URLSearchParams input", () => {
    expect(hrefWithoutIntent("/build", new URLSearchParams("utm_medium=email&intent=contact"))).toBe(
      "/build?utm_medium=email"
    )
  })
})
