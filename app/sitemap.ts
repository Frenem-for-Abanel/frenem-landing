import type { MetadataRoute } from "next"
import { SITE_URL } from "./utils/site"
import { getEssays, neutralUtcInstant } from "../lib/engineering/content"

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  return [
    { url: `${SITE_URL}/`, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/pulse`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/build`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/prism`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/engineering`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/engineering/log`, lastModified, changeFrequency: "weekly", priority: 0.6 },
    ...getEssays().map((essay) => ({
      url: `${SITE_URL}/engineering/${essay.slug}`,
      lastModified: neutralUtcInstant(essay.date),
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
  ]
}
