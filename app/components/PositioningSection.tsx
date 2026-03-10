"use client"

import Reveal from "./Reveal"
import { useContactModal } from "../context/ContactModalContext"

export default function PositioningSection() {
  const { openModal } = useContactModal()

  return (
    <section className="py-[180px] text-center">
      <div className="container-v2">
        <Reveal>
          <p className="font-serif text-[clamp(34px,4.8vw,52px)] font-normal leading-[1.2] tracking-[-0.8px] max-w-[640px] mx-auto mb-6 text-[#1a1a18]">
            The org design that{" "}
            <span className="relative border-b border-dotted border-[rgba(184,134,11,0.4)] cursor-default group">
              McKinsey, Bain, and BCG
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block font-sans text-xs font-normal text-[rgba(246,244,240,0.7)] bg-[#1a1a18] px-3.5 py-1.5 rounded-lg whitespace-nowrap shadow-[0_4px_16px_rgba(0,0,0,0.12)] pointer-events-none">
                the &quot;MBB&quot; firms
              </span>
            </span>{" "}
            deliver in six months and six figures. <em className="italic text-[#b8860b]">Done in 8 weeks.</em>
          </p>
        </Reveal>
        <Reveal delay={0.04}>
          <p className="font-serif text-[22px] text-[#6b6860] max-w-[460px] mx-auto mb-11 leading-[1.6]">
            Same rigour. Fraction of the time and cost. No slide decks that collect dust. A live system your team
            actually uses.
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <button
            type="button"
            onClick={openModal}
            className="font-sans text-[17px] font-medium py-4 px-9 rounded-[980px] bg-[#1a1a18] text-[#f6f4f0] hover:opacity-85 transition-opacity"
          >
            Book a Sprint
          </button>
        </Reveal>
      </div>
    </section>
  )
}
