"use client"

import { useEffect, useRef, useState } from "react"
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion"
import Reveal from "./Reveal"

const ACCENT = "#ff5b1f"
const EMPTY_BG = "#ffffff"
const EMPTY_BORDER = "rgba(10,10,10,0.16)"

const phases = [
  {
    label: "Phase 01",
    title: "Ingest",
    description:
      "One export from your HR system: reporting lines, teams, tenure. Plus a short intake on what's changing in the business.",
    time: "Week 1",
  },
  {
    label: "Phase 02",
    title: "Route & Collect",
    description:
      "Every person inside the boundary receives a secure link. Each pulse is tailored to who they actually work with.",
    time: "Week 2",
  },
  {
    label: "Phase 03",
    title: "Protect & Process",
    description:
      "The engine calculates gaps, thresholds, and confidence, and withholds anything that could identify an individual.",
    time: "Week 3",
  },
  {
    label: "Phase 04",
    title: "Deliver",
    description:
      "Three report cuts land: private coaching guides, a systemic view for leadership, and the relational network map.",
    time: "Week 4",
  },
]

function phaseLit(index: number, total: number, progress: number): boolean {
  const threshold = (index + 0.5) / total
  return progress >= threshold - 0.15
}

export default function PulseMethodSection() {
  const timelineRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const [scrubProgress, setScrubProgress] = useState(0)

  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 0.7", "end 0.6"],
  })

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setScrubProgress(v)
  })

  useEffect(() => {
    setScrubProgress(scrollYProgress.get())
  }, [scrollYProgress])

  const cursorLeft = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])
  const cursorOpacity = useTransform(scrollYProgress, [0, 0.02, 1], [0, 1, 1])

  const n = phases.length

  return (
    <section
      id="how-pulse"
      className="relative overflow-hidden bg-[var(--frenem-bg)] py-16 md:py-[140px]"
      data-section-name="Method"
      data-section-num="04"
    >
      <div className="container-v2">
        <div className="mb-12 grid grid-cols-1 items-end gap-8 md:mb-20 md:gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="frenem-section-label">How It Works</div>
            <h2 className="font-sans text-[clamp(28px,5vw,72px)] font-semibold leading-none tracking-[-0.03em]">
              Ingest. Route. Protect. <em className="font-normal italic">Deliver.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.06}>
            <p className="max-w-[480px] justify-self-end font-sans text-lg font-normal leading-normal tracking-[-0.005em] text-[var(--frenem-ink-secondary)] md:text-xl">
              A standard pilot runs four weeks, boundary to reports. Your part: one file from HR, and
              a few minutes from each person.
            </p>
          </Reveal>
        </div>

        <div ref={timelineRef} className="relative mt-6 md:mt-10">
          <div
            aria-hidden
            className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-[60px] z-0 hidden h-0.5 lg:block"
          >
            <div className="absolute inset-0 rounded-full bg-[var(--frenem-border-strong)]" />
            <div
              className="absolute inset-y-0 left-0 origin-left rounded-full bg-[var(--frenem-accent)] will-change-transform"
              style={{
                transform: `scaleX(${prefersReducedMotion ? 1 : scrubProgress})`,
              }}
            />
            <motion.div
              className="absolute top-1/2 z-[1] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[var(--frenem-bg)] bg-[var(--frenem-accent)] shadow-[0_2px_8px_rgba(0,0,0,0.12)]"
              style={{
                left: cursorLeft,
                opacity: prefersReducedMotion ? 1 : cursorOpacity,
              }}
            />
          </div>

          <div className="relative z-[1] grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {phases.map((phase, i) => {
              const lit = prefersReducedMotion || phaseLit(i, n, scrubProgress)
              return (
                <Reveal key={phase.title} delay={0.05 * i}>
                  <div className="group flex h-full flex-col rounded-2xl border border-[var(--frenem-border-strong)] bg-[var(--frenem-bg)] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--frenem-ink)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] md:p-10">
                    <motion.div
                      aria-hidden
                      className="relative z-[2] mb-6 h-6 w-6 shrink-0 rounded-full border-2"
                      animate={{
                        backgroundColor: lit ? ACCENT : EMPTY_BG,
                        borderColor: lit ? ACCENT : EMPTY_BORDER,
                      }}
                      transition={{
                        duration: prefersReducedMotion ? 0 : 0.35,
                        ease: [0.25, 0.46, 0.45, 0.94],
                      }}
                    />
                    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                      <span className="font-sans text-[13px] font-medium tracking-[0.03em] text-[var(--frenem-ink-tertiary)]">
                        {phase.label}
                      </span>
                      <span className="rounded-full bg-[var(--frenem-accent-soft)] px-2.5 py-1 font-sans text-xs font-medium text-[var(--frenem-accent)]">
                        {phase.time}
                      </span>
                    </div>
                    <h3 className="mb-4 font-sans text-[28px] font-semibold leading-none tracking-[-0.02em] md:text-[32px]">
                      {phase.title}
                    </h3>
                    <p className="mt-auto font-sans text-[15px] leading-relaxed text-[var(--frenem-ink-secondary)]">
                      {phase.description}
                    </p>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
