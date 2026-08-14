import Link from "next/link"
import { tintClass, TYPE_LABELS, type EngineeringEntry } from "../../../lib/engineering/content"
import { aliasesForSlug } from "../../../lib/engineering/slug-aliases"
import Mdx from "./Mdx"

/** Where the row is rendered; the archive is each entry's permanent home. */
export type LogSurface = "cover" | "archive"

/**
 * One ledger row. Essays link out to their page; shipped work and notes
 * render inline, anchored on the archive and linked there from the cover.
 */
export default function LogEntry({
  entry,
  surface,
}: {
  entry: EngineeringEntry
  surface: LogSurface
}) {
  const isArchive = surface === "archive"
  // The cover sits under an "The Log" h2; the archive has no such heading.
  const Heading = isArchive ? "h2" : "h3"
  const href = entry.type === "essay" ? `/engineering/${entry.slug}` : `/engineering/log#${entry.slug}`
  const linked = entry.type === "essay" || !isArchive

  return (
    <article
      id={isArchive ? entry.slug : undefined}
      className={`${tintClass(entry)} scroll-mt-24 py-5 md:py-6`}
    >
      {isArchive
        ? aliasesForSlug(entry.slug).map((alias) => (
            <span
              key={alias}
              id={alias}
              aria-hidden
              className="block h-0 w-0 overflow-hidden scroll-mt-24"
            />
          ))
        : null}
      <div className="grid gap-x-6 gap-y-2 md:grid-cols-[88px_minmax(0,1fr)]">
        <span className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-(--tint-ink) md:pt-[3px]">
          {TYPE_LABELS[entry.type]}
        </span>
        <div className="min-w-0">
          <Heading className="font-sans text-[15px] font-medium leading-snug text-ink md:text-base">
            {linked ? (
              <Link href={href} className="transition-colors hover:text-(--tint-ink)">
                {entry.title} <span aria-hidden>→</span>
              </Link>
            ) : (
              entry.title
            )}
          </Heading>
          {entry.type !== "essay" ? (
            <div className="mt-3 max-w-(--narrow-width) border-l border-line pl-4 md:pl-5 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0 [&_p]:my-3 [&_p]:text-[15px]">
              <Mdx source={entry.body} />
            </div>
          ) : null}
        </div>
      </div>
    </article>
  )
}
