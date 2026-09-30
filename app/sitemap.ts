import type { MetadataRoute } from "next"
import { SITE_URL } from "./utils/site"
import { getAllEntries, getEssays } from "../lib/engineering/content"

/**
 * Only real dates go in lastmod: search engines stop trusting a sitemap that
 * says every page changed at build time. Essays carry their own date, and the
 * engineering pages move with their newest entry. Marketing pages omit it.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const newest = getAllEntries()[0]?.date
  return [
    { url: `${SITE_URL}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/pulse`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/build`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/prism`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/engineering`, lastModified: newest, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/engineering/log`, lastModified: newest, changeFrequency: "weekly", priority: 0.5 },
    ...getEssays().map((essay) => ({
      url: `${SITE_URL}/engineering/${essay.slug}`,
      lastModified: essay.date,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ]
}
