"use client"

import type { ReactNode } from "react"

/** Post-submit confirmation. `srTitle` labels the dialog for screen readers. */
export default function SuccessState({
  srTitle,
  children,
}: {
  srTitle: string
  children: ReactNode
}) {
  return (
    <div>
      <h3 id="contact-modal-title" className="sr-only">
        {srTitle}
      </h3>
      <div className="px-1 py-4 text-center">
        <div className="mx-auto mb-5 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-(--tint-soft) text-[22px] text-(--tint-ink)">
          ✓
        </div>
        <p className="mx-auto max-w-[400px] font-sans text-xl font-semibold leading-[1.4] tracking-[-0.01em] text-ink">
          {children}
        </p>
      </div>
    </div>
  )
}
