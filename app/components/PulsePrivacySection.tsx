"use client"

import Reveal from "./Reveal"

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

export default function PulsePrivacySection() {
  return (
    <section
      className="relative overflow-hidden bg-[var(--frenem-bg)] py-16 md:py-[120px]"
      data-section-name="Privacy"
      data-section-num="06"
    >
      <div className="container-v2">
        <Reveal>
          <div className="frenem-section-label">Privacy by Design</div>
        </Reveal>
        <Reveal delay={0.04}>
          <h2 className="mb-10 max-w-[820px] font-sans text-[clamp(28px,4vw,56px)] font-semibold leading-none tracking-[-0.03em] md:mb-16">
            Safe to answer{" "}
            <em className="font-normal italic text-[var(--frenem-accent)]">honestly.</em>
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-12">
          {items.map((item, i) => (
            <Reveal key={item.title} delay={0.05 * i}>
              <div className="border-t border-[var(--frenem-border-strong)] pt-5 md:pt-6">
                <h3 className="mb-3 font-sans text-lg font-semibold tracking-[-0.01em]">
                  {item.title}
                </h3>
                <p className="font-sans text-[15px] leading-relaxed text-[var(--frenem-ink-secondary)]">
                  {item.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
