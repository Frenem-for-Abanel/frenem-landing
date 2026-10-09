import type { Metadata } from "next"
import { SITE_NAME } from "./site"

/** RSS discovery, repeated per page because a page's `alternates` replaces the layout's. */
export const FEED_ALTERNATE = {
  "application/rss+xml": [{ url: "/engineering/feed.xml", title: "Frenem Engineering" }],
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
    alternates: { canonical: path, types: FEED_ALTERNATE },
    openGraph: {
      siteName: SITE_NAME,
      locale: "en_IN",
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
