import type { Metadata } from "next"
import LogStream from "../../components/engineering/LogStream"
import LogHashRedirect from "../../components/engineering/LogHashRedirect"
import { getAllEntries } from "../../../lib/engineering/content"

export const metadata: Metadata = {
  title: "Engineering log",
  description:
    "The complete Frenem Engineering log: essays, shipped changes, and technical notes, newest first.",
  alternates: { canonical: "/engineering/log" },
  openGraph: {
    title: "The Frenem Engineering log",
    description:
      "The complete Frenem Engineering log: essays, shipped changes, and technical notes, newest first.",
    url: "/engineering/log",
  },
}

export default function EngineeringLogPage() {
  return (
    <div className="tint-brand container-site pb-20 md:pb-28">
      <header className="anim-fade-up pt-10 md:pt-12">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink-secondary">
          The Log
        </p>
        <h1 className="type-display-3 mt-4">Everything, in order.</h1>
        <p className="mt-4 max-w-[52ch] font-sans text-[15px] leading-relaxed text-ink-secondary md:text-base">
          The complete stream: essays, shipped changes, and notes, newest
          first.
        </p>
      </header>
      <div className="mt-8 md:mt-10">
        <LogHashRedirect />
        <LogStream entries={getAllEntries()} surface="archive" />
      </div>
    </div>
  )
}
