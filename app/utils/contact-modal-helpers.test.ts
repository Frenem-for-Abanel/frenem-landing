import { describe, expect, it } from "vitest"
import {
  headerContactMode,
  questionnaireAnswersComplete,
  readContactApiError,
} from "./contact-modal-helpers"

describe("headerContactMode", () => {
  it("maps each product tab to the correct header contact mode", () => {
    expect(headerContactMode("build")).toBe("contact")
    expect(headerContactMode("pulse")).toBe("pulseContact")
    expect(headerContactMode("prism")).toBe("default")
  })
})

describe("questionnaireAnswersComplete", () => {
  it("requires all four answers", () => {
    expect(
      questionnaireAnswersComplete({ q1: "a", q2: "b", q3: "c", q4: "" })
    ).toBe(false)
    expect(
      questionnaireAnswersComplete({ q1: "a", q2: "b", q3: "c", q4: "d" })
    ).toBe(true)
  })
})

describe("readContactApiError", () => {
  it("reads error from JSON body when present", async () => {
    const response = new Response(JSON.stringify({ error: "Invalid or missing answer for q1." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
    expect(await readContactApiError(response)).toBe("Invalid or missing answer for q1.")
  })

  it("falls back when body is not JSON", async () => {
    const response = new Response("nope", { status: 500 })
    expect(await readContactApiError(response)).toBe("Please try again later.")
  })
})
