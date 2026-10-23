import { readContactApiError } from "../../utils/contact-modal-helpers"
import { track } from "../../utils/analytics"
import { attributionFromVisit, readAttribution } from "../../utils/attribution"

/** Where this lead came from: first touch if stored, otherwise this visit. */
function currentAttribution() {
  return (
    readAttribution() ??
    attributionFromVisit({
      search: window.location.search,
      referrer: document.referrer,
      pathname: window.location.pathname,
      host: window.location.host,
      now: new Date(),
    })
  )
}

/**
 * POST to the contact API with the lead's source attached; throws a
 * user-facing Error on failure. Records the outcome for analytics.
 */
export async function submitContact(payload: Record<string, unknown>): Promise<void> {
  const flow = typeof payload.flow === "string" ? payload.flow : "default"
  let response: Response
  try {
    response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, attribution: currentAttribution(), page: window.location.pathname }),
    })
  } catch {
    track("lead_failed", { flow, reason: "network" })
    throw new Error("We couldn't reach the server. Check your connection and try again.")
  }
  if (!response.ok) {
    track("lead_failed", { flow, status: response.status })
    throw new Error(await readContactApiError(response))
  }
  track("lead_submitted", { flow })
}
