import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: { absolute: "Page not found | Frenem" },
  robots: { index: false, follow: true },
}

const links = [
  { href: "/", label: "Home" },
  { href: "/pulse", label: "Pulse, relational diagnostics" },
  { href: "/build", label: "Build, organisation design" },
  { href: "/prism", label: "Prism, the operating record" },
  { href: "/engineering", label: "Engineering" },
]

export default function NotFound() {
  return (
    <div className="container-site flex min-h-[70vh] flex-col justify-center pb-24 pt-36">
      <p className="type-kicker text-ink-secondary">404</p>
      <h1 className="type-display-3 mt-6 max-w-[14ch]">This page isn&apos;t on the site.</h1>
      <p className="mt-5 max-w-[46ch] text-[17px] leading-relaxed text-ink-secondary">
        The link may be out of date. The rest of Frenem is still here.
      </p>
      <nav aria-label="Popular pages" className="mt-8 flex flex-col gap-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-[17px] font-semibold text-ink underline decoration-line-strong underline-offset-4 transition-colors hover:text-(--tint-ink)"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}
