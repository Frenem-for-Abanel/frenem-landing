/**
 * Hero scenes, drawn as a dot-matrix. Each scene is a list of dots in a
 * unit square (0..1 on both axes) sampled from simple shapes on a grid, so
 * the same particles can regroup from one scene into the next. Pure data:
 * built on the client at whatever grid density suits the screen.
 *
 * Colour index per dot: 0 is the faint background grid, 1-5 are the page's
 * palette slots (see SceneField).
 */

export interface SceneDot {
  x: number
  y: number
  /** Size as a fraction of the grid pitch. */
  s: number
  /** Palette slot. */
  c: number
  /** Corner roundness, 0 (square) to 0.5 (circle). */
  r: number
}

export interface SceneNote {
  x: number
  y: number
  text: string
  align?: "left" | "center" | "right"
}

export interface Scene {
  id: string
  /** Step label under its progress segment. */
  label: string
  /** How long the scene holds before the next one, in ms. */
  hold: number
  /** One-line caption under the scene. */
  caption: string
  dots: SceneDot[]
  notes?: SceneNote[]
}

export type SceneSet = "suite" | "build" | "pulse" | "prism"

type Test = (u: number, v: number) => boolean

const disc = (cx: number, cy: number, r: number): Test => (u, v) => (u - cx) ** 2 + (v - cy) ** 2 <= r * r
const box = (x0: number, y0: number, x1: number, y1: number): Test => (u, v) => u >= x0 && u <= x1 && v >= y0 && v <= y1
const pill = (x0: number, y0: number, x1: number, y1: number): Test => {
  const r = (y1 - y0) / 2
  const cy = y0 + r
  return (u, v) =>
    (u >= x0 + r && u <= x1 - r && v >= y0 && v <= y1) ||
    (u - (x0 + r)) ** 2 + (v - cy) ** 2 <= r * r ||
    (u - (x1 - r)) ** 2 + (v - cy) ** 2 <= r * r
}

/** A scene under construction: shapes claim grid cells (later wins); lines add finer dots. */
class Canvas {
  private cells = new Map<number, SceneDot>()
  private extra: SceneDot[] = []
  constructor(private g: number) {}

  fill(test: Test, c: number, s = 0.78, r = 0.16, every = 1) {
    const g = this.g
    for (let j = 0; j < g; j++) {
      for (let i = 0; i < g; i++) {
        if (every > 1 && (i % every !== 0 || j % every !== 0)) continue
        const u = (i + 0.5) / g
        const v = (j + 0.5) / g
        if (test(u, v)) this.cells.set(j * g + i, { x: u, y: v, s, c, r })
      }
    }
    return this
  }

  /** A dotted line, trimmed at each end so it meets shapes rather than overlapping them. */
  line(x1: number, y1: number, x2: number, y2: number, c: number, trim = 0, s = 0.36) {
    const len = Math.hypot(x2 - x1, y2 - y1)
    const step = 0.75 / this.g
    for (let d = trim; d <= len - trim; d += step) {
      const t = d / len
      this.extra.push({ x: x1 + (x2 - x1) * t, y: y1 + (y2 - y1) * t, s, c, r: 0.5 })
    }
    return this
  }

  dots() {
    return [...this.cells.values(), ...this.extra]
  }
}

/* ----------------------------------------------------------------------------
 * Shared pictures
 * -------------------------------------------------------------------------- */

/** A founder, three leads, six teams: an organisation with real levels. */
function structure(g: number, colours: { founder: number; lead: number; team: number; rail: number }) {
  const c = new Canvas(g)
  const leads = [0.22, 0.5, 0.78]
  c.fill(box(0.42, 0.2, 0.58, 0.33), colours.founder)
  leads.forEach((x) => c.fill(box(x - 0.075, 0.44, x + 0.075, 0.54), colours.lead))
  const teams = [0.14, 0.3, 0.42, 0.58, 0.7, 0.86]
  teams.forEach((x) => c.fill(box(x - 0.045, 0.66, x + 0.045, 0.74), colours.team))
  c.line(0.5, 0.33, 0.5, 0.385, colours.rail, 0.01)
  c.line(0.22, 0.39, 0.78, 0.39, colours.rail)
  leads.forEach((x) => c.line(x, 0.39, x, 0.44, colours.rail, 0.01))
  ;[
    [0.14, 0.3],
    [0.42, 0.58],
    [0.7, 0.86],
  ].forEach(([a, b], k) => {
    c.line(a, 0.6, b, 0.6, colours.rail)
    c.line(leads[k], 0.54, leads[k], 0.6, colours.rail, 0.01)
  })
  return c
}

