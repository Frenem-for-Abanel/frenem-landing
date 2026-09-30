"use client"

import type { ReactNode } from "react"
import { Check } from "lucide-react"

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
      <div className="px-1 py-4">
        <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-(--tint-soft) text-ink motion-safe:animate-[scale-in_0.7s_cubic-bezier(0.16,1,0.3,1)_both]">
          <Check aria-hidden className="h-7 w-7" strokeWidth={2.6} />
        </div>
        <p className="max-w-[400px] text-[26px] font-bold leading-[1.15] tracking-[-0.03em] [font-stretch:104%] text-ink">
          {children}
        </p>
      </div>
    </div>
  )
}
