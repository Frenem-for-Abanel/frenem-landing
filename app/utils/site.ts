/** Canonical site origin; override per environment. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://frenem.com"

export const SITE_NAME = "Frenem"
