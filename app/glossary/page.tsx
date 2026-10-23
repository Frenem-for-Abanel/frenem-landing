import type { Metadata } from "next"
import Link from "next/link"
import Breadcrumbs from "../components/Breadcrumbs"
import JsonLd from "../components/JsonLd"
import { pageMetadata } from "../utils/seo"
import { absoluteUrl, breadcrumbs, GLOSSARY_ID, graph, ORG_ID, webPage } from "../utils/structured-data"
import { glossaryAlphabetical, termPath } from "../utils/glossary"

const DESCRIPTION =
  "Plain definitions of organisation design and diagnostics terms: decision rights, RAPID and RACI, organisational network analysis, span of control, and more."

export const metadata: Metadata = pageMetadata({
  path: "/glossary",
  title: "Organisation design glossary | Frenem",
  description: DESCRIPTION,
  socialTitle: "The organisation glossary",
})

export default function GlossaryPage() {
  const terms = glossaryAlphabetical()
  const crumbs = [
    { name: "Insights", path: "/insights" },
    { name: "Glossary", path: "/glossary" },
  ]
  const jsonLd = graph(
    webPage({ path: "/glossary", name: "The organisation glossary", description: DESCRIPTION, type: "CollectionPage", about: GLOSSARY_ID }),
    {
      "@type": "DefinedTermSet",
      "@id": GLOSSARY_ID,
      name: "The organisation glossary",
      description: DESCRIPTION,
      url: absoluteUrl("/glossary"),
      publisher: { "@id": ORG_ID },
      hasDefinedTerm: terms.map((entry) => ({ "@id": absoluteUrl(`${termPath(entry)}#term`) })),
    },
    breadcrumbs(crumbs)
  )

  return (
    <div className="tint-brand">
      <JsonLd data={jsonLd} />
      <header className="grain relative bg-(--tint-soft)">
        <div className="container-site relative pb-12 pt-28 md:pb-16 md:pt-36">
          <Breadcrumbs items={crumbs} />
          <h1 className="type-display-2 anim-fade-up max-w-[16ch]">
            The organisation <em>glossary.</em>
          </h1>
          <p className="type-lead anim-fade-up mt-6 max-w-[56ch] text-ink-secondary">
            Plain definitions of the terms that come up when a business redesigns how it runs. Each
            one starts with a single sentence you can quote.
          </p>
        </div>
      </header>

      <div className="container-site pb-24 pt-10 md:pb-32 md:pt-14">
        <dl className="grid grid-cols-1 gap-x-12 md:grid-cols-2">
          {terms.map((entry) => (
            <div key={entry.slug} className="border-b border-line-strong py-6">
              <dt>
                <Link
                  href={termPath(entry)}
                  className="text-[22px] font-bold leading-snug tracking-[-0.02em] [font-stretch:106%] underline-offset-4 hover:underline"
                >
                  {entry.term}
                </Link>
              </dt>
              <dd className="mt-2 max-w-[60ch] text-[16px] leading-relaxed text-ink-secondary">{entry.definition}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}
