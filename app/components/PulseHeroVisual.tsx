"use client"

import { useRef } from "react"
import { motion, useInView, useReducedMotion } from "framer-motion"

const EASE_POP = [0.34, 1.45, 0.64, 1] as const

const INK = "var(--frenem-ink)"
const INK_TERTIARY = "var(--frenem-ink-tertiary)"
const ACCENT = "var(--frenem-accent)"

const ENERGY_TIES = [
  { x1: 78, y1: 84, x2: 132, y2: 52, delay: 0.5 },
  { x1: 78, y1: 84, x2: 112, y2: 128, delay: 0.56 },
  { x1: 132, y1: 52, x2: 112, y2: 128, delay: 0.62 },
  { x1: 112, y1: 128, x2: 58, y2: 158, delay: 0.68 },
  { x1: 112, y1: 128, x2: 150, y2: 172, delay: 0.74 },
  { x1: 330, y1: 66, x2: 292, y2: 100, delay: 0.5 },
  { x1: 330, y1: 66, x2: 366, y2: 128, delay: 0.58 },
  { x1: 366, y1: 128, x2: 312, y2: 164, delay: 0.66 },
  { x1: 366, y1: 128, x2: 352, y2: 208, delay: 0.72 },
  { x1: 312, y1: 164, x2: 352, y2: 208, delay: 0.78 },
  { x1: 292, y1: 100, x2: 312, y2: 164, delay: 0.84 },
] as const

const BROKER_TIES = [
  { x1: 222, y1: 126, x2: 112, y2: 128, delay: 1.0 },
  { x1: 222, y1: 126, x2: 150, y2: 172, delay: 1.08 },
  { x1: 222, y1: 126, x2: 292, y2: 100, delay: 1.16 },
  { x1: 222, y1: 126, x2: 312, y2: 164, delay: 1.24 },
] as const

const NODES = [
  { cx: 78, cy: 84, delay: 0.1 },
  { cx: 132, cy: 52, delay: 0.16 },
  { cx: 112, cy: 128, delay: 0.22 },
  { cx: 58, cy: 158, delay: 0.28 },
  { cx: 150, cy: 172, delay: 0.34 },
  { cx: 330, cy: 66, delay: 0.2 },
  { cx: 366, cy: 128, delay: 0.26 },
  { cx: 312, cy: 164, delay: 0.32 },
  { cx: 352, cy: 208, delay: 0.38 },
  { cx: 292, cy: 100, delay: 0.44 },
] as const

