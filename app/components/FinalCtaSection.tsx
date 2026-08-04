"use client"

import Reveal from "./Reveal"
import { useContactModal, type ContactModalMode } from "../context/ContactModalContext"
import type { ReactNode } from "react"

interface FinalCtaSectionProps {
  label?: string
  title: ReactNode
  subtitle: string
  buttonText?: string
  sectionName?: string
  sectionNum?: string
  modalMode?: ContactModalMode
}

export default function FinalCtaSection({
  label = "Get Started",
  title,
  subtitle,
  buttonText = "Talk to us →",
  sectionName = "Contact",
  sectionNum = "09",
  modalMode = "default",
}: FinalCtaSectionProps) {
  const { openModal } = useContactModal()

  return (
    <section
      className="relative overflow-hidden bg-[var(--frenem-bg)] px-0 py-16 text-left md:py-[120px] md:pb-24 md:pt-40"
      data-section-name={sectionName}
      data-section-num={sectionNum}
    >
      <div className="container-v2">
        <Reveal>
          <div className="frenem-section-label mb-6 md:mb-10">{label}</div>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mb-10 max-w-[1100px] font-sans text-[clamp(32px,9vw,132px)] font-semibold leading-[0.95] tracking-[-0.04em] text-[var(--frenem-ink)] md:mb-16">
            {title}
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="grid grid-cols-1 items-end gap-8 border-t border-[var(--frenem-border)] pt-6 md:gap-10 md:pt-8 lg:grid-cols-2 lg:gap-16">
            <p className="max-w-[480px] font-sans text-base font-normal leading-relaxed text-[var(--frenem-ink-secondary)] md:text-lg">
              {subtitle}
            </p>
            <div className="lg:justify-self-end">
              <button
                type="button"
                onClick={() => openModal(modalMode)}
                className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border-none bg-[var(--frenem-ink)] px-7 py-3.5 font-sans text-[15px] font-medium text-[var(--frenem-bg)] transition-all duration-300 hover:bg-[var(--frenem-accent)] hover:translate-y-[-2px] md:py-4"
              >
                {buttonText}
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
