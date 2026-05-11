"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"
import { useContactModal } from "../context/ContactModalContext"

interface SubHeroProps {
  label: string
  title: ReactNode
  subtitle: string
  ctaText?: string
  visual?: ReactNode
}

export default function SubHero({ label, title, subtitle, ctaText = "Get started →", visual }: SubHeroProps) {
  const { openModal } = useContactModal()

  return (
    <section
      className="relative mx-auto grid min-h-0 w-full max-w-[var(--content-width)] grid-cols-1 items-center gap-12 px-6 py-[120px] pb-20 md:px-8 lg:min-h-[80vh] lg:grid-cols-[1.2fr_1fr] lg:gap-16 lg:py-[120px]"
      data-section-name="Hero"
      data-section-num="01"
    >
      <motion.div className="flex flex-col justify-center">
        <motion.div
          className="frenem-hero-eyebrow mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.1 }}
        >
          {label}
        </motion.div>
        <motion.h1
          className="mb-8 font-sans text-[clamp(44px,6vw,88px)] font-semibold leading-[0.98] tracking-[-0.035em]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.22 }}
        >
          {title}
        </motion.h1>
        <motion.p
          className="mb-10 max-w-[480px] font-sans text-xl font-normal leading-normal tracking-[-0.005em] text-[var(--frenem-ink-secondary)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.34 }}
        >
          {subtitle}
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.46 }}>
          <button
            type="button"
            onClick={openModal}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full border-none bg-[var(--frenem-ink)] px-7 py-4 font-sans text-[15px] font-medium text-[var(--frenem-bg)] transition-all duration-300 hover:bg-[var(--frenem-accent)] hover:translate-y-[-2px]"
          >
            {ctaText}
          </button>
        </motion.div>
      </motion.div>

      {visual ? <div className="w-full justify-self-center lg:justify-self-start">{visual}</div> : null}
    </section>
  )
}
