"use client"

import Reveal from "../Reveal"
import { Section, SectionHead } from "../Section"
import ModuleGlyph from "./ModuleGlyph"
import type { ModuleId } from "../../utils/build-plan"

/**
 * What Build leaves behind, said as business outcomes. The method behind
 * each one stays with the team; the glyphs only hint at its shape.
 */
const outcomes: Array<{ glyph: ModuleId; title: string; detail: string }> = [
  {
    glyph: "decision-rights",
    title: "Decisions at the right level",
    detail: "Clear calls on who decides what, so the business stops queueing at your door.",
  },
  {
    glyph: "job-architecture",
    title: "One owner for every outcome",
    detail: "Accountability that is written down and lived, not negotiated in meetings.",
  },
  {
    glyph: "org-map",
    title: "A leaner way of working",
    detail: "Fewer layers and handoffs between a decision and the work it unlocks.",
  },
  {
    glyph: "guardrails",
    title: "Control, built in",
    detail: "The controls you care about, designed into how the business runs.",
  },
  {
    glyph: "nine-box",
    title: "A bench ready to lead",
    detail: "Leaders who can step up, so growth never hinges on one person.",
  },
  {
    glyph: "operating-model",
    title: "An investor-grade operating model",
    detail: "Documented, validated, and running in your business when we step back.",
  },
]

export default function DeliverablesSection() {
  return (
    <Section tone="tint">
      <SectionHead
        kicker="What you walk away with"
        title={
          <>
            A working operating system. <em>Not a binder.</em>
          </>
        }
        aside={<p>Built with your leadership team, and left running in the business when we step back.</p>}
      />

      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {outcomes.map((item, i) => (
          <li key={item.title}>
            <Reveal delay={0.05 * (i % 3)} variant="scale" className="h-full">
              <div className="group flex h-full flex-col bg-paper p-7 md:p-8">
                <ModuleGlyph
                  id={item.glyph}
                  className="h-11 w-11 text-ink transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-[-8deg] group-hover:scale-110"
                />
                <h3 className="mt-10 text-[22px] font-bold leading-tight tracking-[-0.025em] [font-stretch:106%]">
                  {item.title}
                </h3>
                <p className="mt-2 text-[16px] leading-relaxed text-ink-secondary">{item.detail}</p>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  )
}
