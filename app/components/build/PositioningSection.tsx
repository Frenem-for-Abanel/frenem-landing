"use client"

import Reveal from "../Reveal"
import ContactCta from "../ContactCta"
import ComparisonTable from "../ComparisonTable"
import { Section, SectionHead } from "../Section"

const rows = [
  { label: "Timeline", them: "Six months, often more", us: "Shaped around what you need" },
  { label: "Cost", them: "Six figures, USD", us: "A fraction" },
  { label: "Deliverable", them: "Slide deck", us: "A live operating system" },
  { label: "Once they leave", them: "It collects dust", us: "Your team uses it daily" },
] as const

export default function PositioningSection() {
  return (
    <Section tone="soft">
      <SectionHead
        kicker="Positioning"
        size={3}
        title={
          <>
            The design that big consulting firms deliver in six months and six figures.{" "}
            <em>Done in weeks.</em>
          </>
        }
      />

      <Reveal>
        <ComparisonTable
          caption="Traditional consulting compared with Frenem Build"
          them="Traditional consulting"
          us="Frenem Build"
          rows={rows}
        />
      </Reveal>

      <Reveal delay={0.08}>
        <div className="mt-12 grid grid-cols-1 items-end gap-8 md:mt-16 md:grid-cols-2">
          <p className="type-lead max-w-[460px] text-ink-secondary">
            Same rigour. Fraction of the time and cost. No slide decks that collect dust. A live
            system your team actually uses.
          </p>
          <div className="md:justify-self-end">
            <ContactCta mode="assessment" className="w-full sm:w-auto">
              Book a Sprint
            </ContactCta>
          </div>
        </div>
      </Reveal>
    </Section>
  )
}
