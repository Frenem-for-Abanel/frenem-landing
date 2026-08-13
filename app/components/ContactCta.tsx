"use client"

import type { ReactNode } from "react"
import { useContactModal, type ContactModalMode } from "../context/ContactModalContext"
import { cn } from "@/lib/utils"

export const primaryCtaClass =
  "inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full border-none bg-ink px-7 py-3.5 font-sans text-[15px] font-medium text-paper transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent md:py-4"

export const textCtaClass =
  "inline-flex min-h-11 items-center border-b border-ink pb-1 font-sans text-[15px] font-medium text-ink transition-colors hover:border-accent-ink hover:text-accent-ink"

/** Button that opens the contact modal in a given flow. */
export default function ContactCta({
  mode = "default",
  variant = "primary",
  className,
  children,
}: {
  mode?: ContactModalMode
  variant?: "primary" | "text"
  className?: string
  children: ReactNode
}) {
  const { openModal } = useContactModal()
  return (
    <button
      type="button"
      onClick={() => openModal(mode)}
      className={cn(variant === "primary" ? primaryCtaClass : textCtaClass, className)}
    >
      {children}
    </button>
  )
}
