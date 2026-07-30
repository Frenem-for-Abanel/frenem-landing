"use client"

import type { ReactNode } from "react"
import Reveal from "./Reveal"

interface Feature {
  num: string
  title: string
  description: string
}

interface FeatureListSectionProps {
  label: string
  heading: ReactNode
  features: Feature[]
  sectionName?: string
  sectionNum?: string
}

export default function FeatureListSection({
  label,
  heading,
  features,
  sectionName = "Features",
  sectionNum = "02",
}: FeatureListSectionProps) {
  return (
    <section
      className="relative overflow-hidden bg-[var(--frenem-bg-soft)] py-16 md:py-[140px]"
      data-section-name={sectionName}
      data-section-num={sectionNum}
    >
      <div className="container-v2">
        <Reveal>
          <div className="frenem-section-label">{label}</div>
        </Reveal>
        <Reveal delay={0.04}>
          <h2 className="mb-10 max-w-[900px] font-sans text-[clamp(28px,5vw,72px)] font-semibold leading-none tracking-[-0.03em] md:mb-14">
            {heading}
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 border-l border-t border-[var(--frenem-border-strong)] md:grid-cols-2">
          {features.map((feature, i) => (
            <Reveal key={feature.title} delay={0.03 * i}>
              <div className="flex flex-col gap-3 border-r border-b border-[var(--frenem-border-strong)] bg-[var(--frenem-bg)] p-6 transition-colors duration-300 hover:bg-[var(--frenem-bg-soft)] md:gap-4 md:p-10">
                <span className="font-sans text-[13px] font-medium text-[var(--frenem-ink-tertiary)]">{feature.num}</span>
                <h3 className="font-sans text-[20px] font-semibold leading-tight tracking-[-0.02em] md:text-[22px]">{feature.title}</h3>
                <p className="font-sans text-base font-normal leading-relaxed text-[var(--frenem-ink-secondary)]">
                  {feature.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
