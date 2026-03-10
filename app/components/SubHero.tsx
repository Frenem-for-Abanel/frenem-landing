"use client"

import { motion } from "framer-motion"
import { useContactModal } from "../context/ContactModalContext"

interface SubHeroProps {
  label: string
  title: React.ReactNode
  subtitle: string
  ctaText?: string
}

export default function SubHero({
  label,
  title,
  subtitle,
  ctaText = "Get started",
}: SubHeroProps) {
  const { openModal } = useContactModal()

  return (
    <section className="min-h-[80vh] flex flex-col justify-center py-[140px] px-8 md:py-[140px] md:px-8 max-w-[720px] mx-auto">
      <motion.div
        className="font-sans text-[15px] font-medium tracking-[2.5px] uppercase text-[#b8860b] mb-7"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.15 }}
      >
        {label}
      </motion.div>
      <motion.h1
        className="font-serif text-[clamp(48px,6.5vw,76px)] font-normal leading-[1.08] tracking-[-1.5px] mb-8 text-[#1a1a18]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        {title}
      </motion.h1>
      <motion.p
        className="font-serif text-2xl font-normal text-[#6b6860] max-w-[500px] leading-[1.55] mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.45 }}
      >
        {subtitle}
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <button
          type="button"
          onClick={openModal}
          className="font-sans text-[17px] font-medium py-4 px-9 rounded-[980px] bg-[#1a1a18] text-[#f6f4f0] hover:opacity-85 transition-opacity"
        >
          {ctaText}
        </button>
      </motion.div>
    </section>
  )
}
