"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { useReducedMotion } from "framer-motion"
import { Pause, Play, RotateCcw } from "lucide-react"
import { buildScenes, type Scene, type SceneDot, type SceneSet } from "../../utils/scenes"
import { DEEP, INK, MID } from "../../utils/palette"

/**
 * Palette slots per set, drawn straight onto the page's own soft field:
 * [lattice, 1, 2, 3, 4, 5]. Deep and mid tones only, so the scene belongs to
 * the page rather than sitting on it.
 */
const PALETTES: Record<SceneSet, string[]> = {
  suite: [INK, MID.sage, MID.clay, MID.heather, INK, MID.rose],
  build: [DEEP.clay, MID.clay, DEEP.clay, INK, MID.sand, MID.rose],
  pulse: [DEEP.sage, MID.sage, DEEP.sage, INK, MID.rose, MID.rose],
  prism: [DEEP.heather, MID.heather, DEEP.heather, INK, MID.sand, MID.rose],
}

const TRAVEL_S = 1.35
const LATTICE_DOT = 0.13
const LATTICE_ALPHA = 0.2

interface Particle {
  fx: number
  fy: number
  fs: number
  fc: number
  fr: number
  tx: number
  ty: number
  ts: number
  tc: number
  tr: number
  start: number
  delay: number
  phase: number
  seed: number
  x: number
  y: number
  s: number
  c: number
  r: number
}

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)
const angleOf = (d: { x: number; y: number }) => Math.atan2(d.y - 0.5, d.x - 0.5)

/**
 * Give every scene the same number of slots, ordered by angle around the
 * stage centre, so particle i travels a short arc from scene to scene.
 * Spare particles rest on free lattice points at zero size: they melt into
 * the field's own grid.
 */
function slotScenes(scenes: Scene[], g: number): SceneDot[][] {
  const n = Math.ceil(Math.max(...scenes.map((s) => s.dots.length)) * 1.08)
  const lattice: SceneDot[] = []
  for (let j = 0; j < g; j++) for (let i = 0; i < g; i++) lattice.push({ x: (i + 0.5) / g, y: (j + 0.5) / g, s: 0, c: 0, r: 0.5 })
  return scenes.map((scene, k) => {
    const taken = new Set(scene.dots.map((d) => `${Math.round(d.x * g)}:${Math.round(d.y * g)}`))
    const free = lattice.filter((d) => !taken.has(`${Math.round(d.x * g)}:${Math.round(d.y * g)}`))
    const pad: SceneDot[] = []
    for (let i = 0; pad.length < n - scene.dots.length && i < free.length * 4; i++) {
      pad.push(free[(i * 7919 + k * 104729) % free.length])
    }
    return [...scene.dots, ...pad].sort((a, b) => angleOf(a) - angleOf(b))
  })
}

/**
 * playing: advancing on its own · paused: stopped mid-step by the reader ·
 * picked: the reader chose a step · done: a one-way story reached its end.
 */
type Mode = "playing" | "paused" | "picked" | "done"

interface SceneContextValue {
  scenes: Scene[]
  index: number
  mode: Mode
  running: boolean
  cycle: number
  choose: (i: number) => void
  toggle: () => void
  settled: boolean
  setStage: (el: HTMLDivElement | null) => void
}

const SceneContext = createContext<SceneContextValue | null>(null)

/**
 * The hero as one dot-matrix field, the way a Studio Dumbar identity treats
 * the page: a lattice of fine dots runs edge to edge behind the headline and
 * the scene alike, and the scene's forms grow out of that same lattice
 * (their dots sit on its grid points). Forms regroup between scenes, the
 * pointer wakes the lattice anywhere in the hero, and scrolling away
 * scatters them. One canvas, a static lattice blitted each frame, paused off
 * screen, a single still frame under reduced motion.
 *
 * Render inside a `relative` section; place <SceneStage /> where the scene
 * should sit.
 */
