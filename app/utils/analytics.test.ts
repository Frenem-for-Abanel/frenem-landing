import { afterEach, describe, expect, it, vi } from "vitest"
import { buildPayload, registerAnalyticsSink, track, TRACK_EVENT } from "./analytics"

describe("buildPayload", () => {
  it("names the event and drops undefined props", () => {
    expect(buildPayload("cta_click", { label: "Get in touch", flow: undefined, step: 2 })).toEqual({
      event: "cta_click",
      label: "Get in touch",
      step: 2,
    })
  })
})

describe("track", () => {
  afterEach(() => {
    registerAnalyticsSink(null)
    vi.unstubAllGlobals()
  })

  it("is a no-op on the server", () => {
    expect(() => track("modal_open")).not.toThrow()
  })

  it("pushes to dataLayer and dispatches a DOM event in the browser", () => {
    const dataLayer: unknown[] = []
    const dispatched: unknown[] = []
    vi.stubGlobal("CustomEvent", class {
      constructor(
        public type: string,
        public init: { detail: unknown }
      ) {}
    })
    vi.stubGlobal("window", {
      location: { pathname: "/build" },
      dataLayer,
      dispatchEvent: (event: { type: string; init: { detail: unknown } }) => {
        dispatched.push([event.type, event.init.detail])
        return true
      },
    })
    track("lead_submitted", { flow: "buildPlan" })
    const payload = { event: "lead_submitted", page: "/build", flow: "buildPlan" }
    expect(dataLayer).toEqual([payload])
    expect(dispatched).toEqual([[TRACK_EVENT, payload]])
  })

  it("survives a broken tag manager", () => {
    vi.stubGlobal("CustomEvent", class {})
    vi.stubGlobal("window", {
      location: { pathname: "/" },
      dataLayer: { push: () => { throw new Error("boom") } },
      dispatchEvent: () => true,
    })
    expect(() => track("modal_open")).not.toThrow()
  })

  it("forwards payloads to a registered PostHog/analytics sink and survives sink errors", () => {
    const received: unknown[] = []
    registerAnalyticsSink((payload) => {
      received.push(payload)
    })
    vi.stubGlobal("CustomEvent", class {
      constructor(public type: string, public init: { detail: unknown }) {}
    })
    vi.stubGlobal("window", {
      location: { pathname: "/pulse" },
      dispatchEvent: () => true,
    })
    track("cta_click", { label: "Book demo" })
    expect(received).toEqual([{ event: "cta_click", page: "/pulse", label: "Book demo" }])

    registerAnalyticsSink(() => {
      throw new Error("sink failure")
    })
    expect(() => track("cta_click", { label: "Book demo" })).not.toThrow()
  })
})
