"use client"

import type { ReactNode } from "react"
import { smoothScrollTo } from "../utils/smooth-scroll"
import { textCtaClass } from "./ContactCta"
import { cn } from "@/lib/utils"

/** In-page anchor with header-offset smooth scrolling. */
export default function SmoothScrollLink({
  targetId,
  children,
  className,
}: {
  targetId: string
  children: ReactNode
  className?: string
}) {
  return (
    <a
      href={`#${targetId}`}
      onClick={(e) => {
        e.preventDefault()
        smoothScrollTo(targetId)
      }}
      className={cn(textCtaClass, "justify-center self-center sm:self-auto", className)}
    >
      {children}
    </a>
  )
}
