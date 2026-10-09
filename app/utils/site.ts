/** Public hostname the Next.js app serves on Railway. */
export const CANONICAL_HOST = "www.frenem.com"
/** Naked domain. GoDaddy forwarding currently intercepts this host. */
export const APEX_HOST = "frenem.com"
export const DEFAULT_SITE_URL = `https://${CANONICAL_HOST}`

export const SITE_NAME = "Frenem"

function normalizedHostname(hostname: string): string {
  return hostname.replace(/\.$/, "").toLowerCase()
}

/**
 * Canonical origin for metadata, sitemap, robots, feeds, and JSON-LD.
 * `https://frenem.com` (any casing, port, path, or trailing dot) is rewritten
 * to www so an env override cannot advertise apex URLs that 404 behind
 * GoDaddy forwarding. Other origins (localhost, Railway previews) are kept.
 */
export function resolveSiteUrl(raw: string | undefined = process.env.NEXT_PUBLIC_SITE_URL): string {
  const trimmed = raw?.trim()
  if (!trimmed) return DEFAULT_SITE_URL
  try {
    const url = new URL(trimmed)
    if (url.protocol !== "http:" && url.protocol !== "https:") return DEFAULT_SITE_URL
    const hostname = normalizedHostname(url.hostname)
    if (hostname === APEX_HOST || hostname === CANONICAL_HOST) return DEFAULT_SITE_URL
    return url.origin
  } catch {
    return DEFAULT_SITE_URL
  }
}

export const SITE_URL = resolveSiteUrl()

/**
 * Absolute URL for a site path. The homepage has no trailing slash, matching
 * the canonical Next emits when `trailingSlash` is off.
 */
export function absoluteUrl(path: string): string {
  if (path === "/" || path === "") return SITE_URL
  const normalized = path.startsWith("/") ? path : `/${path}`
  return `${SITE_URL}${normalized.replace(/\/$/, "")}`
}

/** First host from `Host` / `X-Forwarded-Host`, without port or trailing dot. */
export function requestHostname(hostHeader: string | null | undefined): string {
  if (!hostHeader) return ""
  let host = hostHeader.split(",")[0]?.trim() ?? ""
  if (!host) return ""
  if (host.startsWith("[")) {
    const end = host.indexOf("]")
    host = end === -1 ? host : host.slice(1, end)
  } else {
    host = host.replace(/:\d+$/, "")
  }
  return normalizedHostname(host)
}

/**
 * Permanent Location for apex → www. Returns null when the request is
 * already on the canonical host (or any other host, e.g. localhost).
 * Built as a literal URL so Railway's internal listen port cannot leak.
 */
export function apexToWwwRedirectLocation(hostname: string, pathname: string, search = ""): string | null {
  if (hostname !== APEX_HOST) return null
  let path = pathname.startsWith("/") ? pathname : `/${pathname}`
  if (!path.startsWith("/") || path.startsWith("//")) path = "/"
  const query = search.startsWith("?") ? search : ""
  return `https://${CANONICAL_HOST}${path}${query}`
}
