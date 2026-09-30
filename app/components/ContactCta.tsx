"use client"

import type { PointerEvent, ReactNode } from "react"
import { ArrowDown, ArrowRight } from "lucide-react"
import { useContactModal, type ContactModalMode } from "../context/ContactModalContext"
import { cn } from "@/lib/utils"

/**
 * Primary action: an ink pill with the arrow in its own pastel disc. On
 * hover the disc swells and the arrow swings round. Compose with `CtaInner`.
 */
export const primaryCtaClass =
  "group/cta inline-flex min-h-14 cursor-pointer items-center justify-between gap-4 rounded-full border-none bg-ink py-2 pl-7 pr-2 text-[16px] font-semibold tracking-[-0.01em] text-paper [font-stretch:108%] [translate:var(--mx,0px)_var(--my,0px)] transition-[translate,background-color,color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] disabled:cursor-not-allowed disabled:opacity-50"

/**
 * Magnetic pull for primary actions: with a mouse, the button leans toward
 * the cursor and its arrow disc follows a little further. Touch and reduced
 * motion are left alone. Spread onto the element: `{...magnetic}`.
 */
function magnetMove(e: PointerEvent<HTMLElement>) {
  if (e.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
  const el = e.currentTarget
  const r = el.getBoundingClientRect()
  el.style.setProperty("--mx", `${(((e.clientX - r.left) / r.width - 0.5) * 16).toFixed(1)}px`)
  el.style.setProperty("--my", `${(((e.clientY - r.top) / r.height - 0.5) * 12).toFixed(1)}px`)
}

function magnetLeave(e: PointerEvent<HTMLElement>) {
  e.currentTarget.style.setProperty("--mx", "0px")
  e.currentTarget.style.setProperty("--my", "0px")
}

export const magnetic = { onPointerMove: magnetMove, onPointerLeave: magnetLeave }

export const textCtaClass =
  "link-line inline-flex items-center self-center text-[16px] font-semibold tracking-[-0.01em] text-ink [font-stretch:108%] sm:self-auto"

export function CtaInner({
  children,
  icon = "right",
}: {
  children: ReactNode
  icon?: "right" | "down"
}) {
  const Icon = icon === "down" ? ArrowDown : ArrowRight
  return (
    <>
      <span className="text-left">{children}</span>
      <span
        aria-hidden
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-(--tint-soft) text-ink [translate:calc(var(--mx,0px)*0.7)_calc(var(--my,0px)*0.7)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/cta:scale-110"
      >
        <Icon
          className={cn(
            "h-[18px] w-[18px] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
            icon === "down" ? "group-hover/cta:translate-y-0.5" : "group-hover/cta:-rotate-45"
          )}
          strokeWidth={2.2}
        />
      </span>
    </>
  )
}

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
      {...(variant === "primary" ? magnetic : {})}
    >
      {variant === "primary" ? <CtaInner>{children}</CtaInner> : children}
    </button>
  )
}
