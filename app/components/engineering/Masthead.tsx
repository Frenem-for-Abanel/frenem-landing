import Link from "next/link"

/** Section nameplate: wordmark on the left, quiet mono nav on the right. */
export default function Masthead() {
  return (
    <div className="container-site">
      <div className="flex items-baseline justify-between gap-4 border-b border-line pb-4 pt-8 md:pt-10">
        <Link href="/engineering" className="flex min-w-0 items-baseline gap-2.5">
          <span className="font-logo text-[20px] font-bold lowercase tracking-[-0.5px] text-ink md:text-[22px]">
            frenem
          </span>
          <span className="font-mono text-[13px] tracking-[0.02em] text-ink-secondary">
            engineering
          </span>
        </Link>
        <nav
          aria-label="Engineering section"
          className="flex shrink-0 items-baseline gap-2.5 font-mono text-xs text-ink-secondary"
        >
          <Link href="/engineering" className="transition-colors hover:text-ink">
            Essays
          </Link>
          <span aria-hidden className="text-ink-tertiary">
            ·
          </span>
          <a href="/engineering/feed.xml" className="transition-colors hover:text-ink">
            RSS
          </a>
        </nav>
      </div>
    </div>
  )
}
