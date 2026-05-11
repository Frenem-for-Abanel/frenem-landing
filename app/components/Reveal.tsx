"use client"

import { motion, useReducedMotion } from "framer-motion"
import type { ReactNode } from "react"

/** Approximates GSAP `power3.out` for HTML `.fade-up` parity */
const FADE_UP_EASE = [0.22, 1, 0.16, 1] as const

interface RevealProps {
  children: ReactNode
  delay?: number
  className?: string
}

export default function Reveal({ children, delay = 0, className = "" }: RevealProps) {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.85, delay, ease: FADE_UP_EASE }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
