import type { Metadata } from "next"
import Link from "next/link"
import FeaturedEssay from "../components/engineering/FeaturedEssay"
import LogStream from "../components/engineering/LogStream"
import { getAllEntries, getFeaturedEssay } from "../../lib/engineering/content"

export const metadata: Metadata = {
  title: "Engineering",
  description:
    "Essays and field notes from Frenem Engineering: the method, design, and trust decisions behind the clarity suite.",
  alternates: { canonical: "/engineering" },
  openGraph: {
    title: "Frenem Engineering",
    description:
      "Essays and field notes from Frenem Engineering: the method, design, and trust decisions behind the clarity suite.",
    url: "/engineering",
  },
}

/** The cover shows the latest slice of the ledger; the archive holds it all. */
const LOG_LIMIT = 15

export default function EngineeringPage() {
  const entries = getAllEntries()
  const latest = entries.slice(0, LOG_LIMIT)

  return (
    <div className="tint-brand container-site pb-20 md:pb-28">
      <FeaturedEssay essay={getFeaturedEssay()} />

      <section aria-labelledby="the-log" className="pt-10 md:pt-12">
        <h2
          id="the-log"
          className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink-secondary"
        >
          The Log
        </h2>
        <div className="mt-5 md:mt-6">
          <LogStream entries={latest} />
        </div>
        <p className="mt-2 border-t border-line pt-6">
          <Link
            href="/engineering/log"
            className="font-mono text-[13px] text-ink-secondary transition-colors hover:text-ink"
          >
            The full log <span aria-hidden>→</span>
          </Link>
        </p>
      </section>
    </div>
  )
}
