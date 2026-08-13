"use client"

import Reveal from "../Reveal"
import { Section, SectionLabel, SectionHeading } from "../Section"

const cards = [
  {
    num: "01",
    title: "IPO Readiness",
    description:
      "Governance model, role separation, committee oversight, organisational transparency, and succession visibility.",
  },
  {
    num: "02",
    title: "PE / VC Readiness",
    description:
      "Institutional governance, scalable operating model, management depth, and reduced key-person risk.",
  },
  {
    num: "03",
    title: "Founder-Independent Execution",
    description:
      "A system-driven model where decisions happen because the structure supports them, not because the founder approves them.",
  },
]

export default function CapitalReadySection() {
  return (
    <Section>
      <Reveal>
        <SectionLabel>Capital Ready</SectionLabel>
      </Reveal>
      <Reveal delay={0.05}>
        <SectionHeading className="mb-8 max-w-[1000px] md:mb-12">
          Institution-ready. Before markets <em>force the change.</em>
        </SectionHeading>
      </Reveal>

      <div className="mt-8 grid grid-cols-1 gap-10 md:mt-12 md:gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
        <div>
          <Reveal delay={0.08}>
            <p className="mb-8 font-sans text-lg font-normal leading-snug tracking-[-0.01em] text-ink md:mb-12 md:text-[22px]">
              IPOs and PE deals don&apos;t fail because of strategy. They fail because investors see
              organisation risk. Promoter dependency, informal decision-making, a thin leadership
              bench. Build moves that work upstream, before it becomes expensive.
            </p>
          </Reveal>
          <Reveal delay={0.12}>
            <blockquote className="rounded-2xl border border-line bg-paper-soft p-6 md:p-8">
              <div aria-hidden className="font-display text-[56px] italic leading-[0.5] text-(--tint-ink)">
                &ldquo;
              </div>
              <p className="mt-4 font-display text-xl font-medium italic leading-snug tracking-[-0.01em] md:text-2xl">
                Will this company still work if the promoter steps back?
              </p>
              <footer className="mt-4 flex items-center gap-2 font-sans text-[13px] font-medium tracking-[0.02em] text-ink-tertiary">
                <span aria-hidden className="inline-block h-px w-4 shrink-0 bg-ink-tertiary" />
                The question every merchant banker asks internally
              </footer>
            </blockquote>
          </Reveal>
        </div>

        <div className="flex flex-col gap-3">
          {cards.map((card, i) => (
            <Reveal key={card.title} delay={0.06 * i}>
              <div className="group grid cursor-default grid-cols-[40px_1fr] items-start gap-4 rounded-xl border border-line-strong bg-paper p-5 transition-all duration-300 hover:-translate-x-1 hover:border-ink md:grid-cols-[48px_1fr] md:gap-5 md:p-7">
                <span className="pt-1 font-sans text-[13px] font-medium text-(--tint-ink)">
                  {card.num}
                </span>
                <div>
                  <h3 className="mb-1.5 font-sans text-lg font-semibold tracking-[-0.01em] md:text-xl">
                    {card.title}
                  </h3>
                  <p className="font-sans text-[15px] font-normal leading-normal text-ink-secondary">
                    {card.description}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  )
}
