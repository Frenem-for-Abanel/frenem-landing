"use client"

import Reveal from "./Reveal"

const phases = [
  {
    label: "Phase 01",
    title: "Diagnose",
    description:
      "Understand the baseline: people maturity, employee data, employee voice, and how decisions actually flow today. Build the foundation everything else sits on.",
    time: "Weeks 1–2",
  },
  {
    label: "Phase 02",
    title: "Design",
    description:
      "Build the architecture: the grade structure, role catalog, org map, job descriptions, and decision rights. Turn complexity into a simple organisation that executes.",
    time: "Weeks 3–5",
  },
  {
    label: "Phase 03",
    title: "Deploy",
    description:
      "Lock in the competency framework, map talent, and deliver a validated, boardroom-ready operating model. A leadership blueprint that outlasts individuals.",
    time: "Weeks 6–8",
  },
]

export default function HowItWorksSection() {
  return (
    <section id="how" className="py-[140px]">
      <div className="container-wide">
        <Reveal>
          <div className="font-sans text-sm font-medium tracking-[2.5px] uppercase text-[#b8860b] mb-5">
            How It Works
          </div>
        </Reveal>
        <Reveal delay={0.04}>
          <h2 className="font-serif text-[clamp(36px,5vw,56px)] font-normal leading-[1.12] tracking-[-1px] mb-14 text-[#1a1a18]">
            Fit. Flat. Fast.
            <br />
            Ready for scale.
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="font-serif text-[22px] text-[#6b6860] leading-[1.65] mb-16 max-w-[500px]">
            A structured sprint, not a meandering engagement. You get a working operating system, not a binder.
          </p>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0.5 bg-[rgba(26,26,24,0.06)] rounded-[20px] overflow-hidden md:items-stretch">
          {phases.map((phase, i) => (
            <Reveal key={phase.title} delay={0.04 * (i + 3)} className="min-h-full md:h-full">
              <div
                className={`h-full p-12 md:py-12 md:px-9 bg-[#1a1a18] text-[#f6f4f0] flex flex-col ${
                  i === 0 ? "md:rounded-l-[20px]" : ""
                } ${i === phases.length - 1 ? "md:rounded-r-[20px]" : ""}`}
              >
                <div className="font-sans text-sm font-medium tracking-[2px] uppercase text-[#d4a843] mb-5">
                  {phase.label}
                </div>
                <h3 className="font-serif text-[32px] font-normal mb-4">{phase.title}</h3>
                <p className="font-serif text-[19px] text-[rgba(246,244,240,0.5)] leading-[1.7] mb-7 flex-1">
                  {phase.description}
                </p>
                <span className="inline-block font-sans text-sm font-medium tracking-[1.5px] uppercase text-[#d4a843] py-1.5 px-4 border border-[rgba(212,168,67,0.25)] rounded-[980px] w-fit">
                  {phase.time}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
