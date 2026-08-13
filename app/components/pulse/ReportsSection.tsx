"use client"

import Reveal from "../Reveal"
import { Section, SectionLabel, SectionHeading } from "../Section"
import { IndividualReportMock, OrgPulseMock, NetworkMapMock } from "./ReportMockups"

const reports = [
  {
    num: "01",
    audience: "For every employee",
    title: "The Individual Report",
    description:
      "A confidential coaching guide: where self-perception and colleagues' experience align, the one blind spot that matters most, and a single habit to practise next. Developmental, never evaluation.",
    Mock: IndividualReportMock,
  },
  {
    num: "02",
    audience: "For leadership",
    title: "The Org Pulse Report",
    description:
      "A systemic, top-down read: heatmaps of strain, trust, and culture by department and layer. The top risks, their trajectory if unaddressed, and one intervention you actually control.",
    Mock: OrgPulseMock,
  },
  {
    num: "03",
    audience: "For HR & people analytics",
    title: "The Relational Network Map",
    description:
      "The map itself: structural silos, hidden brokers, bottleneck managers, and an isolation watchlist. Leading indicators of attrition, visible weeks before a notice period.",
    Mock: NetworkMapMock,
  },
] as const

export default function ReportsSection() {
  return (
    <Section soft>
      <Reveal>
        <SectionLabel>What You Receive</SectionLabel>
      </Reveal>
      <Reveal delay={0.04}>
        <SectionHeading className="mb-10 max-w-[900px] md:mb-16">
          Three cuts. Three <em>audiences.</em>
        </SectionHeading>
      </Reveal>

      <div>
        {reports.map((report, i) => (
          <Reveal key={report.title} delay={0.05 * i}>
            <div
              className={`grid grid-cols-1 gap-6 border-t border-line-strong py-8 md:grid-cols-[90px_1.1fr_1fr] md:gap-x-10 md:py-12 ${
                i === reports.length - 1 ? "border-b" : ""
              }`}
            >
              <div className="font-display text-[40px] font-semibold leading-none tracking-[-0.04em] text-(--tint-ink) md:text-[56px]">
                {report.num}
              </div>
              <div className="min-w-0">
                <div className="mb-3 font-sans text-xs font-semibold uppercase tracking-[0.08em] text-ink-tertiary">
                  {report.audience}
                </div>
                <h3 className="mb-4 font-sans text-[22px] font-semibold leading-[1.15] tracking-[-0.02em] md:text-[28px]">
                  {report.title}
                </h3>
                <p className="max-w-[520px] font-sans text-base leading-relaxed text-ink-secondary md:text-[17px]">
                  {report.description}
                </p>
              </div>
              <div className="max-w-[380px] md:justify-self-end md:self-center md:w-full">
                <report.Mock />
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
