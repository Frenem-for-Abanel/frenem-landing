import { renderBrandMark } from "./components/brand-mark"

export const size = { width: 32, height: 32 }
export const contentType = "image/png"

/** Favicon: a tiny relational network mark on the brand ink. */
export default function Icon() {
  return renderBrandMark(32)
}
