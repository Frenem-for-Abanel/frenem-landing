import { HOME_DESCRIPTION } from "./seo"
import { LINKEDIN_URL, SITE_NAME, SITE_URL } from "./site"

/**
 * schema.org JSON-LD for search engines and AI answer engines. One linked
 * graph: every page's entities point back at the same Organization and
 * WebSite by @id, so crawlers read Frenem as one publisher with three
 * products rather than several unrelated pages. Descriptions repeat what the
 * pages already say; nothing here claims more than the visible copy.
 */

export const ORG_ID = `${SITE_URL}/#organization`
export const WEBSITE_ID = `${SITE_URL}/#website`
export const BLOG_ID = `${SITE_URL}/engineering#blog`

export const SAME_AS = [LINKEDIN_URL]

type Json = Record<string, unknown>

/** Homepage has no trailing slash, matching the canonical tag Next emits for `/`. */
const abs = (path: string) => (path === "/" || path === "" ? SITE_URL : `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`)

export function siteGraph(): Json {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ORG_ID,
        name: SITE_NAME,
        alternateName: "frenem",
        url: abs("/"),
        slogan: "The whole organisation, in focus.",
        disambiguatingDescription:
          "Organisation clarity firm. Pulse diagnoses how the business actually runs, Build redesigns it, and Prism keeps that design current.",
        logo: {
          "@type": "ImageObject",
          "@id": `${SITE_URL}/#logo`,
          url: abs("/icon-512.png"),
          width: 512,
          height: 512,
          caption: SITE_NAME,
        },
        image: { "@id": `${SITE_URL}/#logo` },
        description: HOME_DESCRIPTION,
        knowsAbout: [
          "Organisation design",
          "Organisation change",
          "Relational diagnostics",
          "Governance",
          "Ownership",
          "Succession",
          "Operating model",
          "Founder-led companies",
        ],
        sameAs: SAME_AS,
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: abs("/"),
        name: SITE_NAME,
        alternateName: "frenem",
        description: HOME_DESCRIPTION,
        inLanguage: "en",
        publisher: { "@id": ORG_ID },
      },
    ],
  }
}

/** A page's own WebPage node, tied into the site graph. */
export function webPage({
  path,
  name,
  description,
  about,
  type = "WebPage",
}: {
  path: string
  name: string
  description: string
  /** @id of the main entity the page is about. */
  about?: string
  type?: "WebPage" | "CollectionPage" | "FAQPage"
}): Json {
  return {
    "@type": type,
    "@id": `${abs(path)}#webpage`,
    url: abs(path),
    name,
    description,
    inLanguage: "en",
    isPartOf: { "@id": WEBSITE_ID },
    publisher: { "@id": ORG_ID },
    ...(about ? { about: { "@id": about }, mainEntity: { "@id": about } } : {}),
  }
}

export function breadcrumbs(trail: Array<{ name: string; path: string }>): Json {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...trail].map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: abs(crumb.path),
    })),
  }
}

/** Mirrors a page's visible FAQ exactly; never add answers that aren't on the page. */
export function faq(path: string, items: Array<{ question: string; answer: string }>): Json {
  return {
    "@type": "FAQPage",
    "@id": `${abs(path)}#faq`,
    url: abs(path),
    isPartOf: { "@id": WEBSITE_ID },
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  }
}

export function graph(...nodes: Json[]): Json {
  return { "@context": "https://schema.org", "@graph": nodes }
}

/**
 * Serialise for a <script type="application/ld+json">. Escapes "<" so no
 * string in the data can close the script tag early.
 */
export function toJsonLd(data: Json): string {
  return JSON.stringify(data).replace(/</g, "\\u003c")
}

export { abs as absoluteUrl }