/** Relational network map from Frenem Pulse 2.0 redesign */
export default function PulseHeroVisual() {
  const rootRef = useRef<HTMLDivElement>(null)
  const inView = useInView(rootRef, { once: true, amount: 0.3 })
  const reduceMotion = useReducedMotion()
  const show = Boolean(reduceMotion || inView)

  return (
    <div
      ref={rootRef}
      className="flex aspect-[4/3] w-full min-w-0 flex-col gap-3 rounded-2xl border border-[var(--frenem-border-strong)] bg-[var(--frenem-bg)] p-4 shadow-[0_24px_48px_rgba(0,0,0,0.04)] sm:gap-4 sm:p-6"
    >
      <div className="flex items-center justify-between gap-2 border-b border-[var(--frenem-border)] pb-3 font-sans text-[11px] font-medium text-[var(--frenem-ink-tertiary)] sm:text-xs">
        <span className="min-w-0 truncate text-[12px] font-semibold text-[var(--frenem-ink)] sm:text-[13px]">Relational Network Map</span>
        <span className="shrink-0">86% response</span>
      </div>

      <div className="min-h-0 flex-1">
        <svg
          aria-label="Network map of working relationships with a hidden broker highlighted"
          className="block h-full w-full"
          role="img"
          viewBox="0 0 440 280"
        >
          <g style={{ stroke: INK }} strokeOpacity="0.18" strokeWidth="1.5">
            {ENERGY_TIES.map((tie, i) =>
              reduceMotion ? (
                <line key={`e-${i}`} x1={tie.x1} x2={tie.x2} y1={tie.y1} y2={tie.y2} />
              ) : (
                <motion.line
                  key={`e-${i}`}
                  animate={show ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
                  initial={{ pathLength: 0, opacity: 0 }}
                  transition={{ duration: 0.6, delay: tie.delay, ease: "easeOut" }}
                  x1={tie.x1}
                  x2={tie.x2}
                  y1={tie.y1}
                  y2={tie.y2}
                />
              ),
            )}
          </g>

          <g style={{ stroke: ACCENT }} strokeOpacity="0.85" strokeWidth="1.8">
            {BROKER_TIES.map((tie, i) =>
              reduceMotion ? (
                <line key={`b-${i}`} x1={tie.x1} x2={tie.x2} y1={tie.y1} y2={tie.y2} />
              ) : (
                <motion.line
                  key={`b-${i}`}
                  animate={show ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
                  initial={{ pathLength: 0, opacity: 0 }}
                  transition={{ duration: 0.7, delay: tie.delay, ease: "easeOut" }}
                  x1={tie.x1}
                  x2={tie.x2}
                  y1={tie.y1}
                  y2={tie.y2}
                />
              ),
            )}
          </g>

          {reduceMotion ? (
            <line
              opacity={0.7}
              strokeDasharray="4 4"
              strokeWidth="1.5"
              style={{ stroke: INK_TERTIARY }}
              x1={150}
              x2={312}
              y1={172}
              y2={164}
            />
          ) : (
            <motion.line
              animate={show ? { opacity: 0.7 } : { opacity: 0 }}
              initial={{ opacity: 0 }}
              strokeDasharray="4 4"
              strokeWidth="1.5"
              style={{ stroke: INK_TERTIARY }}
              transition={{ duration: 0.6, delay: 1.4, ease: "easeOut" }}
              x1={150}
              x2={312}
              y1={172}
              y2={164}
            />
          )}

          <g style={{ fill: INK }}>
            {NODES.map((node, i) =>
              reduceMotion ? (
                <circle key={`n-${i}`} cx={node.cx} cy={node.cy} r={6} />
              ) : (
                <motion.circle
                  key={`n-${i}`}
                  animate={show ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                  cx={node.cx}
                  cy={node.cy}
                  initial={{ scale: 0, opacity: 0 }}
                  r={6}
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                  transition={{ duration: 0.48, delay: node.delay, ease: EASE_POP }}
                />
              ),
            )}
          </g>

          {reduceMotion ? (
            <circle cx={222} cy={126} opacity={0.18} r={16} style={{ fill: ACCENT }} />
          ) : (
            <motion.circle
              animate={
                show
                  ? { opacity: [0.18, 0.05, 0.18], scale: [1, 1.35, 1] }
                  : { opacity: 0, scale: 0 }
              }
              cx={222}
              cy={126}
              initial={{ opacity: 0, scale: 0 }}
              r={16}
              style={{ fill: ACCENT, transformBox: "fill-box", transformOrigin: "center" }}
              transition={
                show
                  ? { duration: 3, delay: 1.6, ease: "easeInOut", repeat: Infinity }
                  : { duration: 0 }
              }
            />
          )}

          {reduceMotion ? (
            <circle cx={222} cy={126} r={8} style={{ fill: ACCENT }} />
          ) : (
            <motion.circle
              animate={show ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
              cx={222}
              cy={126}
              initial={{ scale: 0, opacity: 0 }}
              r={8}
              style={{ fill: ACCENT, transformBox: "fill-box", transformOrigin: "center" }}
              transition={{ duration: 0.48, delay: 0.9, ease: EASE_POP }}
            />
          )}

          {reduceMotion ? (
            <>
              <circle cx={52} cy={236} r={5} style={{ fill: INK_TERTIARY }} />
              <circle
                cx={52}
                cy={236}
                fill="none"
                opacity={0.6}
                r={11}
                strokeDasharray="3 3"
                strokeWidth="1"
                style={{ stroke: INK_TERTIARY }}
              />
            </>
          ) : (
            <>
              <motion.circle
                animate={show ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                cx={52}
                cy={236}
                initial={{ scale: 0, opacity: 0 }}
                r={5}
                style={{ fill: INK_TERTIARY, transformBox: "fill-box", transformOrigin: "center" }}
                transition={{ duration: 0.48, delay: 1.3, ease: EASE_POP }}
              />
              <motion.circle
                animate={show ? { opacity: 0.6 } : { opacity: 0 }}
                cx={52}
                cy={236}
                fill="none"
                initial={{ opacity: 0 }}
                r={11}
                strokeDasharray="3 3"
                strokeWidth="1"
                style={{ stroke: INK_TERTIARY }}
                transition={{ duration: 0.6, delay: 1.5, ease: "easeOut" }}
              />
            </>
          )}

          <g
            fontFamily="var(--font-sans), system-ui, sans-serif"
            fontSize="10"
            fontWeight="600"
            letterSpacing="0.06em"
            style={{ fill: INK_TERTIARY, textTransform: "uppercase" }}
          >
            {reduceMotion ? (
              <>
                <text style={{ fill: ACCENT }} textAnchor="middle" x={222} y={100}>
                  Hidden Broker
                </text>
                <text textAnchor="middle" x={231} y={196}>
                  Friction
                </text>
                <text x={70} y={240}>
                  Isolated
                </text>
              </>
            ) : (
              <>
                <motion.text
                  animate={show ? { opacity: 1 } : { opacity: 0 }}
                  initial={{ opacity: 0 }}
                  style={{ fill: ACCENT }}
                  textAnchor="middle"
                  transition={{ duration: 0.6, delay: 1.4, ease: "easeOut" }}
                  x={222}
                  y={100}
                >
                  Hidden Broker
                </motion.text>
                <motion.text
                  animate={show ? { opacity: 1 } : { opacity: 0 }}
                  initial={{ opacity: 0 }}
                  textAnchor="middle"
                  transition={{ duration: 0.6, delay: 1.6, ease: "easeOut" }}
                  x={231}
                  y={196}
                >
                  Friction
                </motion.text>
                <motion.text
                  animate={show ? { opacity: 1 } : { opacity: 0 }}
                  initial={{ opacity: 0 }}
                  transition={{ duration: 0.6, delay: 1.7, ease: "easeOut" }}
                  x={70}
                  y={240}
                >
                  Isolated
                </motion.text>
              </>
            )}
          </g>
        </svg>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 font-sans text-[9px] font-semibold uppercase tracking-[0.08em] text-[var(--frenem-ink-tertiary)] sm:gap-5 sm:text-[10px]">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-0.5 w-[18px] bg-[rgba(10,10,10,0.35)]" />
          Energy tie
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-[18px] border-t-2 border-dashed border-[var(--frenem-ink-tertiary)]" />
          Friction
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[var(--frenem-accent)]" />
          Broker
        </span>
      </div>
    </div>
  )
}
