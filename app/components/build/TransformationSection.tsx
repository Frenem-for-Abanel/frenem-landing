"use client"

import Reveal from "../Reveal"
import { Section, SectionLabel, SectionHeading } from "../Section"

const transforms: { before: string; after: string }[] = [
  {
    before: "Everything depends on me",
    after: "A decision-rights framework so calls get made at the right level, without you",
  },
  {
    before: "Roles are unclear as we grow",
    after: "Every role mapped to a grade, family, and owner with documented accountability",
  },
  {
    before: "Good people, but execution is slow",
    after: "Fewer layers, clearer spans of control, and a RACI matrix that kills sign-off loops",
  },
  {
    before: "Overlapping work everywhere",
    after: "A complete job architecture where every outcome has exactly one owner",
  },
  {
    before: "Professionalise without losing control",
    after: "Governance guardrails you define, with delegation built into the structure",
  },
  {
    before: "Succession feels risky and informal",
    after: "A 9-box talent map with a visible leadership bench and development pipeline",
  },
]

/** Before/after ledger — one responsive DOM, no duplicated mobile tree. */
export default function TransformationSection() {
  return (
    <Section dark>
      <Reveal>
        <SectionLabel>The Shift</SectionLabel>
      </Reveal>
      <Reveal delay={0.05}>
        <SectionHeading className="mb-10 text-paper md:mb-14">
          What changes <em>after Build.</em>
        </SectionHeading>
      </Reveal>

      <div className="border-t border-white/10">
        {/* Column headers (desktop only; cells carry their own labels on mobile) */}
        <div className="hidden grid-cols-2 md:grid">
          <div className="flex items-center gap-3 border-b border-white/10 py-7 pr-8 font-sans text-xs font-medium uppercase tracking-[0.1em] text-white/40">
            <span className="h-2 w-2 shrink-0 rounded-full bg-current" />
            Today
          </div>
          <div className="flex items-center gap-3 border-b border-l border-white/10 py-7 pl-8 font-sans text-xs font-medium uppercase tracking-[0.1em] text-(--tint-bright)">
            <span className="h-2 w-2 shrink-0 rounded-full bg-current" />
            After Build
          </div>
        </div>

        {transforms.map((t, i) => (
          <Reveal key={t.before} delay={0.04 * i}>
            <div className="grid grid-cols-1 border-b border-white/10 last:border-b-0 md:grid-cols-2">
              <div className="flex gap-4 pb-2 pt-6 md:gap-6 md:py-7 md:pr-8">
                <span className="w-6 shrink-0 pt-1 font-sans text-[13px] font-medium text-white/40">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="font-sans text-[15px] font-normal leading-snug text-white/50 line-through decoration-white/25 md:text-[17px]">
                  {t.before}
                </p>
              </div>
              <div className="flex gap-4 pb-6 md:gap-6 md:border-l md:border-white/10 md:py-7 md:pl-8">
                <span className="w-6 shrink-0 pt-1 font-sans text-[13px] font-medium text-(--tint-bright)">
                  →
                </span>
                <p className="font-sans text-[15px] font-medium leading-snug tracking-[-0.005em] text-paper md:text-[17px]">
                  {t.after}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
