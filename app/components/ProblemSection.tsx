"use client"

import Reveal from "./Reveal"

const pains = [
  {
    icon: "⏳",
    title: "Everything depends on you",
    description:
      "Every decision, every escalation, every fire. It all routes back to you. You're the bottleneck in your own company.",
  },
  {
    icon: "🔀",
    title: "Roles are unclear as you grow",
    description:
      "People have titles, but nobody knows who owns what. Accountability is a conversation, not a system.",
  },
  {
    icon: "🐌",
    title: "Good people, slow execution",
    description:
      "You have the talent. But decisions crawl through layers, sign-offs, and \"let me check with…\" loops.",
  },
  {
    icon: "👥",
    title: "Overlapping work, unclear ownership",
    description:
      "Multiple people doing the same thing. Nobody quite sure where their remit ends and another's begins.",
  },
  {
    icon: "⚖️",
    title: "Professionalise, but keep control",
    description:
      "You know you need structure. But you've seen what \"consultants\" do. You don't want to lose your company's soul.",
  },
  {
    icon: "🔑",
    title: "Succession feels risky",
    description:
      "There's no visible pipeline. No structured bench. If a key person walks, the plan walks with them.",
  },
]

export default function ProblemSection() {
  return (
    <section className="py-[140px] md:py-[140px] pb-[120px]">
      <div className="container-v2">
        <Reveal>
          <div className="font-sans text-sm font-medium tracking-[2.5px] uppercase text-[#b8860b] mb-5">
            The Founder&apos;s Dilemma
          </div>
        </Reveal>
        <Reveal delay={0.04}>
          <h2 className="font-serif text-[clamp(36px,5vw,56px)] font-normal leading-[1.12] tracking-[-1px] mb-14 text-[#1a1a18]">
            You built this business.
            <br />
            Now it can&apos;t run without you.
          </h2>
        </Reveal>
        <div className="flex flex-col">
          {pains.map((pain, i) => (
            <Reveal key={pain.title} delay={0.04 * (i + 1)}>
              <div className="grid grid-cols-[32px_1fr] gap-5 items-baseline py-8 border-t border-[rgba(26,26,24,0.08)] last:border-b last:border-[rgba(26,26,24,0.08)]">
                <span className="text-xl leading-[1.7]">{pain.icon}</span>
                <div>
                  <h3 className="font-serif text-[28px] font-normal leading-[1.3] tracking-[-0.4px] mb-2.5 text-[#1a1a18]">
                    {pain.title}
                  </h3>
                  <p className="font-serif text-xl text-[#6b6860] leading-[1.7] max-w-[540px]">
                    {pain.description}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
