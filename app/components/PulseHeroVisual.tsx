"use client"

import { useRef } from "react"
import { motion, useInView, useReducedMotion } from "framer-motion"

const gridVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.055 },
  },
}

const cellVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.035 },
  },
}

const dotVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.48, ease: [0.34, 1.45, 0.64, 1] },
  },
}

/** 9-box mock from frenem-build_3.html `.pulse-visual` */
export default function PulseHeroVisual() {
  const rootRef = useRef<HTMLDivElement>(null)
  const inView = useInView(rootRef, { once: true, amount: 0.3 })
  const reduceMotion = useReducedMotion()

  const show = Boolean(reduceMotion || inView)

  return (
    <div
      ref={rootRef}
      className="flex aspect-[4/3] w-full flex-col gap-4 rounded-2xl border border-[var(--frenem-border-strong)] bg-[var(--frenem-bg)] p-6 shadow-[0_24px_48px_rgba(0,0,0,0.04)]"
    >
      <div className="flex items-center justify-between border-b border-[var(--frenem-border)] pb-3 font-sans text-xs font-medium text-[var(--frenem-ink-tertiary)]">
        <span className="text-[13px] font-semibold text-[var(--frenem-ink)]">9-Box Talent Map</span>
        <span>32 employees</span>
      </div>
      <div className="flex min-h-0 flex-1 gap-2">
          <div className="flex w-8 shrink-0 items-center justify-center">
            <span className="-rotate-90 whitespace-nowrap font-sans text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--frenem-ink-tertiary)]">
              Performance →
            </span>
          </div>
          {reduceMotion ? (
            <div className="grid flex-1 grid-cols-3 grid-rows-3 gap-px bg-[var(--frenem-border)]">
              <NineCell accent={0} highlight muted={1} normal={0} reduceMotion={reduceMotion} />
              <NineCell accent={0} muted={0} normal={2} reduceMotion={reduceMotion} />
              <NineCell accent={3} highlight muted={0} normal={0} reduceMotion={reduceMotion} />
              <NineCell accent={0} muted={2} normal={0} reduceMotion={reduceMotion} />
              <NineCell accent={0} muted={0} normal={3} reduceMotion={reduceMotion} />
              <NineCell accent={1} muted={0} normal={1} reduceMotion={reduceMotion} />
              <NineCell accent={0} muted={1} normal={0} reduceMotion={reduceMotion} />
              <NineCell accent={0} muted={2} normal={0} reduceMotion={reduceMotion} />
              <NineCell accent={0} muted={1} normal={0} reduceMotion={reduceMotion} />
            </div>
          ) : (
            <motion.div
              animate={show ? "visible" : "hidden"}
              className="grid flex-1 grid-cols-3 grid-rows-3 gap-px bg-[var(--frenem-border)]"
              initial="hidden"
              variants={gridVariants}
            >
              <NineCell accent={0} highlight muted={1} normal={0} reduceMotion={reduceMotion} />
              <NineCell accent={0} muted={0} normal={2} reduceMotion={reduceMotion} />
              <NineCell accent={3} highlight muted={0} normal={0} reduceMotion={reduceMotion} />
              <NineCell accent={0} muted={2} normal={0} reduceMotion={reduceMotion} />
              <NineCell accent={0} muted={0} normal={3} reduceMotion={reduceMotion} />
              <NineCell accent={1} muted={0} normal={1} reduceMotion={reduceMotion} />
              <NineCell accent={0} muted={1} normal={0} reduceMotion={reduceMotion} />
              <NineCell accent={0} muted={2} normal={0} reduceMotion={reduceMotion} />
              <NineCell accent={0} muted={1} normal={0} reduceMotion={reduceMotion} />
            </motion.div>
          )}
        </div>
      <div className="text-center font-sans text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--frenem-ink-tertiary)]">
        Potential →
      </div>
    </div>
  )
}

function Dot({
  kind,
  reduceMotion,
}: {
  kind: "accent" | "muted" | "normal"
  reduceMotion: boolean | null
}) {
  const bg =
    kind === "accent"
      ? "bg-[var(--frenem-accent)]"
      : kind === "muted"
        ? "bg-[var(--frenem-ink-tertiary)]"
        : "bg-[var(--frenem-ink)]"
  if (reduceMotion) {
    return <div className={`h-3 w-3 rounded-full ${bg}`} />
  }
  return (
    <motion.div className={`h-3 w-3 rounded-full ${bg}`} variants={dotVariants} />
  )
}

function NineCell({
  muted,
  normal,
  accent,
  highlight,
  reduceMotion,
}: {
  muted: number
  normal: number
  accent: number
  highlight?: boolean
  reduceMotion: boolean | null
}) {
  const inner = (
    <>
      {Array.from({ length: muted }, (_, i) => (
        <Dot key={`m-${i}`} kind="muted" reduceMotion={reduceMotion} />
      ))}
      {Array.from({ length: normal }, (_, i) => (
        <Dot key={`n-${i}`} kind="normal" reduceMotion={reduceMotion} />
      ))}
      {Array.from({ length: accent }, (_, i) => (
        <Dot key={`a-${i}`} kind="accent" reduceMotion={reduceMotion} />
      ))}
    </>
  )

  const className = `flex flex-wrap items-center justify-center gap-1 p-1.5 ${
    highlight ? "bg-[var(--frenem-accent-soft)] hover:bg-[rgba(255,91,31,0.14)]" : "bg-[var(--frenem-bg)]"
  } transition-colors hover:bg-[var(--frenem-bg-soft)]`

  if (reduceMotion) {
    return <div className={className}>{inner}</div>
  }

  return (
    <motion.div className={className} variants={cellVariants}>
      {inner}
    </motion.div>
  )
}
