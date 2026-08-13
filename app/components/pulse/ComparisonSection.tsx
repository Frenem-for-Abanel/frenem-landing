"use client"

import Reveal from "../Reveal"
import { Section, SectionLabel, SectionHeading } from "../Section"

const rows = [
  {
    label: "Measures",
    survey: "How individuals feel",
    pulse: "How people work together",
  },
  {
    label: "Unit of analysis",
    survey: "The individual",
    pulse: "The working relationship",
  },
  {
    label: "What it finds",
    survey: "Morale trends and engagement scores",
    pulse: "Exit risk, hidden brokers, the manager effect, silos",
  },
  {
    label: "Output",
    survey: "A dashboard score",
    pulse: "Three report cuts, each with a next action",
  },
  {
    label: "Privacy model",
    survey: "Anonymous averages",
    pulse: "Enforced response thresholds; leadership never sees names",
  },
  {
    label: "Time to signal",
    survey: "Quarterly trend lines",
    pulse: "A four-week pilot",
  },
] as const

export default function ComparisonSection() {
  return (
    <Section>
      <Reveal>
        <SectionLabel>Why Not Just a Survey</SectionLabel>
      </Reveal>
      <Reveal delay={0.04}>
        <SectionHeading className="mb-10 max-w-[900px] md:mb-14">
          Surveys measure mood. Pulse measures <em>the machine.</em>
        </SectionHeading>
      </Reveal>

      <Reveal delay={0.08}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left font-sans">
            <thead>
              <tr>
                <th scope="col" className="w-[22%] pb-4" aria-label="Dimension" />
                <th
                  scope="col"
                  className="w-[36%] border-b border-line-strong pb-4 pr-6 font-sans text-xs font-semibold uppercase tracking-[0.1em] text-ink-tertiary"
                >
                  Engagement survey
                </th>
                <th
                  scope="col"
                  className="w-[42%] rounded-t-xl border-b border-(--tint-bright) bg-(--tint-soft) px-6 pb-4 pt-4 font-sans text-xs font-semibold uppercase tracking-[0.1em] text-(--tint-ink)"
                >
                  Frenem Pulse
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.label}>
                  <th
                    scope="row"
                    className="border-b border-line py-4 pr-6 align-top font-sans text-[13px] font-medium text-ink-tertiary"
                  >
                    {row.label}
                  </th>
                  <td className="border-b border-line py-4 pr-6 align-top text-[15px] text-ink-secondary">
                    {row.survey}
                  </td>
                  <td
                    className={`border-b border-line bg-(--tint-soft) px-6 py-4 align-top text-[15px] font-medium text-ink ${
                      i === rows.length - 1 ? "rounded-b-xl" : ""
                    }`}
                  >
                    {row.pulse}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>

      <Reveal delay={0.12}>
        <p className="mt-8 max-w-[560px] font-sans text-base leading-relaxed text-ink-secondary md:mt-10">
          Not a replacement for listening to your people. A different instrument. Surveys ask how
          everyone feels. Pulse shows where the work itself creates energy, friction, and risk.
        </p>
      </Reveal>
    </Section>
  )
}
