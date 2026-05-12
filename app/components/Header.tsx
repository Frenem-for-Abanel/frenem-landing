"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Mail } from "lucide-react"
import { useProduct } from "../context/ProductContext"
import { useContactModal } from "../context/ContactModalContext"
import { smoothScrollTo } from "../utils/smooth-scroll"
import type { ProductTab } from "../context/ProductContext"

export default function Header() {
  const { activeProduct, setActiveProduct } = useProduct()
  const { openModal } = useContactModal()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const handleProductClick = (tab: ProductTab) => {
    setActiveProduct(tab)
  }

  const handleHowClick = (e: React.MouseEvent) => {
    e.preventDefault()
    smoothScrollTo("how")
  }

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-[100] min-w-0 h-16 grid grid-cols-[1fr_auto_1fr] items-center px-3 md:px-8 transition-shadow duration-300 ${
        scrolled ? "shadow-[0_1px_16px_rgba(0,0,0,0.04)]" : ""
      }`}
      style={{
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        background: "rgba(255, 255, 255, 0.78)",
        borderBottom: "1px solid var(--frenem-border)",
      }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex min-w-0 items-center">
        <button
          type="button"
          onClick={() => handleProductClick("build")}
          className="font-logo font-bold text-lg md:text-[22px] tracking-[-0.5px] text-[var(--frenem-ink)] lowercase"
        >
          frenem
        </button>
      </div>

      <div className="flex min-w-0 items-center gap-0.5 bg-[rgba(10,10,10,0.04)] rounded-full p-[2px] md:p-[3px]">
        <button
          type="button"
          onClick={() => handleProductClick("build")}
          className={`font-sans text-xs md:text-sm font-semibold px-2.5 sm:px-3 md:px-[18px] py-1.5 rounded-full transition-all flex items-center gap-1 md:gap-1.5 whitespace-nowrap tracking-[-0.1px] ${
            activeProduct === "build"
              ? "text-[var(--frenem-ink)] bg-[var(--frenem-bg)] shadow-[0_1px_4px_rgba(0,0,0,0.06),0_0_1px_rgba(0,0,0,0.08)]"
              : "text-[var(--frenem-ink-secondary)] hover:text-[var(--frenem-ink)] bg-transparent border-none"
          }`}
        >
          Build
          <span className="font-sans text-[8px] md:text-[9px] font-bold tracking-[0.8px] uppercase text-[var(--frenem-accent)] bg-[var(--frenem-accent-soft)] px-1 md:px-1.5 py-0.5 rounded leading-[1.4]">
            Core
          </span>
        </button>
        <div className="w-px h-4 bg-[rgba(10,10,10,0.1)] mx-0.5 md:mx-1 shrink-0" />
        <button
          type="button"
          onClick={() => handleProductClick("prism")}
          className={`font-sans text-[11px] md:text-xs px-2.5 sm:px-3 md:px-[18px] py-1.5 rounded-full transition-all whitespace-nowrap ${
            activeProduct === "prism"
              ? "text-[var(--frenem-ink)] font-medium bg-[var(--frenem-bg)] shadow-[0_1px_4px_rgba(0,0,0,0.06),0_0_1px_rgba(0,0,0,0.08)]"
              : "text-[var(--frenem-ink-tertiary)] font-normal hover:text-[var(--frenem-ink-secondary)]"
          }`}
        >
          Prism
        </button>
        <button
          type="button"
          onClick={() => handleProductClick("pulse")}
          className={`font-sans text-[11px] md:text-xs px-2.5 sm:px-3 md:px-[18px] py-1.5 rounded-full transition-all whitespace-nowrap ${
            activeProduct === "pulse"
              ? "text-[var(--frenem-ink)] font-medium bg-[var(--frenem-bg)] shadow-[0_1px_4px_rgba(0,0,0,0.06),0_0_1px_rgba(0,0,0,0.08)]"
              : "text-[var(--frenem-ink-tertiary)] font-normal hover:text-[var(--frenem-ink-secondary)]"
          }`}
        >
          Pulse
        </button>
      </div>

      <div className="flex min-w-0 items-center justify-end gap-3 md:gap-6">
        {activeProduct === "build" && (
          <a
            href="#how"
            onClick={handleHowClick}
            className="hidden md:block font-sans text-[13px] font-normal text-[var(--frenem-ink-secondary)] hover:text-[var(--frenem-ink)] transition-colors"
          >
            How it works
          </a>
        )}
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
