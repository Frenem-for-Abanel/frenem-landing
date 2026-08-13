import type { EngineeringEntry } from "../../../lib/engineering/content"
import LogEntry, { type LogSurface } from "./LogEntry"

/** The tint-coded activity stream: every type interleaved, newest first. */
export default function LogStream({
  entries,
  surface,
}: {
  entries: EngineeringEntry[]
  surface: LogSurface
}) {
  return (
    <div className="divide-y divide-line border-t border-line">
      {entries.map((entry) => (
        <LogEntry key={entry.slug} entry={entry} surface={surface} />
      ))}
    </div>
  )
}
