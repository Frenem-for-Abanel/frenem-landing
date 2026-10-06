"use client"

import { useEffect, useRef, useState, type ComponentType } from "react"
import Reveal from "../Reveal"
import { Section, SectionHead } from "../Section"
import { smoothScrollTo } from "../../utils/smooth-scroll"
import {
  OrgChartVignette,
  KraVignette,
  ReviewCycleVignette,
  MoonshotVignette,
  WhistleblowerVignette,
  AuditTrailVignette,
} from "./PrismVignettes"

interface Feature {
  short: string
  title: string
  description: string
  Vignette: ComponentType
}

const features: Feature[] = [
  {
    short: "Org charts",
    title: "Dynamic org charts",
    description:
      "Live org charts and reporting chains that update as your team grows. Always current, always visible. No more quarterly PowerPoint archaeology.",
    Vignette: OrgChartVignette,
  },
  {
    short: "KRAs & KPIs",
    title: "Transparent KRAs, KPIs, and responsibilities",
    description:
      "Everyone knows what they own, what they're measured on, and what success looks like in their role. Clarity as a default, not an annual exercise.",
    Vignette: KraVignette,
  },
  {
    short: "Review cycles",
    title: "Seamless performance review cycles",
    description:
      "From goal setting through to reviews. A complete, continuous cycle that doesn't live in spreadsheets, and doesn't stall waiting for someone to chase.",
    Vignette: ReviewCycleVignette,
  },
  {
    short: "Moonshots",
    title: "Employee-driven innovation",
    description:
      "Moonshot idea submissions that give every person in the company a voice in shaping what comes next. Good ideas stop dying in inboxes.",
    Vignette: MoonshotVignette,
  },
  {
    short: "Whistleblower channel",
    title: "Secure whistleblower channel",
    description:
      "A safe, anonymous channel for raising concerns. Built in, not bolted on, because trust infrastructure belongs inside the operating system.",
    Vignette: WhistleblowerVignette,
  },
  {
    short: "Audit trails",
    title: "Edit histories and audit trails",
    description:
      "Every change tracked. Full transparency for governance, compliance, and peace of mind. The record keeps itself.",
    Vignette: AuditTrailVignette,
  },
]

/** Six features as a long read, with a sticky contents list that tracks your place. */
export default function FeatureWalkthrough() {
  const [active, setActive] = useState(0)
  const itemRefs = useRef<Array<HTMLElement | null>>([])

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index))
        }
      },
      // A thin band across the middle of the viewport decides which one is "current".
      { rootMargin: "-45% 0px -50% 0px" }
    )
    itemRefs.current.forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <Section id="features">
      <SectionHead
        kicker="What Prism does"
        title={
          <>
            Clarity across your <em>entire</em> organisation.
          </>
        }
      />

      <div className="grid grid-cols-1 gap-x-10 lg:grid-cols-12">
        <nav aria-label="Prism features" className="hidden lg:col-span-4 lg:block">
          <ol className="sticky top-28 flex flex-col gap-1">
            {features.map((f, i) => (
              <li key={f.short}>
                <a
                  href={`#feature-${i + 1}`}
                  onClick={(e) => {
                    e.preventDefault()
                    smoothScrollTo(`feature-${i + 1}`)
                  }}
                  aria-current={active === i ? "true" : undefined}
                  className={`flex items-center gap-4 rounded-full px-5 py-3 text-[19px] font-bold tracking-[-0.02em] [font-stretch:106%] transition-colors duration-500 ${
                    active === i ? "bg-(--tint-soft) text-ink" : "text-ink-tertiary hover:text-ink"
                  }`}
                >
                  <span
                    aria-hidden
                    className={`h-3 w-3 shrink-0 bg-(--tint-bright) transition-[transform,border-radius] duration-500 ${
                      active === i ? "scale-100 rounded-none rotate-45" : "scale-50 rounded-full"
                    }`}
                  />
                  {f.short}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="flex flex-col gap-2 lg:col-span-8">
          {features.map((feature, i) => (
            <article
              key={feature.title}
              id={`feature-${i + 1}`}
              data-index={i}
              ref={(el) => {
                itemRefs.current[i] = el
              }}
              className="scroll-mt-24"
            >
              <Reveal variant="clip">
                <div className="grid grid-cols-1 items-center gap-8 bg-paper-soft p-7 md:grid-cols-2 md:gap-10 md:p-10">
                  <div className="min-w-0">
                    <h3 className="text-[clamp(28px,2.6vw,38px)] font-extrabold leading-[1] tracking-[-0.035em] [font-stretch:106%]">
                      {feature.title}
                    </h3>
                    <p className="mt-4 text-[17px] leading-relaxed text-ink-secondary">{feature.description}</p>
                  </div>
                  <div className="bg-(--tint-soft) p-5 sm:p-7">
                    <feature.Vignette />
                  </div>
                </div>
              </Reveal>
            </article>
          ))}
        </div>
      </div>
    </Section>
  )
}
