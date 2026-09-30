"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { DEEP, INK, MID, WHITE } from "../../utils/palette"

export type FieldMark = "suite" | "pulse" | "build" | "prism"

/** Which tone a cell takes: 0 is empty grid, 1-3 are the mark's layers. */
type Layer = 0 | 1 | 2 | 3

const inCircle = (u: number, v: number, cx: number, cy: number, r: number) => (u - cx) ** 2 + (v - cy) ** 2 <= r * r
const inBox = (u: number, v: number, x0: number, y0: number, x1: number, y1: number) => u >= x0 && u <= x1 && v >= y0 && v <= y1
const inPill = (u: number, v: number, x0: number, y0: number, x1: number, y1: number) => {
  const r = (y1 - y0) / 2
  const cy = y0 + r
  if (u >= x0 + r && u <= x1 - r) return v >= y0 && v <= y1
  return inCircle(u, v, x0 + r, cy, r) || inCircle(u, v, x1 - r, cy, r)
}

/**
 * Each product's mark, drawn in normalised field coordinates. The same
 * shapes as the rest of the site: a network ring for Pulse, a stair of
 * blocks for Build, stacked bars for Prism, and all three for the suite.
 */
const MARKS: Record<FieldMark, (u: number, v: number) => Layer> = {
  pulse: (u, v) => {
    if (inCircle(u, v, 0.5, 0.5, 0.13)) return 1
    const nodes: Array<[number, number]> = [
      [0.5, 0.1],
      [0.88, 0.38],
      [0.74, 0.84],
      [0.26, 0.84],
      [0.12, 0.38],
    ]
    if (nodes.some(([x, y]) => inCircle(u, v, x, y, 0.075))) return 2
    const d = Math.hypot(u - 0.5, v - 0.5)
    if (d > 0.33 && d < 0.4) return 3
    return 0
  },
  build: (u, v) => {
    if (inBox(u, v, 0.54, 0.06, 0.94, 0.46)) return 1
    if (inBox(u, v, 0.1, 0.5, 0.5, 0.9)) return 2
    if (inBox(u, v, 0.54, 0.5, 0.94, 0.9)) return 3
    return 0
  },
  prism: (u, v) => {
    if (inPill(u, v, 0.18, 0.1, 0.98, 0.3)) return 1
    if (inPill(u, v, 0.36, 0.4, 0.92, 0.6)) return 2
    if (inPill(u, v, 0.54, 0.7, 0.98, 0.9)) return 3
    return 0
  },
  suite: (u, v) => {
    if (inCircle(u, v, 0.44, 0.28, 0.2)) return 1
    if (inBox(u, v, 0.58, 0.38, 0.94, 0.74)) return 2
    if (inPill(u, v, 0.26, 0.76, 0.78, 0.92)) return 3
    return 0
  },
}

const COLOURS: Record<FieldMark, [string, string, string, string]> = {
  // [grid dots, layer 1, layer 2, layer 3]
  pulse: [DEEP.sage, DEEP.sage, MID.sage, WHITE],
  build: [DEEP.clay, DEEP.clay, MID.clay, WHITE],
  prism: [DEEP.heather, DEEP.heather, MID.heather, WHITE],
  suite: [INK, MID.sage, MID.clay, MID.heather],
}

interface Cell {
  cx: number
  cy: number
  layer: Layer
  /** Distance from the field centre, 0..~0.7, for the wave and the intro. */
  d: number
  /** Stable per-cell random, for scatter direction and timing. */
  seed: number
}

const hash = (i: number, j: number) => {
  const s = Math.sin(i * 127.1 + j * 311.7) * 43758.5453
  return s - Math.floor(s)
}

/**
 * A living dot-matrix: a grid of small modules that forms a product's mark.
 * Modules ripple in a slow wave, swell and round off under the pointer, and
 * scatter as the page scrolls away. Drawn on one canvas in a handful of
 * batched fills; pauses off screen; a single still frame under reduced motion.
 */
