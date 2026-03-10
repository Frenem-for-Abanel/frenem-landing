"use client"

import Reveal from "./Reveal"

const transforms = [
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
    before: "I want to professionalise, but stay in control",
    after: "Governance guardrails you define, with delegation built into the structure",
  },
  {
    before: "Succession feels risky and informal",
    after: "A 9-box talent map with a visible leadership bench and development pipeline",
  },
]

export default function TransformationSection() {
  return (
    <section className="py-[140px] bg-[#1a1a18] text-[#f6f4f0]">
      <div className="container-v2">
        <Reveal>
          <div className="font-sans text-sm font-medium tracking-[2.5px] uppercase text-[#d4a843] mb-5">
            The Shift
          </div>
        </Reveal>
        <Reveal delay={0.04}>
          <h2 className="font-serif text-[clamp(36px,5vw,56px)] font-normal leading-[1.12] tracking-[-1px] mb-14">
            What changes after Build
          </h2>
        </Reveal>
        <div className="flex flex-col">
          {transforms.map((t, i) => (
            <Reveal key={t.before} delay={0.04 * (i + 2)}>
              <div className="grid grid-cols-1 md:grid-cols-[1fr_40px_1fr] gap-5 md:gap-0 items-center py-7 border-t border-[rgba(255,255,255,0.08)] last:border-b last:border-[rgba(255,255,255,0.08)]">
                <div className="font-serif text-[21px] text-[rgba(246,244,240,0.4)] leading-[1.5] md:pr-4">
                  {t.before}
                </div>
                <div className="text-center text-[#d4a843] text-xl font-sans hidden md:block">→</div>
                <div className="font-serif text-[21px] text-[#f6f4f0] leading-[1.5] md:pl-4">
                  {t.after}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
