import type { Metadata } from "next"
import Link from "next/link"
import FeaturedEssay from "../components/engineering/FeaturedEssay"
import LogStream from "../components/engineering/LogStream"
import JsonLd from "../components/JsonLd"
import { getAllEntries, getEssays, getFeaturedEssay } from "../../lib/engineering/content"
import { pageMetadata } from "../utils/seo"
import { absoluteUrl, BLOG_ID, breadcrumbs, graph, ORG_ID, webPage } from "../utils/structured-data"

const DESCRIPTION =
  "Essays and field notes from Frenem Engineering: the method, design, and trust decisions behind the clarity suite."

export const metadata: Metadata = pageMetadata({
  path: "/engineering",
  title: "Frenem Engineering | Essays and field notes",
  description: DESCRIPTION,
})

/** The cover shows the latest slice of the ledger; the archive holds it all. */
const LOG_LIMIT = 15

export default function EngineeringPage() {
  const entries = getAllEntries()
  const latest = entries.slice(0, LOG_LIMIT)
  const jsonLd = graph(
    webPage({ path: "/engineering", name: "Frenem Engineering", description: DESCRIPTION, type: "CollectionPage", about: BLOG_ID }),
    {
      "@type": "Blog",
      "@id": BLOG_ID,
      name: "Frenem Engineering",
      description: DESCRIPTION,
      url: absoluteUrl("/engineering"),
      inLanguage: "en",
      publisher: { "@id": ORG_ID },
      blogPost: getEssays().map((essay) => ({
        "@type": "BlogPosting",
        "@id": absoluteUrl(`/engineering/${essay.slug}#article`),
        headline: essay.title,
        url: absoluteUrl(`/engineering/${essay.slug}`),
        datePublished: essay.date,
      })),
    },
    breadcrumbs([{ name: "Engineering", path: "/engineering" }])
  )

  return (
    <div className="tint-brand container-site pb-20 md:pb-28">
      <JsonLd data={jsonLd} />
      <FeaturedEssay essay={getFeaturedEssay()} />

      <section aria-labelledby="the-log" className="pt-10 md:pt-12">
        <h2
          id="the-log"
          className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink-secondary"
        >
          The Log
        </h2>
        <div className="mt-5 md:mt-6">
          <LogStream entries={latest} surface="cover" />
        </div>
        <p className="mt-2 border-t border-line pt-6">
          <Link
            href="/engineering/log"
            className="font-mono text-[13px] text-ink-secondary transition-colors hover:text-ink"
          >
            The full log <span aria-hidden>→</span>
          </Link>
        </p>
      </section>
    </div>
  )
}
