"use client"

import { type ReactNode } from "react"
import { MotionConfig } from "framer-motion"
import { ContactModalProvider } from "./ContactModalContext"

export function Providers({ children }: { children: ReactNode }) {
  return (
    // reducedMotion="user" strips transform/layout animation for users who
    // prefer reduced motion, while keeping gentle opacity fades.
    <MotionConfig reducedMotion="user">
      <ContactModalProvider>{children}</ContactModalProvider>
    </MotionConfig>
  )
}
