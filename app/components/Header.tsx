"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { smoothScrollTo } from "../utils/smooth-scroll"

export default function Header() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    smoothScrollTo(id)
  }

  return (
    <motion.header
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-md"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">FRENEM</span>
            <span className="text-2xl font-bold text-[#1e0e62]">FRENEM</span>
          </Link>
        </div>
        <div className="flex gap-x-12">
          <a
            href="#build"
            onClick={(e) => handleNavClick(e, "build")}
            className="text-sm font-semibold leading-6 text-[#1e0e62] hover:text-[#1e0e62]/70 transition-colors"
          >
            Build
          </a>
          <a
            href="#prism"
            onClick={(e) => handleNavClick(e, "prism")}
            className="text-sm font-semibold leading-6 text-[#1e0e62] hover:text-[#1e0e62]/70 transition-colors"
          >
            Prism
          </a>
          <a
            href="#pulse"
            onClick={(e) => handleNavClick(e, "pulse")}
            className="text-sm font-semibold leading-6 text-[#1e0e62] hover:text-[#1e0e62]/70 transition-colors"
          >
            Pulse
          </a>
        </div>
        <div className="flex flex-1 justify-end">
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, "contact")}
            className="rounded-full px-4 py-2 bg-[#1e0e62] text-white text-sm font-medium hover:bg-[#1e0e62]/90 transition-colors"
          >
            Contact Us
          </a>
        </div>
      </nav>
    </motion.header>
  )
}

