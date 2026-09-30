"use client"

import { useEffect, useRef, type ReactNode } from "react"
import { animate, interpolate, useReducedMotion } from "framer-motion"
import type { Block } from "../../utils/blocks"

/**
 * Renderers for the block system (see utils/blocks.ts): every figure is a
 * fixed cast of rectangles that springs between layouts.
 *
 * Blocks are drawn centred on their own origin and placed with an SVG
 * `translate() rotate()` attribute, written straight to the DOM. That keeps
 * rotation exact however a block resizes (framer-motion measures an SVG
 * element's transform origin once, at mount) and costs no React renders
 * per frame, which matters on phones.
 */

const round = (n: number) => Math.round(n * 100) / 100
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const clamp01 = (t: number) => Math.min(1, Math.max(0, t))

const colourMixers = new Map<string, (t: number) => string>()
function mixColour(a: string, b: string, t: number) {
  if (a === b) return a
  const key = `${a}>${b}`
  let mixer = colourMixers.get(key)
  if (!mixer) {
    mixer = interpolate([0, 1], [a, b])
    colourMixers.set(key, mixer)
  }
  return mixer(clamp01(t))
}

/**
 * The rotation to aim for: a pill looks the same turned 180°, a square 90°,
 * so take whichever equivalent angle is the shortest turn from where it is.
 */
function nearestTurn(from: number, b: Block) {
  const to = b.rot ?? 0
  const period = Math.abs(b.w - b.h) < 0.5 ? 90 : 180
  const delta = ((((to - from) % period) + period * 1.5) % period) - period / 2
  return from + delta
}

/** Blend two layouts of the same block. Positions may overshoot (springs); colour and opacity clamp. */
function mixBlock(a: Block, b: Block, t: number): Block {
  const from = a.rot ?? 0
  return {
    x: lerp(a.x, b.x, t),
    y: lerp(a.y, b.y, t),
    w: Math.max(0, lerp(a.w, b.w, t)),
    h: Math.max(0, lerp(a.h, b.h, t)),
    r: Math.max(0, lerp(a.r ?? 0, b.r ?? 0, t)),
    rot: lerp(from, nearestTurn(from, b), t),
    fill: mixColour(a.fill, b.fill, t),
    o: lerp(a.o ?? 1, b.o ?? 1, clamp01(t)),
  }
}

function attrs(b: Block) {
  const r = Math.min(b.r ?? 0, b.w / 2, b.h / 2)
  return {
    x: round(-b.w / 2),
    y: round(-b.h / 2),
    width: round(b.w),
    height: round(b.h),
    rx: round(r),
    fill: b.fill,
    opacity: round(b.o ?? 1),
    transform: `translate(${round(b.x + b.w / 2)} ${round(b.y + b.h / 2)}) rotate(${round(b.rot ?? 0)})`,
  }
}

function paint(el: SVGRectElement | null, b: Block) {
  if (!el) return
  const a = attrs(b)
  el.setAttribute("x", String(a.x))
  el.setAttribute("y", String(a.y))
  el.setAttribute("width", String(a.width))
  el.setAttribute("height", String(a.height))
  el.setAttribute("rx", String(a.rx))
  el.setAttribute("fill", a.fill)
  el.setAttribute("opacity", String(a.opacity))
  el.setAttribute("transform", a.transform)
}

/** A slow, spatially smooth wander: neighbouring blocks move together, so ties stay on their nodes. */
function drifted(b: Block, t: number, amp: number): Block {
  const cx = b.x + b.w / 2
  const cy = b.y + b.h / 2
  return {
    ...b,
    x: b.x + amp * Math.sin(t * 0.8 + cy * 0.018),
    y: b.y + amp * Math.cos(t * 0.65 + cx * 0.016),
    rot: (b.rot ?? 0) + amp * 0.5 * Math.sin(t * 0.5 + (cx + cy) * 0.01),
  }
}

/**
 * Springs every block to the layout at `index`. The change ripples out from
 * the centre of the figure, so it reads as the pieces regrouping rather than
 * a crossfade, and a change mid-flight picks up from wherever each block is.
 * With `drift`, blocks keep wandering gently while the figure is on screen.
 */
export function MorphField({
  layouts,
  index,
  viewBox,
  label,
  className,
  drift = 0,
  overlay,
}: {
  layouts: Block[][]
  index: number
  viewBox: string
  label: string
  className?: string
  /** Idle wander amplitude in user units; 0 for none. */
  drift?: number
  /** Extra SVG drawn above the blocks: labels, signals. */
  overlay?: ReactNode
}) {
  const reduce = useReducedMotion()
  const svgRef = useRef<SVGSVGElement>(null)
  const rects = useRef<Array<SVGRectElement | null>>([])
  // The first layout is rendered by React (so SSR paints it); after that the
  // DOM is driven directly and React never touches these attributes again.
  const initial = useRef(layouts[index])
  const current = useRef<Block[]>(layouts[index].slice())
  const mounted = useRef(false)
  const idle = drift > 0 && !reduce

  useEffect(() => {
    const target = layouts[index]
    if (!mounted.current) {
      mounted.current = true
      if (target === initial.current) return
    }
    const [, , vw, vh] = viewBox.split(" ").map(Number)
    const reach = Math.hypot(vw / 2, vh / 2)
    const from = current.current.slice()
    const controls = target.map((b, i) => {
      if (reduce) {
        current.current[i] = b
        paint(rects.current[i], b)
        return null
      }
      const dist = Math.hypot(b.x + b.w / 2 - vw / 2, b.y + b.h / 2 - vh / 2) / reach
      return animate(0, 1, {
        type: "spring",
        stiffness: 70,
        damping: 14,
        mass: 0.9,
        delay: dist * 0.3,
        onUpdate: (t) => {
          const m = mixBlock(from[i], b, t)
          current.current[i] = m
          if (!idle) paint(rects.current[i], m)
        },
      })
    })
    return () => controls.forEach((c) => c?.stop())
  }, [index, layouts, reduce, viewBox, idle])

  // One painter for the idle wander, running only while on screen.
  useEffect(() => {
    if (!idle) return
    const svg = svgRef.current
    if (!svg) return
    let frame = 0
    let running = false
    const loop = (now: number) => {
      const t = now / 1000
      current.current.forEach((b, i) => paint(rects.current[i], drifted(b, t, drift)))
      if (running) frame = requestAnimationFrame(loop)
    }
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !running) {
        running = true
        frame = requestAnimationFrame(loop)
      } else if (!entry.isIntersecting) {
        running = false
        cancelAnimationFrame(frame)
      }
    })
    io.observe(svg)
    return () => {
      running = false
      cancelAnimationFrame(frame)
      io.disconnect()
    }
  }, [idle, drift])

  return (
    <svg ref={svgRef} role="img" aria-label={label} viewBox={viewBox} className={className}>
      {initial.current.map((b, i) => (
        <rect
          key={i}
          ref={(el) => {
            rects.current[i] = el
          }}
          {...attrs(b)}
        />
      ))}
      {overlay}
    </svg>
  )
}
