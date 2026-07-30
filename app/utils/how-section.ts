import type { ProductTab } from "../context/ProductContext"

/** Scroll target for product "How it works" sections (unique per product). */
export function getHowSectionId(product: ProductTab): "how-build" | "how-pulse" | null {
  if (product === "build") return "how-build"
  if (product === "pulse") return "how-pulse"
  return null
}