/** Two clusters of people, and the broker who quietly connects them. */
function network(g: number, colours: { person: number; broker: number; tie: number; bridge: number; friction: number; isolated: number }) {
  const c = new Canvas(g)
  const A: Array<[number, number]> = [
    [0.2, 0.3],
    [0.33, 0.23],
    [0.3, 0.43],
    [0.16, 0.52],
  ]
  const B: Array<[number, number]> = [
    [0.68, 0.24],
    [0.82, 0.33],
    [0.67, 0.46],
    [0.8, 0.56],
  ]
  const broker: [number, number] = [0.5, 0.4]
  const tie = (p: [number, number], q: [number, number], col: number, trim = 0.05) => c.line(p[0], p[1], q[0], q[1], col, trim)
  tie(A[0], A[1], colours.tie)
  tie(A[0], A[2], colours.tie)
  tie(A[1], A[2], colours.tie)
  tie(A[2], A[3], colours.tie)
  tie(B[0], B[1], colours.tie)
  tie(B[1], B[2], colours.tie)
  tie(B[2], B[3], colours.tie)
  tie(B[0], B[2], colours.tie)
  tie(broker, A[2], colours.bridge, 0.06)
  tie(broker, A[1], colours.bridge, 0.06)
  tie(broker, B[0], colours.bridge, 0.06)
  tie(broker, B[2], colours.bridge, 0.06)
  tie(A[3], [0.62, 0.66], colours.friction, 0.05)
  ;[...A, ...B].forEach(([x, y]) => c.fill(disc(x, y, 0.045), colours.person, 0.8, 0.5))
  c.fill(disc(0.62, 0.66, 0.04), colours.person, 0.8, 0.5)
  c.fill(disc(broker[0], broker[1], 0.075), colours.broker, 0.86, 0.5)
  c.fill(disc(0.86, 0.74, 0.035), colours.isolated, 0.8, 0.5)
  return c
}

/** The live chart: one head, three leads, six teams, KRAs filling under them. */
function chart(g: number, colours: { head: number; lead: number; team: number; kra: number; joiner: number; rail: number }) {
  const c = new Canvas(g)
  c.fill(pill(0.36, 0.18, 0.64, 0.26), colours.head, 0.8, 0.3)
  const leads = [0.2, 0.5, 0.8]
  leads.forEach((x) => c.fill(pill(x - 0.12, 0.38, x + 0.12, 0.46), colours.lead, 0.8, 0.3))
  c.line(0.5, 0.26, 0.5, 0.32, colours.rail, 0.01)
  c.line(0.2, 0.32, 0.8, 0.32, colours.rail)
  leads.forEach((x) => c.line(x, 0.32, x, 0.38, colours.rail, 0.01))
  const teams = [0.13, 0.28, 0.43, 0.58, 0.73, 0.88]
  const kra = [0.85, 0.5, 0.7, 0.35, 0.9, 0.6]
  teams.forEach((x, k) => {
    c.fill(pill(x - 0.06, 0.56, x + 0.06, 0.62), k === 5 ? colours.joiner : colours.team, 0.8, 0.3)
    c.line(x - 0.055, 0.68, x - 0.055 + 0.11 * kra[k], 0.68, colours.kra, 0, 0.5)
  })
  return c
}

/* ----------------------------------------------------------------------------
 * Scene sets, one per hero
 * -------------------------------------------------------------------------- */

