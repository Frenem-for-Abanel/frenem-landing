/** Public hostname the Next.js app already serves on Railway. */
export const CANONICAL_HOST = "www.frenem.com"
/** Naked domain. GoDaddy forwarding currently intercepts this host. */
export const APEX_HOST = "frenem.com"
export const DEFAULT_SITE_URL = `https://${CANONICAL_HOST}`

export const SITE_NAME = "Frenem"

/**
 * Canonical origin for metadata, sitemap, robots, and JSON-LD.
 * Apex (`frenem.com`) is rewritten to www so we never advertise URLs that 404
 * while GoDaddy forwarding is still in front of the naked domain.
 */
export function resolveSiteUrl(
  raw: string | undefined = process.env.NEXT_PUBLIC_SITE_URL,
): string {
  if (!raw) return DEFAULT_SITE_URL
  try {
    const url = new URL(raw)
    if (url.hostname === APEX_HOST) {
      url.hostname = CANONICAL_HOST
    }
    return url.origin
  } catch {
    return DEFAULT_SITE_URL
  }
}

export const SITE_URL = resolveSiteUrl()

/** First host from `Host` / `X-Forwarded-Host`, without port. */
export function requestHostname(hostHeader: string | null | undefined): string {
  if (!hostHeader) return ""
  return hostHeader.split(",")[0]!.trim().split(":")[0]!.toLowerCase()
}

/**
 * Permanent Location for apex → www. Returns null when the request is
 * already on the canonical host (or any other host, e.g. localhost).
 * Built as a literal URL so Railway's internal listen port cannot leak.
 */
export function apexToWwwRedirectLocation(
  hostname: string,
  pathname: string,
  search = "",
): string | null {
  if (hostname !== APEX_HOST) return null
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`
  return `https://${CANONICAL_HOST}${path}${search}`
}
