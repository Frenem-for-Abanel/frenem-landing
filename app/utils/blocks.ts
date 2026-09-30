/**
 * The block system. Every figure on the site is a fixed set of rectangles
 * whose size, corner radius, rotation, and colour change between layouts:
 * a square rounds into a circle, a circle stretches into a pill, a pill
 * becomes a rail. The same pieces regroup to tell each product's story.
 */
export interface Block {
  x: number
  y: number
  w: number
  h: number
  /** Corner radius in user units. */
  r?: number
  rot?: number
  fill: string
  o?: number
}

// Layout helpers. Coordinates are centres unless noted.
export const square = (cx: number, cy: number, s: number, fill: string, rot = 0, o = 1): Block => ({
  x: cx - s / 2,
  y: cy - s / 2,
  w: s,
  h: s,
  r: 0,
  rot,
  fill,
  o,
})

export const circle = (cx: number, cy: number, d: number, fill: string, o = 1): Block => ({
  x: cx - d / 2,
  y: cy - d / 2,
  w: d,
  h: d,
  r: d / 2,
  rot: 0,
  fill,
  o,
})

/** A rounded rectangle from its top-left corner. */
export const box = (x: number, y: number, w: number, h: number, fill: string, r = 0, o = 1): Block => ({
  x,
  y,
  w,
  h,
  r,
  rot: 0,
  fill,
  o,
})

/** A pill of thickness `t` running from (x1, y1) to (x2, y2). */
export const tie = (x1: number, y1: number, x2: number, y2: number, t: number, fill: string, o = 1): Block => {
  const len = Math.hypot(x2 - x1, y2 - y1)
  const cx = (x1 + x2) / 2
  const cy = (y1 + y2) / 2
  return {
    x: cx - len / 2,
    y: cy - t / 2,
    w: len,
    h: t,
    r: t / 2,
    rot: (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI,
    fill,
    o,
  }
}
