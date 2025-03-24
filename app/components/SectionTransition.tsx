"use client"

import { type ReactNode, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

interface SectionTransitionProps {
  children: ReactNode
  className?: string
}

export default function SectionTransition({ children, className = "" }: SectionTransitionProps) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8])

  return (
    <motion.div ref={ref} className={`${className}`} style={{ opacity, scale }}>
      {children}
    </motion.div>
  )
}

