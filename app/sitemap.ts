import type { MetadataRoute } from "next"
import { absoluteUrl } from "./utils/site"
import { openGraphImagePath } from "./utils/seo"
import { entryPath, getAllEntries } from "../lib/engineering/content"

/**
 * Only real dates go in lastmod: search engines stop trusting a sitemap that
 * says every page changed at build time. Essays carry their own date, and the
 * engineering pages move with their newest entry. Marketing pages omit it.
 * Noon UTC keeps that calendar day stable when Next serialises with toISOString.
 */
function lastmod(date: string | undefined): Date | undefined {
  return date ? new Date(`${date}T12:00:00.000Z`) : undefined
}

/** Every page has its own share card; listing it lets image search and answer engines find it. */
function withImage(entry: MetadataRoute.Sitemap[number]): MetadataRoute.Sitemap[number] {
  const path = new URL(entry.url).pathname
  return { ...entry, images: [absoluteUrl(openGraphImagePath(path))] }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const newest = lastmod(getAllEntries()[0]?.date)
  const entries: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "monthly", priority: 1 },
    { url: absoluteUrl("/pulse"), changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/build"), changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/prism"), changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/engineering"), lastModified: newest, changeFrequency: "weekly", priority: 0.7 },
    { url: absoluteUrl("/engineering/log"), lastModified: newest, changeFrequency: "weekly", priority: 0.5 },
    ...getAllEntries().map((entry) => ({
      url: absoluteUrl(entryPath(entry)),
      lastModified: lastmod(entry.date),
      changeFrequency: "yearly" as const,
      priority: entry.type === "essay" ? 0.6 : 0.4,
    })),
  ]
  return entries.map(withImage)
}
