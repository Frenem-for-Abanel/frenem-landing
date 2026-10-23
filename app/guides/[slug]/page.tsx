import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import Mdx from "../../components/engineering/Mdx"
import Breadcrumbs from "../../components/Breadcrumbs"
import JsonLd from "../../components/JsonLd"
import ArticleCta from "../../components/ArticleCta"
import { formatEntryDate } from "../../utils/dates"
import { pageMetadata } from "../../utils/seo"
import { absoluteUrl, article, breadcrumbs, graph, webPage } from "../../utils/structured-data"
import { getGuideBySlug, getGuides, guidePath } from "../../../lib/guides/content"

export const dynamicParams = false

export function generateStaticParams() {
  return getGuides().map((guide) => ({ slug: guide.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const guide = getGuideBySlug(slug)
  if (!guide) return {}
  return pageMetadata({
    path: guidePath(guide),
    // Guide titles are long and keyword-led; the brand goes last and may truncate.
    title: `${guide.title} | Frenem`,
    description: guide.summary,
    socialTitle: guide.title,
    type: "article",
    publishedTime: guide.date,
  })
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const guide = getGuideBySlug(slug)
  if (!guide) notFound()

  const path = guidePath(guide)
  const crumbs = [
    { name: "Insights", path: "/insights" },
    { name: guide.title, path },
  ]
  const jsonLd = graph(
    webPage({ path, name: guide.title, description: guide.summary, about: absoluteUrl(`${path}#article`) }),
    article({
      path,
      headline: guide.title,
      description: guide.summary,
      datePublished: guide.date,
      dateModified: guide.updated,
      wordCount: guide.wordCount,
    }),
    breadcrumbs(crumbs)
  )

  return (
    <div className={guide.product ? `tint-${guide.product}` : "tint-brand"}>
      <JsonLd data={jsonLd} />
      <header className="grain relative bg-(--tint-soft)">
        <div className="container-site relative pb-12 pt-28 md:pb-16 md:pt-36">
          <div className="mx-auto max-w-(--narrow-width)">
            <Breadcrumbs items={crumbs} />
            <p className="anim-fade-up text-[15px] font-semibold text-ink-secondary">
              Guide · {guide.readingTime}
            </p>
            <h1 className="type-display-2 anim-fade-up mt-4">{guide.title}</h1>
            <p className="type-lead anim-fade-up mt-6 text-ink-secondary">{guide.summary}</p>
            <p className="anim-fade-up mt-6 text-[14px] text-ink-secondary">
              By <Link href="/" className="font-semibold text-ink underline decoration-line-strong underline-offset-4">Frenem</Link>
              {" · "}
              <time dateTime={guide.updated}>
                {guide.updated === guide.date ? "Published" : "Updated"} {formatEntryDate(guide.updated)}
              </time>
            </p>
          </div>
        </div>
      </header>

      <article className="container-site pb-20 md:pb-28">
        <div className="mx-auto max-w-(--narrow-width) pt-10 md:pt-12">
          <Mdx source={guide.body} />
          <ArticleCta product={guide.product} />
          <p className="mt-10 text-[15px] text-ink-secondary">
            More from Frenem:{" "}
            <Link href="/insights" className="font-semibold text-ink underline decoration-line-strong underline-offset-4">
              all guides
            </Link>{" "}
            and the{" "}
            <Link href="/glossary" className="font-semibold text-ink underline decoration-line-strong underline-offset-4">
              organisation glossary
            </Link>
            .
          </p>
        </div>
      </article>
    </div>
  )
}
