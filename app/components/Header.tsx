"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Mail, Newspaper } from "lucide-react"
import { useContactModal } from "../context/ContactModalContext"
import { smoothScrollTo } from "../utils/smooth-scroll"
import { getHowSectionId } from "../utils/how-section"
import { headerContactMode } from "../utils/contact-modal-helpers"
import { productFromPathname, PRODUCTS, PRODUCT_LABELS } from "../utils/product"

function tabClass(active: boolean) {
  return `font-sans text-[11px] md:text-xs min-h-11 md:min-h-0 px-3 sm:px-3 md:px-[18px] py-2.5 md:py-1.5 rounded-full transition-all whitespace-nowrap inline-flex items-center justify-center ${
    active
      ? "text-ink font-medium bg-white shadow-sm"
      : "text-ink-tertiary font-normal hover:text-ink-secondary"
  }`
}

export default function Header() {
  const pathname = usePathname()
  const { openModal } = useContactModal()
  const [scrolled, setScrolled] = useState(false)

  const product = productFromPathname(pathname)
  const howSectionId = getHowSectionId(product)
  const onEngineering = pathname === "/engineering" || pathname.startsWith("/engineering/")

  useEffect(() => {
    const handleScroll = () => {
      // Opaque chrome once the visitor is past ~75% of the hero.
      setScrolled(window.scrollY > window.innerHeight * 0.75)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleHowClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (howSectionId) smoothScrollTo(howSectionId)
  }

  return (
    <header
      className={`anim-slide-down fixed top-0 left-0 right-0 z-[100] min-w-0 h-16 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-1 px-2.5 sm:px-3 md:gap-0 md:px-8 transition-[background,border-color,box-shadow] duration-500 ${
        scrolled
          ? "bg-white/90 backdrop-blur-[12px] border-b border-[rgba(10,10,10,0.05)] shadow-[0_1px_16px_rgba(0,0,0,0.02)]"
          : "bg-transparent border-b border-transparent shadow-none"
      }`}
    >
      <div className="flex min-w-0 items-center">
        <Link
          href="/"
          className="font-logo font-bold text-base sm:text-lg md:text-[22px] tracking-[-0.5px] text-ink lowercase truncate"
          aria-label="Frenem home"
        >
          frenem
        </Link>
      </div>

      <nav
        aria-label="Products"
        className="flex min-w-0 max-w-full items-center gap-0.5 rounded-full p-[2px] md:p-[3px] bg-[rgba(10,10,10,0.04)]"
      >
        {PRODUCTS.map((key) => (
          <Link
            key={key}
            href={`/${key}`}
            aria-current={product === key ? "page" : undefined}
            className={tabClass(product === key)}
          >
            {PRODUCT_LABELS[key]}
          </Link>
        ))}
      </nav>

      <div className="flex min-w-0 items-center justify-end gap-1.5 md:gap-6">
        {/* Below 360px the three clusters already fill the bar, so the link
            waits for room rather than overlapping the product tabs. */}
        <Link
          href="/engineering"
          aria-current={onEngineering ? "page" : undefined}
          aria-label="Engineering"
          className={`hidden h-11 w-7 shrink-0 items-center justify-center font-sans text-[13px] transition-colors min-[360px]:inline-flex md:h-auto md:w-auto ${
            onEngineering ? "font-medium text-ink" : "font-normal text-ink-secondary hover:text-ink"
          }`}
        >
          <Newspaper className="size-5 shrink-0 md:hidden" aria-hidden />
          <span className="hidden md:inline">Engineering</span>
        </Link>
        {howSectionId ? (
          <a
            href={`#${howSectionId}`}
            onClick={handleHowClick}
            className="hidden md:block font-sans text-[13px] font-normal text-ink-secondary hover:text-ink transition-colors"
          >
            How it works
          </a>
        ) : null}
        <button
          type="button"
          onClick={() => openModal(headerContactMode(product))}
          aria-label="Get in touch"
          className="inline-flex items-center justify-center font-sans text-[13px] font-medium h-11 w-11 shrink-0 rounded-full bg-ink text-paper hover:bg-accent transition-colors md:h-auto md:w-auto md:py-2 md:px-[18px]"
        >
          <Mail className="size-5 md:hidden shrink-0" aria-hidden />
          <span className="hidden md:inline">Get in Touch</span>
        </button>
      </div>
    </header>
  )
}
