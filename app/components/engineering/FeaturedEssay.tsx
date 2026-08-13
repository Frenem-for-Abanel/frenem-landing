import Link from "next/link"
import {
  formatDate,
  PILLAR_LABELS,
  tintClass,
  type EngineeringEntry,
} from "../../../lib/engineering/content"
import Mdx from "./Mdx"

/**
 * The magazine cover: the manually pinned essay, tinted by its product,
 * opening with the essay's own first figure.
 */
export default function FeaturedEssay({ essay }: { essay: EngineeringEntry }) {
  const href = `/engineering/${essay.slug}`
  return (
    <section
      aria-labelledby="featured-essay"
      className={`${tintClass(essay)} anim-fade-up border-b border-line py-10 md:py-14`}
    >
      <div className="flex items-baseline justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.12em]">
        <p>
          <span className="text-ink-tertiary">Featured</span>
          <span aria-hidden className="mx-2 text-ink-tertiary">
            ·
          </span>
          {essay.pillar ? (
            <span className="font-medium text-(--tint-ink)">
              {PILLAR_LABELS[essay.pillar]}
            </span>
          ) : null}
        </p>
        <time dateTime={essay.date} className="whitespace-nowrap text-ink-tertiary">
          {formatDate(essay.date)}
        </time>
      </div>

      <h1 id="featured-essay" className="type-display-2 mt-6 max-w-[18ch]">
        <Link href={href} className="transition-colors hover:text-(--tint-ink)">
          {essay.title}
        </Link>
      </h1>

      <p className="mt-5 max-w-[62ch] font-sans text-[17px] leading-relaxed text-ink-secondary md:text-lg">
        {essay.summary}
      </p>

      <p className="mt-5">
        <Link
          href={href}
          className="font-mono text-[13px] text-(--tint-ink) transition-colors hover:text-ink"
        >
          Read the essay <span aria-hidden>→</span>
        </Link>
      </p>

      {essay.openingFigure ? (
        <div className="mt-10 max-w-(--narrow-width)">
          <Mdx source={essay.openingFigure} />
        </div>
      ) : null}
    </section>
  )
}
