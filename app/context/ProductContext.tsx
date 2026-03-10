"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

export type ProductTab = "build" | "prism" | "pulse"

type ProductContextType = {
  activeProduct: ProductTab
  setActiveProduct: (tab: ProductTab) => void
}

const ProductContext = createContext<ProductContextType | null>(null)

export function ProductProvider({ children }: { children: ReactNode }) {
  const [activeProduct, setActiveProductState] = useState<ProductTab>("build")

  const setActiveProduct = useCallback((tab: ProductTab) => {
    setActiveProductState(tab)
    window.scrollTo({ top: 0, behavior: "instant" })
  }, [])

  return (
    <ProductContext.Provider value={{ activeProduct, setActiveProduct }}>
      {children}
    </ProductContext.Provider>
  )
}

export function useProduct() {
  const ctx = useContext(ProductContext)
  if (!ctx) throw new Error("useProduct must be used within ProductProvider")
  return ctx
}
