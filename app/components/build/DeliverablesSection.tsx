"use client"

import { Check } from "lucide-react"
import Reveal from "../Reveal"
import { Section, SectionLabel, SectionHeading } from "../Section"

const deliverables = [
  {
    title: "Decision-rights framework",
    detail: "Who decides what, at which level — written down and delegated.",
  },
  {
    title: "Grade structure & role catalog",
    detail: "Every role mapped to a grade, family, and owner.",
  },
  {
    title: "Complete job architecture",
    detail: "Job descriptions where every outcome has exactly one owner.",
  },
  {
    title: "RACI matrix",
    detail: "Accountability that kills the sign-off loops.",
  },
  {
    title: "Org map with spans & layers",
    detail: "Fewer layers, clearer spans of control, designed for execution.",
  },
  {
    title: "Governance guardrails",
    detail: "The controls you define, with delegation built into the structure.",
  },
  {
    title: "Competency framework",
    detail: "What good looks like at every grade, in your language.",
  },
  {
    title: "9-box talent map & bench",
    detail: "A visible leadership pipeline and succession picture.",
  },
  {
    title: "Boardroom-ready operating model",
    detail: "Validated, documented, and live in your team's hands.",
  },
]

export default function DeliverablesSection() {
  return (
    <Section>
      <Reveal>
        <SectionLabel>What You Walk Away With</SectionLabel>
      </Reveal>
      <Reveal delay={0.04}>
        <SectionHeading className="mb-10 max-w-[900px] md:mb-14">
          A working operating system. <em>Not a binder.</em>
        </SectionHeading>
      </Reveal>

      <ul className="grid grid-cols-1 gap-x-10 gap-y-0 sm:grid-cols-2 lg:grid-cols-3">
        {deliverables.map((item, i) => (
          <Reveal key={item.title} delay={0.03 * i}>
            <li className="flex h-full gap-4 border-t border-line-strong py-6 md:py-7">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-(--tint-soft)">
                <Check aria-hidden className="h-3.5 w-3.5 text-(--tint-ink)" strokeWidth={2.4} />
              </span>
              <div>
                <h3 className="mb-1 font-sans text-base font-semibold tracking-[-0.01em] md:text-[17px]">
                  {item.title}
                </h3>
                <p className="font-sans text-sm leading-relaxed text-ink-secondary">{item.detail}</p>
              </div>
            </li>
          </Reveal>
        ))}
      </ul>
    </Section>
  )
}
