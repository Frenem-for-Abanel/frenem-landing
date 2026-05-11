"use client"

import Reveal from "./Reveal"

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
    <section
      className="relative overflow-hidden bg-[var(--frenem-bg)] py-[140px]"
      data-section-name="Capital"
      data-section-num="04"
    >
      <div className="container-v2">
        <Reveal>
          <div className="frenem-section-label">Capital Ready</div>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mb-12 max-w-[1000px] font-sans text-[clamp(36px,5vw,72px)] font-semibold leading-none tracking-[-0.03em]">
            Institution-ready. Before markets force the change.
          </h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
          <div>
            <Reveal delay={0.08}>
              <p className="mb-12 font-sans text-[22px] font-normal leading-snug tracking-[-0.01em] text-[var(--frenem-ink)]">
                IPOs and PE deals don&apos;t fail because of strategy. They fail because investors see organisation risk.
                Promoter dependency, informal decision-making, a thin leadership bench. Build moves that work upstream,
                before it becomes expensive.
              </p>
            </Reveal>
            <Reveal delay={0.12}>
              <div className="rounded-2xl border border-[var(--frenem-border)] bg-[var(--frenem-bg-soft)] p-8">
                <div
                  className="text-[56px] leading-[0.5] text-[var(--frenem-accent)]"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  &ldquo;
                </div>
                <p className="mt-4 font-sans text-2xl font-medium leading-snug tracking-[-0.02em]">
                  Will this company still work if the promoter steps back?
                </p>
                <p className="mt-4 flex items-center gap-2 font-sans text-[13px] font-medium tracking-[0.02em] text-[var(--frenem-ink-tertiary)]">
                  <span aria-hidden className="inline-block h-px w-4 shrink-0 bg-[var(--frenem-ink-tertiary)]" />
                  The question every merchant banker asks internally
                </p>
              </div>
            </Reveal>
          </div>

          <div className="flex flex-col gap-3">
            {cards.map((card, i) => (
              <Reveal key={card.title} delay={0.06 * i}>
                <div className="group grid cursor-default grid-cols-[48px_1fr] items-start gap-5 rounded-xl border border-[var(--frenem-border-strong)] bg-[var(--frenem-bg)] p-7 transition-all duration-300 hover:-translate-x-1 hover:border-[var(--frenem-ink)]">
                  <span className="pt-1 font-sans text-[13px] font-medium text-[var(--frenem-ink-tertiary)]">{card.num}</span>
                  <div>
                    <h4 className="mb-1.5 font-sans text-xl font-semibold tracking-[-0.01em]">{card.title}</h4>
                    <p className="font-sans text-[15px] font-normal leading-normal text-[var(--frenem-ink-secondary)]">
                      {card.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
