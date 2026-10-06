/** Canonical site origin; override per environment. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://frenem.com"

export const SITE_NAME = "Frenem"

/** Company profile. Its homepage is frenem.com. */
export const LINKEDIN_URL = "https://www.linkedin.com/company/frenem"
