"use client"

import { type ReactNode } from "react"
import { ContactModalProvider } from "./ContactModalContext"
import { ProductProvider } from "./ProductContext"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ProductProvider>
      <ContactModalProvider>{children}</ContactModalProvider>
    </ProductProvider>
  )
}
