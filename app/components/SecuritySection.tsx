"use client"

import Reveal from "./Reveal"
import { Section, SectionHead } from "./Section"

const ITEMS = [
  {
    title: "Encryption",
    body: "Data encrypted at rest and in transit. Always.",
  },
  {
    title: "Access Control",
    body: "Secure OTP authentication with role-based permissions for promoter, leadership, and employee levels.",
  },
  {
    title: "Monitoring",
    body: "Full audit trails for every important action on the platform. Nothing happens off the record.",
  },
  {
    title: "Resilience",
    body: "99%+ server uptime with continuous reliability monitoring. Daily backups across a 7-day window.",
  },
  {
    title: "Data Minimisation",
    body: "Only essential PII is collected and stored. We don't ask for what we don't need.",
  },
] as const

/**
 * Platform security facts. `variant="full"` is the detailed ink band;
 * `variant="strip"` is a single band of pills for pages that only need a nod.
 */
export default function SecuritySection({ variant = "full" }: { variant?: "full" | "strip" }) {
  if (variant === "strip") {
    return (
      <section className="bg-paper py-14 md:py-20">
        <div className="container-site grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <h2 className="text-[28px] font-extrabold leading-[1.05] tracking-[-0.03em] [font-stretch:106%] md:text-[34px]">
              Enterprise-grade security, by default.
            </h2>
          </Reveal>
          <Reveal delay={0.1} variant="scale" className="lg:col-span-8">
            <ul className="flex flex-wrap gap-2.5 lg:justify-end">
              {ITEMS.map(({ title }) => (
                <li
                  key={title}
                  className="group inline-flex h-12 items-center gap-2.5 rounded-full bg-paper-soft px-5 text-[15px] font-semibold"
                >
                  <span
                    aria-hidden
                    className="h-3 w-3 rounded-full bg-(--tint-bright) transition-[border-radius,transform] duration-500 group-hover:rotate-45 group-hover:rounded-none"
                  />
                  {title}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>
    )
  }

  return (
    <Section tone="deep" revealFrom="100% 0%">
      <SectionHead
        dark
        kicker="Security and trust"
        title={
          <>
            Your <em>data,</em> protected.
          </>
        }
        aside={
          <p>
            Organisation data is sensitive. We treat it that way. Frenem is built on
            enterprise-grade security practices from the ground up.
          </p>
        }
      />

      <dl>
        {ITEMS.map(({ title, body }, i) => (
          <Reveal
            key={title}
            delay={0.04 * i}
            className="group grid grid-cols-1 gap-3 border-t border-white/15 py-7 md:grid-cols-12 md:items-center md:gap-10 md:py-9"
          >
              <dt className="flex items-center gap-4 text-[clamp(24px,2.6vw,36px)] font-extrabold tracking-[-0.03em] [font-stretch:106%] md:col-span-5">
                <span
                  aria-hidden
                  className="h-5 w-5 shrink-0 rounded-full bg-(--tint-soft) transition-[border-radius,transform] duration-500 group-hover:rotate-45 group-hover:rounded-none"
                />
                {title}
              </dt>
              <dd className="max-w-[560px] text-[17px] leading-relaxed text-white/70 md:col-span-7 md:text-lg">{body}</dd>
          </Reveal>
        ))}
      </dl>
    </Section>
  )
}
