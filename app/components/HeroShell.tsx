"use client"

import { motion, useReducedMotion } from "framer-motion"
import type { ReactNode } from "react"
import HeroBackdrop from "./HeroBackdrop"
import type { ShaderBackgroundColors } from "./ShaderBackground"

interface HeroShellProps {
  eyebrow: string
  title: ReactNode
  subtitle: string
  /** CTA row content — compose ContactCta / links at the call site. */
  actions?: ReactNode
  visual?: ReactNode
  colors: Required<ShaderBackgroundColors>
  /** Full-viewport hero (home + product landings). */
  tall?: boolean
}

/** Shared hero: shader atmosphere, staggered copy column, optional visual. */
export default function HeroShell({
  eyebrow,
  title,
  subtitle,
  actions,
  visual,
  colors,
  tall = false,
}: HeroShellProps) {
  const reduceMotion = useReducedMotion()
  const hidden = { opacity: 0, y: 20 }
  const shown = { opacity: 1, y: 0 }
  const t = (delay: number) =>
    reduceMotion ? { duration: 0 } : { duration: 0.65, delay }

  return (
    <section className="relative w-full overflow-hidden text-ink">
      <HeroBackdrop colors={colors} />

      <div
        className={`relative z-10 mx-auto grid min-h-0 w-full max-w-[var(--content-width)] grid-cols-1 items-center gap-8 px-5 pb-14 pt-28 sm:px-6 md:gap-12 md:px-8 md:pb-20 md:pt-[130px] lg:gap-16 ${
          visual ? "lg:grid-cols-[1.15fr_1fr]" : ""
        } ${tall ? "lg:min-h-screen lg:py-[120px]" : "lg:min-h-[80vh] lg:py-[120px]"}`}
      >
        <div className="flex min-w-0 flex-col justify-center">
          <motion.p
            className="type-eyebrow mb-5 md:mb-8"
            initial={hidden}
            animate={shown}
            transition={t(0.05)}
          >
            {eyebrow}
          </motion.p>
          <motion.h1
            className="type-display-1 mb-5 md:mb-8"
            initial={hidden}
            animate={shown}
            transition={t(0.17)}
          >
            {title}
          </motion.h1>
          <motion.p
            className="mb-8 max-w-[480px] font-sans text-lg font-normal leading-[1.5] tracking-[-0.005em] text-ink-secondary md:mb-10 md:text-xl"
            initial={hidden}
            animate={shown}
            transition={t(0.29)}
          >
            {subtitle}
          </motion.p>
          {actions ? (
            <motion.div
              className="flex w-full flex-col items-stretch gap-3.5 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-5 sm:gap-y-4"
              initial={hidden}
              animate={shown}
              transition={t(0.41)}
            >
              {actions}
            </motion.div>
          ) : null}
        </div>

        {visual ? (
          <motion.div
            className="w-full min-w-0 justify-self-center lg:justify-self-start"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.16, 1] }
            }
          >
            {visual}
          </motion.div>
        ) : null}
      </div>
    </section>
  )
}
