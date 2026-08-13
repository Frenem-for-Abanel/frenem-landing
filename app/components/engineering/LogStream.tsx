import { groupByYear, type EngineeringEntry } from "../../../lib/engineering/content"
import LogEntry from "./LogEntry"

/** The tint-coded activity stream: newest first, with mono year markers. */
export default function LogStream({ entries }: { entries: EngineeringEntry[] }) {
  return (
    <div>
      {groupByYear(entries).map(({ year, entries: yearEntries }) => (
        <section key={year} aria-label={year} className="pt-6 first:pt-0">
          <div className="flex items-center gap-4 pb-1">
            <span className="font-mono text-xs tracking-[0.1em] text-ink-tertiary">
              {year}
            </span>
            <span aria-hidden className="h-px flex-1 bg-line" />
          </div>
          <div className="divide-y divide-line">
            {yearEntries.map((entry) => (
              <LogEntry key={entry.slug} entry={entry} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
