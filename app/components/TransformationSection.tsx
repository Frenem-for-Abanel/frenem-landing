"use client"

import Reveal from "./Reveal"

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

export default function TransformationSection() {
  return (
    <section
      className="relative overflow-hidden bg-[var(--frenem-bg-dark)] py-[140px] text-[var(--frenem-bg)]"
      data-section-name="Transformation"
      data-section-num="03"
    >
      <div className="container-v2">
        <Reveal>
          <div className="mb-6 flex items-center gap-3 text-[13px] font-medium text-white/60 before:h-px before:w-6 before:shrink-0 before:bg-[var(--frenem-bg)] before:content-['']">
            The Shift
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mb-14 font-sans text-[clamp(36px,5vw,72px)] font-semibold leading-none tracking-[-0.03em] text-[var(--frenem-bg)]">
            What changes <em className="font-normal italic">after Build.</em>
          </h2>
        </Reveal>

        {/* Desktop / tablet: two columns */}
        <div className="hidden border-t border-white/10 md:block">
          <div className="grid grid-cols-2 gap-0">
            <div className="border-b border-white/10 py-8 pr-8">
              <div className="flex items-center gap-3 pb-6 font-sans text-xs font-medium uppercase tracking-[0.1em] text-white/40">
                <span className="h-2 w-2 shrink-0 rounded-full bg-current" />
                Today
              </div>
            </div>
            <div className="border-b border-l border-white/10 py-8 pl-8">
              <div className="flex items-center gap-3 pb-6 font-sans text-xs font-medium uppercase tracking-[0.1em] text-[var(--frenem-accent)]">
                <span className="h-2 w-2 shrink-0 rounded-full bg-current" />
                After Build
              </div>
            </div>
          </div>
          {transforms.map((t, i) => (
            <Reveal key={t.before} delay={0.04 * i}>
              <div className="grid grid-cols-2 border-b border-white/10 last:border-b-0">
                <div className="flex gap-6 py-7 pr-8">
                  <span className="w-6 shrink-0 pt-1 font-sans text-[13px] font-medium text-white/40">{String(i + 1).padStart(2, "0")}</span>
                  <p className="font-sans text-[17px] font-normal leading-snug text-white/50 line-through decoration-white/25">{t.before}</p>
                </div>
                <div className="flex gap-6 border-l border-white/10 py-7 pl-8">
                  <span className="w-6 shrink-0 pt-1 font-sans text-[13px] font-medium text-white/40">→</span>
                  <p className="font-sans text-[17px] font-medium leading-snug tracking-[-0.005em]">{t.after}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Mobile */}
        <div className="space-y-0 border-t border-white/10 md:hidden">
          {transforms.map((t, i) => (
            <Reveal key={t.before} delay={0.03 * i}>
              <div className="space-y-3 border-b border-white/10 py-6">
                <p className="font-sans text-[15px] text-white/50 line-through decoration-white/25">{t.before}</p>
                <p className="font-sans text-[16px] font-medium leading-snug text-[var(--frenem-accent)]">→</p>
                <p className="font-sans text-[16px] font-medium leading-snug">{t.after}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
