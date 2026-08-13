"use client"

import { Lock, ShieldCheck, Activity, RefreshCw, Scan } from "lucide-react"
import Reveal from "./Reveal"
import { Section, SectionLabel, SectionHeading } from "./Section"

const ITEMS = [
  {
    title: "Encryption",
    body: "Data encrypted at rest and in transit. Always.",
    Icon: Lock,
  },
  {
    title: "Access Control",
    body: "Secure OTP authentication with role-based permissions for promoter, HR, and employee levels.",
    Icon: ShieldCheck,
  },
  {
    title: "Monitoring",
    body: "Full audit trails for every important action on the platform. Nothing happens off the record.",
    Icon: Activity,
  },
  {
    title: "Resilience",
    body: "99%+ server uptime with continuous reliability monitoring. Daily backups across a 7-day window.",
    Icon: RefreshCw,
  },
  {
    title: "Data Minimisation",
    body: "Only essential PII is collected and stored. We don't ask for what we don't need.",
    Icon: Scan,
  },
] as const

/**
 * Platform security facts. `variant="full"` is the detailed dark band;
 * `variant="strip"` is the compact row for pages that only need a nod.
 */
export default function SecuritySection({ variant = "full" }: { variant?: "full" | "strip" }) {
  if (variant === "strip") {
    return (
      <Section dark className="py-14 md:py-20">
        <Reveal>
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[auto_1fr] lg:gap-16">
            <h2 className="max-w-[280px] font-sans text-xl font-semibold tracking-[-0.01em] text-paper md:text-2xl">
              Enterprise-grade security, by default.
            </h2>
            <ul className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-5">
              {ITEMS.map(({ title, Icon }) => (
                <li key={title} className="flex items-center gap-3 font-sans text-sm text-white/70">
                  <Icon aria-hidden className="h-4.5 w-4.5 shrink-0 text-(--tint-bright)" strokeWidth={1.7} />
                  {title}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </Section>
    )
  }

  return (
    <Section dark>
      <div className="mb-12 grid grid-cols-1 items-end gap-6 md:mb-20 md:gap-8 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <SectionLabel>Security &amp; Trust</SectionLabel>
          <SectionHeading className="text-paper">
            Your <em>data,</em> protected.
          </SectionHeading>
        </Reveal>
        <Reveal delay={0.06}>
          <p className="max-w-[480px] justify-self-end font-sans text-lg font-normal leading-normal tracking-[-0.005em] text-white/70 md:text-xl">
            Organisation data is sensitive. We treat it that way. Frenem is built on
            enterprise-grade security practices from the ground up.
          </p>
        </Reveal>
      </div>

      <div className="grid grid-cols-1 border-l border-t border-line-dark md:grid-cols-2 xl:grid-cols-5">
        {ITEMS.map(({ title, body, Icon }, i) => (
          <Reveal key={title} delay={0.03 * i}>
            <div className="flex min-h-0 flex-col gap-4 border-b border-r border-line-dark bg-transparent p-6 transition-colors duration-500 hover:bg-white/[0.02] md:min-h-[260px] md:p-9 xl:min-h-[280px]">
              <Icon aria-hidden className="h-9 w-9 shrink-0 text-(--tint-bright)" strokeWidth={1.5} />
              <h3 className="font-sans text-[17px] font-semibold tracking-[-0.01em] text-paper">
                {title}
              </h3>
              <p className="mt-auto font-sans text-sm font-normal leading-relaxed text-white/55">
                {body}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
