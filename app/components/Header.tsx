"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion"
import { useContactModal } from "../context/ContactModalContext"
import { headerContactMode } from "../utils/contact-modal-helpers"
import { productFromPathname, PRODUCTS, PRODUCT_LABELS, type ProductKey } from "../utils/product"

const PRODUCT_FIELD: Record<ProductKey, string> = {
  pulse: "bg-sage",
  build: "bg-clay",
  prism: "bg-heather",
}

const PRODUCT_DOT: Record<ProductKey, string> = {
  pulse: "bg-sage-mid",
  build: "bg-clay-mid",
  prism: "bg-heather-mid",
}

const PRODUCT_ROLE: Record<ProductKey, string> = {
  pulse: "Relational diagnostics",
  build: "Organisation design",
  prism: "Employee management",
}

/**
 * Site header. Transparent over the hero, a frosted bar once you scroll,
 * and out of the way while you read down (it returns as soon as you scroll
 * back up). Phones get a full-screen menu of colour blocks.
 */
export default function Header() {
  const pathname = usePathname()
  const { openModal } = useContactModal()
  const reduce = useReducedMotion()
  const product = productFromPathname(pathname)
  const onEngineering = pathname === "/engineering" || pathname.startsWith("/engineering/")

  const [atTop, setAtTop] = useState(true)
  const [tucked, setTucked] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setAtTop(y < 24)
    if (menuOpen) return
    if (y > prev + 4 && y > 160) setTucked(true)
    else if (y < prev - 4) setTucked(false)
  })

  useEffect(() => setMenuOpen(false), [pathname])

  useEffect(() => {
    if (!menuOpen) return
    document.body.style.overflow = "hidden"
    // The menu covers the page, so the page behind it must not take focus
    // or be read out: only the header and the menu stay reachable.
    const behind = [document.querySelector("main"), document.querySelector("main ~ footer")]
    behind.forEach((el) => el?.setAttribute("inert", ""))
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false)
        menuButton.current?.focus()
      }
    }
    document.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = ""
      behind.forEach((el) => el?.removeAttribute("inert"))
      document.removeEventListener("keydown", onKey)
    }
  }, [menuOpen])

  const contact = () => {
    setMenuOpen(false)
    openModal(headerContactMode(product))
  }

  return (
    <>
      <header
        // Keyboard focus brings a tucked-away header back into view.
        onFocus={() => setTucked(false)}
        className={`fixed inset-x-0 top-0 z-[100] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          tucked && !menuOpen ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <div
          className={`transition-[background-color,backdrop-filter] duration-500 ${
            menuOpen ? "bg-paper" : atTop ? "bg-transparent" : "bg-paper/85 backdrop-blur-md"
          }`}
        >
          <div className="container-site flex h-16 items-center justify-between gap-4 md:h-20">
            <Link
              href="/"
              className="font-logo text-[24px] font-bold lowercase tracking-[-0.5px] text-ink md:text-[28px]"
              aria-label="Frenem home"
            >
              frenem
            </Link>

            <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
              {PRODUCTS.map((key) => {
                const active = product === key
                return (
                  <Link
                    key={key}
                    href={`/${key}`}
                    aria-current={active ? "page" : undefined}
                    className={`group inline-flex h-11 items-center gap-2.5 rounded-full px-4 text-[15px] font-semibold tracking-[-0.01em] [font-stretch:108%] transition-colors duration-300 ${
                      active ? "bg-paper text-ink" : `text-ink ${hoverField(key)}`
                    }`}
                  >
                    <span
                      aria-hidden
                      className={`h-2.5 w-2.5 rounded-full transition-transform duration-500 ${PRODUCT_DOT[key]} ${
                        active ? "scale-100" : "scale-0 group-hover:scale-100"
                      }`}
                    />
                    {PRODUCT_LABELS[key]}
                  </Link>
                )
              })}
              <Link
                href="/engineering"
                aria-current={onEngineering ? "page" : undefined}
                className={`inline-flex h-11 items-center rounded-full px-4 text-[15px] font-semibold tracking-[-0.01em] [font-stretch:108%] transition-colors duration-300 ${
                  onEngineering ? "bg-paper" : "hover:bg-paper-soft"
                }`}
              >
                Engineering
              </Link>
            </nav>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={contact}
                className="hidden h-11 items-center rounded-full bg-ink px-5 text-[15px] font-semibold tracking-[-0.01em] text-paper [font-stretch:108%] transition-transform duration-300 hover:scale-[1.04] md:inline-flex"
              >
                Get in touch
              </button>
              <button
                ref={menuButton}
                type="button"
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                onClick={() => setMenuOpen((v) => !v)}
                className="inline-flex h-11 items-center gap-3 rounded-full bg-ink pl-4 pr-3 text-[15px] font-semibold text-paper md:hidden"
              >
                {menuOpen ? "Close" : "Menu"}
                <span aria-hidden className="relative block h-3 w-5">
                  <span
                    className={`absolute left-0 h-0.5 w-5 bg-current transition-transform duration-300 ${
                      menuOpen ? "top-[5px] rotate-45" : "top-0.5"
                    }`}
                  />
                  <span
                    className={`absolute left-0 h-0.5 w-5 bg-current transition-transform duration-300 ${
                      menuOpen ? "top-[5px] -rotate-45" : "top-[9px]"
                    }`}
                  />
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-[99] flex flex-col bg-paper pt-16 md:hidden"
            initial={reduce ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
            animate={reduce ? { opacity: 1 } : { clipPath: "inset(0 0 0% 0)" }}
            exit={reduce ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: reduce ? 0.01 : 0.6, ease: [0.65, 0, 0.35, 1] }}
          >
            <nav aria-label="Menu" className="flex flex-1 flex-col">
              {PRODUCTS.map((key, i) => (
                <MenuRow key={key} index={i} reduce={Boolean(reduce)} className={PRODUCT_FIELD[key]}>
                  <Link href={`/${key}`} className="flex h-full flex-col justify-center px-5" aria-current={product === key ? "page" : undefined}>
                    <span className="text-[44px] font-extrabold leading-none tracking-[-0.04em] [font-stretch:110%]">
                      {PRODUCT_LABELS[key]}
                    </span>
                    <span className="mt-2 text-[15px] font-medium text-ink-secondary">{PRODUCT_ROLE[key]}</span>
                  </Link>
                </MenuRow>
              ))}
              <MenuRow index={3} reduce={Boolean(reduce)} className="bg-paper-soft">
                <Link href="/engineering" className="flex h-full items-center px-5 text-[32px] font-extrabold tracking-[-0.035em] [font-stretch:110%]">
                  Engineering
                </Link>
              </MenuRow>
              <MenuRow index={4} reduce={Boolean(reduce)} className="bg-sand">
                <button
                  type="button"
                  onClick={contact}
                  className="flex h-full w-full items-center px-5 text-left text-[32px] font-extrabold tracking-[-0.035em] [font-stretch:110%]"
                >
                  Get in touch
                </button>
              </MenuRow>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}

/** Tailwind needs the hover classes spelled out in full to generate them. */
function hoverField(key: ProductKey) {
  return { pulse: "hover:bg-sage", build: "hover:bg-clay", prism: "hover:bg-heather" }[key]
}

function MenuRow({
  children,
  index,
  className,
  reduce,
}: {
  children: React.ReactNode
  index: number
  className: string
  reduce: boolean
}) {
  return (
    <motion.div
      className={`min-h-0 flex-1 ${className}`}
      initial={reduce ? false : { x: "100%" }}
      animate={{ x: 0 }}
      transition={{ duration: 0.7, delay: 0.12 + index * 0.06, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}
