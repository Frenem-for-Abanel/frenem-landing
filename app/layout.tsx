import "./globals.css"
import type { Metadata, Viewport } from "next"
import { Archivo, League_Spartan } from "next/font/google"
import { Toaster } from "sonner"
import type React from "react"
import type { CSSProperties } from "react"
import { Providers } from "./context/Providers"
import Header from "./components/Header"
import Footer from "./components/Footer"
import ContactModal from "./components/contact/ContactModal"
import JsonLd from "./components/JsonLd"
import { HOME_DESCRIPTION, HOME_TITLE } from "./utils/seo"
import { SITE_NAME, SITE_URL } from "./utils/site"
import { siteGraph } from "./utils/structured-data"

const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined
const bingVerification = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION || undefined

/** One variable grotesk for everything: weight and width do the hierarchy. */
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
})

/**
 * Headlines skip next/font's body-tuned fallback for ones sized to the wide
 * ExtraBold cut (globals.css), so they wrap the same once Archivo arrives.
 */
const displayFont = {
  "--font-archivo-display": `${archivo.style.fontFamily.split(",")[0]}, "Archivo Display Fallback", "Archivo Display Fallback Roboto"`,
} as CSSProperties

const leagueSpartan = League_Spartan({
  subsets: ["latin"],
  variable: "--font-league-spartan",
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: HOME_TITLE,
    template: "%s | Frenem",
  },
  description: HOME_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "business",
  formatDetection: { telephone: false, email: false, address: false },
  robots: {
    index: true,
    follow: true,
    // Let search and Discover show large image cards and full snippets.
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  alternates: {
    types: { "application/rss+xml": [{ url: "/engineering/feed.xml", title: "Frenem Engineering" }] },
  },
  openGraph: {
    siteName: SITE_NAME,
    type: "website",
    locale: "en_GB",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
  },
  ...(googleVerification || bingVerification
    ? {
        verification: {
          ...(googleVerification ? { google: googleVerification } : {}),
          ...(bingVerification ? { other: { "msvalidate.01": bingVerification } } : {}),
        },
      }
    : {}),
}

export const viewport: Viewport = {
  themeColor: "#151515",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body
        style={displayFont}
        className={`${archivo.variable} ${leagueSpartan.variable} min-h-screen bg-paper font-sans text-ink antialiased`}
      >
        <JsonLd data={siteGraph()} />
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
