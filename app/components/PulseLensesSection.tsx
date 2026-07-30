"use client"

import Reveal from "./Reveal"

const lenses = [
  {
    num: "01",
    title: "Self",
    description:
      "How individuals see their own behaviour, habits, and self-regulation at work.",
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

export default function PulseLensesSection() {
  return (
    <section
      className="relative overflow-hidden bg-[var(--frenem-bg)] py-16 md:py-[140px]"
      data-section-name="Lenses"
      data-section-num="02"
    >
      <div className="container-v2">
        <Reveal>
          <div className="frenem-section-label">What Pulse Measures</div>
        </Reveal>
        <Reveal delay={0.04}>
          <h2 className="mb-10 max-w-[900px] font-sans text-[clamp(28px,5vw,72px)] font-semibold leading-none tracking-[-0.03em] md:mb-[72px]">
            Four lenses. One{" "}
            <em className="font-normal italic text-[var(--frenem-accent)]">diagnostic.</em>
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-12 lg:grid-cols-4 lg:gap-x-10 lg:gap-y-12">
          {lenses.map((lens, i) => (
            <Reveal key={lens.title} delay={0.05 * i}>
              <div
                className={`border-t pt-6 md:pt-7 ${
                  lens.accent
                    ? "border-[var(--frenem-accent)]"
                    : "border-[var(--frenem-border-strong)]"
                }`}
              >
                <div
                  className={`mb-4 font-sans text-[13px] font-medium ${
                    lens.accent
                      ? "text-[var(--frenem-accent)]"
                      : "text-[var(--frenem-ink-tertiary)]"
                  }`}
                >
                  {lens.num}
                </div>
                <h3 className="mb-3 font-sans text-[20px] font-semibold leading-tight tracking-[-0.02em] md:text-[22px]">
                  {lens.title}
                </h3>
                <p className="font-sans text-[15px] leading-relaxed text-[var(--frenem-ink-secondary)]">
                  {lens.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
