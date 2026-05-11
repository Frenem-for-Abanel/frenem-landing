"use client"

import type { Transition } from "framer-motion"
import { motion } from "framer-motion"

/** Single source for founder geometry (SVG user space — same cx/cy for node + pulse) */
const FOUNDER = { cx: 270, cy: 90, r: 32 } as const

const LABEL_BG = {
  rx: 5,
  /** Horizontal / vertical inset so grid lines miss the glyphs */
  padX: 7,
  padY: 4,
  /** Estimated cap height at ~11px for rect sizing */
  boxH: 15,
}

const DEPT_LABEL_W = {
  Operations: 70,
  Product: 48,
  People: 42,
} as const

function AnimatedNodeLabelBackdrop({
  y,
  w,
  motionProps,
}: {
  y: number
  w: number
  motionProps: { initial: { opacity: number }; animate: { opacity: number }; transition?: Transition }
}) {
  const { padX, padY, rx, boxH } = LABEL_BG
  const fullW = w + padX * 2
  const fullH = boxH + padY * 2
  return (
    <motion.rect
      aria-hidden
      animate={motionProps.animate}
      fill="var(--frenem-bg)"
      height={fullH}
      initial={motionProps.initial}
      rx={rx}
      transition={motionProps.transition}
      width={fullW}
      x={-fullW / 2}
      y={y - fullH / 2}
    />
  )
}

const LINE_CFG = [
  { x1: 270, y1: 120, x2: 120, y2: 270, delay: 0.55 },
  { x1: 270, y1: 120, x2: 270, y2: 270, delay: 0.63 },
  { x1: 270, y1: 120, x2: 420, y2: 270, delay: 0.71 },
  { x1: 120, y1: 320, x2: 60, y2: 430, delay: 0.95 },
  { x1: 120, y1: 320, x2: 180, y2: 430, delay: 0.99 },
  { x1: 270, y1: 320, x2: 220, y2: 430, delay: 1.03 },
  { x1: 270, y1: 320, x2: 320, y2: 430, delay: 1.07 },
  { x1: 420, y1: 320, x2: 360, y2: 430, delay: 1.11 },
  { x1: 420, y1: 320, x2: 480, y2: 430, delay: 1.15 },
] as const

function OrgLine({ x1, y1, x2, y2, delay }: { x1: number; y1: number; x2: number; y2: number; delay: number }) {
  const len = Math.hypot(x2 - x1, y2 - y1)
  return (
    <motion.line
      className="fill-none stroke-[var(--frenem-border-strong)]"
      strokeWidth={1}
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      initial={{ strokeDasharray: len, strokeDashoffset: len, opacity: 0 }}
      animate={{ strokeDashoffset: 0, opacity: 1 }}
      transition={{ duration: 0.75, ease: [0.4, 0, 0.2, 1], delay }}
    />
  )
}

/** Framer Motion on `<g>` overwrites SVG `transform`. Keep layout on static `<g>`, animate children only.
 * Pulse uses svg `cx`/`cy` + animated `r` (not css `scale`) so expansion is radial and aligned with geometry. */
export default function HeroOrgDiagram() {
  const pulseStartR = FOUNDER.r + 2

  return (
    <svg className="h-full w-full overflow-visible" viewBox="0 0 540 540" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <g>
        {LINE_CFG.map((l) => (
          <OrgLine key={`${l.x1}-${l.y1}-${l.x2}-${l.y2}`} {...l} />
        ))}
      </g>

      {/* SMIL <animate> — Framer often ignores SVG `r`; native animation is reliable and stays centered on cx/cy */}
      <circle
        cx={FOUNDER.cx}
        cy={FOUNDER.cy}
        fill="none"
        r={pulseStartR}
        stroke="var(--frenem-accent)"
        strokeWidth={2}
      >
        <animate
          attributeName="r"
          calcMode="spline"
          dur="2.2s"
          keySplines="0.33 1 0.68 1"
          keyTimes="0;1"
          repeatCount="indefinite"
          values={`${pulseStartR};${pulseStartR + 28}`}
        />
        <animate
          attributeName="opacity"
          dur="2.2s"
          repeatCount="indefinite"
          values="0.65;0"
        />
      </circle>

      <g data-node="founder" transform={`translate(${FOUNDER.cx}, ${FOUNDER.cy})`}>
        <motion.circle
          cx={0}
          cy={0}
          className="fill-[var(--frenem-ink)] stroke-[var(--frenem-ink)]"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          r={FOUNDER.r}
          strokeWidth={1.5}
          style={{ transformOrigin: "0px 0px", transformBox: "fill-box" }}
          transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1], delay: 0.2 }}
        />
        <AnimatedNodeLabelBackdrop
          motionProps={{
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            transition: { duration: 0.45, delay: 0.4 },
          }}
          w={54}
          y={61}
        />
        <motion.text
          className="fill-[var(--frenem-ink)] font-sans text-[11px] font-semibold"
          dominantBaseline="middle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          textAnchor="middle"
          transition={{ duration: 0.5, delay: 0.45 }}
          y={61}
        >
          Founder
        </motion.text>
      </g>

      {[
        { x: 120, y: 295, label: "Operations" },
        { x: 270, y: 295, label: "Product" },
        { x: 420, y: 295, label: "People" },
      ].map((d, i) => (
        <g key={d.label} data-node="dept" transform={`translate(${d.x}, ${d.y})`}>
          <motion.circle
            cx={0}
            cy={0}
            className="fill-[var(--frenem-bg)] stroke-[var(--frenem-ink)]"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            r={22}
            strokeWidth={1.5}
            style={{ transformOrigin: "0px 0px", transformBox: "fill-box" }}
            transition={{ duration: 0.55, ease: [0.34, 1.56, 0.64, 1], delay: 0.85 + i * 0.1 }}
          />
          <AnimatedNodeLabelBackdrop
            motionProps={{
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              transition: { duration: 0.4, delay: 0.92 + i * 0.1 },
            }}
            w={DEPT_LABEL_W[d.label as keyof typeof DEPT_LABEL_W]}
            y={44}
          />
          <motion.text
            className="fill-[var(--frenem-ink-secondary)] font-sans text-[11px] font-medium"
            dominantBaseline="middle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            textAnchor="middle"
            transition={{ duration: 0.45, delay: 0.95 + i * 0.1 }}
            y={44}
          >
            {d.label}
          </motion.text>
        </g>
      ))}

      {[
        [60, 455],
        [180, 455],
        [220, 455],
        [320, 455],
        [360, 455],
        [480, 455],
      ].map(([tx, ty], i) => (
        <g key={`${tx}-${ty}`} className="team" data-node="team" transform={`translate(${tx}, ${ty})`}>
          <motion.circle
            cx={0}
            cy={0}
            className="fill-[var(--frenem-bg-soft)] stroke-[var(--frenem-border-strong)]"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            r={14}
            strokeWidth={1.5}
            style={{ transformOrigin: "0px 0px", transformBox: "fill-box" }}
            transition={{ duration: 0.45, ease: [0.34, 1.56, 0.64, 1], delay: 1.2 + i * 0.04 }}
          />
        </g>
      ))}
    </svg>
  )
}
