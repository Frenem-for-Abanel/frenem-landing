"use client"

import Reveal from "../Reveal"
import { Section, SectionLabel, SectionHeading } from "../Section"

const lenses = [
  {
    num: "01",
    title: "Self",
    description: "How individuals see their own behaviour, habits, and self-regulation at work.",
    accent: false,
  },
  {
    num: "02",
    title: "Subject",
    description:
      "How colleagues actually experience working with a person: the mirror held up to self-perception.",
    accent: false,
  },
  {
    num: "03",
    title: "System",
    description:
      "The conditions people work inside: workload, autonomy, clarity, and whether it feels safe to speak up.",
    accent: false,
  },
  {
    num: "04 · The differentiator",
    title: "Dyad",
    description:
      "The energy or friction inside specific working relationships. The lens that makes the invisible network visible.",
    accent: true,
  },
] as const

export default function LensesSection() {
  return (
    <Section>
      <Reveal>
        <SectionLabel>What Pulse Measures</SectionLabel>
      </Reveal>
      <Reveal delay={0.04}>
        <SectionHeading className="mb-10 max-w-[900px] md:mb-[72px]">
          Four lenses. One <em>diagnostic.</em>
        </SectionHeading>
      </Reveal>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-12 lg:grid-cols-4 lg:gap-x-10 lg:gap-y-12">
        {lenses.map((lens, i) => (
          <Reveal key={lens.title} delay={0.05 * i}>
            <div
              className={`h-full border-t pt-6 md:pt-7 ${
                lens.accent
                  ? "border-(--tint-bright) bg-gradient-to-b from-(--tint-soft) to-transparent px-4 -mx-4 rounded-b-xl"
                  : "border-line-strong"
              }`}
            >
              <div
                className={`mb-4 font-sans text-[13px] font-medium ${
                  lens.accent ? "text-(--tint-ink)" : "text-ink-tertiary"
                }`}
              >
                {lens.num}
              </div>
              <h3 className="mb-3 font-sans text-[20px] font-semibold leading-tight tracking-[-0.02em] md:text-[22px]">
                {lens.title}
              </h3>
              <p className="font-sans text-[15px] leading-relaxed text-ink-secondary">
                {lens.description}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
