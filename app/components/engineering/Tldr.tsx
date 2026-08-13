import type { ReactNode } from "react"

/**
 * Authored summary card at the top of an essay: a mono label and 2-4 bullets,
 * written as a plain markdown list inside the tag.
 */
export default function Tldr({ children }: { children: ReactNode }) {
  return (
    <aside className="my-8 rounded-lg border border-line bg-paper-soft p-5 first:mt-0 sm:p-6">
      <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-(--tint-ink)">
        TL;DR
      </p>
      <div className="mt-3 [&_li]:relative [&_li]:my-0 [&_li]:pl-5 [&_li]:text-[15px] [&_li]:leading-relaxed [&_li]:text-ink-secondary [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:top-[0.72em] [&_li]:before:h-px [&_li]:before:w-3 [&_li]:before:bg-(--tint-ink) [&_li]:before:content-[''] [&_ul]:my-0 [&_ul]:list-none [&_ul]:space-y-2 [&_ul]:pl-0">
        {children}
      </div>
    </aside>
  )
}
