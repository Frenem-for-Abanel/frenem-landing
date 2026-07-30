"use client"

import Reveal from "./Reveal"

const reports = [
  {
    num: "01",
    audience: "For every employee",
    title: "The Individual Report",
    description:
      "A confidential coaching guide: where self-perception and colleagues' experience align, the one blind spot that matters most, and a single habit to practise next. Developmental, never evaluation.",
  },
  {
    num: "02",
    audience: "For leadership",
    title: "The Org Pulse Report",
    description:
      "A systemic, top-down read: heatmaps of strain, trust, and culture by department and layer. The top risks, their trajectory if unaddressed, and one intervention you actually control.",
  },
  {
    num: "03",
    audience: "For HR & people analytics",
    title: "The Relational Network Map",
    description:
      "The map itself: structural silos, hidden brokers, bottleneck managers, and an isolation watchlist. Leading indicators of attrition, visible weeks before a notice period.",
  },
] as const

export default function PulseReportsSection() {
  return (
    <section
      className="relative overflow-hidden bg-[var(--frenem-bg-soft)] py-16 md:py-[140px]"
      data-section-name="Reports"
      data-section-num="05"
    >
      <div className="container-v2">
        <Reveal>
          <div className="frenem-section-label">What You Receive</div>
        </Reveal>
        <Reveal delay={0.04}>
          <h2 className="mb-10 max-w-[900px] font-sans text-[clamp(28px,5vw,72px)] font-semibold leading-none tracking-[-0.03em] md:mb-16">
            Three cuts. Three{" "}
            <em className="font-normal italic text-[var(--frenem-accent)]">audiences.</em>
          </h2>
        </Reveal>

        <div>
          {reports.map((report, i) => (
            <Reveal key={report.title} delay={0.05 * i}>
              <div
                className={`grid grid-cols-1 gap-4 border-t border-[var(--frenem-border-strong)] py-8 md:grid-cols-[90px_1fr] md:gap-x-10 md:gap-y-6 md:py-10 lg:grid-cols-[90px_1fr_1.1fr] ${
                  i === reports.length - 1 ? "border-b" : ""
                }`}
              >
                <div className="font-sans text-[40px] font-semibold leading-none tracking-[-0.04em] text-[var(--frenem-accent)] md:text-[56px]">
                  {report.num}
                </div>
                <div className="min-w-0">
                  <div className="mb-3 font-sans text-xs font-semibold uppercase tracking-[0.08em] text-[var(--frenem-ink-tertiary)]">
                    {report.audience}
                  </div>
                  <h3 className="font-sans text-[22px] font-semibold leading-[1.15] tracking-[-0.02em] md:text-[28px]">
                    {report.title}
                  </h3>
                </div>
                <p className="font-sans text-base leading-relaxed text-[var(--frenem-ink-secondary)] md:col-span-2 md:text-[17px] lg:col-span-1">
                  {report.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
