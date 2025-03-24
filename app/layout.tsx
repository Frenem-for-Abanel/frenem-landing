import "./globals.css"
import { Inter } from "next/font/google"
import Header from "./components/Header"
import Footer from "./components/Footer"
import { Toaster } from "sonner"
import type React from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "frenem | Consulting Reimagined",
  description: "Software and Consulting Converging for Exceptional Outcomes",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="light">
      <body className={`${inter.className} min-h-screen bg-white text-foreground`}>
        <Header />
        <main>{children}</main>
        <Footer />
        <Toaster position="top-center" />
      </body>
    </html>
  )
}

