"use client"

import Reveal from "../Reveal"
import ContactCta from "../ContactCta"
import { Section, SectionLabel } from "../Section"

const rowsTraditional = [
  { label: "Timeline", value: "6 months" },
  { label: "Cost", value: "Six figures, USD" },
  { label: "Deliverable", value: "Slide deck" },
  { label: "After they leave", value: "It collects dust" },
]

const rowsFrenem = [
  { label: "Timeline", value: "8 weeks", highlight: true },
  { label: "Cost", value: "A fraction", highlight: true },
  { label: "Deliverable", value: "A live operating system", highlight: false },
  { label: "After we leave", value: "Your team uses it daily", highlight: false },
]

export default function PositioningSection() {
  return (
    <Section soft className="md:py-[180px]">
      <Reveal>
        <SectionLabel>Positioning</SectionLabel>
      </Reveal>
      <Reveal delay={0.05}>
        <p className="type-display-3 mb-10 max-w-[1000px] md:mb-16 lg:mb-20">
          The design that big consulting firms deliver in six months and six figures.{" "}
          <em>Done in weeks.</em>
        </p>
      </Reveal>

      <div className="mb-10 grid grid-cols-1 gap-4 md:mb-14 md:gap-6 lg:grid-cols-2">
        <Reveal delay={0.08}>
          <div className="h-full rounded-2xl border border-line-strong bg-paper px-5 py-6 md:px-9 md:py-9">
            <div className="mb-6 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-ink-tertiary">
              Traditional consulting
            </div>
            {rowsTraditional.map((row) => (
              <div
                key={row.label}
                className="grid grid-cols-[1fr_auto] gap-4 border-b border-line py-4 font-sans text-[15px] last:border-b-0"
              >
                <span className="text-ink-secondary">{row.label}</span>
                <span className="text-right font-semibold text-ink">{row.value}</span>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="h-full rounded-2xl border border-ink bg-ink px-5 py-6 text-paper md:px-9 md:py-9">
            <div className="mb-6 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-(--tint-bright)">
              Frenem Build
            </div>
            {rowsFrenem.map((row) => (
              <div
                key={row.label}
                className="grid grid-cols-[1fr_auto] gap-4 border-b border-white/10 py-4 font-sans text-[15px] last:border-b-0"
              >
                <span className="text-white/60">{row.label}</span>
                <span
                  className={`text-right font-semibold ${
                    row.highlight ? "text-(--tint-bright)" : "text-paper"
                  }`}
                >
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.12}>
        <div className="grid grid-cols-1 items-end gap-8 border-t border-line pt-6 md:gap-10 md:pt-8 lg:grid-cols-2 lg:gap-16">
          <p className="max-w-[480px] font-sans text-base font-normal leading-relaxed text-ink-secondary md:text-lg">
            Same rigour. Fraction of the time and cost. No slide decks that collect dust. A live
            system your team actually uses.
          </p>
          <div className="lg:justify-self-end">
            <ContactCta mode="assessment">Book a Sprint →</ContactCta>
          </div>
        </div>
      </Reveal>
    </Section>
  )
}
