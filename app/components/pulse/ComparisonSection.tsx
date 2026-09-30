"use client"

import Reveal from "../Reveal"
import ComparisonTable from "../ComparisonTable"
import { Section, SectionHead } from "../Section"

const rows = [
  {
    label: "Measures",
    them: "How individuals feel",
    us: "How people work together",
  },
  {
    label: "Unit of analysis",
    them: "The individual",
    us: "The working relationship",
  },
  {
    label: "What it finds",
    them: "Morale trends and engagement scores",
    us: "Exit risk, hidden brokers, the manager effect, silos",
  },
  {
    label: "Output",
    them: "A dashboard score",
    us: "Three report cuts, each with a next action",
  },
  {
    label: "Privacy model",
    them: "Anonymous averages",
    us: "Enforced response thresholds; leadership never sees names",
  },
  {
    label: "Time to signal",
    them: "Quarterly trend lines",
    us: "Early, while you can still act",
  },
] as const

export default function ComparisonSection() {
  return (
    <Section>
      <SectionHead
        kicker="Why not just a survey"
        title={
          <>
            Surveys measure mood. Pulse measures <em>the machine.</em>
          </>
        }
        aside={
          <p>
            Not a replacement for listening to your people. A different instrument. Surveys ask how
            everyone feels. Pulse shows where the work itself creates energy, friction, and risk.
          </p>
        }
      />

      <Reveal>
        <ComparisonTable
          caption="Engagement surveys compared with Frenem Pulse"
          them="Engagement survey"
          us="Frenem Pulse"
          rows={rows}
        />
      </Reveal>
    </Section>
  )
}
