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
}

export default function FeatureListSection({ label, heading, features }: FeatureListSectionProps) {
  return (
    <section
      className="relative overflow-hidden bg-[var(--frenem-bg-soft)] py-[140px]"
      data-section-name="Features"
      data-section-num="02"
    >
      <div className="container-v2">
        <Reveal>
          <div className="frenem-section-label">{label}</div>
        </Reveal>
        <Reveal delay={0.04}>
          <h2 className="mb-14 max-w-[900px] font-sans text-[clamp(36px,5vw,72px)] font-semibold leading-none tracking-[-0.03em]">
            {heading}
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 border-l border-t border-[var(--frenem-border-strong)] md:grid-cols-2">
          {features.map((feature, i) => (
            <Reveal key={feature.title} delay={0.03 * i}>
              <div className="flex flex-col gap-4 border-r border-b border-[var(--frenem-border-strong)] bg-[var(--frenem-bg)] p-10 transition-colors duration-300 hover:bg-[var(--frenem-bg-soft)]">
                <span className="font-sans text-[13px] font-medium text-[var(--frenem-ink-tertiary)]">{feature.num}</span>
                <h3 className="font-sans text-[22px] font-semibold leading-tight tracking-[-0.02em]">{feature.title}</h3>
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
