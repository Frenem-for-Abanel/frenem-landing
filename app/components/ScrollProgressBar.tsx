"use client"

import { useEffect, useState } from "react"

/** Thin tint strip under the header showing reading progress. */
export default function ScrollProgressBar() {
  const [p, setP] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement
      const scrollable = el.scrollHeight - el.clientHeight
      const next = scrollable > 0 ? (el.scrollTop / scrollable) * 100 : 0
      setP(Math.min(100, Math.max(0, next)))
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [])

  return (
    <div
      aria-hidden
      className="fixed left-0 z-[99] h-0.5 origin-left bg-(--tint-bright) transition-[width] duration-150 ease-out"
      style={{ top: 64, width: `${p}%` }}
    />
  )
}