export function HeroScene({ set, children }: { set: SceneSet; children: ReactNode }) {
  const reduce = useReducedMotion()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const goTo = useRef<(index: number) => void>(() => {})
  const [stage, setStage] = useState<HTMLDivElement | null>(null)
  const [index, setIndex] = useState(0)
  const [mode, setMode] = useState<Mode>("playing")
  const [cycle, setCycle] = useState(0)
  const [inView, setInView] = useState(false)
  const [settled, setSettled] = useState(false)

  const scenes = useMemo(() => buildScenes(set, 24), [set])
  // The suite cycles through its three lenses; product stories play once
  // (before, then after) and rest on the outcome.
  const loop = set === "suite"
  const last = scenes.length - 1
  const running = mode === "playing" && inView && !reduce

  // Time spent in a step, kept across pauses and off-screen time so the
  // progress bar and the timer agree. Tagged with its step, so it can never
  // leak into the next one.
  const elapsed = useRef({ index: 0, ms: 0 })

  const show = useCallback((i: number) => {
    elapsed.current = { index: i, ms: 0 }
    setIndex(i)
  }, [])

  useEffect(() => {
    if (!running) return
    if (elapsed.current.index !== index) elapsed.current = { index, ms: 0 }
    const startedAt = performance.now()
    const timer = setTimeout(
      () => {
        if (index < last) show(index + 1)
        else if (loop) {
          show(0)
          setCycle((c) => c + 1)
        } else setMode("done")
      },
      Math.max(0, scenes[index].hold - elapsed.current.ms)
    )
    return () => {
      clearTimeout(timer)
      if (elapsed.current.index === index) elapsed.current.ms += performance.now() - startedAt
    }
  }, [running, index, last, loop, scenes, show])

  // Reduced motion: no autoplay; product stories open on their outcome.
  useEffect(() => {
    if (!reduce) return
    setMode("picked")
    setIndex(loop ? 0 : last)
  }, [reduce, loop, last])

  useEffect(() => {
    goTo.current(index)
    setSettled(false)
    const timer = setTimeout(() => setSettled(true), reduce ? 0 : (TRAVEL_S + 0.5) * 1000)
    return () => clearTimeout(timer)
  }, [index, reduce])

  const choose = useCallback(
    (i: number) => {
      show(i)
      setMode("picked")
    },
    [show]
  )

  const toggle = useCallback(() => {
    if (mode === "playing") setMode("paused")
    else if (mode === "done") {
      show(0)
      setCycle((c) => c + 1)
      setMode("playing")
    } else {
      if (mode === "picked") elapsed.current = { index, ms: 0 }
      setMode("playing")
    }
  }, [mode, show, index])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !stage) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const stillMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const finePointer = window.matchMedia("(pointer: fine)").matches
    const palette = PALETTES[set]
    const canRound = typeof ctx.roundRect === "function"
    const lattice = document.createElement("canvas")
    const lctx = lattice.getContext("2d")!

    let W = 0
    let H = 0
    let sx = 0
    let sy = 0
    let S = 0
    let pitch = 0
    let slots: SceneDot[][] = []
    let particles: Particle[] = []
    let current = 0
    let frame = 0
    let running = false
    let visible = false
    const pointer = { x: -9999, y: -9999, strength: 0, target: 0 }
    const now = () => performance.now() / 1000

    const retarget = (sceneIndex: number, fromScatter: boolean) => {
      const t = now()
      const target = slots[sceneIndex]
      particles.forEach((p, i) => {
        const d = target[i]
        if (fromScatter) {
          // Start out of focus: spread across the whole hero, then gather.
          p.x = (p.seed * W - sx) / S
          p.y = (p.phase * H - sy) / S
          p.s = 0.2
          p.c = 0
          p.r = 0.5
        }
        p.fx = p.x
        p.fy = p.y
        p.fs = p.s
        p.fc = p.c
        p.fr = p.r
        p.tx = d.x
        p.ty = d.y
        p.ts = d.s
        p.tc = d.c
        p.tr = d.r
        p.start = t
        p.delay = stillMotion ? 0 : ((angleOf(d) + Math.PI) / (Math.PI * 2)) * 0.35 + p.seed * (fromScatter ? 0.6 : 0.18)
      })
      current = sceneIndex
    }

    const paintLattice = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      lattice.width = canvas.width
      lattice.height = canvas.height
      lctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      lctx.clearRect(0, 0, W, H)
      lctx.fillStyle = palette[0]
      const w = pitch * LATTICE_DOT * 2
      const ox = ((sx % pitch) + pitch) % pitch
      const oy = ((sy % pitch) + pitch) % pitch
      for (let y = oy + pitch / 2; y < H; y += pitch) {
        for (let x = ox + pitch / 2; x < W; x += pitch) {
          // Quieter behind the copy, fuller around the scene.
          const reach = Math.min(1, Math.max(0, (x - (sx - S * 0.35)) / (S * 0.6)))
          lctx.globalAlpha = LATTICE_ALPHA * (0.45 + 0.55 * reach)
          lctx.beginPath()
          lctx.arc(x, y, w / 2, 0, Math.PI * 2)
          lctx.fill()
        }
      }
      lctx.globalAlpha = 1
    }

    const layout = () => {
      const crect = canvas.getBoundingClientRect()
      const srect = stage.getBoundingClientRect()
      W = crect.width
      H = crect.height
      sx = srect.left - crect.left
      sy = srect.top - crect.top
      S = srect.width
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(W * dpr)
      canvas.height = Math.round(H * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const g = S < 420 ? 28 : S < 540 ? 34 : 40
      pitch = S / g
      slots = slotScenes(buildScenes(set, g), g)
      const n = slots[0].length
      const first = particles.length === 0
      if (particles.length !== n) {
        particles = Array.from({ length: n }, (_, i) => {
          const seed = ((Math.sin(i * 12.9898) * 43758.5453) % 1 + 1) % 1
          const phase = ((Math.sin(i * 78.233) * 12345.678) % 1 + 1) % 1
          const d = slots[current][i]
          return {
            fx: d.x, fy: d.y, fs: d.s, fc: d.c, fr: d.r,
            tx: d.x, ty: d.y, ts: d.s, tc: d.c, tr: d.r,
            start: 0, delay: 0, phase, seed,
            x: d.x, y: d.y, s: d.s, c: d.c, r: d.r,
          }
        })
      }
      paintLattice()
      retarget(current, first && !stillMotion)
    }

    const draw = () => {
      const t = now()
      // Scatter keys off the scene's own place on screen, not page scroll:
      // on phones the scene sits below the copy and must hold together while
      // it is being looked at. It dissolves once its centre passes above a
      // third of the viewport.
      let scroll = 0
      if (!stillMotion) {
        const vh = window.innerHeight
        const centre = canvas.getBoundingClientRect().top + sy + S / 2
        scroll = Math.min(1, Math.max(0, (vh * 0.35 - centre) / (vh * 0.35 + S / 2)))
      }
      pointer.strength += (pointer.target - pointer.strength) * 0.1

      ctx.clearRect(0, 0, W, H)
      ctx.drawImage(lattice, 0, 0, W, H)

      // The pointer wakes the lattice wherever it is in the hero.
      if (pointer.strength > 0.01) {
        const R = 130
        const ox = ((sx % pitch) + pitch) % pitch + pitch / 2
        const oy = ((sy % pitch) + pitch) % pitch + pitch / 2
        const i0 = Math.max(0, Math.floor((pointer.x - R - ox) / pitch))
        const i1 = Math.ceil((pointer.x + R - ox) / pitch)
        const j0 = Math.max(0, Math.floor((pointer.y - R - oy) / pitch))
        const j1 = Math.ceil((pointer.y + R - oy) / pitch)
        const bloom = new Path2D()
        for (let j = j0; j <= j1; j++) {
          for (let i = i0; i <= i1; i++) {
            const x = ox + i * pitch
            const y = oy + j * pitch
            const d2 = (x - pointer.x) ** 2 + (y - pointer.y) ** 2
            const k = pointer.strength * Math.exp(-d2 / (2 * 55 * 55))
            if (k < 0.06) continue
            const w = pitch * (LATTICE_DOT * 2 + 0.55 * k)
            if (canRound) bloom.roundRect(x - w / 2, y - w / 2, w, w, w * (0.5 - 0.3 * k))
            else bloom.rect(x - w / 2, y - w / 2, w, w)
          }
        }
        ctx.globalAlpha = 0.5
        ctx.fillStyle = palette[1]
        ctx.fill(bloom)
        ctx.globalAlpha = 1
      }

      const paths = palette.map(() => new Path2D())
      for (const p of particles) {
        const k = stillMotion ? 1 : Math.min(1, Math.max(0, (t - p.start - p.delay) / TRAVEL_S))
        const e = ease(k)
        p.x = p.fx + (p.tx - p.fx) * e
        p.y = p.fy + (p.ty - p.fy) * e
        p.s = p.fs + (p.ts - p.fs) * e
        p.r = p.fr + (p.tr - p.fr) * e
        p.c = e < 0.5 ? p.fc : p.tc
        if (p.s <= 0.01) continue

        let s = p.s * (1 - 0.5 * Math.sin(Math.PI * e)) * (stillMotion ? 1 : 0.94 + 0.06 * Math.sin(t * 1.7 + p.phase * 6.28))
        let px = sx + p.x * S
        let py = sy + p.y * S

        if (pointer.strength > 0.01) {
          const dx = px - pointer.x
          const dy = py - pointer.y
          const d = Math.hypot(dx, dy) || 1
          const near = pointer.strength * Math.exp(-(d * d) / (2 * 64 * 64))
          px += (dx / d) * near * 16
          py += (dy / d) * near * 16
          s *= 1 + near * 0.4
        }
        if (scroll > 0) {
          const a = p.seed * Math.PI * 2
          const push = scroll * (40 + p.seed * 160)
          px += Math.cos(a) * push
          py += Math.sin(a) * push - scroll * 24
          s *= 1 - scroll * 0.6
        }

        const w = s * pitch
        if (w < 0.35) continue
        const path = paths[p.c]
        if (canRound) path.roundRect(px - w / 2, py - w / 2, w, w, w * p.r)
        else path.rect(px - w / 2, py - w / 2, w, w)
      }
      paths.forEach((path, c) => {
        ctx.globalAlpha = c === 0 ? LATTICE_ALPHA * 1.4 : 1
        ctx.fillStyle = palette[c]
        ctx.fill(path)
      })
      ctx.globalAlpha = 1
    }

    const loop = () => {
      draw()
      if (running) frame = requestAnimationFrame(loop)
    }
    const start = () => {
      if (running || !visible || document.hidden || stillMotion) return
      running = true
      frame = requestAnimationFrame(loop)
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(frame)
    }

    goTo.current = (i: number) => {
      if (i === current || !slots.length) return
      retarget(i, false)
      if (stillMotion) draw()
    }

    layout()
    draw()

    const ro = new ResizeObserver(() => {
      layout()
      draw()
    })
    ro.observe(canvas)
    ro.observe(stage)

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      setInView(entry.isIntersecting)
      if (visible) start()
      else stop()
    })
    io.observe(canvas)

    const onVisibility = () => (document.hidden ? stop() : start())
    document.addEventListener("visibilitychange", onVisibility)

    // Web fonts can reflow the copy and move the stage without resizing it.
    let alive = true
    document.fonts?.ready.then(() => {
      if (!alive) return
      layout()
      draw()
    })

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      pointer.x = e.clientX - rect.left
      pointer.y = e.clientY - rect.top
      pointer.target = pointer.x >= 0 && pointer.y >= 0 && pointer.x <= rect.width && pointer.y <= rect.height ? 1 : 0
    }
    if (finePointer && !stillMotion) window.addEventListener("pointermove", onMove, { passive: true })

    return () => {
      alive = false
      stop()
      ro.disconnect()
      io.disconnect()
      document.removeEventListener("visibilitychange", onVisibility)
      window.removeEventListener("pointermove", onMove)
      goTo.current = () => {}
    }
  }, [set, stage])

  const value = useMemo(
    () => ({ scenes, index, mode, running, cycle, choose, toggle, settled, setStage }),
    [scenes, index, mode, running, cycle, choose, toggle, settled]
  )

  return (
    <SceneContext.Provider value={value}>
      <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0 block h-full w-full" />
      {children}
    </SceneContext.Provider>
  )
}

