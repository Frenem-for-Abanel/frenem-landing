"use client"

import { useRef } from "react"
import { motion, useInView, useReducedMotion } from "framer-motion"

const BAR_EASE = [0.22, 1, 0.16, 1] as const

/** Static UI mock from frenem-build_3.html `.prism-visual` */
export default function PrismHeroVisual() {
  const rootRef = useRef<HTMLDivElement>(null)
  const inView = useInView(rootRef, { once: true, amount: 0.35 })
  const reduceMotion = useReducedMotion()

  return (
    <div
      ref={rootRef}
      className="flex aspect-[4/3] w-full flex-col gap-4 rounded-2xl border border-[var(--frenem-border-strong)] bg-[var(--frenem-bg)] p-6 shadow-[0_24px_48px_rgba(0,0,0,0.04)]"
    >
      <div className="flex gap-1.5 border-b border-[var(--frenem-border)] pb-3">
        <div className="h-2.5 w-2.5 rounded-full bg-[var(--frenem-border-strong)]" />
        <div className="h-2.5 w-2.5 rounded-full bg-[var(--frenem-border-strong)]" />
        <div className="h-2.5 w-2.5 rounded-full bg-[var(--frenem-border-strong)]" />
      </div>
      <div className="relative flex gap-4 border-b border-[var(--frenem-border)] pb-3 font-sans text-xs font-medium text-[var(--frenem-ink-tertiary)]">
        <span className="relative pb-3 font-medium text-[var(--frenem-ink)] after:absolute after:inset-x-0 after:-bottom-[13px] after:h-0.5 after:bg-[var(--frenem-accent)]">
          Org Chart
        </span>
        <span>KRAs</span>
        <span>Reviews</span>
        <span>Audit Log</span>
      </div>
      <div className="grid flex-1 grid-cols-2 gap-4">
        <div className="flex flex-col items-center justify-center gap-2 rounded-lg bg-[var(--frenem-bg-soft)] p-4">
          <svg className="w-full max-w-[200px]" viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg">
            <line stroke="#999" strokeWidth="1" x1="100" x2="40" y1="32" y2="80" />
            <line stroke="#999" strokeWidth="1" x1="100" x2="100" y1="32" y2="80" />
            <line stroke="#999" strokeWidth="1" x1="100" x2="160" y1="32" y2="80" />
            <line stroke="#ccc" strokeWidth="1" x1="40" x2="20" y1="100" y2="140" />
            <line stroke="#ccc" strokeWidth="1" x1="40" x2="60" y1="100" y2="140" />
            <line stroke="#ccc" strokeWidth="1" x1="100" x2="100" y1="100" y2="140" />
            <line stroke="#ccc" strokeWidth="1" x1="160" x2="140" y1="100" y2="140" />
            <line stroke="#ccc" strokeWidth="1" x1="160" x2="180" y1="100" y2="140" />
            <circle cx="100" cy="22" fill="var(--frenem-ink)" r="10" />
            <circle cx="40" cy="90" fill="var(--frenem-bg)" r="8" stroke="var(--frenem-ink)" strokeWidth="1.5" />
            <circle cx="100" cy="90" fill="var(--frenem-bg)" r="8" stroke="var(--frenem-ink)" strokeWidth="1.5" />
            <circle cx="160" cy="90" fill="var(--frenem-bg)" r="8" stroke="var(--frenem-ink)" strokeWidth="1.5" />
            <circle cx="20" cy="148" fill="#999" r="5" />
            <circle cx="60" cy="148" fill="#999" r="5" />
            <circle cx="100" cy="148" fill="#999" r="5" />
            <circle cx="140" cy="148" fill="#999" r="5" />
            <circle cx="180" cy="148" fill="var(--frenem-accent)" r="5" />
          </svg>
        </div>
        <div className="flex flex-col gap-2.5 rounded-lg bg-[var(--frenem-bg-soft)] p-4">
          <div className="mb-1 font-sans text-[11px] font-semibold uppercase tracking-[0.05em] text-[var(--frenem-ink-tertiary)]">
            Q1 KRAs · A. Rao
          </div>
          <KraRow delayIndex={0} inView={inView} label="Revenue Growth" reduceMotion={reduceMotion} width={78} />
          <KraRow delayIndex={1} inView={inView} label="Team NPS" reduceMotion={reduceMotion} width={92} />
          <KraRow delayIndex={2} inView={inView} label="Retention" reduceMotion={reduceMotion} width={65} />
          <KraRow delayIndex={3} inView={inView} label="OKR Delivery" reduceMotion={reduceMotion} width={84} />
        </div>
      </div>
    </div>
  )
}

function KraRow({
  label,
  width,
  delayIndex,
  inView,
  reduceMotion,
}: {
  label: string
  width: number
  delayIndex: number
  inView: boolean
  reduceMotion: boolean | null
}) {
  const play = Boolean(inView && !reduceMotion)
  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-2 font-sans text-xs">
      <span>{label}</span>
      <div className="h-1.5 w-[60px] overflow-hidden rounded-full bg-[var(--frenem-border)]">
        <motion.div
          className="h-full max-w-full rounded-full bg-[var(--frenem-accent)]"
          initial={{ width: reduceMotion ? `${width}%` : "0%" }}
          animate={{
            width: reduceMotion || inView ? `${width}%` : "0%",
          }}
          transition={{
            duration: play ? 1.25 : 0,
            delay: play ? 0.35 + delayIndex * 0.12 : 0,
            ease: BAR_EASE,
          }}
        />
      </div>
    </div>
  )
}
