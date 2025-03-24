"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { smoothScrollTo } from "../utils/smooth-scroll"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024) // 1024px is the lg breakpoint
    }
    
    // Initial check
    checkMobile()
    
    // Add event listener
    window.addEventListener('resize', checkMobile)
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    setIsOpen(false)
    
    // Determine scroll target based on device and clicked link
    const scrollTarget = isMobile ? id.toLowerCase() : "products"
    
    setTimeout(() => {
      smoothScrollTo(scrollTarget)
    }, 200)
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
            <span className="sr-only">frenem</span>
            <span className="font-['League_Spartan'] text-3xl font-black tracking-[-0.05em]">frenem</span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden lg:flex gap-x-12">
          <a
            href="#build"
            onClick={(e) => handleNavClick(e, "build")}
            className="text-xl font-semibold leading-6 text-[#1e0e62] hover:text-[#1e0e62]/70 transition-colors"
          >
            Build
          </a>
          <a
            href="#prism"
            onClick={(e) => handleNavClick(e, "prism")}
            className="text-xl font-semibold leading-6 text-[#1e0e62] hover:text-[#1e0e62]/70 transition-colors"
          >
            Prism
          </a>
          <a
            href="#pulse"
            onClick={(e) => handleNavClick(e, "pulse")}
            className="text-xl font-semibold leading-6 text-[#1e0e62] hover:text-[#1e0e62]/70 transition-colors"
          >
            Pulse
          </a>
        </div>
        
        {/* Desktop Contact Button */}
        <div className="hidden lg:flex flex-1 justify-end">
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, "contact")}
            className="rounded-full px-4 py-2 bg-[#1e0e62] text-white text-sm font-medium hover:bg-[#1e0e62]/90 transition-colors"
          >
            Contact Us
          </a>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="p-2 text-[#1e0e62]"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
          >
            <span className="sr-only">Toggle menu</span>
            {!isOpen ? (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-white border-t border-gray-200"
          >
            <div className="space-y-1 px-4 pb-4 pt-2">
              <a
                href="#build"
                onClick={(e) => handleNavClick(e, "build")}
                className="block py-2 text-base font-semibold text-[#1e0e62] hover:text-[#1e0e62]/70 transition-colors"
              >
                Build
              </a>
              <a
                href="#prism"
                onClick={(e) => handleNavClick(e, "prism")}
                className="block py-2 text-base font-semibold text-[#1e0e62] hover:text-[#1e0e62]/70 transition-colors"
              >
                Prism
              </a>
              <a
                href="#pulse"
                onClick={(e) => handleNavClick(e, "pulse")}
                className="block py-2 text-base font-semibold text-[#1e0e62] hover:text-[#1e0e62]/70 transition-colors"
              >
                Pulse
              </a>
              <a
                href="#contact"
                onClick={(e) => handleNavClick(e, "contact")}
                className="block py-2 text-base font-semibold text-[#1e0e62] hover:text-[#1e0e62]/70 transition-colors"
              >
                Contact Us
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