/**
 * Where the scene sits in the hero's layout: a square the canvas draws into,
 * the scene's labels, and under it a story-style stepper. Each step is a
 * progress segment that fills while it plays, labelled, and tappable; a
 * single button pauses, resumes, or replays. It reads at a glance as "this
 * moves on its own, and you can jump", with nothing hidden behind hover.
 */
export function SceneStage({ className }: { className?: string }) {
  const ctx = useContext(SceneContext)
  if (!ctx) throw new Error("SceneStage must be inside HeroScene")
  const { scenes, index, mode, running, cycle, choose, toggle, settled, setStage } = ctx
  const scene = scenes[index]

  const control =
    mode === "playing"
      ? { label: "Pause the animation", Icon: Pause }
      : mode === "done"
        ? { label: "Replay the animation", Icon: RotateCcw }
        : { label: "Play the animation", Icon: Play }

  return (
    <div className={className}>
      <div ref={setStage} role="img" aria-label={scene.caption} className="relative aspect-square w-full">
        {scenes.map((s, i) =>
          (s.notes ?? []).map((n) => (
            <span
              key={`${s.id}-${n.text}`}
              aria-hidden
              className="pointer-events-none absolute whitespace-nowrap text-[12px] font-semibold text-ink-secondary transition-opacity duration-500 sm:text-[13px]"
              style={{
                left: `${n.x * 100}%`,
                top: `${n.y * 100}%`,
                transform: n.align === "center" ? "translate(-50%, -50%)" : n.align === "right" ? "translate(-100%, -50%)" : "translateY(-50%)",
                opacity: i === index && settled ? 1 : 0,
              }}
            >
              {n.text}
            </span>
          ))
        )}
      </div>

      <div className="anim-fade-up mt-4" style={{ animationDelay: "0.9s" }}>
        <div className="flex items-start gap-4">
          <div
            role="group"
            aria-label="Steps"
            className="grid min-w-0 flex-1 gap-x-3"
            style={{ gridTemplateColumns: `repeat(${scenes.length}, minmax(0, 1fr))` }}
          >
            {scenes.map((s, i) => {
              const active = i === index
              const complete = i < index || (active && (mode === "done" || mode === "picked"))
              return (
                <button
                  key={s.id}
                  type="button"
                  aria-pressed={active}
                  aria-label={`Show step ${i + 1}: ${s.label}`}
                  onClick={() => choose(i)}
                  className="group min-w-0 py-2 text-left"
                >
                  <span className="relative block h-1 overflow-hidden rounded-full bg-(--tint-deep)/15 transition-[height] duration-300 group-hover:h-1.5">
                    {active && !complete ? (
                      <span
                        key={`${index}-${cycle}-${mode === "picked" ? "p" : "a"}`}
                        className="absolute inset-0 origin-left rounded-full bg-ink"
                        style={{
                          animation: `rule-in ${s.hold}ms linear both`,
                          animationPlayState: running ? "running" : "paused",
                        }}
                      />
                    ) : (
                      <span
                        className="absolute inset-0 origin-left rounded-full bg-ink transition-transform duration-500"
                        style={{ transform: `scaleX(${complete ? 1 : 0})` }}
                      />
                    )}
                  </span>
                  <span
                    className={`mt-2.5 block truncate text-[13px] font-semibold transition-colors sm:text-[14px] ${
                      active ? "text-ink" : "text-ink-secondary group-hover:text-ink"
                    }`}
                  >
                    {s.label}
                  </span>
                </button>
              )
            })}
          </div>
          <button
            type="button"
            onClick={toggle}
            aria-label={control.label}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink text-paper transition-transform duration-300 hover:scale-105"
          >
            <control.Icon aria-hidden className="h-4 w-4" strokeWidth={2.4} fill={control.Icon === RotateCcw ? "none" : "currentColor"} />
          </button>
        </div>
        <p className="mt-2 text-[15px] font-medium leading-snug text-ink-secondary">{scene.caption}</p>
      </div>
    </div>
  )
}
