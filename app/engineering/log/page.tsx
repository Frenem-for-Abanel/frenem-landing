import type { Metadata } from "next"
import LogStream from "../../components/engineering/LogStream"
import LogHashRedirect from "../../components/engineering/LogHashRedirect"
import { getAllEntries } from "../../../lib/engineering/content"
import JsonLd from "../../components/JsonLd"
import { pageMetadata } from "../../utils/seo"
import { BLOG_ID, breadcrumbs, graph, webPage } from "../../utils/structured-data"

const DESCRIPTION =
  "The complete Frenem Engineering log: essays, shipped changes, and technical notes, newest first."

export const metadata: Metadata = pageMetadata({
  path: "/engineering/log",
  title: "Engineering log | Frenem",
  description: DESCRIPTION,
  socialTitle: "The Frenem Engineering log",
})

const jsonLd = graph(
  webPage({ path: "/engineering/log", name: "The Frenem Engineering log", description: DESCRIPTION, type: "CollectionPage", about: BLOG_ID }),
  breadcrumbs([
    { name: "Engineering", path: "/engineering" },
    { name: "Log", path: "/engineering/log" },
  ])
)

export default function EngineeringLogPage() {
  return (
    <div className="tint-brand container-site pb-20 md:pb-28">
      <JsonLd data={jsonLd} />
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
