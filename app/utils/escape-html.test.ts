import { describe, expect, it } from "vitest"
import { escapeHtml } from "./escape-html"

describe("escapeHtml", () => {
  it("escapes ampersand, angle brackets, and quotes", () => {
    expect(escapeHtml(`a & b <c> "d" 'e'`)).toBe(
      "a &amp; b &lt;c&gt; &quot;d&quot; &#39;e&#39;",
    )
  })

  it("returns empty string unchanged", () => {
    expect(escapeHtml("")).toBe("")
  })
})
