"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion"
import Reveal from "./Reveal"
import { Section, SectionLabel, SectionHeading } from "./Section"

const EMPTY_BG = "#ffffff"
const EMPTY_BORDER = "rgba(10,10,10,0.16)"

export interface TimelinePhase {
  label: string
  title: string
  description: string
  time: string
}

function phaseLit(index: number, total: number, progress: number): boolean {
  const threshold = (index + 0.5) / total
  return progress >= threshold - 0.15
}

/**
 * Scroll-scrubbed phase timeline shared by the Build sprint and Pulse pilot.
 * `tintHex` must be a concrete colour so framer-motion can interpolate it.
 */
export default function TimelineSection({
  id,
  label = "How It Works",
  heading,
  sub,
  phases,
  tintHex,
  soft = false,
}: {
  id?: string
  label?: string
  heading: ReactNode
  sub: string
  phases: TimelinePhase[]
  tintHex: string
  soft?: boolean
}) {
  const timelineRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const [scrubProgress, setScrubProgress] = useState(0)

  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 0.7", "end 0.6"],
  })

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (!prefersReducedMotion) setScrubProgress(v)
  })

  useEffect(() => {
    // Reduced motion: show the finished state instead of scroll-scrubbing.
    setScrubProgress(prefersReducedMotion ? 1 : scrollYProgress.get())
  }, [scrollYProgress, prefersReducedMotion])

  const cursorLeft = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])
  const cursorOpacity = useTransform(scrollYProgress, [0, 0.02, 1], [0, 1, 1])

  const n = phases.length
  // Track endpoints align with the centre of the first/last card column.
  const inset = `${(100 / (n * 2)).toFixed(2)}%`
  const gridClass =
    n >= 4
      ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      : "grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8"

  return (
    <Section id={id} soft={soft}>
      <div className="mb-12 grid grid-cols-1 items-end gap-8 md:mb-20 md:gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <SectionLabel>{label}</SectionLabel>
          <SectionHeading>{heading}</SectionHeading>
        </Reveal>
        <Reveal delay={0.06}>
          <p className="max-w-[480px] justify-self-end font-sans text-lg font-normal leading-normal tracking-[-0.005em] text-ink-secondary md:text-xl">
            {sub}
          </p>
        </Reveal>
      </div>

      <div ref={timelineRef} className="relative mt-6 md:mt-10">
        <div
          aria-hidden
          className="pointer-events-none absolute top-[60px] z-0 hidden h-0.5 lg:block"
          style={{ left: inset, right: inset }}
        >
          <div className="absolute inset-0 rounded-full bg-line-strong" />
          <div
            className="absolute inset-y-0 left-0 origin-left rounded-full will-change-transform"
            style={{
              backgroundColor: tintHex,
              transform: `scaleX(${scrubProgress})`,
            }}
          />
          <motion.div
            className="absolute top-1/2 z-[1] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-paper shadow-[0_2px_8px_rgba(0,0,0,0.12)]"
            style={{
              backgroundColor: tintHex,
              left: cursorLeft,
              opacity: prefersReducedMotion ? 0 : cursorOpacity,
            }}
          />
        </div>

        <div className={`relative z-[1] ${gridClass}`}>
          {phases.map((phase, i) => {
            const lit = prefersReducedMotion || phaseLit(i, n, scrubProgress)
            return (
              <Reveal key={phase.title} delay={0.05 * i}>
                <div className="group flex h-full flex-col rounded-2xl border border-line-strong bg-paper p-6 transition-all duration-300 hover:-translate-y-1 hover:border-ink hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] md:p-10">
                  <motion.div
                    aria-hidden
                    className="relative z-[2] mb-6 h-6 w-6 shrink-0 rounded-full border-2"
                    animate={{
                      backgroundColor: lit ? tintHex : EMPTY_BG,
                      borderColor: lit ? tintHex : EMPTY_BORDER,
                    }}
                    transition={{
                      duration: prefersReducedMotion ? 0 : 0.35,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                  />
                  <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <span className="font-sans text-[13px] font-medium tracking-[0.03em] text-ink-tertiary">
                      {phase.label}
                    </span>
                    <span className="rounded-full bg-(--tint-soft) px-2.5 py-1 font-sans text-xs font-medium text-(--tint-ink)">
                      {phase.time}
                    </span>
                  </div>
                  <h3 className="mb-4 font-sans text-[28px] font-semibold leading-none tracking-[-0.02em] md:text-[32px]">
                    {phase.title}
                  </h3>
                  <p className="mt-auto font-sans text-[15px] leading-relaxed text-ink-secondary">
                    {phase.description}
                  </p>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </Section>
  )
}
