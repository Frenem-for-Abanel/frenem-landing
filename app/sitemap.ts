import type { MetadataRoute } from "next"
import { absoluteUrl } from "./utils/site"
import { getAllEntries, getEssays } from "../lib/engineering/content"

/**
 * Only real dates go in lastmod: search engines stop trusting a sitemap that
 * says every page changed at build time. Essays carry their own date, and the
 * engineering pages move with their newest entry. Marketing pages omit it.
 * Noon UTC keeps that calendar day stable when Next serialises with toISOString.
 */
function lastmod(date: string | undefined): Date | undefined {
  return date ? new Date(`${date}T12:00:00.000Z`) : undefined
}

export default function sitemap(): MetadataRoute.Sitemap {
  const newest = lastmod(getAllEntries()[0]?.date)
  return [
    { url: absoluteUrl("/"), changeFrequency: "monthly", priority: 1 },
    { url: absoluteUrl("/pulse"), changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/build"), changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/prism"), changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/engineering"), lastModified: newest, changeFrequency: "weekly", priority: 0.7 },
    { url: absoluteUrl("/engineering/log"), lastModified: newest, changeFrequency: "weekly", priority: 0.5 },
    ...getEssays().map((essay) => ({
      url: absoluteUrl(`/engineering/${essay.slug}`),
      lastModified: lastmod(essay.date),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ]
}
