import type { CSSProperties, ReactNode } from "react"
import HeroBackdrop from "./HeroBackdrop"
import type { ShaderBackgroundColors } from "./ShaderBackground"

interface HeroShellProps {
  eyebrow: string
  title: ReactNode
  subtitle: string
  /** CTA row content: compose ContactCta / links at the call site. */
  actions?: ReactNode
  visual?: ReactNode
  colors: Required<ShaderBackgroundColors>
  /** Full-viewport hero (home + product landings). */
  tall?: boolean
}

const at = (delay: number): CSSProperties => ({ animationDelay: `${delay}s` })

/**
 * Shared hero: shader atmosphere, staggered copy column, optional visual.
 * Entrances are CSS animations so the hero paints even when JS is throttled.
 */
export default function HeroShell({
  eyebrow,
  title,
  subtitle,
  actions,
  visual,
  colors,
  tall = false,
}: HeroShellProps) {
  return (
    <section className="relative w-full overflow-hidden text-ink">
      <HeroBackdrop colors={colors} />

      <div
        className={`relative z-10 mx-auto grid min-h-0 w-full max-w-[var(--content-width)] grid-cols-1 items-center gap-8 px-5 pb-14 pt-28 sm:px-6 md:gap-12 md:px-8 md:pb-20 md:pt-[130px] lg:gap-16 ${
          visual ? "lg:grid-cols-[1.15fr_1fr]" : ""
        } ${tall ? "lg:min-h-screen lg:py-[120px]" : "lg:min-h-[80vh] lg:py-[120px]"}`}
      >
        <div className="flex min-w-0 flex-col justify-center">
          <p className="type-eyebrow anim-fade-up mb-5 md:mb-8" style={at(0.05)}>
            {eyebrow}
          </p>
          <h1 className="type-display-1 anim-fade-up mb-5 md:mb-8" style={at(0.17)}>
            {title}
          </h1>
          <p
            className="anim-fade-up mb-8 max-w-[480px] font-sans text-lg font-normal leading-[1.5] tracking-[-0.005em] text-ink-secondary md:mb-10 md:text-xl"
            style={at(0.29)}
          >
            {subtitle}
          </p>
          {actions ? (
            <div
              className="anim-fade-up flex w-full flex-col items-stretch gap-3.5 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-5 sm:gap-y-4"
              style={at(0.41)}
            >
              {actions}
            </div>
          ) : null}
        </div>

        {visual ? (
          <div className="anim-scale-in w-full min-w-0 justify-self-center lg:justify-self-start" style={at(0.2)}>
            {visual}
          </div>
        ) : null}
      </div>
    </section>
  )
}
