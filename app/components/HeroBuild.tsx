"use client"

import { motion } from "framer-motion"
import { useContactModal } from "../context/ContactModalContext"
import { smoothScrollTo } from "../utils/smooth-scroll"
import HeroOrgDiagram from "./HeroOrgDiagram"

export default function HeroBuild() {
  const { openModal } = useContactModal()

  const handleHowClick = (e: React.MouseEvent) => {
    e.preventDefault()
    smoothScrollTo("how")
  }

  return (
    <section
      className="relative mx-auto grid min-h-0 w-full max-w-[var(--content-width)] grid-cols-1 items-center gap-12 px-6 pb-[60px] pt-[120px] md:px-8 lg:min-h-screen lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:pb-20 lg:pt-[120px]"
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
          Frenem Build · Organisation Design
        </motion.div>
        <motion.h1
          className="mb-8 font-sans text-[clamp(48px,6.5vw,96px)] font-semibold leading-[0.98] tracking-[-0.035em] text-[var(--frenem-ink)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.22 }}
        >
          Build an organisation that scales{" "}
          <em className="text-[var(--frenem-accent)]" style={{ fontWeight: 400, fontStyle: "italic" }}>
            beyond you.
          </em>
        </motion.h1>
        <motion.p
          className="mb-10 max-w-[480px] font-sans text-xl font-normal leading-[1.5] tracking-[-0.005em] text-[var(--frenem-ink-secondary)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.34 }}
        >
          Clarity in roles, decisions, and leadership. Without losing control. In weeks, not months.
        </motion.p>
        <motion.div
          className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.46 }}
        >
          <button
            type="button"
            onClick={openModal}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full border-none bg-[var(--frenem-ink)] px-7 py-4 font-sans text-[15px] font-medium text-[var(--frenem-bg)] transition-colors duration-300 hover:bg-[var(--frenem-accent)] hover:translate-y-[-2px]"
          >
            Start your sprint →
          </button>
          <a
            href="#how"
            onClick={handleHowClick}
            className="border-b border-[var(--frenem-ink)] pb-1 font-sans text-[15px] font-medium text-[var(--frenem-ink)] transition-colors hover:border-[var(--frenem-accent)] hover:text-[var(--frenem-accent)]"
          >
            See how
          </a>
        </motion.div>
      </motion.div>

      <div className="relative mx-auto aspect-square w-full max-w-[400px] justify-self-center lg:max-w-[540px]">
        <HeroOrgDiagram />
      </div>
    </section>
  )
}
