import type { MetadataRoute } from "next"
import { absoluteUrl } from "./utils/site"
import { entryPath, getAllEntries } from "../lib/engineering/content"
import { getGuides, guidePath } from "../lib/guides/content"
import { GLOSSARY, termPath } from "./utils/glossary"

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
  const guides = getGuides()
  const newestGuide = lastmod(guides.map((guide) => guide.updated).sort().at(-1))
  return [
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
    { url: absoluteUrl("/insights"), lastModified: newestGuide, changeFrequency: "weekly", priority: 0.8 },
    ...guides.map((guide) => ({
      url: absoluteUrl(guidePath(guide)),
      lastModified: lastmod(guide.updated),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    // Glossary entries live in code, so they carry no edit date of their own.
    { url: absoluteUrl("/glossary"), changeFrequency: "monthly", priority: 0.6 },
    ...GLOSSARY.map((entry) => ({
      url: absoluteUrl(termPath(entry)),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ]
}
