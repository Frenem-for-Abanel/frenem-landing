import Link from "next/link"
import ContactCta from "./ContactCta"

const footerLinkClass =
  "inline-flex min-h-11 items-center font-sans text-sm text-white/60 transition-colors hover:text-white md:min-h-0"

export default function Footer() {
  return (
    <footer className="on-dark relative overflow-hidden bg-ink px-5 py-12 text-white/60 sm:px-6 md:px-8 md:pb-10 md:pt-16">
      <div className="mx-auto grid max-w-[var(--content-width)] grid-cols-1 gap-10 md:grid-cols-[1fr_auto_auto] md:items-end md:gap-16">
        <div className="font-logo text-[clamp(48px,12vw,140px)] font-bold lowercase leading-[0.85] tracking-[-0.04em] text-white">
          frenem
        </div>

        <nav className="flex flex-col gap-1 md:gap-2.5" aria-label="Products">
          <span className="mb-1 font-sans text-xs font-semibold uppercase tracking-[0.1em] text-white/35">
            Products
          </span>
          <Link href="/pulse" className={footerLinkClass}>
            Pulse · Relational Diagnostics
          </Link>
          <Link href="/build" className={footerLinkClass}>
            Build · Organisation Design
          </Link>
          <Link href="/prism" className={footerLinkClass}>
            Prism · Employee Management
          </Link>
        </nav>

        <nav className="flex flex-col gap-1 md:gap-2.5" aria-label="Company">
          <span className="mb-1 font-sans text-xs font-semibold uppercase tracking-[0.1em] text-white/35">
            Company
          </span>
          <ContactCta
            mode="default"
            variant="text"
            className="min-h-11 justify-start self-start border-white/40 pb-0 text-sm font-normal text-white/60 hover:border-white hover:text-white md:min-h-0"
          >
            Get in touch
          </ContactCta>
          <a
            href="https://frenem.com"
            target="_blank"
            rel="noopener noreferrer"
            className={footerLinkClass}
          >
            frenem.com
          </a>
          <a
            // TODO: confirm the company LinkedIn URL before launch.
            href="https://www.linkedin.com/company/frenem"
            target="_blank"
            rel="noopener noreferrer"
            className={footerLinkClass}
          >
            LinkedIn
          </a>
        </nav>
      </div>

      <div className="mx-auto mt-10 flex max-w-[var(--content-width)] flex-col justify-between gap-3 border-t border-line-dark pt-6 font-sans text-xs text-white/40 md:mt-12 md:flex-row md:items-center md:gap-6">
        <span>© Frenem {new Date().getFullYear()}</span>
        <span>Bangalore, India</span>
      </div>
    </footer>
  )
}
