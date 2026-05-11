"use client"

import { useProduct } from "../context/ProductContext"
import type { ProductTab } from "../context/ProductContext"

export default function Footer() {
  const { setActiveProduct } = useProduct()

  const link = (
    tab: ProductTab,
    label: string,
    className = "text-left font-sans text-sm text-white/60 transition-colors hover:text-[var(--frenem-bg)] md:text-right"
  ) => (
    <button type="button" className={className} onClick={() => setActiveProduct(tab)}>
      {label}
    </button>
  )

  return (
    <footer className="relative overflow-hidden bg-[var(--frenem-bg-dark)] px-6 py-14 text-[var(--frenem-ink-secondary)] md:px-8 md:pb-10 md:pt-14">
      <div className="mx-auto mb-12 grid max-w-[var(--content-width)] grid-cols-1 items-end gap-8 md:grid-cols-[1fr_auto] md:gap-8">
        <div className="font-logo text-[clamp(60px,12vw,140px)] font-bold lowercase leading-[0.85] tracking-[-0.04em] text-[var(--frenem-bg)]">
          frenem
        </div>
        <nav className="flex flex-col gap-3 md:text-right" aria-label="Product">
          {link("build", "Build")}
          {link("prism", "Prism")}
          {link("pulse", "Pulse")}
          <a
            href="https://frenem.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-sm text-white/60 transition-colors hover:text-[var(--frenem-bg)] md:text-right"
          >
            frenem.com
          </a>
        </nav>
      </div>
      <div className="mx-auto flex max-w-[var(--content-width)] flex-col justify-between gap-3 border-t border-[var(--frenem-border-dark)] pt-6 font-sans text-xs text-white/40 md:flex-row md:items-center md:gap-6 md:px-0">
        <span>© Frenem {new Date().getFullYear()}</span>
        <span>Bangalore, India</span>
      </div>
    </footer>
  )
}
