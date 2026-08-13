import type { ProductKey } from "./product"
import type { ContactFlow } from "./contact-submission"

/**
 * Deep-linkable contact intents, e.g. `/pulse?intent=read` opens the Pulse
 * questionnaire. Unknown intents resolve to null (no modal).
 */
export function modalModeForIntent(
  product: ProductKey | null,
  intent: string | null
): ContactFlow | null {
  if (!intent) return null
  const normalized = intent.toLowerCase()

  if (normalized === "read" || normalized === "assessment") {
    if (product === "pulse") return "pulseQuestionnaire"
    if (product === "build") return "assessment"
    return null
  }

  if (normalized === "contact") {
    if (product === "pulse") return "pulseContact"
    if (product === "build") return "contact"
    return "default"
  }

  return null
}

/**
 * The URL to replace after handling an intent: same path and query with only
 * `intent` removed, so campaign params (utm_*, etc.) survive for analytics.
 */
export function hrefWithoutIntent(pathname: string, search: string | URLSearchParams): string {
  const params = new URLSearchParams(search)
  params.delete("intent")
  const query = params.toString()
  return query ? `${pathname}?${query}` : pathname
}
