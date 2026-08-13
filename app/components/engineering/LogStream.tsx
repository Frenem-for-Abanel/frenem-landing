import type { EngineeringEntry } from "../../../lib/engineering/content"
import LogEntry from "./LogEntry"

/** The tint-coded activity stream: every type interleaved, newest first. */
export default function LogStream({ entries }: { entries: EngineeringEntry[] }) {
  return (
    <div className="divide-y divide-line border-t border-line">
      {entries.map((entry) => (
        <LogEntry key={entry.slug} entry={entry} />
      ))}
    </div>
  )
}
