import { IBM_Plex_Mono } from "next/font/google"
import type React from "react"
import Masthead from "../components/engineering/Masthead"

/**
 * Section chrome for /engineering. Loads the ledger's mono face here, scoped
 * to the section: the variable overrides Tailwind's `--font-mono` for this
 * subtree only, so `font-mono` resolves to IBM Plex Mono without touching the
 * root layout or global CSS.
 */
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
})

export default function EngineeringLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`${plexMono.variable} bg-paper pt-16`}>
      <Masthead />
      {children}
    </div>
  )
}
