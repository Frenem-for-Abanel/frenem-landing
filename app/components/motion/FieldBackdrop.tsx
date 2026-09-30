"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useMotionTemplate, useReducedMotion, useScroll, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"

/**
 * A section's colour field that grows in from a corner as the section
 * arrives, a circle sweeping out until it fills the band. It only arms
 * itself when JS confirms the section starts below the fold, so without JS
 * (or with reduced motion) the field is simply there.
 */
export default function FieldBackdrop({
  className,
  origin = "0% 0%",
}: {
  className?: string
  /** Where the circle grows from, as a CSS position. */
  origin?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const [armed, setArmed] = useState(false)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.25"] })
  const radius = useTransform(scrollYProgress, [0, 1], [0, 150])
  const clipPath = useMotionTemplate`circle(${radius}% at ${origin})`

  useEffect(() => {
    if (reduce) return
    const el = ref.current
    if (!el) return
    if (el.getBoundingClientRect().top > window.innerHeight) setArmed(true)
  }, [reduce])

  return (
    <motion.div
      ref={ref}
      aria-hidden
      className={cn("grain pointer-events-none absolute inset-0", className)}
      style={armed ? { clipPath } : undefined}
    />
  )
}
