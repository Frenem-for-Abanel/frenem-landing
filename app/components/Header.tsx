"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Mail } from "lucide-react"
import { useProduct } from "../context/ProductContext"
import { useContactModal } from "../context/ContactModalContext"
import { smoothScrollTo } from "../utils/smooth-scroll"
import { getHowSectionId } from "../utils/how-section"
import type { ProductTab } from "../context/ProductContext"

function tabClass(active: boolean) {
  return `font-sans text-[11px] md:text-xs min-h-11 md:min-h-0 px-3 sm:px-3 md:px-[18px] py-2.5 md:py-1.5 rounded-full transition-all whitespace-nowrap inline-flex items-center justify-center ${
    active
      ? "text-[var(--frenem-ink)] font-medium bg-white shadow-sm"
      : "text-[var(--frenem-ink-tertiary)] font-normal hover:text-[var(--frenem-ink-secondary)]"
  }`
}

export default function Header() {
  const { activeProduct, setActiveProduct } = useProduct()
  const { openModal } = useContactModal()
  const [scrolledPastHero, setScrolledPastHero] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Trigger the opaque header when scrolled past ~75% of the viewport height
      setScrolledPastHero(window.scrollY > window.innerHeight * 0.75)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll() // Initial check
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleProductClick = (tab: ProductTab) => {
    setActiveProduct(tab)
  }

  const handleHowClick = (e: React.MouseEvent) => {
    e.preventDefault()
    const id = getHowSectionId(activeProduct)
    if (id) smoothScrollTo(id)
  }

  const howSectionId = getHowSectionId(activeProduct)

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-[100] min-w-0 h-16 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-1 px-2.5 sm:px-3 md:gap-0 md:px-8 transition-all duration-500 ${
        scrolledPastHero
          ? "bg-white/90 backdrop-blur-[12px] border-b border-[rgba(10,10,10,0.05)] shadow-[0_1px_16px_rgba(0,0,0,0.02)]"
          : "bg-transparent border-b border-transparent shadow-none"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex min-w-0 items-center">
        <button
          type="button"
          onClick={() => handleProductClick("pulse")}
          className="font-logo font-bold text-base sm:text-lg md:text-[22px] tracking-[-0.5px] text-[var(--frenem-ink)] lowercase truncate"
        >
          frenem
        </button>
      </div>

      <div className="flex min-w-0 max-w-full items-center gap-0.5 rounded-full p-[2px] md:p-[3px] bg-[rgba(10,10,10,0.04)]">
        <button
          type="button"
          onClick={() => handleProductClick("pulse")}
          className={tabClass(activeProduct === "pulse")}
        >
          Pulse
        </button>
        <button
          type="button"
          onClick={() => handleProductClick("build")}
          className={tabClass(activeProduct === "build")}
        >
          Build
        </button>
        <button
          type="button"
          onClick={() => handleProductClick("prism")}
          className={tabClass(activeProduct === "prism")}
        >
          Prism
        </button>
      </div>

      <div className="flex min-w-0 items-center justify-end gap-3 md:gap-6">
        {howSectionId ? (
          <a
            href={`#${howSectionId}`}
            onClick={handleHowClick}
            className="hidden md:block font-sans text-[13px] font-normal text-[var(--frenem-ink-secondary)] hover:text-[var(--frenem-ink)] transition-colors"
          >
            How it works
          </a>
        ) : null}
        <button
          type="button"
          onClick={openModal}
          aria-label="Get in touch"
          className="inline-flex items-center justify-center font-sans text-[13px] font-medium h-11 w-11 shrink-0 rounded-full bg-[var(--frenem-ink)] text-[var(--frenem-bg)] hover:bg-[var(--frenem-accent)] transition-colors md:h-auto md:w-auto md:py-2 md:px-[18px]"
        >
          <Mail className="size-5 md:hidden shrink-0" aria-hidden />
          <span className="hidden md:inline">Get in Touch</span>
        </button>
      </div>
    </motion.header>
  )
}
