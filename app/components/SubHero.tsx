"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"
import { useContactModal } from "../context/ContactModalContext"
import { smoothScrollTo } from "../utils/smooth-scroll"
import ShaderBackground, { type ShaderBackgroundColors } from "./ShaderBackground"

interface SubHeroProps {
  label: string
  title: ReactNode
  subtitle: string
  ctaText?: string
  secondaryHref?: string
  secondaryText?: string
  visual?: ReactNode
  shaderColors?: ShaderBackgroundColors
}

export default function SubHero({
  label,
  title,
  subtitle,
  ctaText = "Get started →",
  secondaryHref,
  secondaryText,
  visual,
  shaderColors,
}: SubHeroProps) {
  const { openModal } = useContactModal()

  const hidden = { opacity: 0, y: 20 }
  const shown = { opacity: 1, y: 0 }

  const handleSecondaryClick = (e: React.MouseEvent) => {
    if (!secondaryHref) return
    e.preventDefault()
    smoothScrollTo(secondaryHref)
  }

  return (
    <section
        className="relative w-full overflow-hidden text-[var(--frenem-ink)]"
        data-section-name="Hero"
        data-section-num="01"
      >
        {shaderColors && (
          <>
            <div className="absolute inset-0">
              <ShaderBackground
                colors={shaderColors}
                intensity={1}
                className="h-full w-full"
              />
            </div>
            {/* Soft gradient overlay to ensure text readability over the shader */}
            <div 
              className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/60 via-transparent to-white/80" 
              style={{
                background: `linear-gradient(to bottom, ${shaderColors.bg}99, transparent, ${shaderColors.bg}CC)`
              }}
            />
          </>
        )}

        <div className="relative z-10 mx-auto grid min-h-0 w-full max-w-[var(--content-width)] grid-cols-1 items-center gap-8 px-5 pt-24 pb-14 sm:px-6 md:gap-12 md:px-8 md:pt-[120px] md:pb-20 lg:min-h-[80vh] lg:grid-cols-[1.2fr_1fr] lg:gap-16 lg:py-[120px]">
          <motion.div className="flex min-w-0 flex-col justify-center">
            <motion.div
              className="frenem-hero-eyebrow mb-5 md:mb-8"
              initial={hidden}
              animate={shown}
              transition={{ duration: 0.65, delay: shaderColors ? 0.05 : 0.1 }}
            >
              {label}
            </motion.div>
            <motion.h1
              className="mb-5 font-sans text-[clamp(34px,6vw,88px)] font-semibold leading-[0.98] tracking-[-0.035em] md:mb-8"
              initial={hidden}
              animate={shown}
              transition={{ duration: 0.65, delay: shaderColors ? 0.17 : 0.22 }}
            >
              {title}
            </motion.h1>
            <motion.p
              className="mb-8 max-w-[480px] font-sans text-lg font-normal leading-normal tracking-[-0.005em] text-[var(--frenem-ink-secondary)] md:mb-10 md:text-xl"
              initial={hidden}
              animate={shown}
              transition={{ duration: 0.65, delay: shaderColors ? 0.29 : 0.34 }}
            >
              {subtitle}
            </motion.p>
            <motion.div
              className={
                secondaryHref && secondaryText
                  ? "flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-4"
                  : undefined
              }
              initial={hidden}
              animate={shown}
              transition={{ duration: 0.65, delay: shaderColors ? 0.41 : 0.46 }}
            >
              <button
                type="button"
                onClick={() => openModal()}
                className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border-none bg-[var(--frenem-ink)] px-7 py-3.5 font-sans text-[15px] font-medium text-[var(--frenem-bg)] transition-all duration-300 hover:bg-[var(--frenem-accent)] hover:translate-y-[-2px] md:py-4"
              >
                {ctaText}
              </button>
              {secondaryHref && secondaryText ? (
                <a
                  href={`#${secondaryHref.replace(/^#/, "")}`}
                  onClick={handleSecondaryClick}
                  className="inline-flex min-h-11 items-center border-b border-[var(--frenem-ink)] pb-1 font-sans text-[15px] font-medium text-[var(--frenem-ink)] transition-colors hover:border-[var(--frenem-accent)] hover:text-[var(--frenem-accent)]"
                >
                  {secondaryText}
                </a>
              ) : null}
            </motion.div>
          </motion.div>

          {visual ? (
            <motion.div 
              className="w-full min-w-0 justify-self-center lg:justify-self-start"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.16, 1] }}
            >
              {visual}
            </motion.div>
          ) : null}
        </div>
      </section>
  )
}
