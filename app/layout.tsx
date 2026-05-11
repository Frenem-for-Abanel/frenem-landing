import "./globals.css"
import { League_Spartan, Inter } from "next/font/google"
import { Providers } from "./context/Providers"
import Header from "./components/Header"
import Footer from "./components/Footer"
import ContactModal from "./components/ContactModal"
import ScrollProgressBar from "./components/ScrollProgressBar"
import { Toaster } from "sonner"
import type React from "react"

const leagueSpartan = League_Spartan({
  subsets: ["latin"],
  variable: "--font-logo",
})
const inter = Inter({
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
        className={`${inter.variable} ${leagueSpartan.variable} ${inter.className} min-h-screen bg-[var(--frenem-bg)] text-[var(--frenem-ink)] antialiased`}
      >
        <Providers>
          <Header />
          <ScrollProgressBar />
          <main>{children}</main>
          <Footer />
          <ContactModal />
        </Providers>
        <Toaster position="top-center" />
      </body>
    </html>
  )
}
