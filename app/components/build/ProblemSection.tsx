"use client"

import Reveal from "../Reveal"
import { Section, SectionLabel, SectionHeading } from "../Section"

const pains = [
  {
    num: "01",
    title: "Everything depends on you",
    description:
      "Every decision, every escalation, every fire. It all routes back to you. You're the bottleneck in your own company.",
  },
  {
    num: "02",
    title: "Roles are unclear as you grow",
    description:
      "People have titles, but nobody knows who owns what. Accountability is a conversation, not a system.",
  },
  {
    num: "03",
    title: "Good people, slow execution",
    description:
      'You have the talent. But decisions crawl through layers, sign-offs, and "let me check with…" loops.',
  },
  {
    num: "04",
    title: "Overlapping work, unclear ownership",
    description:
      "Multiple people doing the same thing. Nobody quite sure where their remit ends and another's begins.",
  },
  {
    num: "05",
    title: "Professionalise, but keep control",
    description:
      'You know you need structure. But you\'ve seen what "consultants" do. You don\'t want to lose your company\'s soul.',
  },
  {
    num: "06",
    title: "Succession feels risky",
    description:
      "There's no visible pipeline. No structured bench. If a key person walks, the plan walks with them.",
  },
]

export default function ProblemSection() {
  return (
    <Section soft>
      <div className="mb-12 grid grid-cols-1 items-end gap-8 md:mb-20 md:gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <SectionLabel>The Founder&apos;s Dilemma</SectionLabel>
          <SectionHeading>
            You built this business.
            <br />
            Now it can&apos;t run <em>without you.</em>
          </SectionHeading>
        </Reveal>
        <Reveal delay={0.06}>
          <div className="rounded-xl border border-line-strong bg-paper p-6 md:p-8">
            <div className="mb-2 font-display text-[48px] font-semibold leading-none tracking-[-0.04em] text-(--tint-ink) md:text-[64px]">
              1
            </div>
            <p className="font-sans text-sm leading-snug text-ink-secondary">
              person every decision routes through. The bottleneck has a name.
            </p>
          </div>
        </Reveal>
      </div>

      <div className="grid grid-cols-1 border-l border-t border-line-strong md:grid-cols-2">
        {pains.map((pain, i) => (
          <Reveal key={pain.title} delay={0.03 * i}>
            <div className="flex h-full cursor-default flex-col gap-3 border-r border-b border-line-strong bg-paper p-6 transition-colors duration-300 hover:bg-paper-soft md:gap-4 md:p-10">
              <span className="font-sans text-[13px] font-medium tracking-[0.02em] text-(--tint-ink)">
                {pain.num}
              </span>
              <h3 className="font-sans text-xl font-semibold leading-tight tracking-[-0.02em] md:text-2xl">
                {pain.title}
              </h3>
              <p className="font-sans text-base font-normal leading-relaxed text-ink-secondary">
                {pain.description}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
