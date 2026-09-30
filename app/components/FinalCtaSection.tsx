"use client"

import type { ReactNode } from "react"
import Reveal from "./Reveal"
import ContactCta from "./ContactCta"
import SplitText from "./motion/SplitText"
import Parallax from "./motion/Parallax"
import FieldBackdrop from "./motion/FieldBackdrop"
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

/**
 * Closing call to action on the page's pastel field, with the three block
 * shapes turning slowly as it scrolls past.
 */
export default function FinalCtaSection({
  label = "Get started",
  title,
  subtitle,
  buttonText = "Talk to us",
  modalMode = "default",
  secondaryButtonText,
  secondaryModalMode = "default",
}: FinalCtaSectionProps) {
  return (
    <section className="relative overflow-clip py-24 md:py-40">
      <FieldBackdrop className="bg-(--tint-soft)" origin="100% 100%" />
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <Parallax y={[80, -80]} rotate={[0, 90]} className="absolute right-[6%] top-16 hidden md:block">
          <div className="h-40 w-40 bg-(--tint-bright) md:h-64 md:w-64" />
        </Parallax>
        <Parallax y={[140, -40]} className="absolute right-[30%] -bottom-24 hidden md:block">
          <div className="h-56 w-56 rounded-full bg-paper/70" />
        </Parallax>
        <Parallax y={[40, -120]} rotate={[-30, 20]} className="absolute bottom-10 right-[5%] hidden md:block">
          <div className="h-10 w-36 rounded-full bg-(--tint-deep) md:h-14 md:w-52" />
        </Parallax>
      </div>

      <div className="container-site relative">
        <Reveal>
          <p className="type-kicker flex items-center gap-3 text-ink-secondary">
            <span aria-hidden className="h-3 w-3 rounded-full bg-ink" />
            {label}
          </p>
        </Reveal>
        <SplitText as="h2" className="type-display-1 mt-8 max-w-[11ch] md:mt-10">
          {title}
        </SplitText>
        <Reveal delay={0.15}>
          <div className="mt-12 grid grid-cols-1 gap-10 md:mt-16 lg:grid-cols-12 lg:items-end">
            <p className="type-lead max-w-[480px] text-ink-secondary lg:col-span-6">{subtitle}</p>
            <div className="flex w-full flex-col items-stretch gap-5 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-8 lg:col-span-6 lg:justify-self-start">
              <ContactCta mode={modalMode} className="w-full bg-ink sm:w-auto">
                {buttonText}
              </ContactCta>
              {secondaryButtonText ? (
                <ContactCta mode={secondaryModalMode} variant="text">
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