export default function ModuleField({
  mark,
  className,
  cell = 22,
  scatter = true,
}: {
  mark: FieldMark
  className?: string
  /** Grid pitch in CSS pixels. */
  cell?: number
  /** Scatter the modules as the page scrolls away from the top. */
  scatter?: boolean
}) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const finePointer = window.matchMedia("(pointer: fine)").matches
    const colours = COLOURS[mark]
    const shape = MARKS[mark]
    const canRound = typeof ctx.roundRect === "function"

    let cells: Cell[] = []
    let width = 0
    let height = 0
    let pitch = cell
    let frame = 0
    let running = false
    let visible = true
    const started = performance.now()
    const pointer = { x: -9999, y: -9999, strength: 0, target: 0 }

    const layout = () => {
      const rect = wrap.getBoundingClientRect()
      width = rect.width
      height = rect.height
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      pitch = width < 480 ? Math.max(14, cell - 6) : cell
      const cols = Math.floor(width / pitch)
      const rows = Math.floor(height / pitch)
      const ox = (width - cols * pitch) / 2 + pitch / 2
      const oy = (height - rows * pitch) / 2 + pitch / 2
      cells = []
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const u = (i + 0.5) / cols
          const v = (j + 0.5) / rows
          cells.push({
            cx: ox + i * pitch,
            cy: oy + j * pitch,
            layer: shape(u, v),
            d: Math.hypot(u - 0.5, v - 0.5),
            seed: hash(i, j),
          })
        }
      }
    }

    const draw = (now: number) => {
      const t = (now - started) / 1000
      const intro = reduce ? 1 : Math.min(1, t / 1.6)
      const scroll = scatter && !reduce ? Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * 0.9))) : 0
      pointer.strength += (pointer.target - pointer.strength) * 0.08

      ctx.clearRect(0, 0, width, height)
      const paths = [new Path2D(), new Path2D(), new Path2D(), new Path2D()]
      const glow = new Path2D()
      const base = pitch * 0.78

      for (const c of cells) {
        // Staggered entrance, sweeping out from the centre.
        const local = Math.min(1, Math.max(0, (intro * 1.6 - c.d * 1.4 - c.seed * 0.15) / 0.6))
        if (local <= 0) continue
        const ease = 1 - (1 - local) ** 3

        const wave = reduce ? 1 : 0.5 + 0.5 * Math.sin(t * 1.15 - c.d * 11)
        const dx = c.cx - pointer.x
        const dy = c.cy - pointer.y
        const near = pointer.strength * Math.exp(-(dx * dx + dy * dy) / (2 * 70 * 70))

        let size: number
        let round: number
        if (c.layer === 0) {
          // The empty grid: tiny dots, which bloom where the pointer passes.
          size = pitch * (0.12 + 0.5 * near)
          round = 0.5
        } else {
          size = base * (0.6 + 0.3 * wave + 0.3 * near)
          round = 0.12 + 0.38 * near
        }
        size *= ease

        // Scroll scatter: modules drift apart and shrink as the hero leaves.
        const angle = c.seed * Math.PI * 2
        const push = scroll * (40 + c.seed * 140)
        const x = c.cx + Math.cos(angle) * push - size / 2
        const y = c.cy + Math.sin(angle) * push - size / 2 - scroll * 30
        const s = size * (1 - scroll * 0.6)
        if (s < 0.4) continue

        const target = c.layer === 0 && near > 0.25 ? glow : paths[c.layer]
        if (canRound) target.roundRect(x, y, s, s, s * round)
        else target.rect(x, y, s, s)
      }

      ctx.globalAlpha = 0.16
      ctx.fillStyle = colours[0]
      ctx.fill(paths[0])
      ctx.globalAlpha = 0.55
      ctx.fillStyle = colours[2]
      ctx.fill(glow)
      ctx.globalAlpha = 1
      for (let k = 1; k <= 3; k++) {
        ctx.fillStyle = colours[k]
        ctx.fill(paths[k])
      }
    }

    const loop = (now: number) => {
      draw(now)
      if (running) frame = requestAnimationFrame(loop)
    }

    const start = () => {
      if (running || reduce || !visible || document.hidden) return
      running = true
      frame = requestAnimationFrame(loop)
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(frame)
    }

    layout()
    draw(performance.now() + (reduce ? 10000 : 0))

    const ro = new ResizeObserver(() => {
      layout()
      if (!running) draw(performance.now() + 10000)
    })
    ro.observe(wrap)

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) start()
      else stop()
    })
    io.observe(wrap)

    const onVisibility = () => (document.hidden ? stop() : start())
    document.addEventListener("visibilitychange", onVisibility)

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      pointer.x = e.clientX - rect.left
      pointer.y = e.clientY - rect.top
      pointer.target = 1
    }
    const onLeave = () => {
      pointer.target = 0
    }
    if (finePointer && !reduce) {
      window.addEventListener("pointermove", onMove, { passive: true })
      document.documentElement.addEventListener("pointerleave", onLeave)
    }

    start()

    return () => {
      stop()
      ro.disconnect()
      io.disconnect()
      document.removeEventListener("visibilitychange", onVisibility)
      window.removeEventListener("pointermove", onMove)
      document.documentElement.removeEventListener("pointerleave", onLeave)
    }
  }, [mark, cell, scatter])

  return (
    <div ref={wrapRef} aria-hidden className={cn("pointer-events-none", className)}>
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  )
}
