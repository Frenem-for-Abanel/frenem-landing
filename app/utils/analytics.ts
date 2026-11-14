/**
 * Vendor-neutral analytics. `track()` pushes each event onto
 * `window.dataLayer` when a tag manager has created it, and dispatches a
 * `frenem:track` DOM event for anything else to listen to. Adding a vendor
 * later means one listener, not edits across the components.
 */

export const TRACK_EVENT = "frenem:track"

export type AnalyticsEventName =
  | "cta_click"
  | "modal_open"
  | "modal_close"
  | "questionnaire_step"
  | "lead_submitted"
  | "lead_failed"
  | "plan_pain_toggled"
  | "plan_shared"
  | "plan_sent"
  | "marquee_paused"
  | "web_vital"

export type AnalyticsProps = Record<string, string | number | boolean | null | undefined>

export type AnalyticsPayload = { event: AnalyticsEventName } & Record<string, string | number | boolean | null>

export type AnalyticsSink = (payload: AnalyticsPayload) => void

let externalSink: AnalyticsSink | null = null

export function registerAnalyticsSink(sink: AnalyticsSink | null): void {
  externalSink = sink
}

declare global {
  interface Window {
    dataLayer?: unknown[]
  }
}

/** Drops undefined values so payloads stay flat and serialisable. */
export function buildPayload(event: AnalyticsEventName, props: AnalyticsProps = {}): AnalyticsPayload {
  const payload: AnalyticsPayload = { event }
  for (const [key, value] of Object.entries(props)) {
    if (value !== undefined) payload[key] = value
  }
  return payload
}

export function track(event: AnalyticsEventName, props: AnalyticsProps = {}): void {
  if (typeof window === "undefined") return
  const payload = buildPayload(event, { page: window.location.pathname, ...props })
  try {
    window.dataLayer?.push(payload)
  } catch {
    // A broken tag manager must never break the page.
  }
  try {
    window.dispatchEvent(new CustomEvent(TRACK_EVENT, { detail: payload }))
  } catch {
    // CustomEvent is universal in supported browsers; ignore exotic failures.
  }
  if (externalSink) {
    try {
      externalSink(payload)
    } catch {
      // External analytics sinks must never break UI interactions.
    }
  }
  if (process.env.NODE_ENV === "development") console.debug("[track]", payload)
}
