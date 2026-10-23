import type { Metadata } from "next"
import Link from "next/link"
import Breadcrumbs from "../components/Breadcrumbs"
import JsonLd from "../components/JsonLd"
import { pageMetadata } from "../utils/seo"
import { absoluteUrl, breadcrumbs, GLOSSARY_ID, graph, ORG_ID, webPage } from "../utils/structured-data"
import { glossaryAlphabetical } from "../utils/glossary"
import { PRODUCT_LABELS } from "../utils/product"

const DESCRIPTION =
  "Short definitions of the organisation terms Frenem uses: decision rights, RAPID and RACI, operating model, network analysis, and more."

export const metadata: Metadata = pageMetadata({
  path: "/glossary",
  title: "Organisation design glossary | Frenem",
  description: DESCRIPTION,
  socialTitle: "The Frenem glossary",
})

export default function GlossaryPage() {
  const terms = glossaryAlphabetical()
  const crumbs = [{ name: "Glossary", path: "/glossary" }]
  const jsonLd = graph(
    webPage({ path: "/glossary", name: "The Frenem glossary", description: DESCRIPTION, about: GLOSSARY_ID }),
    {
      "@type": "DefinedTermSet",
      "@id": GLOSSARY_ID,
      name: "The Frenem glossary",
      description: DESCRIPTION,
      url: absoluteUrl("/glossary"),
      inLanguage: "en-GB",
      publisher: { "@id": ORG_ID },
      hasDefinedTerm: terms.map((entry) => ({
        "@type": "DefinedTerm",
        "@id": `${absoluteUrl("/glossary")}#${entry.slug}`,
        name: entry.term,
        description: entry.definition,
        url: `${absoluteUrl("/glossary")}#${entry.slug}`,
        inDefinedTermSet: { "@id": GLOSSARY_ID },
      })),
    },
    breadcrumbs(crumbs)
  )

  return (
    <div className="tint-brand">
      <JsonLd data={jsonLd} />
      <div className="container-site pb-24 pt-28 md:pb-32 md:pt-36">
        <Breadcrumbs items={crumbs} />
        <h1 className="type-display-2 anim-fade-up">Glossary</h1>
        <p className="type-lead anim-fade-up mt-5 max-w-[52ch] text-ink-secondary">
          The terms we use, in one sentence each.
        </p>

        <dl className="mt-12 grid grid-cols-1 gap-x-12 md:mt-16 md:grid-cols-2">
          {terms.map((entry) => (
            <div key={entry.slug} id={entry.slug} className="scroll-mt-24 border-t border-line-strong py-6">
              <dt className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <span className="text-[20px] font-bold leading-snug tracking-[-0.02em] [font-stretch:106%]">{entry.term}</span>
                {entry.product ? (
                  <Link
                    href={`/${entry.product}`}
                    className="text-[14px] font-semibold text-ink-secondary underline decoration-line-strong underline-offset-4 hover:text-ink"
                  >
                    {PRODUCT_LABELS[entry.product]}
                  </Link>
                ) : null}
              </dt>
              <dd className="mt-2 max-w-[58ch] text-[16px] leading-relaxed text-ink-secondary">{entry.definition}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}
