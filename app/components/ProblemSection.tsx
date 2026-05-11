"use client"

import Reveal from "./Reveal"

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
    <section
      className="relative overflow-hidden bg-[var(--frenem-bg-soft)] py-[140px]"
      data-section-name="Problem"
      data-section-num="02"
    >
      <div className="container-v2">
        <div className="mb-20 grid grid-cols-1 items-end gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="frenem-section-label">The Founder&apos;s Dilemma</div>
            <h2 className="font-sans text-[clamp(36px,5vw,72px)] font-semibold leading-none tracking-[-0.03em]">
              You built this business.
              <br />
              Now it can&apos;t run{" "}
              <em className="font-normal italic">
                without you.
              </em>
            </h2>
          </Reveal>
          <Reveal delay={0.06}>
            <div className="rounded-xl border border-[var(--frenem-border-strong)] bg-[var(--frenem-bg)] p-8">
              <div className="mb-2 font-sans text-[64px] font-semibold leading-none tracking-[-0.04em] text-[var(--frenem-accent)]">
                1
              </div>
              <p className="font-sans text-sm leading-snug text-[var(--frenem-ink-secondary)]">
                person every decision routes through. The bottleneck has a name.
              </p>
            </div>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 border-l border-t border-[var(--frenem-border-strong)] md:grid-cols-2">
          {pains.map((pain, i) => (
            <Reveal key={pain.title} delay={0.03 * i}>
              <div className="flex cursor-default flex-col gap-4 border-r border-b border-[var(--frenem-border-strong)] bg-[var(--frenem-bg)] p-10 transition-colors duration-300 hover:bg-[var(--frenem-bg-soft)]">
                <span className="font-sans text-[13px] font-medium tracking-[0.02em] text-[var(--frenem-ink-tertiary)]">
                  {pain.num}
                </span>
                <h3 className="font-sans text-2xl font-semibold leading-tight tracking-[-0.02em]">{pain.title}</h3>
                <p className="font-sans text-base font-normal leading-relaxed text-[var(--frenem-ink-secondary)]">
                  {pain.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
