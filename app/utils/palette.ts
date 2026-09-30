/**
 * The palette as concrete values, for canvas and SVG fills that animate
 * (interpolation needs real colours, not CSS variables). Mirrors the tokens
 * in app/globals.css; change both together.
 */
export const INK = "#151515"
export const WHITE = "#ffffff"
export const GREY = "#e2e0d9"

/** Soft fields. */
export const SOFT = {
  sand: "#ece5d5",
  clay: "#f0d7c7",
  sage: "#d2e4d7",
  heather: "#dcd8ee",
  mist: "#d3e0e9",
  rose: "#edd4d8",
} as const

/** Mid tones, for shapes on soft fields. */
export const MID = {
  sand: "#c9b287",
  clay: "#d4876a",
  sage: "#7aad93",
  heather: "#948cc9",
  mist: "#7ba0bb",
  rose: "#c68893",
} as const

/** Deep partners, for dark bands and strong marks. */
export const DEEP = {
  sand: "#2d2a22",
  clay: "#5c2419",
  sage: "#1f4636",
  heather: "#2c2758",
  mist: "#1d3548",
  rose: "#582331",
} as const
