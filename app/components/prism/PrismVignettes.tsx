import { Lock, ShieldCheck } from "lucide-react"

/**
 * Small product-evidence vignettes for the Prism feature walkthrough.
 * Abstract UI shapes only; no fabricated people or customer data.
 */

function VignetteFrame({
  caption,
  children,
}: {
  caption: string
  children: React.ReactNode
}) {
  return (
    <div className="flex h-full flex-col gap-3 rounded-xl border border-line-strong bg-paper p-4 shadow-[0_12px_32px_rgba(0,0,0,0.04)] sm:p-5">
      <div className="border-b border-line pb-2.5 font-sans text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-tertiary">
        {caption}
      </div>
      <div className="flex flex-1 flex-col justify-center">{children}</div>
    </div>
  )
}

export function OrgChartVignette() {
  return (
    <VignetteFrame caption="Org chart · live">
      <svg aria-hidden className="mx-auto block w-full max-w-[240px]" viewBox="0 0 220 130">
        <line stroke="#9c9c98" strokeWidth="1" x1="110" x2="50" y1="26" y2="64" />
        <line stroke="#9c9c98" strokeWidth="1" x1="110" x2="110" y1="26" y2="64" />
        <line stroke="#9c9c98" strokeWidth="1" x1="110" x2="170" y1="26" y2="64" />
        <line stroke="#cfcfcb" strokeWidth="1" x1="50" x2="30" y1="80" y2="112" />
        <line stroke="#cfcfcb" strokeWidth="1" x1="50" x2="70" y1="80" y2="112" />
        <line stroke="#cfcfcb" strokeWidth="1" x1="110" x2="110" y1="80" y2="112" />
        <line stroke="#cfcfcb" strokeWidth="1" x1="170" x2="150" y1="80" y2="112" />
        <line stroke="#cfcfcb" strokeWidth="1" x1="170" x2="190" y1="80" y2="112" />
        <circle cx="110" cy="18" fill="var(--color-ink)" r="9" />
        <circle cx="50" cy="72" fill="var(--color-paper)" r="7.5" stroke="var(--color-ink)" strokeWidth="1.5" />
        <circle cx="110" cy="72" fill="var(--color-paper)" r="7.5" stroke="var(--color-ink)" strokeWidth="1.5" />
        <circle cx="170" cy="72" fill="var(--color-paper)" r="7.5" stroke="var(--color-ink)" strokeWidth="1.5" />
        <circle cx="30" cy="118" fill="#9c9c98" r="4.5" />
        <circle cx="70" cy="118" fill="#9c9c98" r="4.5" />
        <circle cx="110" cy="118" fill="#9c9c98" r="4.5" />
        <circle cx="150" cy="118" fill="#9c9c98" r="4.5" />
        <circle cx="190" cy="118" fill="var(--tint-bright)" r="4.5" />
      </svg>
      <p className="mt-3 text-center font-sans text-[11px] text-ink-tertiary">
        New joiner placed, chart updated instantly
      </p>
    </VignetteFrame>
  )
}

export function KraVignette() {
  const rows = [
    { label: "Revenue growth", width: 78 },
    { label: "Team NPS", width: 92 },
    { label: "Retention", width: 65 },
  ]
  return (
    <VignetteFrame caption="KRAs · Q1 scorecard">
      <div className="flex flex-col gap-3">
        {rows.map((row) => (
          <div key={row.label} className="grid grid-cols-[1fr_auto] items-center gap-3 font-sans text-xs">
            <span className="truncate text-ink">{row.label}</span>
            <div className="h-1.5 w-[100px] overflow-hidden rounded-full bg-line">
              <div
                className="h-full rounded-full bg-(--tint-bright)"
                style={{ width: `${row.width}%` }}
              />
            </div>
          </div>
        ))}
        <p className="mt-1 font-sans text-[11px] text-ink-tertiary">
          Owner, measure, and target, visible to the whole chain
        </p>
      </div>
    </VignetteFrame>
  )
}

