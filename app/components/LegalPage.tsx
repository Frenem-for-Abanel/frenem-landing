import type React from "react"
import Breadcrumbs from "./Breadcrumbs"

/** Plain reading layout for the legal pages. Sections are written as children. */
export default function LegalPage({
  title,
  path,
  updated,
  children,
}: {
  title: string
  path: string
  /** Human-readable date, e.g. "18 November 2026". */
  updated: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-paper">
      <div className="container-site pb-20 pt-28 md:pb-28 md:pt-40">
        <Breadcrumbs items={[{ name: title, path }]} />
        <article className="max-w-[68ch]">
          <h1 className="type-display-2 text-ink">{title}</h1>
          <p className="mt-4 text-[14px] text-ink-tertiary">Last updated {updated}</p>
          <div className="mt-10 space-y-8 text-[17px] leading-[1.6] text-ink-secondary">{children}</div>
        </article>
      </div>
    </div>
  )
}

export function LegalSection({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-2 text-[20px] font-semibold tracking-[-0.01em] text-ink">{heading}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  )
}
