"use client"

import { useEffect, useState } from "react"
import { useContactModal, type ContactModalMode } from "../context/ContactModalContext"
import { track } from "../utils/analytics"
import { preloadContactFlows } from "./contact/lazy-flows"

/**
 * Phones only: once the hero has scrolled away, a slim bar keeps the page's
 * main action under the thumb. It steps aside wherever the page already
 * offers an action (the closing call to action, the footer, and any section
 * named in `clearOf`, such as the Build planner with its own bar).
 */
export default function MobileCtaBar({
  label,
  mode,
  summary,
  clearOf = [],
}: {
  label: string
  mode: ContactModalMode
  /** What the page is, in a few words, beside the button. */
  summary: string
  clearOf?: string[]
}) {
  const { openModal, isOpen } = useContactModal()
  const [pastHero, setPastHero] = useState(false)
  const [blocked, setBlocked] = useState(0)

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.9)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const targets = [
      ...clearOf.map((id) => document.getElementById(id)),
      document.querySelector("[data-final-cta]"),
      document.querySelector("body > footer"),
    ].filter((el): el is HTMLElement => Boolean(el))
    const visible = new Set<Element>()
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target)
        else visible.delete(entry.target)
      }
      setBlocked(visible.size)
    })
    targets.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [clearOf])

  const show = pastHero && blocked === 0 && !isOpen

  return (
    <div
      aria-hidden={!show}
      className={`fixed inset-x-3 bottom-3 z-50 rounded-full bg-ink py-2 pl-5 pr-2 text-paper shadow-[0_12px_40px_rgba(0,0,0,0.25)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden ${
        show ? "translate-y-0" : "pointer-events-none translate-y-[160%]"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="min-w-0 truncate text-[15px] font-semibold">{summary}</p>
        <button
          type="button"
          tabIndex={show ? 0 : -1}
          onTouchStart={preloadContactFlows}
          onClick={() => {
            track("cta_click", { label, flow: mode, placement: "mobile_bar" })
            openModal(mode)
          }}
          className="h-11 shrink-0 rounded-full bg-(--tint-soft) px-5 text-[15px] font-semibold text-ink"
        >
          {label}
        </button>
      </div>
    </div>
  )
}
