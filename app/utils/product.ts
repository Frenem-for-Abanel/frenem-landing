export type ProductKey = "pulse" | "build" | "prism"

export const PRODUCTS: ProductKey[] = ["pulse", "build", "prism"]

export const PRODUCT_LABELS: Record<ProductKey, string> = {
  pulse: "Pulse",
  build: "Build",
  prism: "Prism",
}

/** Derive the active product from a pathname, e.g. "/pulse" or "/build#how". */
export function productFromPathname(pathname: string): ProductKey | null {
  const segment = pathname.split("/").filter(Boolean)[0]?.toLowerCase()
  if (segment === "pulse" || segment === "build" || segment === "prism") {
    return segment
  }
  return null
}
