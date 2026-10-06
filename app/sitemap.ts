import type { MetadataRoute } from "next"
import { absoluteUrl } from "./utils/structured-data"
import { getAllEntries, getEssays } from "../lib/engineering/content"

/**
 * Only real dates go in lastmod: search engines stop trusting a sitemap that
 * says every page changed at build time. Essays carry their own date, and the
 * engineering pages move with their newest entry. Marketing pages omit it.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const newest = getAllEntries()[0]?.date
  return [
    { url: absoluteUrl("/"), changeFrequency: "monthly", priority: 1 },
    { url: absoluteUrl("/pulse"), changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/build"), changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/prism"), changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/engineering"), lastModified: newest, changeFrequency: "weekly", priority: 0.7 },
    { url: absoluteUrl("/engineering/log"), lastModified: newest, changeFrequency: "weekly", priority: 0.5 },
    ...getEssays().map((essay) => ({
      url: absoluteUrl(`/engineering/${essay.slug}`),
      lastModified: essay.date,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ]
}
