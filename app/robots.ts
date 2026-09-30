import type { MetadataRoute } from "next"
import { SITE_URL } from "./utils/site"

/**
 * Open to every crawler, including AI answer engines, so Frenem can be cited
 * wherever people ask about organisation design. Only the form API is closed.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
