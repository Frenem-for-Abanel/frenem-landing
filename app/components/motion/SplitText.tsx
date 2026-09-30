"use client"

import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from "react"
import { cn } from "@/lib/utils"

type Tag = "h1" | "h2" | "h3" | "p"

/**
 * Split text (including nested <em>/<strong>) into words, each wrapped in a
 * clipping box so it can rise into place. Spaces stay real text nodes, so
 * copy, selection, and screen readers see the sentence unchanged.
 */
function splitWords(children: ReactNode, counter: { i: number }, byChar = false): ReactNode[] {
  return Children.toArray(children).flatMap((child, idx): ReactNode[] => {
    if (typeof child === "string" || typeof child === "number") {
      return String(child)
        .split(byChar ? /(\s+|)/ : /(\s+)/)
        .filter(Boolean)
        .map((part, j) =>
          /^\s+$/.test(part) ? (
            " "
          ) : (
            <span key={`${idx}-${j}`} className="split-word">
              <span className="split-inner" style={{ "--i": counter.i++ } as CSSProperties}>
                {part}
              </span>
            </span>
          )
        )
    }
    if (isValidElement(child)) {
      const el = child as ReactElement<{ children?: ReactNode }>
      if (el.type === "br") return [el]
      return [cloneElement(el, { key: idx }, splitWords(el.props.children, counter, byChar))]
    }
    return [child]
  })
}

/**
 * Headline that rises in word by word. `trigger="load"` animates on first
 * paint with pure CSS (heroes); `trigger="view"` waits until it scrolls in,
 * and only hides itself if it starts below the fold, so nothing is ever
 * stuck invisible without JS.
 */
export default function SplitText({
  as: Tag = "h2",
  children,
  className,
  trigger = "view",
  delay = 0,
  id,
  by = "word",
  "aria-hidden": ariaHidden,
}: {
  as?: Tag
  children: ReactNode
  className?: string
  trigger?: "load" | "view"
  delay?: number
  id?: string
  /** Split into words (headlines) or single characters (wordmarks). */
  by?: "word" | "char"
  "aria-hidden"?: boolean
}) {
  const ref = useRef<HTMLHeadingElement>(null)
  const [state, setState] = useState<"idle" | "pending" | "in">(trigger === "load" ? "in" : "idle")

  useEffect(() => {
    if (trigger === "load") return
    const el = ref.current
    if (!el) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) return

    setState("pending")
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState("in")
          io.disconnect()
        }
      },
      // No bottom inset: the last thing on a page (the footer wordmark) can
      // never scroll above one, and would stay hidden.
      { threshold: 0.2 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [trigger])

  const words = splitWords(children, { i: 0 }, by === "char")

  return (
    <Tag
      ref={ref}
      id={id}
      aria-hidden={ariaHidden}
      className={cn(state === "pending" && "split-pending", state === "in" && "split-in", className)}
      style={delay ? ({ "--split-delay": `${delay}s` } as CSSProperties) : undefined}
    >
      {words}
    </Tag>
  )
}
