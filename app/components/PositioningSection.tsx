"use client"

import Reveal from "./Reveal"
import { useContactModal } from "../context/ContactModalContext"

export default function PositioningSection() {
  const { openModal } = useContactModal()

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

  return (
    <section className="relative overflow-hidden bg-[var(--frenem-bg)] py-16 md:py-[180px]" data-section-name="Position" data-section-num="06">
      <div className="container-v2 text-left">
        <Reveal>
          <div className="frenem-section-label">Positioning</div>
        </Reveal>
        <Reveal delay={0.05}>
          <p className="mb-10 max-w-[1000px] font-sans text-[clamp(24px,4.4vw,56px)] font-medium leading-tight tracking-[-0.025em] text-[var(--frenem-ink)] md:mb-16 lg:mb-20">
            The design that big consulting firms deliver in six months and six figures.{" "}
            <em className="font-normal italic text-[var(--frenem-accent)]">Done in weeks.</em>
          </p>
        </Reveal>

        <div className="mb-10 grid grid-cols-1 gap-4 md:mb-14 md:gap-6 lg:grid-cols-2">
          <Reveal delay={0.08}>
            <div className="rounded-2xl border border-[var(--frenem-border-strong)] bg-[var(--frenem-bg-soft)] px-5 py-6 md:px-9 md:py-9">
              <div className="mb-6 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-[var(--frenem-ink-tertiary)]">
                Traditional consulting
              </div>
              {rowsTraditional.map((row) => (
                <div
                  key={row.label}
                  className="grid grid-cols-[1fr_auto] gap-4 border-b border-[var(--frenem-border)] py-4 font-sans text-[15px] last:border-b-0"
                >
                  <span className="text-[var(--frenem-ink-secondary)]">{row.label}</span>
                  <span className="text-right font-semibold text-[var(--frenem-ink)]">{row.value}</span>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="rounded-2xl border border-[var(--frenem-ink)] bg-[var(--frenem-ink)] px-5 py-6 text-[var(--frenem-bg)] md:px-9 md:py-9">
              <div className="mb-6 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-[var(--frenem-accent)]">
                Frenem Build
              </div>
              {rowsFrenem.map((row) => (
                <div
                  key={row.label}
                  className="grid grid-cols-[1fr_auto] gap-4 border-b border-white/10 py-4 font-sans text-[15px] last:border-b-0"
                >
                  <span className="text-white/60">{row.label}</span>
                  <span
                    className={`text-right font-semibold ${row.highlight ? "text-[var(--frenem-accent)]" : "text-[var(--frenem-bg)]"}`}
                  >
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.12}>
          <div className="grid grid-cols-1 items-end gap-8 border-t border-[var(--frenem-border)] pt-6 md:gap-10 md:pt-8 lg:grid-cols-2 lg:gap-16">
            <p className="max-w-[480px] font-sans text-base font-normal leading-relaxed text-[var(--frenem-ink-secondary)] md:text-lg">
              Same rigour. Fraction of the time and cost. No slide decks that collect dust. A live system your team
              actually uses.
            </p>
            <div className="lg:justify-self-end">
              <button
                type="button"
                onClick={openModal}
                className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border-none bg-[var(--frenem-ink)] px-7 py-3.5 font-sans text-[15px] font-medium text-[var(--frenem-bg)] transition-all duration-300 hover:bg-[var(--frenem-accent)] hover:translate-y-[-2px] md:py-4"
              >
                Book a Sprint →
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
