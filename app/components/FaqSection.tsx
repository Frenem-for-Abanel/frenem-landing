"use client"

import Link from "next/link"
import { Plus } from "lucide-react"
import Reveal from "./Reveal"
import { Section, SectionHead } from "./Section"
import { linkSegments, type FaqEntry } from "../utils/faqs"

/** Native details/summary FAQ: zero JS to operate; opens smoothly where the browser supports it. */
export default function FaqSection({
  label = "Questions",
  heading,
  items,
  id = "questions",
}: {
  label?: string
  heading: React.ReactNode
  items: FaqEntry[]
  id?: string
}) {
  return (
    <Section id={id}>
      <div className="grid grid-cols-1 gap-y-4 lg:grid-cols-12 lg:gap-x-10">
        <div className="lg:col-span-5">
          <SectionHead kicker={label} title={heading} size={3} className="mb-8 lg:mb-0 lg:[&>div]:col-span-12" />
        </div>
        <div className="lg:col-span-7">
          {items.map((item, i) => (
            <Reveal key={item.question} delay={0.04 * i}>
              <details className="faq group border-t-2 border-ink last:border-b-2">
                <summary className="flex min-h-11 items-center justify-between gap-6 py-6 text-[clamp(19px,1.8vw,24px)] font-bold leading-snug tracking-[-0.02em] [font-stretch:104%] md:py-7">
                  {item.question}
                  <span
                    aria-hidden
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-(--tint-soft) transition-[transform,background-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-open:rotate-[135deg] group-open:bg-(--tint-bright)"
                  >
                    <Plus className="h-5 w-5" strokeWidth={2.2} />
                  </span>
                </summary>
                <p className="max-w-[600px] pb-8 text-[17px] leading-relaxed text-ink-secondary">
                  {linkSegments(item.answer, item.links).map((segment, index) =>
                    segment.href ? (
                      <Link
                        key={index}
                        href={segment.href}
                        className="text-ink underline decoration-line-strong underline-offset-4 transition-colors hover:text-(--tint-ink)"
                      >
                        {segment.text}
                      </Link>
                    ) : (
                      <span key={index}>{segment.text}</span>
                    )
                  )}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  )
}