export function buildScenes(set: SceneSet, g: number): Scene[] {
  switch (set) {
    case "suite":
      return [
        {
          id: "pulse",
          label: "Diagnose",
          hold: 4600,
          caption: "Pulse maps how your people actually work together.",
          dots: network(g, { person: 1, broker: 4, tie: 1, bridge: 4, friction: 5, isolated: 3 }).dots(),
          notes: [
            { x: 0.5, y: 0.3, text: "Broker", align: "center" },
            { x: 0.86, y: 0.82, text: "Isolated", align: "center" },
          ],
        },
        {
          id: "build",
          label: "Design",
          hold: 4600,
          caption: "Build designs the structure your growth needs.",
          dots: structure(g, { founder: 4, lead: 2, team: 2, rail: 4 }).dots(),
          notes: [{ x: 0.61, y: 0.265, text: "Founder" }],
        },
        {
          id: "prism",
          label: "Operate",
          hold: 4600,
          caption: "Prism keeps it current as you scale.",
          dots: chart(g, { head: 4, lead: 3, team: 3, kra: 3, joiner: 2, rail: 4 }).dots(),
          notes: [{ x: 0.88, y: 0.76, text: "New joiner", align: "center" }],
        },
      ]

    case "build": {
      const today = new Canvas(g)
      const around: Array<[number, number]> = [
        [0.2, 0.24],
        [0.42, 0.18],
        [0.72, 0.2],
        [0.84, 0.42],
        [0.78, 0.66],
        [0.54, 0.74],
        [0.28, 0.7],
        [0.14, 0.5],
        [0.62, 0.34],
      ]
      around.forEach(([x, y]) => today.line(0.5, 0.47, x, y, 1, 0.07))
      today.line(0.2, 0.24, 0.42, 0.18, 1, 0.05).line(0.84, 0.42, 0.78, 0.66, 1, 0.05).line(0.28, 0.7, 0.14, 0.5, 1, 0.05)
      around.forEach(([x, y], k) => today.fill(box(x - 0.04, y - 0.04, x + 0.04, y + 0.04), k % 3 === 0 ? 2 : 1))
      today.fill(box(0.42, 0.39, 0.58, 0.55), 3)
      return [
        {
          id: "today",
          label: "Today",
          hold: 3400,
          caption: "Every decision routes through you.",
          dots: today.dots(),
          notes: [{ x: 0.5, y: 0.6, text: "You", align: "center" }],
        },
        {
          id: "after",
          label: "After Build",
          hold: 6000,
          caption: "Decisions get made at the right level.",
          dots: structure(g, { founder: 3, lead: 2, team: 1, rail: 1 }).dots(),
          notes: [
            { x: 0.61, y: 0.265, text: "You" },
            { x: 0.865, y: 0.49, text: "Leaders" },
            { x: 0.86, y: 0.8, text: "Teams", align: "center" },
          ],
        },
      ]
    }

    case "pulse": {
      const survey = new Canvas(g)
      survey.fill(box(0.2, 0.24, 0.8, 0.6), 1, 0.62, 0.5, 2)
      survey.line(0.26, 0.72, 0.58, 0.72, 2, 0, 0.62)
      survey.line(0.58, 0.72, 0.74, 0.72, 1, 0, 0.3)
      return [
        {
          id: "survey",
          label: "What a survey sees",
          hold: 3400,
          caption: "An average score, and not much else.",
          dots: survey.dots(),
          notes: [{ x: 0.26, y: 0.79, text: "Engagement: 72%" }],
        },
        {
          id: "pulse",
          label: "What Pulse sees",
          hold: 6000,
          caption: "How people actually work together: brokers, friction, isolation.",
          dots: network(g, { person: 1, broker: 3, tie: 1, bridge: 3, friction: 4, isolated: 2 }).dots(),
          notes: [
            { x: 0.5, y: 0.3, text: "Hidden broker", align: "center" },
            { x: 0.4, y: 0.66, text: "Friction", align: "center" },
            { x: 0.86, y: 0.82, text: "Isolated", align: "center" },
          ],
        },
      ]
    }

    case "prism": {
      const scattered = new Canvas(g)
      const files: Array<[number, number, number, number]> = [
        [0.12, 0.2, 0.26, 0.34],
        [0.34, 0.26, 0.46, 0.4],
        [0.58, 0.16, 0.7, 0.3],
        [0.76, 0.3, 0.9, 0.44],
        [0.16, 0.5, 0.3, 0.62],
        [0.44, 0.52, 0.56, 0.64],
        [0.66, 0.56, 0.8, 0.7],
        [0.3, 0.7, 0.42, 0.8],
      ]
      files.forEach(([x0, y0, x1, y1], k) => {
        scattered.fill(box(x0, y0, x1, y1), k % 3 === 1 ? 2 : 1, 0.72, 0.1)
        scattered.line(x0 + 0.02, y0 + 0.035, x1 - 0.02, y0 + 0.035, 3, 0, 0.3)
      })
      return [
        {
          id: "scattered",
          label: "Today",
          hold: 3400,
          caption: "People data scattered across files.",
          dots: scattered.dots(),
        },
        {
          id: "prism",
          label: "With Prism",
          hold: 6000,
          caption: "One live source of truth.",
          dots: chart(g, { head: 3, lead: 2, team: 1, kra: 3, joiner: 4, rail: 1 }).dots(),
          notes: [
            { x: 0.88, y: 0.76, text: "New joiner", align: "center" },
            { x: 0.08, y: 0.76, text: "KRAs, live" },
          ],
        },
      ]
    }
  }
}
