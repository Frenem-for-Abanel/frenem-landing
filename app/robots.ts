import type { MetadataRoute } from "next"
import { SITE_URL } from "./utils/site"

/**
 * Open to every crawler, including AI answer engines, so Frenem can be cited
 * wherever people ask about organisation design. Only the form API is closed.
 */
/**
 * Named on purpose, so the policy reads at a glance and survives a CDN
 * "block AI crawlers" default: search and answer engines that cite sources,
 * and the crawlers that feed them.
 */
const ANSWER_ENGINES = [
  "Googlebot",
  "Bingbot",
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot",
  "Applebot-Extended",
  "DuckAssistBot",
  "meta-externalagent",
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: ANSWER_ENGINES, allow: "/", disallow: "/api/" },
      { userAgent: "*", allow: "/", disallow: "/api/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
