"use client"

import Link from "next/link"
import { ArrowDown, ArrowRight, RotateCcw } from "lucide-react"
import Reveal from "./Reveal"
import { Section, SectionLabel, SectionHeading } from "./Section"
import type { ProductKey } from "../utils/product"

const steps: Array<{
  key: ProductKey
  phase: string
  name: string
  blurb: string
}> = [
  {
    key: "pulse",
    phase: "Diagnose",
    name: "Pulse",
    blurb: "See how people actually work together: friction, energy, and risk.",
  },
  {
    key: "build",
    phase: "Design",
    name: "Build",
    blurb: "Design the structure, decision rights, and succession your growth needs.",
  },
  {
    key: "prism",
    phase: "Operate",
    name: "Prism",
    blurb: "Keep the structure current: org charts, KRAs, reviews, and governance.",
  },
]

/**
 * How the three products chain into one loop. `current` de-links the page
 * you're already on; `dark` renders it as a near-black band.
 */
export default function SuiteLoopSection({
  current,
  dark = false,
  label = "One System",
  heading,
}: {
  current?: ProductKey
  dark?: boolean
  label?: string
  heading: React.ReactNode
}) {
  return (
    <Section dark={dark} soft={!dark ? false : undefined}>
      <Reveal>
        <SectionLabel>{label}</SectionLabel>
      </Reveal>
      <Reveal delay={0.04}>
        <SectionHeading className={`mb-10 max-w-[900px] md:mb-16 ${dark ? "text-paper" : ""}`}>
          {heading}
        </SectionHeading>
      </Reveal>

      <Reveal delay={0.08}>
        <div className="flex flex-col items-stretch gap-3 lg:flex-row lg:items-center lg:gap-4">
          {steps.map((step, i) => {
            const isCurrent = step.key === current
            const cardInner = (
              <>
                <span
                  className={`mb-3 block font-sans text-xs font-semibold uppercase tracking-[0.1em] ${
                    dark ? "text-(--tint-bright)" : "text-(--tint-ink)"
                  }`}
                >
                  {step.phase}
                </span>
                <span
                  className={`mb-2 flex items-baseline gap-2 font-sans text-xl font-semibold tracking-[-0.01em] md:text-2xl ${
                    dark ? "text-paper" : "text-ink"
                  }`}
                >
                  {step.name}
                  {isCurrent ? (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.06em] ${
                        dark ? "bg-white/10 text-white/70" : "bg-(--tint-soft) text-(--tint-ink)"
                      }`}
                    >
                      This page
                    </span>
                  ) : null}
                </span>
                <span
                  className={`block font-sans text-sm leading-relaxed ${
                    dark ? "text-white/60" : "text-ink-secondary"
                  }`}
                >
                  {step.blurb}
                </span>
                {!isCurrent && (
                  <span
                    className={`mt-4 inline-flex items-center gap-1 font-sans text-[13px] font-medium ${
                      dark ? "text-(--tint-bright)" : "text-(--tint-ink)"
                    }`}
                  >
                    Explore {step.name}
                    <ArrowRight aria-hidden className="h-3.5 w-3.5" />
                  </span>
                )}
              </>
            )
            const cardClass = `flex h-full flex-1 flex-col rounded-2xl border p-6 transition-colors duration-300 md:p-8 ${
              dark
                ? `border-line-dark ${isCurrent ? "bg-white/[0.04]" : "hover:bg-white/[0.04]"}`
                : `border-line-strong bg-paper ${isCurrent ? "" : "hover:border-ink"}`
            }`

            return (
              <div key={step.key} className="contents">
                {isCurrent ? (
                  <div className={cardClass}>{cardInner}</div>
                ) : (
                  <Link href={`/${step.key}`} className={cardClass}>
                    {cardInner}
                  </Link>
                )}
                {i < steps.length - 1 && (
                  <div
                    aria-hidden
                    className={`flex shrink-0 items-center justify-center ${
                      dark ? "text-white/40" : "text-ink-tertiary"
                    }`}
                  >
                    <ArrowRight className="hidden h-5 w-5 lg:block" />
                    <ArrowDown className="h-5 w-5 lg:hidden" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </Reveal>

      <Reveal delay={0.12}>
        <p
          className={`mt-8 flex items-center gap-2.5 font-sans text-sm md:mt-10 ${
            dark ? "text-white/50" : "text-ink-tertiary"
          }`}
        >
          <RotateCcw aria-hidden className="h-4 w-4 shrink-0" />
          And around again: each Pulse read tests whether the design still matches reality.
        </p>
      </Reveal>
    </Section>
  )
}
