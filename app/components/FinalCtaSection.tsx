"use client"

import Reveal from "./Reveal"
import { useContactModal } from "../context/ContactModalContext"

interface FinalCtaSectionProps {
  label?: string
  title: React.ReactNode
  subtitle: string
  buttonText?: string
}

export default function FinalCtaSection({
  label = "Get Started",
  title,
  subtitle,
  buttonText = "Talk to us →",
}: FinalCtaSectionProps) {
  const { openModal } = useContactModal()

  return (
    <section className="py-[140px] pb-[100px] bg-[#1a1a18] text-[#f6f4f0] text-center">
      <div className="container-v2">
        <Reveal>
          <div className="font-sans text-sm font-medium tracking-[2.5px] uppercase text-[#d4a843] mb-5">
            {label}
          </div>
        </Reveal>
        <Reveal delay={0.04}>
          <h2 className="font-serif text-[clamp(38px,5.5vw,60px)] font-normal leading-[1.1] tracking-[-1px] max-w-[580px] mx-auto mb-6">
            {title}
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="font-serif text-[22px] text-[rgba(246,244,240,0.5)] max-w-[440px] mx-auto mb-11 leading-[1.6]">
            {subtitle}
          </p>
        </Reveal>
        <Reveal delay={0.12}>
          <button
            type="button"
            onClick={openModal}
            className="font-sans text-[17px] font-medium py-4 px-9 rounded-[980px] bg-[#f6f4f0] text-[#1a1a18] hover:opacity-90 transition-opacity inline-block"
          >
            {buttonText}
          </button>
        </Reveal>
      </div>
    </section>
  )
}
