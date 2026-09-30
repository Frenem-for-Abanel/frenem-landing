"use client"

import Reveal from "../Reveal"
import Parallax from "../motion/Parallax"
import { Section, SectionHead } from "../Section"
import { IndividualReportMock, OrgPulseMock, NetworkMapMock } from "./ReportMockups"

const reports = [
  {
    audience: "For every employee",
    title: "The Individual Report",
    description:
      "A confidential personal read: where self-perception and colleagues' experience align, the one blind spot that matters most, and a single habit to practise next. Developmental, never evaluation.",
    Mock: IndividualReportMock,
  },
  {
    audience: "For leadership",
    title: "The Org Pulse Report",
    description:
      "A systemic, top-down read: heatmaps of strain, trust, and culture by department and layer. The top risks, their trajectory if unaddressed, and one intervention you actually control.",
    Mock: OrgPulseMock,
  },
  {
    audience: "For HR and people analytics",
    title: "The Relational Network Map",
    description:
      "The map itself: structural silos, hidden brokers, bottleneck managers, and an isolation watchlist. Leading indicators of attrition, visible weeks before a notice period.",
    Mock: NetworkMapMock,
  },
] as const

export default function ReportsSection() {
  return (
    <Section tone="soft">
      <SectionHead
        kicker="What you receive"
        title={
          <>
            Three cuts. Three <em>audiences.</em>
          </>
        }
      />

      <div className="flex flex-col gap-2">
        {reports.map((report, i) => (
          <Reveal key={report.title} variant="clip">
            <div className="grid grid-cols-1 gap-10 bg-paper p-7 md:grid-cols-12 md:items-center md:gap-10 md:p-12">
              <div className={`min-w-0 md:col-span-6 ${i % 2 === 1 ? "md:order-2 md:col-start-7" : ""}`}>
                <p className="type-kicker text-ink-secondary">{report.audience}</p>
                <h3 className="mt-4 text-[clamp(32px,3.6vw,54px)] font-extrabold leading-[0.95] tracking-[-0.04em] [font-stretch:108%]">
                  {report.title}
                </h3>
                <p className="mt-5 max-w-[500px] text-[17px] leading-relaxed text-ink-secondary">{report.description}</p>
              </div>
              <div className={`md:col-span-5 ${i % 2 === 1 ? "md:order-1 md:col-start-1" : "md:col-start-8"}`}>
                <div className="bg-(--tint-soft) p-5 sm:p-8">
                  <Parallax y={[30, -30]}>
                    <report.Mock />
                  </Parallax>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
