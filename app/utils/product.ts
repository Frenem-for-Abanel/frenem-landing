export type ProductKey = "pulse" | "build" | "prism"

export const PRODUCTS: ProductKey[] = ["pulse", "build", "prism"]

export const PRODUCT_LABELS: Record<ProductKey, string> = {
  pulse: "Pulse",
  build: "Build",
  prism: "Prism",
}

/** What each product is, in a few words: shown under the coined names in navigation. */
export const PRODUCT_ROLES: Record<ProductKey, string> = {
  pulse: "Relational diagnostics",
  build: "Organisation design",
  prism: "Operating record",
}

/** Derive the active product from a pathname, e.g. "/pulse" or "/build#how". */
export function productFromPathname(pathname: string): ProductKey | null {
  const segment = pathname.split("/").filter(Boolean)[0]?.toLowerCase()
  if (segment === "pulse" || segment === "build" || segment === "prism") {
    return segment
  }
  return null
}
