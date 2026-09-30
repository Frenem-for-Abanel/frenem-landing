"use client"

import Reveal from "../Reveal"
import { Section, SectionHead } from "../Section"

const items = [
  {
    title: "No surveillance",
    description:
      "Pulse never reads email, calendars, or chat. Every data point is a question someone chose to answer.",
    shape: "rounded-full",
  },
  {
    title: "Thresholds, enforced",
    description:
      "Team and relationship data stays hidden unless enough people respond. Below the threshold, it is not shown to anyone.",
    shape: "",
  },
  {
    title: "Reports stay in their lane",
    description:
      "Individual reports go to the individual alone. Leadership sees systems and patterns, never names.",
    shape: "rounded-full w-24",
  },
] as const

/** Ink band: privacy is the buying objection, so it gets its own moment. */
export default function PrivacySection() {
  return (
    <Section tone="deep">
      <SectionHead
        dark
        kicker="Privacy by design"
        title={
          <>
            Safe to answer <em>honestly.</em>
          </>
        }
        aside={
          <p>
            Honest answers are the whole product. Pulse only works if every person trusts where
            their words go, so the guarantees are structural, not policy.
          </p>
        }
      />
      <ul className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
        {items.map((item, i) => (
          <li key={item.title}>
            <Reveal delay={0.08 * i}>
              <span aria-hidden className={`block h-12 w-12 bg-(--tint-soft) ${item.shape}`} />
              <h3 className="mt-8 text-[30px] font-extrabold leading-[1.02] tracking-[-0.035em] [font-stretch:106%]">{item.title}</h3>
              <p className="mt-4 text-[17px] leading-relaxed text-white/70">{item.description}</p>
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  )
}
