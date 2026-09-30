"use client"

import Reveal from "./Reveal"
import { Section, SectionHead } from "./Section"

const alumni = ["Goldman Sachs", "Cisco", "Times Internet", "Godrej & Boyce", "Novell Software"]

const education = [
  "XLRI Jamshedpur",
  "IISc Bangalore",
  "IIIT Hyderabad",
  "RVCE Bangalore",
  "St. Stephen's College, Delhi",
]

function Credits({ label, names }: { label: string; names: string[] }) {
  return (
    <div>
      <p className="type-kicker mb-4 text-ink-secondary">{label}</p>
      <ul className="border-t-2 border-ink">
        {names.map((name) => (
          <li key={name} className="group relative overflow-hidden border-b border-line-strong">
            <span
              aria-hidden
              className="absolute inset-0 origin-left scale-x-0 bg-(--tint-soft) transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
            />
            <span className="relative block py-4 text-[clamp(22px,2.4vw,34px)] font-bold leading-tight tracking-[-0.03em] [font-stretch:106%] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-3">
              {name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Team credibility, set as two big lists: real backgrounds only, no fabricated logos. */
export default function TeamSection({
  label = "Who built this",
  compact = false,
  tone = "white",
  title = (
    <>
      A combined <em>100+ years</em> of consulting and HR experience.
    </>
  ),
}: {
  label?: string
  compact?: boolean
  tone?: "white" | "soft"
  title?: React.ReactNode
}) {
  return (
    <Section tone={tone}>
      <SectionHead
        kicker={label}
        title={title}
        aside={
          <p>
            Frenem isn&apos;t a tool built by engineers guessing what organisations need. It&apos;s
            built by people who&apos;ve done this work, in the room, for decades.
          </p>
        }
      />

      <div className="grid grid-cols-1 gap-14 md:grid-cols-2 md:gap-10">
        <Reveal>
          <Credits label="Team alumni from" names={alumni} />
        </Reveal>
        <Reveal delay={0.1}>
          <Credits label="Educated at" names={education} />
        </Reveal>
      </div>

      {!compact && (
        <Reveal delay={0.1}>
          <p className="type-lead mt-16 max-w-[640px] text-ink md:mt-24">
            The playbooks we&apos;ve used across{" "}
            <strong className="font-bold">hundreds of engagements</strong> are now embedded directly
            in the platform. You get the thinking without the billing.
          </p>
        </Reveal>
      )}
    </Section>
  )
}
