"use client"

import type { ReactNode } from "react"
import { smoothScrollTo } from "../utils/smooth-scroll"
import { CtaInner, magnetic, primaryCtaClass, textCtaClass } from "./ContactCta"
import { cn } from "@/lib/utils"

/** In-page anchor with header-offset smooth scrolling. */
export default function SmoothScrollLink({
  targetId,
  children,
  className,
  variant = "text",
}: {
  targetId: string
  children: ReactNode
  className?: string
  variant?: "primary" | "text"
}) {
  return (
    <a
      href={`#${targetId}`}
      onClick={(e) => {
        e.preventDefault()
        smoothScrollTo(targetId)
      }}
      className={cn(variant === "primary" ? primaryCtaClass : textCtaClass, className)}
      {...(variant === "primary" ? magnetic : {})}
    >
      {variant === "primary" ? <CtaInner icon="down">{children}</CtaInner> : children}
    </a>
  )
}
