"use client"

import type { ReactNode } from "react"
import Reveal from "../Reveal"
import { Section, SectionHead } from "../Section"

const T = "var(--tint-bright)"
const spin = "origin-center [transform-box:fill-box] motion-safe:group-hover:animate-[spin-slow_9s_linear_infinite]"

/** Each lens drawn as who is looking at whom. */
const GLYPHS: Record<string, ReactNode> = {
  Self: (
    <>
      <circle cx="40" cy="40" r="12" fill="currentColor" />
      <circle cx="40" cy="40" r="27" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="5 6" className={spin} />
    </>
  ),
  Subject: (
    <>
      <circle cx="40" cy="44" r="12" fill="currentColor" />
      <circle cx="12" cy="16" r="8" fill={T} />
      <circle cx="68" cy="16" r="8" fill={T} />
      <path d="M18 22l10 10M62 22L52 32" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  System: (
    <>
      <rect x="6" y="6" width="68" height="68" fill="none" stroke="currentColor" strokeWidth="3" />
      <circle cx="40" cy="40" r="12" fill="currentColor" />
      <circle cx="20" cy="22" r="6" fill={T} />
      <circle cx="60" cy="58" r="6" fill={T} />
    </>
  ),
  Dyad: (
    <>
      <rect x="16" y="34" width="48" height="12" rx="6" fill={T} className="origin-center [transform-box:fill-box] transition-transform duration-700 group-hover:scale-x-125" />
      <circle cx="14" cy="40" r="13" fill="currentColor" />
      <circle cx="66" cy="40" r="13" fill="currentColor" />
    </>
  ),
}

const lenses = [
  {
    title: "Self",
    description: "How individuals see their own behaviour, habits, and self-regulation at work.",
  },
  {
    title: "Subject",
    description:
      "How colleagues actually experience working with a person: the mirror held up to self-perception.",
  },
  {
    title: "System",
    description:
      "The conditions people work inside: workload, autonomy, clarity, and whether it feels safe to speak up.",
  },
  {
    title: "Dyad",
    description:
      "The energy or friction inside specific working relationships. The lens that makes the invisible network visible.",
    differentiator: true,
  },
] as const

export default function LensesSection() {
  return (
    <Section>
      <SectionHead
        kicker="What Pulse measures"
        title={
          <>
            Four lenses. One <em>diagnostic.</em>
          </>
        }
      />

      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {lenses.map((lens, i) => {
          const accent = "differentiator" in lens
          return (
            <li key={lens.title}>
              <Reveal delay={0.06 * i} variant="clip" className="h-full">
                <div className={`group flex h-full min-h-[380px] flex-col p-7 ${accent ? "bg-(--tint-soft)" : "bg-paper-soft"}`}>
                  <svg aria-hidden viewBox="0 0 80 80" className="h-20 w-20 text-ink">
                    {GLYPHS[lens.title]}
                  </svg>
                  <div className="mt-auto pt-12">
                    {accent ? <p className="type-kicker mb-3">The differentiator</p> : null}
                    <h3 className="text-[40px] font-extrabold leading-none tracking-[-0.04em] [font-stretch:110%]">{lens.title}</h3>
                    <p className="mt-4 text-[16px] leading-relaxed text-ink-secondary">{lens.description}</p>
                  </div>
                </div>
              </Reveal>
            </li>
          )
        })}
      </ul>
    </Section>
  )
}
