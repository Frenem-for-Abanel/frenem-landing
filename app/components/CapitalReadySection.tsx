"use client"

import Reveal from "./Reveal"

const cards = [
  {
    title: "IPO Readiness",
    description:
      "Governance model, role separation, committee oversight, organisational transparency, and succession visibility.",
  },
  {
    title: "PE / VC Readiness",
    description:
      "Institutional governance, scalable operating model, management depth, and reduced key-person risk.",
  },
  {
    title: "Founder-Independent Execution",
    description:
      "A system-driven model where decisions happen because the structure supports them, not because the founder approves them.",
  },
]

export default function CapitalReadySection() {
  return (
    <section className="py-[140px] bg-[#edeae4]">
      <div className="container-v2">
        <Reveal>
          <div className="font-sans text-sm font-medium tracking-[2.5px] uppercase text-[#b8860b] mb-5">
            Capital Ready
          </div>
        </Reveal>
        <Reveal delay={0.04}>
          <h2 className="font-serif text-[clamp(36px,5vw,56px)] font-normal leading-[1.12] tracking-[-1px] mb-14 text-[#1a1a18]">
            Institution-ready, before markets force the change
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="font-serif text-[22px] text-[#6b6860] leading-[1.7] mb-12">
            IPOs and PE deals don&apos;t fail because of strategy. They fail because investors see organisation risk:
            promoter dependency, informal decision-making, and a thin leadership bench. Build moves that work
            upstream, before it becomes expensive.
          </p>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="font-serif text-[30px] italic leading-[1.4] text-[#1a1a18] mb-2.5">
            &quot;Will this company still work if the promoter steps back?&quot;
          </p>
          <p className="font-serif text-[18px] text-[#9b978f] mb-14">
            The question every merchant banker asks internally
          </p>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:items-stretch">
          {cards.map((card, i) => (
            <Reveal key={card.title} delay={0.04 * (i + 4)} className="min-h-full md:h-full">
              <div className="h-full p-8 md:py-8 md:px-7 bg-white rounded-[14px] border border-[rgba(26,26,24,0.08)] flex flex-col">
                <h4 className="font-serif text-2xl font-normal mb-3 leading-[1.25] text-[#1a1a18]">
                  {card.title}
                </h4>
                <p className="font-serif text-[19px] text-[#6b6860] leading-[1.65] flex-1">{card.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
