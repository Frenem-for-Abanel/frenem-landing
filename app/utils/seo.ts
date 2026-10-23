import type { Metadata } from "next"
import type { EngineeringEntry } from "../../lib/engineering/content"
import { SITE_NAME } from "./site"

/** Homepage title and description. No city: the firm reads as global. The work is how the business runs, not an HR function. */
export const HOME_TITLE = "Frenem | Organisation design for founder-led companies"
export const HOME_DESCRIPTION =
  "Organisation design and diagnostics for founder-led companies. Pulse shows how the business really runs, Build redesigns it, Prism keeps it current."

/**
 * The essay summary is one sentence. When a TL;DR bullet states the topic in
 * the author's words and still fits a snippet, append it.
 */
export function essayMetaDescription(essay: Pick<EngineeringEntry, "summary" | "body">): string {
  const summary = essay.summary.trim()
  const block = essay.body.match(/<Tldr\b[^>]*>([\s\S]*?)<\/Tldr>/)?.[1]
  const bullet = block?.match(/^-\s+(.+)$/m)?.[1]?.trim()
  if (!bullet) return summary
  const topical = (bullet.includes(":") ? bullet.split(":").slice(1).join(":") : bullet)
    .replace(/\.$/, "")
    .trim()
  const parts = topical
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
  const limit = 158 - summary.length - 1
  if (limit < 24 || parts.length === 0) return summary
  let extra = parts[0]
  if (parts[1] && extra.length + 2 + parts[1].length <= limit) {
    extra = `${extra}, ${parts[1]}`
  }
  if (extra.length > limit) return summary
  const sentence = extra.charAt(0).toUpperCase() + extra.slice(1)
  return `${summary} ${sentence}.`
}

/**
 * Alternate formats, repeated per page because a page's `alternates`
 * replaces the layout's: the RSS feed, and the plain-text site maps for AI
 * assistants (llms.txt and its full-text companion).
 */
export const FEED_ALTERNATE = {
  "application/rss+xml": [{ url: "/engineering/feed.xml", title: "Frenem Engineering" }],
  "text/plain": [
    { url: "/llms.txt", title: "llms.txt" },
    { url: "/llms-full.txt", title: "llms-full.txt" },
  ],
}

/** One language, one URL per page: declare it, with the same URL as the default. */
export function languageAlternates(path: string) {
  return { "en-GB": path, "x-default": path }
}

/** Pixel size of every `opengraph-image.tsx`. Keep in step with `OG_SIZE`. */
export const OG_IMAGE = { width: 1200, height: 630, type: "image/png" as const }

/** Route Next serves for a page's generated share image. */
export function openGraphImagePath(path: string): string {
  return `${path === "/" ? "" : path.replace(/\/$/, "")}/opengraph-image`
}

/**
 * Complete metadata for one page. Next replaces nested objects like
 * `openGraph` wholesale rather than merging them with the layout's, so every
 * page sets the full set here: canonical, Open Graph, and Twitter card.
 * Titles are absolute (they already carry the brand) and kept under about
 * 60 characters so search results show them whole.
 */
export function pageMetadata({
  path,
  title,
  description,
  socialTitle = title,
  socialDescription = description,
  type = "website",
  publishedTime,
}: {
  path: string
  title: string
  description: string
  socialTitle?: string
  socialDescription?: string
  type?: "website" | "article"
  /** ISO date, for articles. */
  publishedTime?: string
}): Metadata {
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path, languages: languageAlternates(path), types: FEED_ALTERNATE },
    openGraph: {
      siteName: SITE_NAME,
      locale: "en_GB",
      type,
      url: path,
      title: socialTitle,
      description: socialDescription,
      ...(type === "article" && publishedTime ? { publishedTime, authors: [`${SITE_NAME} Engineering`] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: socialDescription,
      // images intentionally omitted: Next copies each page's
      // opengraph-image (alt, size, and the hashed URL) onto the Twitter
      // card when this field is absent. Setting it here would publish a
      // second, unhashed image URL.
    },
  }
}
