"use client"

import { Plus } from "lucide-react"
import Reveal from "./Reveal"
import { Section, SectionLabel, SectionHeading } from "./Section"

export interface FaqItem {
  question: string
  answer: string
}

/** Native details/summary FAQ: zero JS to operate, styled to the system. */
export default function FaqSection({
  label = "Questions",
  heading,
  items,
}: {
  label?: string
  heading: React.ReactNode
  items: FaqItem[]
}) {
  return (
    <Section soft>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <Reveal>
          <SectionLabel>{label}</SectionLabel>
          <SectionHeading size={3}>{heading}</SectionHeading>
        </Reveal>

        <div>
          {items.map((item, i) => (
            <Reveal key={item.question} delay={0.04 * i}>
              <details className="group border-t border-line-strong last:border-b">
                <summary className="flex min-h-11 items-center justify-between gap-6 py-5 font-sans text-base font-semibold tracking-[-0.01em] text-ink transition-colors hover:text-(--tint-ink) md:py-6 md:text-lg">
                  {item.question}
                  <Plus
                    aria-hidden
                    className="h-5 w-5 shrink-0 text-ink-tertiary transition-transform duration-300 group-open:rotate-45"
                    strokeWidth={1.8}
                  />
                </summary>
                <p className="max-w-[560px] pb-6 font-sans text-[15px] leading-relaxed text-ink-secondary md:pb-7">
                  {item.answer}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  )
}
