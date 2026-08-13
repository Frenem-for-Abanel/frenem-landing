import type { MetadataRoute } from "next"
import { SITE_URL } from "./utils/site"

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  return [
    { url: `${SITE_URL}/`, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/pulse`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/build`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/prism`, lastModified, changeFrequency: "monthly", priority: 0.9 },
  ]
}
