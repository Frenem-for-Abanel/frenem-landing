"use client"

import { motion } from "framer-motion"
import { useContactModal } from "../context/ContactModalContext"
import { smoothScrollTo } from "../utils/smooth-scroll"
import HeroOrgDiagram from "./HeroOrgDiagram"
import ShaderBackground from "./ShaderBackground"

const HERO_SHADER_COLORS = {
  bg: "#fffbeb", // Very pale warm yellow
  bg2: "#fef3c7", // Soft sunny yellow
  accent: "#ffffff", // Pure white clouds
  accent2: "#d97706", // Deep amber for depth
  highlight: "#fde68a", // Light gold highlight
} as const

export default function HeroBuild() {
  const { openModal } = useContactModal()

  const handleHowClick = (e: React.MouseEvent) => {
    e.preventDefault()
    smoothScrollTo("how")
  }

  const hidden = { opacity: 0, y: 20 }
  const shown = { opacity: 1, y: 0 }

  return (
    <section
        className="relative w-full overflow-hidden text-[var(--frenem-ink)]"
        data-section-name="Hero"
        data-section-num="01"
      >
        <div className="absolute inset-0">
          <ShaderBackground
            colors={HERO_SHADER_COLORS}
            intensity={1}
            className="h-full w-full"
          />
        </div>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#fffbeb]/60 via-transparent to-[#fffbeb]/80" />

        <div className="relative z-10 mx-auto grid min-h-0 w-full max-w-[var(--content-width)] grid-cols-1 items-center gap-12 px-6 pb-[60px] pt-[120px] md:px-8 lg:min-h-screen lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:pb-20 lg:pt-[120px]">
          <motion.div className="flex flex-col justify-center">
            <motion.div
              className="mb-8 flex items-center gap-3 text-[13px] font-medium text-[var(--frenem-ink-secondary)] before:h-px before:w-6 before:shrink-0 before:bg-[var(--frenem-ink)] before:content-['']"
              initial={hidden}
              animate={shown}
              transition={{ duration: 0.65, delay: 0.05 }}
            >
              Frenem Build · Organisation Design
            </motion.div>
            <motion.h1
              className="mb-8 font-sans text-[clamp(48px,6.5vw,96px)] font-semibold leading-[0.98] tracking-[-0.035em] text-[var(--frenem-ink)]"
              initial={hidden}
              animate={shown}
              transition={{ duration: 0.65, delay: 0.17 }}
            >
              Build an organisation that scales{" "}
              <em className="text-[var(--frenem-accent)]" style={{ fontWeight: 400, fontStyle: "italic" }}>
                beyond you.
              </em>
            </motion.h1>
            <motion.p
              className="mb-10 max-w-[480px] font-sans text-xl font-normal leading-[1.5] tracking-[-0.005em] text-[var(--frenem-ink-secondary)]"
              initial={hidden}
              animate={shown}
              transition={{ duration: 0.65, delay: 0.29 }}
            >
              Clarity in roles, decisions, and leadership. Without losing control. In weeks, not months.
            </motion.p>
            <motion.div
              className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-4"
              initial={hidden}
              animate={shown}
              transition={{ duration: 0.65, delay: 0.41 }}
            >
              <button
                type="button"
                onClick={openModal}
                className="inline-flex cursor-pointer items-center gap-2 rounded-full border-none bg-[var(--frenem-ink)] text-[var(--frenem-bg)] hover:bg-[var(--frenem-accent)] px-7 py-4 font-sans text-[15px] font-medium transition-colors duration-300 hover:translate-y-[-2px]"
              >
                Start your free assessment →
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

          <motion.div
            className="relative mx-auto aspect-square w-full max-w-[400px] justify-self-center lg:max-w-[540px]"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.16, 1] }}
          >
            <HeroOrgDiagram theme="light" />
          </motion.div>
        </div>
      </section>
  )
}
