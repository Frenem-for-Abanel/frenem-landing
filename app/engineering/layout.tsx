import { IBM_Plex_Mono } from "next/font/google"
import type React from "react"
import Masthead from "../components/engineering/Masthead"

/**
 * Section chrome for /engineering. The ledger's mono face is loaded here,
 * scoped to the section, so the rest of the site never pays for it.
 */
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
})

export default function EngineeringLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`${plexMono.variable} bg-paper`}>
      <Masthead />
      {children}
    </div>
  )
}
