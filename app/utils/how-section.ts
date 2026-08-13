import type { ProductKey } from "./product"

/** Scroll target for product "How it works" sections (unique per product). */
export function getHowSectionId(product: ProductKey | null): "how-build" | "how-pulse" | null {
  if (product === "build") return "how-build"
  if (product === "pulse") return "how-pulse"
  return null
}
