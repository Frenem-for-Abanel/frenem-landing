import type { Metadata } from "next"
import type { EngineeringEntry } from "../../lib/engineering/content"
import { SITE_NAME } from "./site"

/** Homepage title and description. No city: the firm reads as global. The work is how the business runs, not an HR function. */
export const HOME_TITLE = "Frenem | Diagnose, design, and run the organisation"
export const HOME_DESCRIPTION =
  "A clarity suite for how a business actually runs. Pulse maps how people work together, Build redesigns the structure, and Prism keeps it current."

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

/** RSS discovery, repeated per page because a page's `alternates` replaces the layout's. */
export const FEED_ALTERNATE = {
  "application/rss+xml": [{ url: "/engineering/feed.xml", title: "Frenem Engineering" }],
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
    alternates: { canonical: path, types: FEED_ALTERNATE },
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
    },
  }
}
