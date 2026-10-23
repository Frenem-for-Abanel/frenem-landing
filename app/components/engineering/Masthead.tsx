"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const navLink =
  "inline-flex min-h-11 items-center px-1 transition-colors hover:text-ink aria-[current=page]:text-ink aria-[current=page]:underline aria-[current=page]:underline-offset-4"

/**
 * Section nameplate: the section name set large, a quiet mono nav on the
 * right. On the section's front page the name is the page's h1; essays and
 * the log carry their own.
 */
export default function Masthead() {
  const pathname = usePathname()
  const onCover = pathname === "/engineering"
  const onLog = pathname === "/engineering/log"
  const Name = onCover ? "h1" : "span"

  return (
    <div className="bg-sand">
      {/* Phones stack the nav under the name, always: letting it wrap would
          move it once the web font widens the name (layout shift). */}
      <div className="container-site flex flex-col items-start gap-3 pb-6 pt-28 sm:flex-row sm:items-end sm:justify-between sm:gap-4 md:pb-10 md:pt-40">
        <Link href="/engineering" className="group flex min-w-0 items-center gap-4">
          <span
            aria-hidden
            className="h-6 w-6 shrink-0 bg-sand-mid transition-[border-radius,transform] duration-700 group-hover:rotate-45 group-hover:rounded-full md:h-9 md:w-9"
          />
          <Name className="text-[clamp(40px,7vw,96px)] font-extrabold leading-[0.9] tracking-[-0.05em] text-ink [font-stretch:110%]">
            Engineering
            {onCover ? <span className="sr-only">: essays and field notes from Frenem</span> : null}
          </Name>
        </Link>
        <nav aria-label="Engineering section" className="flex shrink-0 items-baseline gap-1.5 font-mono text-[13px] text-ink-secondary">
          <Link href="/engineering" aria-current={onCover ? "page" : undefined} className={navLink}>
            Essays
          </Link>
          <span aria-hidden>·</span>
          <Link href="/engineering/log" aria-current={onLog ? "page" : undefined} className={navLink}>
            Log
          </Link>
        </nav>
      </div>
    </div>
  )
}
