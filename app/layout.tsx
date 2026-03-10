import "./globals.css"
import { League_Spartan, Instrument_Serif, DM_Sans } from "next/font/google"
import { Providers } from "./context/Providers"
import Header from "./components/Header"
import Footer from "./components/Footer"
import ContactModal from "./components/ContactModal"
import { Toaster } from "sonner"
import type React from "react"

const leagueSpartan = League_Spartan({
  subsets: ["latin"],
  variable: "--font-logo",
})
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-serif",
})
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata = {
  title: "Frenem | Organisation Design for Scale",
  description: "Build an organisation that scales beyond you. Clarity in roles, decisions, and leadership.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="light">
      <body
        className={`${instrumentSerif.variable} ${leagueSpartan.variable} ${dmSans.variable} ${instrumentSerif.className} min-h-screen bg-[#f6f4f0] text-[#1a1a18]`}
      >
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
          <ContactModal />
        </Providers>
        <Toaster position="top-center" />
      </body>
    </html>
  )
}

