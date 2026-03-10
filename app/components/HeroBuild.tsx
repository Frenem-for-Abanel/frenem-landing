"use client"

import { motion } from "framer-motion"
import { useContactModal } from "../context/ContactModalContext"
import { smoothScrollTo } from "../utils/smooth-scroll"

export default function HeroBuild() {
  const { openModal } = useContactModal()

  const handleHowClick = (e: React.MouseEvent) => {
    e.preventDefault()
    smoothScrollTo("how")
  }

  return (
    <section className="min-h-screen flex flex-col justify-center py-[140px] px-8 md:py-[140px] md:px-8 max-w-[720px] mx-auto">
      <motion.div
        className="font-sans text-[15px] font-medium tracking-[2.5px] uppercase text-[#b8860b] mb-7"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        Frenem Build
      </motion.div>
      <motion.h1
        className="font-serif text-[clamp(48px,6.5vw,76px)] font-normal leading-[1.08] tracking-[-1.5px] mb-8 text-[#1a1a18]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.35 }}
      >
        Build an organisation that scales <em className="italic text-[#b8860b]">beyond you</em>
      </motion.h1>
      <motion.p
        className="font-serif text-2xl font-normal text-[#6b6860] max-w-[500px] leading-[1.55] mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        Clarity in roles, decisions, and leadership. Without losing control. In weeks, not months.
      </motion.p>
      <motion.div
        className="flex flex-col sm:flex-row gap-5 items-start"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.65 }}
      >
        <button
          type="button"
          onClick={openModal}
          className="font-sans text-[17px] font-medium py-4 px-9 rounded-[980px] bg-[#1a1a18] text-[#f6f4f0] hover:opacity-85 transition-opacity"
        >
          Start your sprint
        </button>
        <a
          href="#how"
          onClick={handleHowClick}
          className="font-serif text-xl text-[#6b6860] border-b border-[rgba(26,26,24,0.15)] pb-0.5 hover:text-[#1a1a18] hover:border-[#1a1a18] transition-colors"
        >
          See how it works
        </a>
      </motion.div>
    </section>
  )
}