export function ReviewCycleVignette() {
  const steps = ["Goals", "Self review", "Manager review", "Sign-off"]
  const activeIndex = 2
  return (
    <VignetteFrame caption="Review cycle · H1">
      <ol className="flex flex-col gap-2.5">
        {steps.map((step, i) => {
          const done = i < activeIndex
          const active = i === activeIndex
          return (
            <li key={step} className="flex items-center gap-3 font-sans text-xs">
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ${
                  done
                    ? "bg-(--tint-bright) text-white"
                    : active
                      ? "border-2 border-(--tint-bright) text-(--tint-ink)"
                      : "border border-line-strong text-ink-tertiary"
                }`}
              >
                {done ? "✓" : i + 1}
              </span>
              <span className={active ? "font-semibold text-ink" : done ? "text-ink-secondary" : "text-ink-tertiary"}>
                {step}
              </span>
              {active && (
                <span className="ml-auto rounded-full bg-(--tint-soft) px-2 py-0.5 text-[10px] font-medium text-(--tint-ink)">
                  In progress
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </VignetteFrame>
  )
}

export function MoonshotVignette() {
  return (
    <VignetteFrame caption="Moonshots · idea inbox">
      <div className="flex flex-col gap-2.5">
        <div className="rounded-lg border border-line-strong bg-paper-soft p-3">
          <div className="mb-1 flex items-center justify-between gap-2">
            <span className="font-sans text-xs font-semibold text-ink">Moonshot #14</span>
            <span className="rounded-full bg-(--tint-soft) px-2 py-0.5 font-sans text-[10px] font-medium text-(--tint-ink)">
              Under review
            </span>
          </div>
          <div className="h-2 w-4/5 rounded bg-line" />
          <div className="mt-1.5 h-2 w-3/5 rounded bg-line" />
        </div>
        <div className="rounded-lg border border-line bg-paper p-3 opacity-70">
          <div className="mb-1 flex items-center justify-between gap-2">
            <span className="font-sans text-xs font-semibold text-ink">Moonshot #13</span>
            <span className="rounded-full bg-paper-soft px-2 py-0.5 font-sans text-[10px] font-medium text-ink-tertiary">
              Shipped
            </span>
          </div>
          <div className="h-2 w-2/3 rounded bg-line" />
        </div>
        <p className="font-sans text-[11px] text-ink-tertiary">
          Every employee can propose the next big move
        </p>
      </div>
    </VignetteFrame>
  )
}

export function WhistleblowerVignette() {
  return (
    <VignetteFrame caption="Whistleblower channel">
      <div className="flex flex-col items-center gap-3 py-2 text-center">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-(--tint-soft)">
          <Lock aria-hidden className="h-5 w-5 text-(--tint-ink)" strokeWidth={1.8} />
        </span>
        <div className="flex items-center gap-2 font-sans text-[11px] font-medium text-ink-secondary">
          <ShieldCheck aria-hidden className="h-3.5 w-3.5 text-(--tint-ink)" />
          Anonymous · Encrypted · Off the org chart
        </div>
        <div className="w-full space-y-1.5 px-4">
          <div className="mx-auto h-2 w-5/6 rounded bg-line" />
          <div className="mx-auto h-2 w-4/6 rounded bg-line" />
        </div>
      </div>
    </VignetteFrame>
  )
}

export function AuditTrailVignette() {
  const rows = [
    { time: "09:41", text: "Role owner changed", kind: "edit" },
    { time: "09:12", text: "KRA target updated", kind: "edit" },
    { time: "Yesterday", text: "Review cycle locked", kind: "lock" },
  ]
  return (
    <VignetteFrame caption="Audit log · immutable">
      <ul className="flex flex-col">
        {rows.map((row) => (
          <li
            key={row.text}
            className="flex items-center gap-3 border-b border-line py-2.5 font-sans text-xs last:border-b-0"
          >
            <span
              className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                row.kind === "lock" ? "bg-ink" : "bg-(--tint-bright)"
              }`}
            />
            <span className="text-ink">{row.text}</span>
            <span className="ml-auto shrink-0 text-[10px] text-ink-tertiary">{row.time}</span>
          </li>
        ))}
      </ul>
      <p className="mt-2 font-sans text-[11px] text-ink-tertiary">
        Every change tracked, nothing off the record
      </p>
    </VignetteFrame>
  )
}
