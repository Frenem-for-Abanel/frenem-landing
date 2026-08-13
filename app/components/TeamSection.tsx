"use client"

import Reveal from "./Reveal"
import { Section, SectionLabel, SectionHeading } from "./Section"

const alumniTags = [
  "Goldman Sachs",
  "Cisco",
  "Times Internet",
  "Godrej & Boyce",
  "Novell Software",
]

const educationTags = [
  "XLRI Jamshedpur",
  "IISc Bangalore",
  "IIIT Hyderabad",
  "RVCE Bangalore",
  "St. Stephen's College, Delhi",
]

function TagRow({ label, tags }: { label: string; tags: string[] }) {
  return (
    <div className="grid grid-cols-1 gap-y-0 border-t border-line-strong md:grid-cols-[200px_1fr] md:items-baseline md:gap-8 md:py-6">
      <span className="pb-2 pt-6 font-sans text-[13px] font-medium text-ink-tertiary md:py-6">
        {label}
      </span>
      <ul className="flex flex-wrap gap-2 pb-6 md:gap-2.5 md:py-6">
        {tags.map((tag) => (
          <li
            key={tag}
            className="cursor-default rounded-full border border-line-strong bg-paper px-3.5 py-2 font-sans text-sm font-medium transition-colors hover:border-ink hover:bg-ink hover:text-paper md:px-4"
          >
            {tag}
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Team credibility: real backgrounds only, no fabricated logos. */
export default function TeamSection({
  label = "Who Built This",
  compact = false,
  soft = true,
}: {
  label?: string
  compact?: boolean
  soft?: boolean
}) {
  return (
    <Section soft={soft}>
      <div className="mb-12 grid grid-cols-1 items-end gap-8 md:mb-16 md:gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
        <div>
          <Reveal>
            <SectionLabel>{label}</SectionLabel>
          </Reveal>
          <Reveal delay={0.05}>
            <SectionHeading className="mb-6 md:mb-8">
              A combined <em>100+ years</em> of consulting and HR experience.
            </SectionHeading>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="max-w-[560px] font-sans text-lg font-normal leading-snug text-ink-secondary md:text-xl">
              Frenem isn&apos;t a tool built by engineers guessing what organisations need.
              It&apos;s built by people who&apos;ve done this work, in the room, for decades.
            </p>
          </Reveal>
        </div>
        <Reveal delay={0.06}>
          <div className="flex flex-col justify-center rounded-2xl bg-ink p-6 text-paper md:p-8 lg:min-h-[200px]">
            <div className="font-display text-[48px] font-semibold leading-[0.9] tracking-[-0.04em] text-(--tint-bright) md:text-[72px]">
              100+
            </div>
            <p className="mt-2 font-sans text-sm leading-snug text-white/70">
              Years of combined consulting &amp; HR experience across the team.
            </p>
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.1}>
        <TagRow label="Team alumni from" tags={alumniTags} />
      </Reveal>
      <Reveal delay={0.12}>
        <div className="border-b border-line-strong">
          <TagRow label="Educated at" tags={educationTags} />
        </div>
      </Reveal>

      {!compact && (
        <Reveal delay={0.14}>
          <p className="mt-10 max-w-[720px] font-sans text-lg font-normal leading-snug text-ink md:mt-14 md:text-xl">
            The playbooks we&apos;ve used across{" "}
            <strong className="font-semibold">hundreds of engagements</strong> are now embedded
            directly in the platform. You get the thinking without the billing.
          </p>
        </Reveal>
      )}
    </Section>
  )
}
