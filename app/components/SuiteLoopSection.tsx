"use client"

import Link from "next/link"
import { ArrowRight, RotateCcw } from "lucide-react"
import Reveal from "./Reveal"
import { Section, SectionHead } from "./Section"
import type { ProductKey } from "../utils/product"

const steps: Array<{
  key: ProductKey
  phase: string
  name: string
  blurb: string
  field: string
  shape: string
}> = [
  {
    key: "pulse",
    phase: "Diagnose",
    name: "Pulse",
    blurb: "See how people actually work together: friction, energy, and risk.",
    field: "bg-sage",
    shape: "h-24 w-24 rounded-full bg-sage-mid group-hover:scale-110",
  },
  {
    key: "build",
    phase: "Design",
    name: "Build",
    blurb: "Redesign how decisions, ownership, and leadership work as you grow.",
    field: "bg-clay",
    shape: "h-24 w-24 bg-clay-mid group-hover:rotate-45",
  },
  {
    key: "prism",
    phase: "Operate",
    name: "Prism",
    blurb: "Keep the structure current: org charts, KRAs, reviews, and governance.",
    field: "bg-heather",
    shape: "h-12 w-32 rounded-full bg-heather-mid -rotate-12 group-hover:rotate-12",
  },
]

/**
 * How the three products chain into one loop: three colour blocks in a row
 * and a return path underneath that keeps marching back to the start.
 * `current` de-links the page you're on.
 */
export default function SuiteLoopSection({
  current,
  label = "One system",
  heading,
}: {
  current?: ProductKey
  label?: string
  heading: React.ReactNode
}) {
  return (
    <Section tone="soft">
      <SectionHead kicker={label} title={heading} />

      <ol className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {steps.map((step, i) => {
          const isCurrent = step.key === current
          const inner = (
            <>
              <div className="flex h-28 items-start">
                <span aria-hidden className={`block transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${step.shape}`} />
              </div>
              <p className="type-kicker mt-10 text-ink-secondary">
                {String(i + 1)}. {step.phase}
              </p>
              <h3 className="mt-2 flex items-baseline gap-3 text-[56px] font-extrabold leading-none tracking-[-0.045em] [font-stretch:110%]">
                {step.name}
                {isCurrent ? <span className="text-[15px] font-semibold tracking-normal text-ink-secondary">This page</span> : null}
              </h3>
              <p className="mt-4 max-w-[320px] text-[17px] leading-relaxed text-ink-secondary">{step.blurb}</p>
              {!isCurrent ? (
                <span className="mt-8 inline-flex items-center gap-2 text-[16px] font-semibold">
                  Explore {step.name}
                  <ArrowRight aria-hidden className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1.5" />
                </span>
              ) : null}
            </>
          )
          return (
            <li key={step.key}>
              <Reveal delay={0.08 * i} variant="clip" className="h-full">
                {isCurrent ? (
                  <div className={`group flex h-full flex-col p-7 md:p-9 ${step.field}`}>{inner}</div>
                ) : (
                  <Link href={`/${step.key}`} className={`group flex h-full flex-col p-7 md:p-9 ${step.field}`}>
                    {inner}
                  </Link>
                )}
              </Reveal>
            </li>
          )
        })}
      </ol>

      {/* Return path, from the end of the loop back to its start. */}
      <Reveal delay={0.2}>
        <svg aria-hidden viewBox="0 0 1000 60" preserveAspectRatio="none" className="mt-3 hidden h-14 w-full md:block">
          <path
            d="M 833 0 V 44 Q 833 56 821 56 H 179 Q 167 56 167 44 V 8"
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth="2"
            strokeDasharray="6 8"
            vectorEffect="non-scaling-stroke"
            className="motion-safe:animate-[dash-march_6s_linear_infinite]"
          />
        </svg>
        <p className="mt-6 flex items-center gap-3 text-[17px] font-medium text-ink-secondary md:mt-2 md:justify-center">
          <RotateCcw aria-hidden className="h-5 w-5 shrink-0" />
          And around again: each new Pulse shows whether the design still matches reality.
        </p>
      </Reveal>
    </Section>
  )
}
