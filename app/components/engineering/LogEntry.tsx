import Link from "next/link"
import { tintClass, TYPE_LABELS, type EngineeringEntry } from "../../../lib/engineering/content"
import Mdx from "./Mdx"

/**
 * One ledger row. Essays link out to their page; shipped work and notes
 * render fully inline. Each row is an anchor target (id = slug) so entries
 * without a page of their own can still be linked to.
 */
export default function LogEntry({ entry }: { entry: EngineeringEntry }) {
  const isEssay = entry.type === "essay"
  return (
    <article id={entry.slug} className={`${tintClass(entry)} scroll-mt-24 py-5 md:py-6`}>
      <div className="grid gap-x-6 gap-y-2 md:grid-cols-[88px_minmax(0,1fr)]">
        <span className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-(--tint-ink) md:pt-[3px]">
          {TYPE_LABELS[entry.type]}
        </span>
        <div className="min-w-0">
          <h3 className="font-sans text-[15px] font-medium leading-snug text-ink md:text-base">
            {isEssay ? (
              <Link
                href={`/engineering/${entry.slug}`}
                className="transition-colors hover:text-(--tint-ink)"
              >
                {entry.title} <span aria-hidden>→</span>
              </Link>
            ) : (
              entry.title
            )}
          </h3>
          {!isEssay ? (
            <div className="mt-3 max-w-(--narrow-width) border-l border-line pl-4 md:pl-5 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0 [&_p]:my-3 [&_p]:text-[15px]">
              <Mdx source={entry.body} />
            </div>
          ) : null}
        </div>
      </div>
    </article>
  )
}
