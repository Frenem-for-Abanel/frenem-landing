"use client"

import type { ComponentType } from "react"
import Reveal from "../Reveal"
import { Section, SectionLabel, SectionHeading } from "../Section"
import {
  OrgChartVignette,
  KraVignette,
  ReviewCycleVignette,
  MoonshotVignette,
  WhistleblowerVignette,
  AuditTrailVignette,
} from "./PrismVignettes"

interface Feature {
  num: string
  title: string
  description: string
  Vignette: ComponentType
}

const features: Feature[] = [
  {
    num: "01",
    title: "Dynamic org charts",
    description:
      "Live org charts and reporting chains that update as your team grows. Always current, always visible. No more quarterly PowerPoint archaeology.",
    Vignette: OrgChartVignette,
  },
  {
    num: "02",
    title: "Transparent KRAs, KPIs, and responsibilities",
    description:
      "Everyone knows what they own, what they're measured on, and what success looks like in their role. Clarity as a default, not an annual exercise.",
    Vignette: KraVignette,
  },
  {
    num: "03",
    title: "Seamless performance review cycles",
    description:
      "From goal setting through to reviews. A complete, continuous cycle that doesn't live in spreadsheets, and doesn't stall waiting for HR to chase.",
    Vignette: ReviewCycleVignette,
  },
  {
    num: "04",
    title: "Employee-driven innovation",
    description:
      "Moonshot idea submissions that give every person in the company a voice in shaping what comes next. Good ideas stop dying in inboxes.",
    Vignette: MoonshotVignette,
  },
  {
    num: "05",
    title: "Secure whistleblower channel",
    description:
      "A safe, anonymous channel for raising concerns. Built in, not bolted on, because trust infrastructure belongs inside the operating system.",
    Vignette: WhistleblowerVignette,
  },
  {
    num: "06",
    title: "Edit histories and audit trails",
    description:
      "Every change tracked. Full transparency for governance, compliance, and peace of mind. The record keeps itself.",
    Vignette: AuditTrailVignette,
  },
]

export default function FeatureWalkthrough() {
  return (
    <Section soft>
      <Reveal>
        <SectionLabel>What Prism Does</SectionLabel>
      </Reveal>
      <Reveal delay={0.04}>
        <SectionHeading className="mb-10 max-w-[900px] md:mb-16">
          Clarity across your <em>entire</em> organisation.
        </SectionHeading>
      </Reveal>

      <div>
        {features.map((feature, i) => {
          const flip = i % 2 === 1
          return (
            <Reveal key={feature.title} delay={0.04}>
              <div
                className={`grid grid-cols-1 items-center gap-6 border-t border-line-strong py-10 md:gap-14 md:py-14 lg:grid-cols-2 ${
                  i === features.length - 1 ? "border-b" : ""
                }`}
              >
                <div className={`min-w-0 ${flip ? "lg:order-2" : ""}`}>
                  <span className="mb-3 block font-sans text-[13px] font-medium text-(--tint-ink)">
                    {feature.num}
                  </span>
                  <h3 className="mb-4 font-sans text-[22px] font-semibold leading-[1.15] tracking-[-0.02em] md:text-[28px]">
                    {feature.title}
                  </h3>
                  <p className="max-w-[480px] font-sans text-base leading-relaxed text-ink-secondary md:text-[17px]">
                    {feature.description}
                  </p>
                </div>
                <div
                  className={`w-full max-w-[380px] justify-self-center lg:justify-self-auto ${
                    flip ? "lg:order-1 lg:justify-self-start" : "lg:justify-self-end"
                  }`}
                >
                  <feature.Vignette />
                </div>
              </div>
            </Reveal>
          )
        })}
      </div>
    </Section>
  )
}
