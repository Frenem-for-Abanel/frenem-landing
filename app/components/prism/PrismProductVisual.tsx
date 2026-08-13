"use client"

import { useRef } from "react"
import { motion, useInView, useReducedMotion } from "framer-motion"

const BAR_EASE = [0.22, 1, 0.16, 1] as const

/** Product window: live org chart beside a KRA scorecard. */
export default function PrismProductVisual() {
  const rootRef = useRef<HTMLDivElement>(null)
  const inView = useInView(rootRef, { once: true, amount: 0.35 })
  const reduceMotion = useReducedMotion()

  return (
    <div
      ref={rootRef}
      className="flex aspect-[4/3] w-full min-w-0 flex-col gap-3 rounded-2xl border border-line-strong bg-paper p-4 shadow-[0_24px_48px_rgba(0,0,0,0.04)] sm:gap-4 sm:p-6"
    >
      <div className="flex gap-1.5 border-b border-line pb-3">
        <div className="h-2.5 w-2.5 rounded-full bg-line-strong" />
        <div className="h-2.5 w-2.5 rounded-full bg-line-strong" />
        <div className="h-2.5 w-2.5 rounded-full bg-line-strong" />
      </div>
      <div className="relative flex gap-2.5 overflow-x-auto border-b border-line pb-3 font-sans text-[10px] font-medium text-ink-tertiary sm:gap-4 sm:text-xs [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <span className="relative shrink-0 pb-3 font-medium text-ink after:absolute after:inset-x-0 after:-bottom-[13px] after:h-0.5 after:bg-(--tint-bright)">
          Org Chart
        </span>
        <span className="shrink-0">KRAs</span>
        <span className="shrink-0">Reviews</span>
        <span className="shrink-0">Audit Log</span>
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-2 gap-2 sm:gap-4">
        <div className="flex flex-col items-center justify-center gap-2 rounded-lg bg-paper-soft p-2 sm:p-4">
          <svg
            aria-label="Live organisation chart"
            role="img"
            className="w-full max-w-[200px]"
            viewBox="0 0 200 160"
          >
            <line stroke="#9c9c98" strokeWidth="1" x1="100" x2="40" y1="32" y2="80" />
            <line stroke="#9c9c98" strokeWidth="1" x1="100" x2="100" y1="32" y2="80" />
            <line stroke="#9c9c98" strokeWidth="1" x1="100" x2="160" y1="32" y2="80" />
            <line stroke="#cfcfcb" strokeWidth="1" x1="40" x2="20" y1="100" y2="140" />
            <line stroke="#cfcfcb" strokeWidth="1" x1="40" x2="60" y1="100" y2="140" />
            <line stroke="#cfcfcb" strokeWidth="1" x1="100" x2="100" y1="100" y2="140" />
            <line stroke="#cfcfcb" strokeWidth="1" x1="160" x2="140" y1="100" y2="140" />
            <line stroke="#cfcfcb" strokeWidth="1" x1="160" x2="180" y1="100" y2="140" />
            <circle cx="100" cy="22" fill="var(--color-ink)" r="10" />
            <circle cx="40" cy="90" fill="var(--color-paper)" r="8" stroke="var(--color-ink)" strokeWidth="1.5" />
            <circle cx="100" cy="90" fill="var(--color-paper)" r="8" stroke="var(--color-ink)" strokeWidth="1.5" />
            <circle cx="160" cy="90" fill="var(--color-paper)" r="8" stroke="var(--color-ink)" strokeWidth="1.5" />
            <circle cx="20" cy="148" fill="#9c9c98" r="5" />
            <circle cx="60" cy="148" fill="#9c9c98" r="5" />
            <circle cx="100" cy="148" fill="#9c9c98" r="5" />
            <circle cx="140" cy="148" fill="#9c9c98" r="5" />
            <circle cx="180" cy="148" fill="var(--tint-bright)" r="5" />
          </svg>
        </div>
        <div className="flex min-w-0 flex-col gap-2 rounded-lg bg-paper-soft p-2 sm:gap-2.5 sm:p-4">
          <div className="mb-1 font-sans text-[10px] font-semibold uppercase tracking-[0.05em] text-ink-tertiary sm:text-[11px]">
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
    <div className="grid min-w-0 grid-cols-[1fr_auto] items-center gap-1.5 font-sans text-[10px] sm:gap-2 sm:text-xs">
      <span className="truncate">{label}</span>
      <div className="h-1.5 w-[48px] overflow-hidden rounded-full bg-line sm:w-[60px]">
        <motion.div
          className="h-full max-w-full rounded-full bg-(--tint-bright)"
          initial={{ width: "0%" }}
          animate={{ width: reduceMotion || inView ? `${width}%` : "0%" }}
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
