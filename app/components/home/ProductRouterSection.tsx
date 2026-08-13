"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import Reveal from "../Reveal"
import { Section, SectionLabel, SectionHeading } from "../Section"

const cards = [
  {
    tintClass: "tint-pulse",
    product: "Pulse",
    tagline: "Relational Diagnostics",
    problem: "People you counted on keep leaving — and it keeps surprising you.",
    description:
      "Pulse maps how your people actually work together: exit risk, hidden brokers, and cross-team friction, visible early.",
    meta: ["4-week pilot", "5 min per person", "3 report cuts"],
    href: "/pulse",
  },
  {
    tintClass: "tint-build",
    product: "Build",
    tagline: "Organisation Design",
    problem: "The company still can't run without you.",
    description:
      "An 8-week sprint that designs the structure, decision rights, and succession your growth needs. Without losing control.",
    meta: ["8-week sprint", "Decision rights", "Succession map"],
    href: "/build",
  },
  {
    tintClass: "tint-prism",
    product: "Prism",
    tagline: "Employee Management",
    problem: "Nobody's quite sure who owns what anymore.",
    description:
      "Lightweight employee management: live org charts, KRAs, review cycles, and governance in one place your team actually uses.",
    meta: ["Live org charts", "KRAs & reviews", "Audit trails"],
    href: "/prism",
  },
] as const

export default function ProductRouterSection() {
  return (
    <Section id="products">
      <Reveal>
        <SectionLabel>Start With the Problem</SectionLabel>
      </Reveal>
      <Reveal delay={0.04}>
        <SectionHeading className="mb-10 max-w-[900px] md:mb-16">
          Three products. One <em>operating picture.</em>
        </SectionHeading>
      </Reveal>

      <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-3">
        {cards.map((card, i) => (
          <Reveal key={card.product} delay={0.05 * i} className="h-full">
            <Link
              href={card.href}
              className={`${card.tintClass} group flex h-full flex-col rounded-2xl border border-line-strong bg-paper p-6 transition-all duration-300 hover:-translate-y-1 hover:border-ink hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] md:p-8`}
            >
              <span className="mb-6 inline-flex items-baseline gap-2 self-start rounded-full bg-(--tint-soft) px-3 py-1.5">
                <span className="font-sans text-sm font-semibold text-(--tint-ink)">
                  {card.product}
                </span>
                <span className="font-sans text-[11px] font-medium text-(--tint-ink) opacity-70">
                  {card.tagline}
                </span>
              </span>

              <p className="type-display-3 mb-4 text-[22px] md:text-[26px]">
                &ldquo;{card.problem}&rdquo;
              </p>
              <p className="mb-6 font-sans text-[15px] leading-relaxed text-ink-secondary">
                {card.description}
              </p>

              <div className="mt-auto">
                <ul className="mb-5 flex flex-wrap gap-1.5">
                  {card.meta.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-line px-2.5 py-1 font-sans text-[11px] font-medium text-ink-tertiary"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
                <span className="inline-flex items-center gap-1.5 font-sans text-[14px] font-medium text-(--tint-ink)">
                  Explore {card.product}
                  <ArrowRight
                    aria-hidden
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                  />
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
