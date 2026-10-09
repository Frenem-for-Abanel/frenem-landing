import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Mdx from "../../components/engineering/Mdx"
import JsonLd from "../../components/JsonLd"
import { pageMetadata } from "../../utils/seo"
import { absoluteUrl, BLOG_ID, breadcrumbs, graph, ogImage, ORG_ID } from "../../utils/structured-data"
import {
  BYLINE,
  getEssayBySlug,
  getEssays,
  PILLAR_LABELS,
  tintClass,
} from "../../../lib/engineering/content"

export const dynamicParams = false

export function generateStaticParams() {
  return getEssays().map((essay) => ({ slug: essay.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const essay = getEssayBySlug(slug)
  if (!essay) return {}
  return pageMetadata({
    path: `/engineering/${essay.slug}`,
    title: `${essay.title} | Frenem Engineering`,
    description: essay.summary,
    socialTitle: essay.title,
    type: "article",
    publishedTime: essay.date,
  })
}

export default async function EssayPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const essay = getEssayBySlug(slug)
  if (!essay) notFound()

  const path = `/engineering/${essay.slug}`
  const jsonLd = graph(
    {
      "@type": "BlogPosting",
      "@id": absoluteUrl(`${path}#article`),
      headline: essay.title,
      description: essay.summary,
      url: absoluteUrl(path),
      mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(path) },
      image: ogImage(path),
      datePublished: essay.date,
      dateModified: essay.date,
      inLanguage: "en-IN",
      ...(essay.pillar ? { articleSection: PILLAR_LABELS[essay.pillar] } : {}),
      author: { "@type": "Organization", name: BYLINE, url: absoluteUrl("/engineering") },
      publisher: { "@id": ORG_ID },
      isPartOf: { "@id": BLOG_ID },
    },
    breadcrumbs([
      { name: "Engineering", path: "/engineering" },
      { name: essay.title, path },
    ])
  )

  return (
    <div className={tintClass(essay)}>
      <JsonLd data={jsonLd} />
      <article className="container-site pb-20 md:pb-28">
        <div className="mx-auto max-w-(--narrow-width) pt-10 md:pt-14">
          <header className="anim-fade-up">
            <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.12em]">
              {essay.pillar ? (
                <span className="font-medium text-(--tint-ink)">
                  {PILLAR_LABELS[essay.pillar]}
                </span>
              ) : null}
              {essay.pillar && essay.readingTime ? (
                <span aria-hidden className="text-ink-tertiary">
                  ·
                </span>
              ) : null}
              {essay.readingTime ? (
                <span className="text-ink-tertiary">{essay.readingTime}</span>
              ) : null}
            </p>
            <h1 className="type-display-2 mt-6">{essay.title}</h1>
            <p className="mt-5 font-sans text-[17px] leading-relaxed text-ink-secondary md:text-lg">
              {essay.summary}
            </p>
          </header>

          <div className="mt-8 border-t border-line pt-8 md:mt-10">
            <Mdx source={essay.body} />
          </div>

          <footer className="mt-14 border-t border-line pt-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-tertiary">
              {BYLINE}
            </p>
          </footer>
        </div>
      </article>
    </div>
  )
}
