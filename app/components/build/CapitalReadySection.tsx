"use client"

import Reveal from "../Reveal"
import SplitText from "../motion/SplitText"
import Parallax from "../motion/Parallax"
import { Section, SectionHead } from "../Section"

const readiness = [
  {
    title: "IPO Readiness",
    description:
      "Governance model, role separation, committee oversight, organisational transparency, and succession visibility.",
    field: "bg-(--tint-soft)",
    shape: "rounded-full",
  },
  {
    title: "PE / VC Readiness",
    description:
      "Institutional governance, scalable operating model, management depth, and reduced key-person risk.",
    field: "bg-paper-soft",
    shape: "",
  },
  {
    title: "Founder-Independent Execution",
    description:
      "A system-driven model where decisions happen because the structure supports them, not because the founder approves them.",
    field: "bg-sand",
    shape: "rounded-full w-20 h-10",
  },
]

export default function CapitalReadySection() {
  return (
    <Section>
      <SectionHead
        kicker="Capital ready"
        title={
          <>
            Institution-ready. Before markets <em>force the change.</em>
          </>
        }
        aside={
          <p>
            IPOs and PE deals don&apos;t fail because of strategy. They fail because investors see
            organisation risk. Promoter dependency, informal decision-making, a thin leadership
            bench. Build moves that work upstream, before it becomes expensive.
          </p>
        }
      />

      <figure className="grain grain-light relative my-8 overflow-clip bg-(--tint-deep) px-6 py-16 text-paper md:my-12 md:px-16 md:py-24">
        <Parallax y={[60, -60]} rotate={[0, 45]} className="absolute -right-10 -top-10 md:right-10 md:top-10">
          <div aria-hidden className="h-28 w-28 bg-(--tint-soft) md:h-40 md:w-40" />
        </Parallax>
        <SplitText as="p" className="relative max-w-[18ch] text-[clamp(34px,5vw,76px)] font-light leading-[0.98] tracking-[-0.045em] [font-stretch:104%]">
          Will this company still work if the promoter steps back?
        </SplitText>
        <figcaption className="relative mt-8 text-[16px] font-medium text-white/65">
          The question every merchant banker asks internally
        </figcaption>
      </figure>

      <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
        {readiness.map((item, i) => (
          <Reveal key={item.title} delay={0.06 * i} variant="clip" className="h-full">
            <div className={`group flex h-full flex-col p-7 md:p-9 ${item.field}`}>
              <span
                aria-hidden
                className={`block h-10 w-10 bg-(--tint-deep) transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-90 ${item.shape}`}
              />
              <h3 className="mt-12 text-[26px] font-extrabold leading-[1.05] tracking-[-0.03em] [font-stretch:106%]">{item.title}</h3>
              <p className="mt-3 text-[16px] leading-relaxed text-ink-secondary">{item.description}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
