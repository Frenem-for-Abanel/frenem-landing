import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import Breadcrumbs from "../../components/Breadcrumbs"
import JsonLd from "../../components/JsonLd"
import ArticleCta from "../../components/ArticleCta"
import { pageMetadata } from "../../utils/seo"
import { breadcrumbs, definedTerm, graph, webPage, absoluteUrl } from "../../utils/structured-data"
import { getTerm, GLOSSARY, termPath } from "../../utils/glossary"
import { getGuideBySlug, guidePath } from "../../../lib/guides/content"

export const dynamicParams = false

export function generateStaticParams() {
  return GLOSSARY.map((entry) => ({ term: entry.slug }))
}

/** "What is X?" leads the title: it is how people ask search engines and assistants. */
function titleFor(term: string): string {
  return `What is ${term.replace(/\s*\(.*\)$/, "")}? | Frenem glossary`
}

export async function generateMetadata({ params }: { params: Promise<{ term: string }> }): Promise<Metadata> {
  const { term } = await params
  const entry = getTerm(term)
  if (!entry) return {}
  return pageMetadata({
    path: termPath(entry),
    title: titleFor(entry.term),
    description: entry.definition.length > 158 ? `${entry.definition.slice(0, 155).trimEnd()}…` : entry.definition,
    socialTitle: entry.term,
  })
}

export default async function GlossaryTermPage({ params }: { params: Promise<{ term: string }> }) {
  const { term } = await params
  const entry = getTerm(term)
  if (!entry) notFound()

  const path = termPath(entry)
  const crumbs = [
    { name: "Glossary", path: "/glossary" },
    { name: entry.term, path },
  ]
  const related = entry.related.map(getTerm).filter((r): r is NonNullable<typeof r> => Boolean(r))
  const guide = entry.guide ? getGuideBySlug(entry.guide) : undefined
  const jsonLd = graph(
    webPage({ path, name: entry.term, description: entry.definition, about: absoluteUrl(`${path}#term`) }),
    definedTerm({ path, name: entry.term, description: entry.definition, alternateNames: entry.aka }),
    breadcrumbs(crumbs)
  )

  return (
    <div className={entry.product ? `tint-${entry.product}` : "tint-brand"}>
      <JsonLd data={jsonLd} />
      <article>
        <header className="grain relative bg-(--tint-soft)">
          <div className="container-site relative pb-12 pt-28 md:pb-16 md:pt-36">
            <div className="mx-auto max-w-(--narrow-width)">
              <Breadcrumbs items={crumbs} />
              <h1 className="type-display-2 anim-fade-up">{entry.term}</h1>
              {entry.aka?.length ? (
                <p className="anim-fade-up mt-4 text-[15px] text-ink-secondary">Also called: {entry.aka.join(", ")}</p>
              ) : null}
              <p className="type-lead anim-fade-up mt-6 text-ink">{entry.definition}</p>
            </div>
          </div>
        </header>

        <div className="container-site pb-20 md:pb-28">
          <div className="mx-auto max-w-(--narrow-width) pt-10 md:pt-12">
            {entry.body.map((paragraph) => (
              <p key={paragraph.slice(0, 32)} className="my-5 text-base leading-[1.75] text-ink-secondary">
                {paragraph}
              </p>
            ))}

            {guide ? (
              <p className="mt-8 text-[17px] leading-relaxed">
                Go deeper:{" "}
                <Link href={guidePath(guide)} className="font-semibold text-ink underline decoration-line-strong underline-offset-4 hover:text-(--tint-ink)">
                  {guide.title}
                </Link>
              </p>
            ) : null}

            {related.length ? (
              <section aria-labelledby="related-terms" className="mt-12">
                <h2 id="related-terms" className="text-[20px] font-bold tracking-[-0.02em]">
                  Related terms
                </h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {related.map((r) => (
                    <li key={r.slug}>
                      <Link
                        href={termPath(r)}
                        className="inline-flex min-h-11 items-center rounded-full bg-paper-soft px-4 text-[15px] font-semibold transition-colors hover:bg-(--tint-soft)"
                      >
                        {r.term}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <ArticleCta product={entry.product} />
          </div>
        </div>
      </article>
    </div>
  )
}
