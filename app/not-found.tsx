import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: { absolute: "Page not found | Frenem" },
  description: "That page doesn't exist. Explore Frenem Pulse, Build, Prism, or Engineering from here.",
  robots: {
    index: false,
    follow: true,
    googleBot: { index: false, follow: true },
  },
}

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/pulse", label: "Pulse" },
  { href: "/build", label: "Build" },
  { href: "/prism", label: "Prism" },
  { href: "/engineering", label: "Engineering" },
]

export default function NotFound() {
  return (
    <div className="tint-brand">
      <div className="container-site pb-24 pt-32 md:pb-36 md:pt-40">
        <p className="type-kicker text-ink-secondary">404</p>
        <h1 className="type-display-2 mt-6 max-w-[14ch]">This page isn&apos;t here.</h1>
        <p className="type-lead mt-6 max-w-[42ch] text-ink-secondary">
          The address doesn&apos;t match a page. These do.
        </p>
        <ul className="mt-10 flex flex-col">
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="inline-flex min-h-11 items-center text-[17px] font-semibold tracking-[-0.01em] text-ink underline decoration-line-strong underline-offset-4 transition-colors hover:text-(--tint-ink)"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
