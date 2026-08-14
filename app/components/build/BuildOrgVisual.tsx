"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView, useReducedMotion } from "framer-motion"

const INK = "var(--color-ink)"
const TINT = "var(--tint-bright)"

type NodeState = { x: number; y: number }

/**
 * Ten people, two structures. "Today": everything routes through the founder.
 * "After Build": three clean tiers with decision rights pushed down.
 * The visual morphs between the two on a slow loop.
 */
const FOUNDER = 0
const LEADS = [1, 2, 3]

const TODAY: NodeState[] = [
  { x: 220, y: 118 }, // founder, dead centre: the hub
  { x: 84, y: 66 },
  { x: 350, y: 58 },
  { x: 120, y: 210 },
  { x: 60, y: 140 },
  { x: 165, y: 44 },
  { x: 296, y: 216 },
  { x: 382, y: 150 },
  { x: 232, y: 232 },
  { x: 310, y: 120 },
]

const AFTER: NodeState[] = [
  { x: 220, y: 48 }, // founder, top of a real structure
  { x: 110, y: 132 },
  { x: 220, y: 132 },
  { x: 330, y: 132 },
  { x: 62, y: 222 },
  { x: 140, y: 222 },
  { x: 192, y: 222 },
  { x: 250, y: 222 },
  { x: 302, y: 222 },
  { x: 380, y: 222 },
]

// Today: every node reports to the founder, plus a few tangles.
const TODAY_EDGES: Array<[number, number]> = [
  ...[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => [FOUNDER, i] as [number, number]),
  [4, 5],
  [2, 9],
  [6, 8],
]

// After: founder → three leads → two reports each.
const AFTER_EDGES: Array<[number, number]> = [
  [0, 1],
  [0, 2],
  [0, 3],
  [1, 4],
  [1, 5],
  [2, 6],
  [2, 7],
  [3, 8],
  [3, 9],
]

const HOLD_MS = 3400

const CAPTION_CLASS =
  "col-start-1 row-start-1 text-center font-sans text-[9px] font-semibold uppercase tracking-[0.06em] transition-opacity sm:text-[10px]"

export default function BuildOrgVisual() {
  const rootRef = useRef<HTMLDivElement>(null)
  const inView = useInView(rootRef, { once: true, amount: 0.3 })
  const reduceMotion = useReducedMotion()
  // Reduced motion: show the outcome, skip the loop.
  const [after, setAfter] = useState(false)

  useEffect(() => {
    if (reduceMotion) {
      setAfter(true)
      return
    }
    if (!inView) return
    setAfter(true)
    const timer = setInterval(() => setAfter((v) => !v), HOLD_MS)
    return () => clearInterval(timer)
  }, [inView, reduceMotion])

  const nodes = after ? AFTER : TODAY
  const spring = reduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 60, damping: 14 }

  return (
    <div
      ref={rootRef}
      className="flex aspect-[4/3] w-full min-w-0 flex-col gap-3 rounded-2xl border border-line-strong bg-paper p-4 shadow-[0_24px_48px_rgba(0,0,0,0.04)] sm:gap-4 sm:p-6"
    >
      <div className="flex items-center justify-between gap-2 border-b border-line pb-3">
        <span className="min-w-0 truncate font-sans text-[12px] font-semibold text-ink sm:text-[13px]">
          Operating structure
        </span>
        <span
          aria-live="polite"
          className={`shrink-0 rounded-full px-2.5 py-1 font-sans text-[10px] font-semibold uppercase tracking-[0.08em] transition-colors duration-500 sm:text-[11px] ${
            after ? "bg-(--tint-soft) text-(--tint-ink)" : "bg-paper-soft text-ink-tertiary"
          }`}
        >
          {after ? "After Build" : "Today"}
        </span>
      </div>

      <div className="min-h-0 flex-1">
        <svg
          aria-label="Org chart morphing from founder-centric chaos into three clean tiers"
          className="block h-full w-full"
          role="img"
          viewBox="0 0 440 252"
        >
          {/* Today's tangle */}
          <motion.g
            animate={{ opacity: after ? 0 : 1 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.7, ease: "easeInOut" }}
            style={{ stroke: INK }}
            strokeOpacity="0.22"
            strokeWidth="1.4"
          >
            {TODAY_EDGES.map(([a, b], i) => (
              <motion.line
                key={`t-${i}`}
                animate={{ x1: nodes[a].x, y1: nodes[a].y, x2: nodes[b].x, y2: nodes[b].y }}
                initial={false}
                transition={spring}
              />
            ))}
          </motion.g>

          {/* Clean structure */}
          <motion.g
            animate={{ opacity: after ? 1 : 0 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.7, ease: "easeInOut" }}
            style={{ stroke: TINT }}
            strokeOpacity="0.7"
            strokeWidth="1.6"
          >
            {AFTER_EDGES.map(([a, b], i) => (
              <motion.line
                key={`a-${i}`}
                animate={{ x1: nodes[a].x, y1: nodes[a].y, x2: nodes[b].x, y2: nodes[b].y }}
                initial={false}
                transition={spring}
              />
            ))}
          </motion.g>

          {nodes.map((node, i) => {
            const isFounder = i === FOUNDER
            const isLead = LEADS.includes(i)
            return (
              <motion.circle
                key={`n-${i}`}
                animate={{ cx: node.x, cy: node.y }}
                initial={false}
                transition={spring}
                r={isFounder ? 9 : isLead ? 7 : 5.5}
                style={{
                  fill: isFounder ? INK : isLead && after ? TINT : "var(--color-ink-tertiary)",
                  transition: "fill 0.6s ease",
                }}
              />
            )
          })}
        </svg>
      </div>

      <div className="grid px-1">
        <p
          aria-hidden={!after}
          className={`${CAPTION_CLASS} ${reduceMotion ? "duration-0" : "duration-500"} ${
            after ? "text-(--tint-ink) opacity-90" : "pointer-events-none opacity-0"
          }`}
        >
          Decisions at the right level
        </p>
        <p
          aria-hidden={after}
          className={`${CAPTION_CLASS} ${reduceMotion ? "duration-0" : "duration-500"} ${
            after ? "pointer-events-none opacity-0" : "text-ink-tertiary opacity-90"
          }`}
        >
          Every decision routes through one person
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 font-sans text-[9px] font-semibold uppercase tracking-[0.08em] text-ink-tertiary sm:gap-5 sm:text-[10px]">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-ink" />
          Founder
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-(--tint-bright)" />
          Leadership bench
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-ink-tertiary" />
          Team
        </span>
      </div>
    </div>
  )
}
