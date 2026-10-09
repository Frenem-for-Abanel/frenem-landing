import { OG_IMAGE, openGraphImagePath } from "./seo"
import { absoluteUrl, SITE_NAME, SITE_URL } from "./site"

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

/** TODO: confirm the company LinkedIn URL before launch (see Footer). */
export const SAME_AS = ["https://www.linkedin.com/company/frenem"]

type Json = Record<string, unknown>

const abs = absoluteUrl

/** `@id` base. The homepage keeps a slash so fragments match `/#organization`. */
function idBase(path: string): string {
  return path === "/" ? `${SITE_URL}/` : abs(path)
}

/** Share image for a page, at the size the OG route actually renders. */
export function ogImage(path: string): Json {
  return {
    "@type": "ImageObject",
    url: abs(openGraphImagePath(path)),
    width: OG_IMAGE.width,
    height: OG_IMAGE.height,
  }
}

export function siteGraph(): Json {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ORG_ID,
        name: SITE_NAME,
        url: abs("/"),
        logo: {
          "@type": "ImageObject",
          url: abs("/icon-512.png"),
          width: 512,
          height: 512,
        },
        description:
          "Organisation clarity for scaling companies: relational diagnostics (Pulse), organisation design (Build), and employee management (Prism).",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Bangalore",
          addressRegion: "Karnataka",
          addressCountry: "IN",
        },
        areaServed: { "@type": "Country", name: "India" },
        knowsAbout: [
          "Organisation design",
          "Organisational network analysis",
          "Relational diagnostics",
          "Decision rights",
          "Governance",
          "Succession planning",
          "Leadership development",
          "Employee management",
          "Performance management",
        ],
        sameAs: SAME_AS,
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer support",
          url: abs("/"),
          areaServed: "IN",
          availableLanguage: ["en"],
        },
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: abs("/"),
        name: SITE_NAME,
        description:
          "Organisation clarity for scaling companies: relational diagnostics (Pulse), organisation design (Build), and employee management (Prism).",
        inLanguage: "en-IN",
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
    "@id": `${idBase(path)}#webpage`,
    url: abs(path),
    name,
    description,
    inLanguage: "en-IN",
    isPartOf: { "@id": WEBSITE_ID },
    publisher: { "@id": ORG_ID },
    primaryImageOfPage: ogImage(path),
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
    "@id": `${idBase(path)}#faq`,
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

export { absoluteUrl }
