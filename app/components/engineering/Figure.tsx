import type { ReactNode } from "react"

/**
 * Editorial figure: ink-line content in a hairline frame, mono caption.
 * `placeholder` renders a labelled empty frame until a real asset lands, and
 * gives way as soon as there is real content to show.
 */
export default function Figure({
  caption,
  placeholder,
  children,
}: {
  caption?: string
  placeholder?: string
  children?: ReactNode
}) {
  const showPlaceholder = Boolean(placeholder) && !children
  return (
    <figure className="my-8 first:mt-0">
      <div className="rounded-lg border border-line bg-paper p-4 sm:p-6 [&_svg]:block [&_svg]:h-auto [&_svg]:w-full">
        {showPlaceholder ? (
          <div className="flex aspect-[16/7] items-center justify-center rounded border border-dashed border-line-strong bg-paper-soft px-4">
            <span className="text-center font-mono text-[11px] uppercase tracking-[0.08em] text-ink-tertiary">
              {placeholder}
            </span>
          </div>
        ) : (
          children
        )}
      </div>
      {caption ? (
        <figcaption className="mt-3 flex items-baseline gap-3 font-mono text-xs leading-relaxed text-ink-tertiary">
          <span aria-hidden className="h-px w-4 shrink-0 self-center bg-(--tint-ink)" />
          {caption}
        </figcaption>
      ) : null}
    </figure>
  )
}
