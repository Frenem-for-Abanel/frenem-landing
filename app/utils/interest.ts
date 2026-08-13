import type { ProductKey } from "./product"

export const INTEREST_BY_PRODUCT = {
  build: "Build · Org Design Sprint",
  prism: "Prism · Employee Management",
  pulse: "Pulse · Relational Diagnostics",
} as const satisfies Record<ProductKey, string>

export function getInterestForProduct(product: ProductKey | null): string {
  return product ? INTEREST_BY_PRODUCT[product] : ""
}
