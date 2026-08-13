import "./globals.css"
import type { Metadata } from "next"
import { Fraunces, Inter, League_Spartan } from "next/font/google"
import { Toaster } from "sonner"
import type React from "react"
import { Providers } from "./context/Providers"
import Header from "./components/Header"
import Footer from "./components/Footer"
import ScrollProgressBar from "./components/ScrollProgressBar"
import ContactModal from "./components/contact/ContactModal"
import { SITE_NAME, SITE_URL } from "./utils/site"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["SOFT", "WONK", "opsz"],
  variable: "--font-fraunces",
})

const leagueSpartan = League_Spartan({
  subsets: ["latin"],
  variable: "--font-league-spartan",
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Frenem | Organisation clarity — diagnose, design, operate",
    template: "%s | Frenem",
  },
  description:
    "Frenem is a clarity suite for scaling organisations. Pulse maps how people actually work together, Build designs the structure your strategy needs, and Prism keeps it current.",
  openGraph: {
    siteName: SITE_NAME,
    type: "website",
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
  },
}

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  description:
    "Organisation consulting and software: relational diagnostics (Pulse), organisation design sprints (Build), and employee management (Prism).",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Bangalore",
    addressCountry: "IN",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-GB">
      <body
        className={`${inter.variable} ${fraunces.variable} ${leagueSpartan.variable} min-h-screen bg-paper font-sans text-ink antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
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
