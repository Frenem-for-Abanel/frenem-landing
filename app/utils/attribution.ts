/**
 * First-touch attribution for leads: the campaign, referrer, and landing
 * page that first brought a visitor, kept in localStorage and sent with
 * every contact submission so a lead can be traced back to its source.
 */

export const ATTRIBUTION_KEY = "frenem:attribution"

export const ATTRIBUTION_FIELDS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "li_fat_id",
  "referrer",
  "landing_page",
  "first_seen",
] as const

export type AttributionField = (typeof ATTRIBUTION_FIELDS)[number]
export type Attribution = Partial<Record<AttributionField, string>>

const CAMPAIGN_PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "li_fat_id"] as const

/** Longest value kept per field, client and server side. */
export const ATTRIBUTION_MAX_LENGTH = 300

function clip(value: string): string {
  return value.slice(0, ATTRIBUTION_MAX_LENGTH)
}

/** True when the visit carries campaign parameters worth recording. */
export function hasCampaign(attribution: Attribution): boolean {
  return CAMPAIGN_PARAMS.some((key) => Boolean(attribution[key]))
}

/**
 * Attribution for the current visit. Internal referrers are dropped: moving
 * between pages of this site is not a source.
 */
export function attributionFromVisit({
  search,
  referrer,
  pathname,
  host,
  now,
}: {
  search: string
  referrer: string
  pathname: string
  host: string
  now: Date
}): Attribution {
  const params = new URLSearchParams(search)
  const result: Attribution = {}
  for (const key of CAMPAIGN_PARAMS) {
    const value = params.get(key)?.trim()
    if (value) result[key] = clip(value)
  }
  if (referrer) {
    try {
      const ref = new URL(referrer)
      if (ref.host !== host) result.referrer = clip(`${ref.origin}${ref.pathname}`)
    } catch {
      // Ignore malformed referrers.
    }
  }
  result.landing_page = clip(pathname)
  result.first_seen = now.toISOString()
  return result
}

/**
 * First touch wins, except that a campaign visit replaces an earlier visit
 * that had no campaign: paid and partner traffic should not be credited to
 * "direct" because someone once opened the site without parameters.
 */
export function mergeAttribution(stored: Attribution | null, current: Attribution): Attribution {
  if (!stored) return current
  if (!hasCampaign(stored) && hasCampaign(current)) return current
  return stored
}

/** Keeps only known string fields, clipped. Use on anything read back from storage or the network. */
export function sanitizeAttribution(value: unknown): Attribution | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined
  const raw = value as Record<string, unknown>
  const result: Attribution = {}
  for (const key of ATTRIBUTION_FIELDS) {
    const field = raw[key]
    if (typeof field === "string" && field.trim()) result[key] = clip(field.trim())
  }
  return Object.keys(result).length ? result : undefined
}

function readStored(): Attribution | null {
  try {
    const raw = window.localStorage.getItem(ATTRIBUTION_KEY)
    return raw ? (sanitizeAttribution(JSON.parse(raw)) ?? null) : null
  } catch {
    return null
  }
}

/** Records this visit's attribution. Safe to call on every page load. */
export function captureAttribution(): void {
  if (typeof window === "undefined") return
  const current = attributionFromVisit({
    search: window.location.search,
    referrer: document.referrer,
    pathname: window.location.pathname,
    host: window.location.host,
    now: new Date(),
  })
  const next = mergeAttribution(readStored(), current)
  try {
    window.localStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(next))
  } catch {
    // Private mode or blocked storage: submissions simply go without it.
  }
}

export function readAttribution(): Attribution | undefined {
  if (typeof window === "undefined") return undefined
  return readStored() ?? undefined
}
