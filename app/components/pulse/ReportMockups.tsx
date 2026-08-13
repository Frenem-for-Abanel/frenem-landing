/**
 * Miniature report previews for the "Three cuts" section. Deliberately
 * abstract — shapes and labels, no fabricated people or companies.
 */

const cardClass =
  "flex h-full flex-col gap-3 rounded-xl border border-line-strong bg-paper p-4 shadow-[0_12px_32px_rgba(0,0,0,0.04)] sm:p-5"

const cardHeaderClass =
  "flex items-center justify-between gap-2 border-b border-line pb-2.5 font-sans text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-tertiary"

export function IndividualReportMock() {
  return (
    <div className={cardClass} aria-hidden>
      <div className={cardHeaderClass}>
        <span className="text-ink">Individual report</span>
        <span>Private</span>
      </div>
      <div className="flex flex-col gap-2.5 font-sans text-[11px] text-ink-secondary">
        <span className="font-medium text-ink">“Listens under pressure”</span>
        <MockBar label="How I see it" width={82} muted />
        <MockBar label="How colleagues experience it" width={46} />
        <div className="mt-1 rounded-lg bg-(--tint-soft) px-3 py-2 text-[11px] leading-snug text-(--tint-ink)">
          <span className="font-semibold">One habit to practise:</span> close the loop out loud
          before moving on.
        </div>
      </div>
    </div>
  )
}

export function OrgPulseMock() {
  // Strain heatmap: 4 layers × 6 departments, opacity encodes strain.
  const cells = [
    [0.12, 0.2, 0.14, 0.3, 0.16, 0.1],
    [0.18, 0.45, 0.22, 0.62, 0.2, 0.16],
    [0.1, 0.3, 0.85, 0.4, 0.26, 0.14],
    [0.08, 0.16, 0.34, 0.22, 0.12, 0.1],
  ]
  return (
    <div className={cardClass} aria-hidden>
      <div className={cardHeaderClass}>
        <span className="text-ink">Org pulse</span>
        <span>Leadership</span>
      </div>
      <div className="flex flex-1 flex-col justify-center gap-1.5">
        {cells.map((row, r) => (
          <div key={r} className="flex gap-1.5">
            {row.map((opacity, c) => {
              const top = opacity > 0.8
              return (
                <span
                  key={c}
                  className={`h-5 flex-1 rounded-[4px] ${top ? "ring-2 ring-ink ring-offset-1" : ""}`}
                  style={{ backgroundColor: "var(--tint-bright)", opacity: Math.max(opacity, 0.08) }}
                />
              )
            })}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between font-sans text-[10px] text-ink-tertiary">
        <span>Strain by department × layer</span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-[3px] ring-2 ring-ink ring-offset-1" />
          Top risk
        </span>
      </div>
    </div>
  )
}

export function NetworkMapMock() {
  return (
    <div className={cardClass} aria-hidden>
      <div className={cardHeaderClass}>
        <span className="text-ink">Network map</span>
        <span>HR &amp; analytics</span>
      </div>
      <div className="flex-1">
        <svg className="block h-full min-h-[96px] w-full" viewBox="0 0 220 110">
          <g stroke="var(--color-ink)" strokeOpacity="0.16" strokeWidth="1.2">
            <line x1="34" y1="34" x2="72" y2="58" />
            <line x1="72" y1="58" x2="46" y2="86" />
            <line x1="150" y1="30" x2="182" y2="56" />
            <line x1="182" y1="56" x2="158" y2="88" />
            <line x1="150" y1="30" x2="158" y2="88" />
          </g>
          <g stroke="var(--tint-bright)" strokeOpacity="0.8" strokeWidth="1.5">
            <line x1="110" y1="58" x2="72" y2="58" />
            <line x1="110" y1="58" x2="150" y2="30" />
            <line x1="110" y1="58" x2="158" y2="88" />
          </g>
          <line
            x1="46"
            y1="86"
            x2="158"
            y2="88"
            stroke="var(--color-ink-tertiary)"
            strokeDasharray="3 3"
            strokeWidth="1.2"
            opacity="0.7"
          />
          <g fill="var(--color-ink)">
            <circle cx="34" cy="34" r="4.5" />
            <circle cx="72" cy="58" r="4.5" />
            <circle cx="46" cy="86" r="4.5" />
            <circle cx="150" cy="30" r="4.5" />
            <circle cx="182" cy="56" r="4.5" />
            <circle cx="158" cy="88" r="4.5" />
          </g>
          <circle cx="110" cy="58" r="10" fill="var(--tint-bright)" opacity="0.18" />
          <circle cx="110" cy="58" r="6" fill="var(--tint-bright)" />
          <circle cx="204" cy="92" r="3.5" fill="var(--color-ink-tertiary)" />
          <circle
            cx="204"
            cy="92"
            r="8"
            fill="none"
            stroke="var(--color-ink-tertiary)"
            strokeDasharray="2.5 2.5"
            strokeWidth="1"
            opacity="0.6"
          />
        </svg>
      </div>
      <div className="flex items-center justify-between font-sans text-[10px] text-ink-tertiary">
        <span>Brokers · silos · isolation</span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-(--tint-bright)" />
          Broker
        </span>
      </div>
    </div>
  )
}

function MockBar({ label, width, muted = false }: { label: string; width: number; muted?: boolean }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] text-ink-tertiary">{label}</span>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-line">
        <div
          className="h-full rounded-full"
          style={{
            width: `${width}%`,
            backgroundColor: muted ? "var(--color-ink-tertiary)" : "var(--tint-bright)",
          }}
        />
      </div>
    </div>
  )
}
