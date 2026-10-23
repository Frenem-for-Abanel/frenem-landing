type Bucket = number[]

const DEFAULT_LIMIT = 5
const DEFAULT_WINDOW_MS = 10 * 60 * 1000

/**
 * Minimal sliding-window rate limiter. In-memory by design: good enough to
 * blunt drive-by form spam on a single instance; serverless deployments get
 * per-instance limiting, which is still a meaningful brake.
 */
const buckets = new Map<string, Bucket>()

export function checkRateLimit(
  key: string,
  { limit = DEFAULT_LIMIT, windowMs = DEFAULT_WINDOW_MS, now = Date.now() } = {}
): { allowed: boolean; remaining: number } {
  const cutoff = now - windowMs
  const bucket = (buckets.get(key) ?? []).filter((t) => t > cutoff)

  if (bucket.length >= limit) {
    buckets.set(key, bucket)
    return { allowed: false, remaining: 0 }
  }

  bucket.push(now)
  buckets.set(key, bucket)

  // Opportunistic cleanup so the map doesn't grow unbounded.
  if (buckets.size > 1000) {
    for (const [k, v] of buckets) {
      if (v.every((t) => t <= cutoff)) buckets.delete(k)
    }
  }

  return { allowed: true, remaining: limit - bucket.length }
}

/** Test hook. */
export function resetRateLimits() {
  buckets.clear()
}

/**
 * Rate-limit key for a request. The proxy appends the address it saw to
 * X-Forwarded-For, so the last hop is the one a client cannot forge; the
 * first is whatever the client sent. X-Real-IP, when set, is preferred.
 */
export function clientKey(req: Pick<Request, "headers">): string {
  const realIp = req.headers.get("x-real-ip")?.trim()
  if (realIp) return realIp
  const hops = req.headers
    .get("x-forwarded-for")
    ?.split(",")
    .map((hop) => hop.trim())
    .filter(Boolean)
  return hops?.at(-1) || "unknown"
}
