"use client"

import { motion, useReducedMotion } from "framer-motion"
import type { ReactNode } from "react"

const FADE_UP_EASE = [0.22, 1, 0.16, 1] as const

interface RevealProps {
  children: ReactNode
  delay?: number
  className?: string
}

/**
 * Fade-up on first view. Markup is identical for every user — reduced motion
 * only zeroes the transition — so SSR/hydration never leave stale hidden
 * styles behind.
 */
export default function Reveal({ children, delay = 0, className = "" }: RevealProps) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { duration: 0.85, delay, ease: FADE_UP_EASE }
      }
      className={className}
    >
      {children}
    </motion.div>
  )
}
