"use client"

import { useRef, useState, type ReactNode } from "react"
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion"
import Reveal from "./Reveal"
import { SectionHead } from "./Section"
import { MorphField } from "./motion/Blocks"
import type { Block } from "../utils/blocks"

export interface TimelinePhase {
  label: string
  title: string
  description: string
}

/** Each phase gets this much scroll while the stage is pinned. */
const SCROLL_PER_PHASE_SVH = 75

function Segment({ progress, index, total }: { progress: MotionValue<number>; index: number; total: number }) {
  const fill = useTransform(progress, (p) => Math.min(1, Math.max(0, p * total - index)))
  return (
    <span className="relative h-2 flex-1 overflow-hidden rounded-full bg-ink/10">
      <motion.span className="absolute inset-0 origin-left rounded-full bg-ink" style={{ scaleX: fill }} />
    </span>
  )
}

/**
 * "How it works" as a pinned stage. On wide screens the section holds still
 * while you scroll: the phase text swaps and the blocks regroup into each
 * phase's picture, with a segmented bar tracking progress. Phones get the
 * same phases as a simple stacked sequence, no pinning.
 */
export default function TimelineSection({
  id,
  label = "How it works",
  heading,
  sub,
  phases,
  layouts,
  viewBox,
}: {
  id?: string
  label?: string
  heading: ReactNode
  sub: string
  phases: TimelinePhase[]
  layouts: Block[][]
  viewBox: string
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const [active, setActive] = useState(0)
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] })
  const n = phases.length

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setActive(Math.min(n - 1, Math.max(0, Math.floor(p * n))))
  })

  const phase = phases[active]

  return (
    <section id={id} className="relative scroll-mt-20 bg-paper">
      <div className="container-site pt-24 md:pt-36">
        <SectionHead kicker={label} title={heading} aside={<p>{sub}</p>} className="mb-10 md:mb-12 lg:mb-0" />
      </div>

      {/* Wide screens: pinned stage */}
      <div ref={trackRef} className="relative hidden lg:block" style={{ height: `${n * SCROLL_PER_PHASE_SVH + 40}svh` }}>
        <div className="sticky top-0 flex h-[100svh] items-center overflow-clip">
          <div className="container-site grid w-full grid-cols-12 items-center gap-10">
            <div className="col-span-5">
              <div className="flex gap-2" aria-hidden>
                {phases.map((p, i) => (
                  <Segment key={p.title} progress={scrollYProgress} index={i} total={n} />
                ))}
              </div>
              <ol className="mt-5 flex flex-wrap gap-x-5 gap-y-1 text-[15px] font-semibold">
                {phases.map((p, i) => (
                  <li
                    key={p.title}
                    aria-current={i === active ? "step" : undefined}
                    className={`transition-colors duration-300 ${i === active ? "text-ink" : "text-ink-tertiary"}`}
                  >
                    {p.title}
                  </li>
                ))}
              </ol>

              <div className="relative mt-14 min-h-[300px]">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={active}
                    initial={reduce ? { opacity: 0 } : { opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? { opacity: 0 } : { opacity: 0, y: -30 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <p className="type-kicker text-ink-secondary">{phase.label}</p>
                    <h3 className="mt-4 text-[clamp(48px,5.4vw,84px)] font-extrabold leading-[0.92] tracking-[-0.045em] [font-stretch:108%]">
                      {phase.title}
                    </h3>
                    <p className="type-lead mt-6 max-w-[440px] text-ink-secondary">{phase.description}</p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div className="col-span-7">
              <div className="grain dot-grid relative bg-(--tint-soft) p-6 xl:p-10">
                <MorphField
                  layouts={layouts}
                  index={active}
                  viewBox={viewBox}
                  drift={1.8}
                  label={`${phase.title}: ${phase.description}`}
                  className="block h-auto w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Phones and tablets: stacked */}
      <div className="container-site pb-24 md:pb-36 lg:hidden">
        <ol className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-x-8 md:gap-y-16">
          {phases.map((p, i) => (
            <li key={p.title}>
              <Reveal variant="clip">
                <div className="dot-grid bg-(--tint-soft) p-5">
                  <MorphField layouts={layouts} index={i} viewBox={viewBox} drift={1.4} label={p.title} className="block h-auto w-full" />
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="type-kicker mt-6 text-ink-secondary">{p.label}</p>
                <h3 className="mt-2 text-[40px] font-extrabold leading-none tracking-[-0.04em] [font-stretch:108%]">
                  {p.title}
                </h3>
                <p className="mt-4 text-[17px] leading-relaxed text-ink-secondary">{p.description}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
