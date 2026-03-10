"use client"

import Reveal from "./Reveal"

interface Feature {
  num: string
  title: string
  description: string
}

interface FeatureListSectionProps {
  label: string
  heading: string
  features: Feature[]
}

export default function FeatureListSection({ label, heading, features }: FeatureListSectionProps) {
  return (
    <section className="py-[100px] pb-[140px]">
      <div className="container-v2">
        <Reveal>
          <div className="font-sans text-sm font-medium tracking-[2.5px] uppercase text-[#b8860b] mb-5">
            {label}
          </div>
        </Reveal>
        <Reveal delay={0.04}>
          <h2 className="font-serif text-[clamp(36px,5vw,56px)] font-normal leading-[1.12] tracking-[-1px] mb-12 text-[#1a1a18]">
            {heading}
          </h2>
        </Reveal>
        <div className="flex flex-col">
          {features.map((feature, i) => (
            <Reveal key={feature.title} delay={0.04 * (i + 1)}>
              <div className="grid grid-cols-[48px_1fr] gap-6 items-baseline py-9 border-t border-[rgba(26,26,24,0.08)] last:border-b last:border-[rgba(26,26,24,0.08)]">
                <span className="font-sans text-sm font-medium text-[#b8860b]">{feature.num}</span>
                <div>
                  <h3 className="font-serif text-[28px] font-normal leading-[1.3] tracking-[-0.4px] mb-2.5 text-[#1a1a18]">
                    {feature.title}
                  </h3>
                  <p className="font-serif text-xl text-[#6b6860] leading-[1.7] max-w-[540px]">
                    {feature.description}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
