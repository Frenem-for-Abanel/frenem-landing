"use client"

import Reveal from "../Reveal"
import { Section, SectionLabel, SectionHeading } from "../Section"

const items = [
  {
    title: "No surveillance",
    description:
      "Pulse never reads email, calendars, or chat. Every data point is a question someone chose to answer.",
  },
  {
    title: "Thresholds, enforced",
    description:
      "Team and relationship data stays hidden unless enough people respond. Below the threshold, it is not shown to anyone.",
  },
  {
    title: "Reports stay in their lane",
    description:
      "Individual reports go to the individual alone. Leadership sees systems and patterns, never names.",
  },
] as const

/** Dark band: privacy is the buying objection, so it gets its own moment. */
export default function PrivacySection() {
  return (
    <Section dark>
      <Reveal>
        <SectionLabel>Privacy by Design</SectionLabel>
      </Reveal>
      <Reveal delay={0.04}>
        <SectionHeading className="mb-6 max-w-[820px] text-paper">
          Safe to answer <em>honestly.</em>
        </SectionHeading>
      </Reveal>
      <Reveal delay={0.06}>
        <p className="mb-10 max-w-[560px] font-sans text-lg leading-snug text-white/70 md:mb-16 md:text-xl">
          Honest answers are the whole product. Pulse only works if every person trusts where
          their words go, so the guarantees are structural, not policy.
        </p>
      </Reveal>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-12">
        {items.map((item, i) => (
          <Reveal key={item.title} delay={0.05 * i}>
            <div className="border-t border-(--tint-bright) pt-5 md:pt-6">
              <h3 className="mb-3 font-sans text-lg font-semibold tracking-[-0.01em] text-paper">
                {item.title}
              </h3>
              <p className="font-sans text-[15px] leading-relaxed text-white/60">
                {item.description}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
