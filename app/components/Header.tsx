"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
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
      className={`fixed top-0 left-0 right-0 z-50 h-[52px] grid grid-cols-[1fr_auto_1fr] items-center px-6 md:px-12 transition-all duration-300 ${
        scrolled ? "shadow-[0_1px_12px_rgba(0,0,0,0.04)]" : ""
      }`}
      style={{
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
        background: "rgba(246, 244, 240, 0.88)",
        borderBottom: "1px solid rgba(26, 26, 24, 0.08)",
      }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center">
        <button
          type="button"
          onClick={() => handleProductClick("build")}
          className="font-logo font-bold text-[22px] tracking-[-0.5px] text-[#1a1a18] lowercase"
        >
          frenem
        </button>
      </div>

      <div className="flex items-center gap-1 bg-[rgba(26,26,24,0.04)] rounded-[980px] p-0.5">
        <button
          type="button"
          onClick={() => handleProductClick("build")}
          className={`font-sans text-sm font-semibold px-5 py-1.5 rounded-[980px] transition-all flex items-center gap-1.5 ${
            activeProduct === "build"
              ? "text-[#1a1a18] bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06),0_0_1px_rgba(0,0,0,0.08)]"
              : "text-[#6b6860] hover:text-[#1a1a18]"
          }`}
        >
          Build
          <span className="font-sans text-[8.5px] font-semibold tracking-[0.8px] uppercase text-[#b8860b] bg-[rgba(184,134,11,0.08)] px-1.5 py-0.5 rounded">
            Core
          </span>
        </button>
        <div className="w-px h-4 bg-[rgba(26,26,24,0.1)] mx-1 flex-shrink-0" />
        <button
          type="button"
          onClick={() => handleProductClick("prism")}
          className={`font-sans text-xs px-5 py-1.5 rounded-[980px] transition-all ${
            activeProduct === "prism"
              ? "text-[#1a1a18] font-medium bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06),0_0_1px_rgba(0,0,0,0.08)]"
              : "text-[#9b978f] font-normal hover:text-[#6b6860]"
          }`}
        >
          Prism
        </button>
        <button
          type="button"
          onClick={() => handleProductClick("pulse")}
          className={`font-sans text-xs px-5 py-1.5 rounded-[980px] transition-all ${
            activeProduct === "pulse"
              ? "text-[#1a1a18] font-medium bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06),0_0_1px_rgba(0,0,0,0.08)]"
              : "text-[#9b978f] font-normal hover:text-[#6b6860]"
          }`}
        >
          Pulse
        </button>
      </div>

      <div className="flex items-center justify-end gap-7">
        {activeProduct === "build" && (
          <a
            href="#how"
            onClick={handleHowClick}
            className="hidden md:block font-sans text-[13px] font-normal text-[#6b6860] hover:text-[#1a1a18] transition-colors"
          >
            How it works
          </a>
        )}
        <button
          type="button"
          onClick={openModal}
          className="font-sans text-[13px] font-medium py-1.5 px-4 rounded-[980px] bg-[#1a1a18] text-[#f6f4f0] hover:opacity-85 transition-opacity"
        >
          Get in Touch
        </button>
      </div>
    </motion.header>
  )
}
