"use client"

import Reveal from "./Reveal"

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

export default function TeamSection() {
  return (
    <section className="relative overflow-hidden bg-[var(--frenem-bg-soft)] py-[140px]" data-section-name="Team" data-section-num="07">
      <div className="container-v2">
        <div className="mb-16 grid grid-cols-1 items-end gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <div>
            <Reveal>
              <div className="frenem-section-label">Who Built This</div>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mb-8 font-sans text-[clamp(36px,5vw,72px)] font-semibold leading-none tracking-[-0.03em]">
                A combined <em className="font-normal italic">100+ years</em> of consulting and HR experience.
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="max-w-[560px] font-sans text-xl font-normal leading-snug text-[var(--frenem-ink-secondary)]">
                Frenem isn&apos;t a tool built by engineers guessing what organisations need. It&apos;s built by people
                who&apos;ve done this work, in the room, for decades.
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.06}>
            <div className="flex flex-col justify-center rounded-2xl bg-[var(--frenem-ink)] p-8 text-[var(--frenem-bg)] lg:min-h-[200px]">
              <div className="font-sans text-[72px] font-semibold leading-[0.9] tracking-[-0.04em] text-[var(--frenem-accent)]">
                100+
              </div>
              <p className="mt-2 font-sans text-sm leading-snug text-white/70">
                Years of combined consulting &amp; HR experience across the team.
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="grid grid-cols-1 gap-y-0 border-t border-[var(--frenem-border-strong)] md:grid-cols-[200px_1fr] md:items-baseline md:gap-8 md:py-6">
            <span className="pb-2 pt-6 font-sans text-[13px] font-medium text-[var(--frenem-ink-tertiary)] md:py-6">
              Team alumni from
            </span>
            <div className="flex flex-wrap gap-2.5 pb-6 md:py-6">
              {alumniTags.map((tag) => (
                <span
                  key={tag}
                  className="cursor-default rounded-full border border-[var(--frenem-border-strong)] bg-[var(--frenem-bg)] px-4 py-2 font-sans text-sm font-medium transition-colors hover:border-[var(--frenem-ink)] hover:bg-[var(--frenem-ink)] hover:text-[var(--frenem-bg)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="grid grid-cols-1 gap-y-0 border-t border-b border-[var(--frenem-border-strong)] md:grid-cols-[200px_1fr] md:items-baseline md:gap-8 md:py-6">
            <span className="pb-2 pt-6 font-sans text-[13px] font-medium text-[var(--frenem-ink-tertiary)] md:py-6">
              Educated at
            </span>
            <div className="flex flex-wrap gap-2.5 pb-6 md:py-6">
              {educationTags.map((tag) => (
                <span
                  key={tag}
                  className="cursor-default rounded-full border border-[var(--frenem-border-strong)] bg-[var(--frenem-bg)] px-4 py-2 font-sans text-sm font-medium transition-colors hover:border-[var(--frenem-ink)] hover:bg-[var(--frenem-ink)] hover:text-[var(--frenem-bg)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.14}>
          <p className="mt-14 max-w-[720px] font-sans text-xl font-normal leading-snug text-[var(--frenem-ink)]">
            The playbooks we&apos;ve used across{" "}
            <strong className="font-semibold">hundreds of engagements</strong> are now embedded directly in the
            platform. You get the thinking without the billing.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
