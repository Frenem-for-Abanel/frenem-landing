"use client"

import type { ReactNode } from "react"
import Reveal from "./Reveal"
import ContactCta from "./ContactCta"
import type { ContactModalMode } from "../context/ContactModalContext"

interface FinalCtaSectionProps {
  label?: string
  title: ReactNode
  subtitle: string
  buttonText?: string
  modalMode?: ContactModalMode
  secondaryButtonText?: string
  secondaryModalMode?: ContactModalMode
}

/** Closing full-bleed CTA with the oversized display headline. */
export default function FinalCtaSection({
  label = "Get Started",
  title,
  subtitle,
  buttonText = "Talk to us →",
  modalMode = "default",
  secondaryButtonText,
  secondaryModalMode = "default",
}: FinalCtaSectionProps) {
  return (
    <section className="relative overflow-hidden bg-paper px-0 py-16 text-left md:py-[120px] md:pb-24 md:pt-40">
      <div className="container-site">
        <Reveal>
          <div className="type-eyebrow mb-6 md:mb-10">{label}</div>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="type-display-1 mb-10 max-w-[1100px] md:mb-16 md:text-[clamp(48px,8.5vw,124px)]">
            {title}
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="grid grid-cols-1 items-end gap-8 border-t border-line pt-6 md:gap-10 md:pt-8 lg:grid-cols-2 lg:gap-16">
            <p className="max-w-[480px] font-sans text-base font-normal leading-relaxed text-ink-secondary md:text-lg">
              {subtitle}
            </p>
            <div className="flex w-full flex-col items-stretch gap-3.5 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:justify-end sm:gap-x-5 lg:justify-self-end">
              <ContactCta mode={modalMode} className="w-full sm:w-auto">
                {buttonText}
              </ContactCta>
              {secondaryButtonText ? (
                <ContactCta
                  mode={secondaryModalMode}
                  variant="text"
                  className="justify-center self-center text-[14px] sm:self-auto sm:text-[15px]"
                >
                  {secondaryButtonText}
                </ContactCta>
              ) : null}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
