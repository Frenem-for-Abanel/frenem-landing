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
    smoothScrollTo("how-build")
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

        <div className="relative z-10 mx-auto grid min-h-0 w-full max-w-[var(--content-width)] grid-cols-1 items-center gap-8 px-5 pb-12 pt-24 sm:px-6 md:gap-12 md:px-8 md:pb-[60px] md:pt-[120px] lg:min-h-screen lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:pb-20 lg:pt-[120px]">
          <motion.div className="flex min-w-0 flex-col justify-center">
            <motion.div
              className="frenem-hero-eyebrow mb-5 md:mb-8"
              initial={hidden}
              animate={shown}
              transition={{ duration: 0.65, delay: 0.05 }}
            >
              Frenem Build · Organisation Design
            </motion.div>
            <motion.h1
              className="mb-5 font-sans text-[clamp(34px,6.5vw,96px)] font-semibold leading-[0.98] tracking-[-0.035em] text-[var(--frenem-ink)] md:mb-8"
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
              className="mb-8 max-w-[480px] font-sans text-lg font-normal leading-[1.5] tracking-[-0.005em] text-[var(--frenem-ink-secondary)] md:mb-10 md:text-xl"
              initial={hidden}
              animate={shown}
              transition={{ duration: 0.65, delay: 0.29 }}
            >
              Clarity in roles, decisions, and leadership. Without losing control. In weeks, not months.
            </motion.p>
            <motion.div
              className="flex flex-col items-start gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-[18px] sm:gap-y-4"
              initial={hidden}
              animate={shown}
              transition={{ duration: 0.65, delay: 0.41 }}
            >
              <button
                type="button"
                onClick={() => openModal("assessment")}
                className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border-none bg-[var(--frenem-ink)] px-7 py-3.5 font-sans text-[15px] font-medium text-[var(--frenem-bg)] transition-colors duration-300 hover:translate-y-[-2px] hover:bg-[var(--frenem-accent)] md:py-4"
              >
                Get started →
              </button>
              <button
                type="button"
                onClick={() => openModal("contact")}
                className="inline-flex min-h-11 items-center border-b border-[var(--frenem-ink)] pb-1 font-sans text-[15px] font-medium text-[var(--frenem-ink)] transition-colors hover:border-[var(--frenem-accent)] hover:text-[var(--frenem-accent)]"
              >
                Just get in touch
              </button>
              <a
                href="#how-build"
                onClick={handleHowClick}
                className="inline-flex min-h-11 items-center border-b border-[var(--frenem-ink)] pb-1 font-sans text-[15px] font-medium text-[var(--frenem-ink)] transition-colors hover:border-[var(--frenem-accent)] hover:text-[var(--frenem-accent)]"
              >
                See how
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            className="relative mx-auto aspect-square w-full max-w-[320px] min-w-0 justify-self-center sm:max-w-[400px] lg:max-w-[540px]"
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
