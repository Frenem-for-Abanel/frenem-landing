import type { ProductTab } from "../context/ProductContext"

export const INTEREST_BY_PRODUCT = {
  build: "Build · Org Design Sprint",
  prism: "Prism · Employee Management",
  pulse: "Pulse · Relational Diagnostics",
} as const satisfies Record<ProductTab, string>

export function getInterestForProduct(product: ProductTab): string {
  return INTEREST_BY_PRODUCT[product]
}
