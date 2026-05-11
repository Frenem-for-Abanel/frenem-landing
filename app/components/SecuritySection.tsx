"use client"

import Reveal from "./Reveal"

const ITEMS = [
  {
    title: "Encryption",
    body: "Data encrypted at rest and in transit. Always.",
    Icon: LockIcon,
  },
  {
    title: "Access Control",
    body: "Secure OTP authentication with role-based permissions for promoter, HR, and employee levels.",
    Icon: CheckIcon,
  },
  {
    title: "Monitoring",
    body: "Full audit trails for every important action on the platform. Nothing happens off the record.",
    Icon: ActivityIcon,
  },
  {
    title: "Resilience",
    body: "99%+ server uptime with continuous reliability monitoring. Daily backups across a 7-day window.",
    Icon: RefreshIcon,
  },
  {
    title: "Data Minimisation",
    body: "Only essential PII is collected and stored. We don't ask for what we don't need.",
    Icon: InfoIcon,
  },
] as const

function LockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <rect height="11" rx="2" ry="2" width="18" x="3" y="11" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M9 12l2 2 4-4" />
      <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c2.4 0 4.58.94 6.19 2.46" />
    </svg>
  )
}

function ActivityIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M2 12h4l3-9 6 18 3-9h4" />
    </svg>
  )
}

function RefreshIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M21 12a9 9 0 1 1-9-9c2.4 0 4.58.94 6.19 2.46" />
      <polyline points="21 3 21 9 15 9" />
    </svg>
  )
}

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4M12 16h.01" />
    </svg>
  )
}

export default function SecuritySection() {
  return (
    <section
      className="overflow-hidden bg-[var(--frenem-bg-dark)] py-[140px] text-[var(--frenem-bg)]"
      data-section-name="Security"
      data-section-num="08"
    >
      <div className="container-v2">
        <div className="mb-20 grid grid-cols-1 items-end gap-8 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="mb-6 flex items-center gap-3 text-[13px] font-medium text-white/60 before:h-px before:w-6 before:shrink-0 before:bg-[var(--frenem-bg)] before:content-['']">
              Security &amp; Trust
            </div>
            <h2 className="font-sans text-[clamp(36px,5vw,72px)] font-semibold leading-none tracking-[-0.03em]">
              Your{" "}
              <em className="font-normal italic text-[var(--frenem-accent)]">data,</em> protected.
            </h2>
          </Reveal>
          <Reveal delay={0.06}>
            <p className="max-w-[480px] justify-self-end font-sans text-xl font-normal leading-normal tracking-[-0.005em] text-white/70">
              Organisation data is sensitive. We treat it that way. Frenem is built on enterprise-grade security practices from the ground up.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 border-l border-t border-[var(--frenem-border-dark)] md:grid-cols-2 xl:grid-cols-5">
          {ITEMS.map(({ title, body, Icon }, i) => (
            <Reveal key={title} delay={0.03 * i}>
              <div className="flex min-h-[260px] flex-col gap-4 border-b border-r border-[var(--frenem-border-dark)] bg-transparent p-9 transition-colors duration-500 hover:bg-white/[0.02] xl:min-h-[280px]">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center text-[var(--frenem-accent)]">
                  <Icon className="h-9 w-9 stroke-[1.5]" />
                </div>
                <h4 className="font-sans text-[17px] font-semibold tracking-[-0.01em] text-[var(--frenem-bg)]">{title}</h4>
                <p className="mt-auto font-sans text-sm font-normal leading-relaxed text-white/55">{body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
