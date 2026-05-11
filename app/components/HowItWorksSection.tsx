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
    title: "Diagnose",
    description:
      "Understand the baseline. People maturity, employee data, employee voice, and how decisions actually flow today. Build the foundation everything else sits on.",
    time: "Weeks 1–2",
  },
  {
    label: "Phase 02",
    title: "Design",
    description:
      "Build the architecture. The grade structure, role catalog, org map, job descriptions, and decision rights. Turn complexity into a simple organisation that executes.",
    time: "Weeks 3–5",
  },
  {
    label: "Phase 03",
    title: "Deploy",
    description:
      "Lock in the competency framework, map talent, and deliver a validated, boardroom-ready operating model. A leadership blueprint that outlasts individuals.",
    time: "Weeks 6–8",
  },
]

function phaseLit(index: number, total: number, progress: number): boolean {
  const threshold = (index + 0.5) / total
  return progress >= threshold - 0.15
}

export default function HowItWorksSection() {
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
      id="how"
      data-section-name="Method"
      data-section-num="05"
      className="relative overflow-hidden bg-[var(--frenem-bg-soft)] py-[140px]"
    >
      <div className="container-v2">
        <div className="mb-20 grid grid-cols-1 items-end gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="frenem-section-label">How It Works</div>
            <h2 className="font-sans text-[clamp(36px,5vw,72px)] font-semibold leading-none tracking-[-0.03em]">
              Fit. Flat. Fast.{" "}
              <em className="font-normal italic">Ready for scale.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.06}>
            <p className="max-w-[480px] justify-self-end font-sans text-xl font-normal leading-normal tracking-[-0.005em] text-[var(--frenem-ink-secondary)]">
              A structured sprint. Not a meandering engagement. You get a working operating system, not a binder.
            </p>
          </Reveal>
        </div>

        <div ref={timelineRef} className="relative mt-10">
          <div
            aria-hidden
            className="pointer-events-none absolute left-[8.33%] right-[8.33%] top-[60px] z-0 hidden h-0.5 lg:block"
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

          <div className="relative z-[1] grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
            {phases.map((phase, i) => {
              const lit = prefersReducedMotion || phaseLit(i, n, scrubProgress)
              return (
                <Reveal key={phase.title} delay={0.05 * i}>
                  <div className="group flex h-full flex-col rounded-2xl border border-[var(--frenem-border-strong)] bg-[var(--frenem-bg)] p-10 pb-10 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--frenem-ink)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)]">
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
                    <h3 className="mb-4 font-sans text-[32px] font-semibold leading-none tracking-[-0.02em]">{phase.title}</h3>
                    <p className="mt-auto font-sans text-[15px] leading-relaxed text-[var(--frenem-ink-secondary)]">{phase.description}</p>
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
