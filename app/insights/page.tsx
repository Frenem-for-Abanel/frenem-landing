import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import Breadcrumbs from "../components/Breadcrumbs"
import JsonLd from "../components/JsonLd"
import { formatEntryDate } from "../utils/dates"
import { pageMetadata } from "../utils/seo"
import { absoluteUrl, breadcrumbs, graph, webPage } from "../utils/structured-data"
import { glossaryAlphabetical, termPath } from "../utils/glossary"
import { PRODUCT_LABELS } from "../utils/product"
import { getGuides, guidePath } from "../../lib/guides/content"
import { entryPath, getAllEntries, TYPE_LABELS } from "../../lib/engineering/content"

const DESCRIPTION =
  "Guides, definitions, and field notes on organisation design and diagnostics: decision rights, network analysis, the founder bottleneck, and running the operating model."

export const metadata: Metadata = pageMetadata({
  path: "/insights",
  title: "Insights on organisation design | Frenem",
  description: DESCRIPTION,
  socialTitle: "Frenem Insights",
})

const DOT = { pulse: "bg-sage-mid", build: "bg-clay-mid", prism: "bg-heather-mid" } as const

export default function InsightsPage() {
  const guides = getGuides()
  const terms = glossaryAlphabetical()
  const engineering = getAllEntries().slice(0, 4)
  const crumbs = [{ name: "Insights", path: "/insights" }]

  const jsonLd = graph(
    webPage({ path: "/insights", name: "Frenem Insights", description: DESCRIPTION, type: "CollectionPage" }),
    {
      "@type": "ItemList",
      name: "Frenem guides",
      itemListElement: guides.map((guide, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: guide.title,
        url: absoluteUrl(guidePath(guide)),
      })),
    },
    breadcrumbs(crumbs)
  )

  return (
    <div className="tint-brand">
      <JsonLd data={jsonLd} />
      <header className="grain relative bg-(--tint-soft)">
        <div className="container-site relative pb-12 pt-28 md:pb-16 md:pt-36">
          <Breadcrumbs items={crumbs} />
          <h1 className="type-display-2 anim-fade-up max-w-[14ch]">
            How organisations <em>actually run.</em>
          </h1>
          <p className="type-lead anim-fade-up mt-6 max-w-[58ch] text-ink-secondary">
            Guides for founders and leadership teams on decision rights, network analysis, and keeping
            the operating model current. Plus a glossary of the terms, and notes from the team building
            Frenem.
          </p>
        </div>
      </header>

      <section aria-labelledby="guides" className="container-site pb-16 pt-12 md:pb-24 md:pt-16">
        <h2 id="guides" className="type-display-3">
          Guides
        </h2>
        <ul className="mt-8 grid grid-cols-1 gap-x-12 md:grid-cols-2">
          {guides.map((guide) => (
            <li key={guide.slug} className="border-b border-line-strong">
              <Link href={guidePath(guide)} className="group flex flex-col gap-2 py-7">
                <span className="flex items-center gap-2.5 text-[14px] font-semibold text-ink-secondary">
                  {guide.product ? (
                    <>
                      <span aria-hidden className={`h-2.5 w-2.5 rounded-full ${DOT[guide.product]}`} />
                      {PRODUCT_LABELS[guide.product]}
                      <span aria-hidden>·</span>
                    </>
                  ) : null}
                  {guide.readingTime}
                </span>
                <span className="text-[24px] font-bold leading-[1.15] tracking-[-0.025em] [font-stretch:106%] group-hover:underline group-hover:underline-offset-4">
                  {guide.title}
                </span>
                <span className="max-w-[56ch] text-[16px] leading-relaxed text-ink-secondary">{guide.summary}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="glossary" className="bg-paper-soft py-16 md:py-24">
        <div className="container-site">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 id="glossary" className="type-display-3">
              Glossary
            </h2>
            <Link href="/glossary" className="link-line text-[16px] font-semibold">
              All {terms.length} terms
            </Link>
          </div>
          <ul className="mt-8 flex flex-wrap gap-2">
            {terms.map((entry) => (
              <li key={entry.slug}>
                <Link
                  href={termPath(entry)}
                  className="inline-flex min-h-11 items-center rounded-full bg-paper px-4 text-[15px] font-semibold transition-colors hover:bg-(--tint-soft)"
                >
                  {entry.term}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="engineering" className="container-site py-16 md:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 id="engineering" className="type-display-3">
            From Engineering
          </h2>
          <Link href="/engineering" className="link-line text-[16px] font-semibold">
            Essays and the log
          </Link>
        </div>
        <ul className="mt-8">
          {engineering.map((entry) => (
            <li key={entry.slug} className="border-b border-line-strong">
              <Link href={entryPath(entry)} className="group grid grid-cols-1 gap-1 py-5 md:grid-cols-[160px_minmax(0,1fr)_24px] md:items-baseline md:gap-6">
                <span className="text-[14px] text-ink-secondary">
                  {TYPE_LABELS[entry.type]} · {formatEntryDate(entry.date)}
                </span>
                <span className="text-[18px] font-semibold leading-snug">{entry.title}</span>
                <ArrowRight aria-hidden className="hidden h-4 w-4 transition-transform group-hover:translate-x-1 md:block" />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
