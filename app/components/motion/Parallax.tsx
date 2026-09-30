"use client"

import { useRef, type ReactNode } from "react"
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion"

/**
 * Scroll-linked drift for decorative pieces: translate and rotate across the
 * element's pass through the viewport. Transform-only, spring-smoothed so
 * touch scrolling stays fluid; inert under reduced motion.
 */
export default function Parallax({
  children,
  y = [60, -60],
  rotate = [0, 0],
  scale = [1, 1],
  className,
}: {
  children: ReactNode
  y?: [number, number]
  rotate?: [number, number]
  scale?: [number, number]
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 })
  // Same markup either way (so server and client agree); under reduced
  // motion the ranges collapse to their resting values.
  const still = (range: [number, number]): [number, number] => (reduce ? [range[0], range[0]] : range)
  const ty = useTransform(progress, [0, 1], still(y))
  const r = useTransform(progress, [0, 1], still(rotate))
  const s = useTransform(progress, [0, 1], still(scale))

  return (
    <motion.div ref={ref} className={className} style={{ y: ty, rotate: r, scale: s }}>
      {children}
    </motion.div>
  )
}
