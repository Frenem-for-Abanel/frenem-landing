"use client"

import { useEffect, useRef, useState } from "react"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface RevealProps {
  children: ReactNode
  delay?: number
  className?: string
  /** rise: fade up · scale: grow in · clip: wipe up from the bottom edge */
  variant?: "rise" | "scale" | "clip"
}

/**
 * Entrance on first view, driven by IntersectionObserver + CSS transitions.
 * Content is visible by default (SSR, no-JS, reduced motion, throttled tabs);
 * JS only hides elements that are still below the fold at mount, then reveals
 * them as they scroll in.
 */
export default function Reveal({ children, delay = 0, className = "", variant = "rise" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const rect = el.getBoundingClientRect()
    const alreadyInView = rect.top < window.innerHeight * 0.95 && rect.bottom > 0
    if (alreadyInView) return

    setHidden(true)
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHidden(false)
          io.disconnect()
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -6% 0px" }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const style = delay ? { transitionDelay: `${delay}s` } : undefined

  // A fully clipped element never reports as intersecting, so the wipe runs
  // on an inner layer while the unclipped wrapper is what gets observed.
  if (variant === "clip") {
    return (
      <div ref={ref} className={className}>
        <div className={cn("reveal-item reveal-clip h-full", hidden && "reveal-hidden")} style={style}>
          {children}
        </div>
      </div>
    )
  }

  return (
    <div ref={ref} className={cn("reveal-item", `reveal-${variant}`, hidden && "reveal-hidden", className)} style={style}>
      {children}
    </div>
  )
}
