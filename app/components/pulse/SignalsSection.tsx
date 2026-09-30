"use client"

import Reveal from "../Reveal"
import { Section, SectionHead } from "../Section"

const signals = [
  {
    title: "Exit risk, visible early",
    description:
      "Strain, silence, and isolation rarely appear alone. Pulse cross-references them to flag likely departures while there is still time to act.",
    shape: "rounded-full",
  },
  {
    title: "Hidden brokers, surfaced",
    description:
      "The people quietly holding your network together, trusted across teams, absent from every succession plan. Pulse names the single points of failure.",
    shape: "",
  },
  {
    title: "The manager effect, isolated",
    description:
      "When a team struggles, Pulse separates the workload from the manager. So you fix the actual problem, not the visible one.",
    shape: "rounded-full w-20",
  },
  {
    title: "Cross-functional friction, mapped",
    description:
      "Where collaboration between departments creates energy, and where it drains it. Silos stop being a feeling and become a map.",
    shape: "rounded-tr-full",
  },
]

const facts = [
  { title: "One secure link", body: "Answered on any device. No logins, no app." },
  { title: "Tailored to each person", body: "Questions shaped by who each person actually works with." },
  { title: "Honest by design", body: "Thresholds and privacy rules are structural, not policy." },
]

export default function SignalsSection() {
  return (
    <Section tone="tint">
      <SectionHead
        kicker="What Pulse does"
        title={
          <>
            The signals standard tools <em>can&apos;t see.</em>
          </>
        }
      />

      <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
        {signals.map((signal, i) => (
          <li key={signal.title}>
            <Reveal delay={0.05 * (i % 2)} variant="scale" className="h-full">
              <div className="group flex h-full flex-col bg-paper p-7 md:p-10">
                <span
                  aria-hidden
                  className={`block h-10 w-10 bg-(--tint-bright) transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-90 group-hover:scale-110 ${signal.shape}`}
                />
                <h3 className="mt-10 max-w-[16ch] text-[clamp(28px,2.8vw,40px)] font-extrabold leading-[1] tracking-[-0.035em] [font-stretch:106%]">
                  {signal.title}
                </h3>
                <p className="mt-4 max-w-[460px] text-[17px] leading-relaxed text-ink-secondary">{signal.description}</p>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>

      <Reveal delay={0.1}>
        <dl className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-3">
          {facts.map((fact) => (
            <div key={fact.title} className="grain grain-light relative bg-(--tint-deep) p-7 text-paper">
              <dt className="relative text-[22px] font-bold tracking-[-0.02em] [font-stretch:106%]">{fact.title}</dt>
              <dd className="relative mt-2 text-[16px] leading-relaxed text-white/70">{fact.body}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </Section>
  )
}
