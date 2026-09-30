import { box, circle, square, tie, type Block } from "./blocks"
import { DEEP, GREY, INK, MID, SOFT, WHITE } from "./palette"

/**
 * Block layouts for every figure. Each figure keeps a fixed cast of blocks
 * (connectors first so they draw behind people) and each layout recasts
 * them. Pure data: pages can import it on the server and hand it to client
 * figures.
 */

const hidden = (cx: number, cy: number): Block => ({ x: cx, y: cy, w: 0, h: 0, r: 0, fill: WHITE, o: 0 })

/* ----------------------------------------------------------------------------
 * Shared: the structure (viewBox 480 x 420)
 * Blocks 0-5 are rails, 6-15 are the ten people.
 * -------------------------------------------------------------------------- */

// The structure: founder, three leads, six reports.
const TREE: Record<number, [number, number, number]> = {
  0: [240, 70, 64],
  3: [110, 190, 54],
  2: [240, 190, 54],
  9: [370, 190, 54],
  4: [62, 300, 44],
  1: [142, 300, 44],
  5: [202, 300, 44],
  7: [278, 300, 44],
  6: [338, 300, 44],
  8: [418, 300, 44],
}

function treePeople(fills: { founder: string; lead: string; report: string }): Block[] {
  return Array.from({ length: 10 }, (_, i) => {
    const [x, y, s] = TREE[i]
    const fill = i === 0 ? fills.founder : s === 54 ? fills.lead : fills.report
    return square(x, y, s, fill)
  })
}

const treeRails = (fill: string, o = 1): Block[] => [
  tie(240, 104, 240, 152, 8, fill, o),
  tie(110, 152, 370, 152, 8, fill, o),
  tie(62, 248, 142, 248, 8, fill, o),
  tie(202, 248, 278, 248, 8, fill, o),
  tie(338, 248, 418, 248, 8, fill, o),
  tie(30, 346, 450, 346, 6, fill, 0.25),
]

/* ----------------------------------------------------------------------------
 * Build phases: diagnose, design, deploy (viewBox 480 x 420)
 * -------------------------------------------------------------------------- */

const SCATTER: Array<[number, number]> = [
  [118, 150],
  [72, 214],
  [176, 92],
  [150, 248],
  [96, 312],
  [232, 176],
  [214, 298],
  [66, 110],
  [270, 246],
  [190, 356],
]

const diagnose: Block[] = [
  circle(170, 210, 210, SOFT.sand, 0.9),
  ...[150, 90, 120, 60, 110].map((w, k) => box(318, 118 + k * 44, w, 18, k === 1 ? MID.clay : INK, 9)),
  ...SCATTER.map(([x, y], i) => circle(x, y, i === 0 ? 40 : 32, i % 4 === 0 ? INK : i % 3 === 0 ? MID.clay : WHITE)),
]

export const BUILD_PHASES: Block[][] = [
  diagnose,
  [...treeRails(INK), ...treePeople({ founder: INK, lead: WHITE, report: WHITE })],
  [
    tie(240, 104, 240, 152, 8, INK),
    tie(110, 152, 370, 152, 8, INK),
    tie(62, 248, 142, 248, 8, INK),
    tie(202, 248, 278, 248, 8, INK),
    tie(338, 248, 418, 248, 8, INK),
    box(24, 336, 432, 30, INK, 0),
    ...treePeople({ founder: INK, lead: DEEP.clay, report: MID.clay }),
  ],
]

/* ----------------------------------------------------------------------------
 * Pulse phases: ingest, route, protect, deliver (viewBox 480 x 420)
 * Blocks 0-5 are frames and links, 6-15 are marks and people.
 * -------------------------------------------------------------------------- */

const RING = Array.from({ length: 10 }, (_, i) => {
  const a = (i / 10) * Math.PI * 2 - Math.PI / 2
  return [240 + Math.cos(a) * 158, 210 + Math.sin(a) * 150] as const
})

const ingest: Block[] = [
  box(110, 60, 260, 300, WHITE, 14),
  box(140, 90, 110, 16, INK, 8),
  hidden(240, 210),
  hidden(240, 210),
  hidden(240, 210),
  hidden(240, 210),
  ...Array.from({ length: 10 }, (_, i) => box(140, 128 + i * 21, [180, 150, 196, 120, 170, 140, 188, 110, 160, 132][i], 10, INK, 5, i % 3 === 0 ? 0.85 : 0.3)),
]

const route: Block[] = [
  square(240, 210, 64, INK),
  ...[0, 2, 4, 6, 8].map((i) => tie(240, 210, RING[i][0], RING[i][1], 6, MID.sage)),
  ...RING.map(([x, y], i) => circle(x, y, i % 2 === 0 ? 44 : 38, i % 2 === 0 ? WHITE : INK)),
]

const TEAMS: Array<[number, number]> = [
  [120, 150],
  [168, 190],
  [110, 226],
  [300, 130],
  [350, 170],
  [300, 206],
  [210, 300],
  [262, 322],
  [320, 290],
  [170, 346],
]
const WITHHELD = new Set([2, 9])

const protect: Block[] = [
  box(56, 70, 368, 310, WHITE, 60),
  tie(120, 150, 168, 190, 6, MID.sage),
  tie(300, 130, 350, 170, 6, MID.sage),
  tie(210, 300, 262, 322, 6, MID.sage),
  tie(168, 190, 300, 206, 6, INK, 0.25),
  tie(262, 322, 320, 290, 6, MID.sage),
  ...TEAMS.map(([x, y], i) => circle(x, y, 40, WITHHELD.has(i) ? GREY : i % 3 === 0 ? MID.sage : INK, WITHHELD.has(i) ? 0.5 : 1)),
]

const deliver: Block[] = [
  box(28, 80, 128, 268, WHITE, 12),
  box(176, 80, 128, 268, WHITE, 12),
  box(324, 80, 128, 268, WHITE, 12),
  box(48, 104, 60, 12, INK, 6),
  box(196, 104, 60, 12, INK, 6),
  box(344, 104, 60, 12, INK, 6),
  // Individual report: self vs colleagues bars
  box(48, 150, 88, 14, INK, 7, 0.3),
  box(48, 180, 56, 14, MID.sage, 7),
  box(48, 232, 88, 60, SOFT.sage, 10),
  // Org pulse: a small heatmap
  square(214, 180, 40, SOFT.sage),
  square(266, 180, 40, MID.sage),
  square(214, 232, 40, MID.sage),
  square(266, 232, 40, SOFT.sage),
  // Network map
  circle(360, 186, 36, INK),
  circle(418, 214, 30, INK),
  circle(384, 268, 44, MID.sage),
]

export const PULSE_PHASES: Block[][] = [ingest, route, protect, deliver]

export const PHASE_VIEWBOX = "0 0 480 420"
