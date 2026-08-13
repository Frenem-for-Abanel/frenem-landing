"use client"

import Reveal from "../Reveal"
import { Section, SectionLabel, SectionHeading } from "../Section"

const signals = [
  {
    num: "01",
    title: "Exit risk, visible early",
    description:
      "Strain, silence, and isolation rarely appear alone. Pulse cross-references them to flag likely departures while there is still time to act.",
  },
  {
    num: "02",
    title: "Hidden brokers, surfaced",
    description:
      "The people quietly holding your network together, trusted across teams, absent from every succession plan. Pulse names the single points of failure.",
  },
  {
    num: "03",
    title: "The manager effect, isolated",
    description:
      "When a team struggles, Pulse separates the workload from the manager. So you fix the actual problem, not the visible one.",
  },
  {
    num: "04",
    title: "Cross-functional friction, mapped",
    description:
      "Where collaboration between departments creates energy, and where it drains it. Silos stop being a feeling and become a map.",
  },
]

const mechanics = [
  { stat: "15", label: "questions, tailored by who each person actually works with" },
  { stat: "~5 min", label: "per person, answered on a phone" },
  { stat: "0 logins", label: "one secure link, no survey fatigue" },
]

export default function SignalsSection() {
  return (
    <Section soft>
      <Reveal>
        <SectionLabel>What Pulse Does</SectionLabel>
      </Reveal>
      <Reveal delay={0.04}>
        <SectionHeading className="mb-10 max-w-[900px] md:mb-14">
          The signals standard tools <em>can&apos;t see.</em>
        </SectionHeading>
      </Reveal>

      <div className="grid grid-cols-1 border-l border-t border-line-strong md:grid-cols-2">
        {signals.map((signal, i) => (
          <Reveal key={signal.title} delay={0.03 * i}>
            <div className="flex h-full flex-col gap-3 border-r border-b border-line-strong bg-paper p-6 transition-colors duration-300 hover:bg-paper-soft md:gap-4 md:p-10">
              <span className="font-sans text-[13px] font-medium text-(--tint-ink)">
                {signal.num}
              </span>
              <h3 className="font-sans text-[20px] font-semibold leading-tight tracking-[-0.02em] md:text-[22px]">
                {signal.title}
              </h3>
              <p className="font-sans text-base font-normal leading-relaxed text-ink-secondary">
                {signal.description}
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.14}>
        <div className="grid grid-cols-1 gap-6 border border-t-0 border-line-strong bg-ink p-6 text-paper sm:grid-cols-3 sm:gap-8 md:p-10">
          {mechanics.map((item) => (
            <div key={item.stat} className="flex flex-col gap-1.5">
              <span className="font-display text-[36px] font-semibold leading-none tracking-[-0.02em] text-(--tint-bright) md:text-[44px]">
                {item.stat}
              </span>
              <span className="max-w-[260px] font-sans text-sm leading-snug text-white/65">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </Reveal>
    </Section>
  )
}
