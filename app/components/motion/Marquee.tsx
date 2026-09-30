"use client"

import { useRef, type ReactNode } from "react"
import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion"
import { cn } from "@/lib/utils"

const wrap = (min: number, max: number, v: number) => {
  const range = max - min
  return ((((v - min) % range) + range) % range) + min
}

const COPIES = 4

/**
 * Kinetic type band. Drifts on its own, then speeds up and flips direction
 * with the reader's scroll velocity; with `kinetic`, the letters also widen
 * along the typeface's width axis and lean into the motion. Pauses off
 * screen; static and readable under reduced motion. The moving copies are
 * hidden from assistive tech; the first copy carries the text.
 */
export default function Marquee({
  children,
  speed = 3,
  reverse = false,
  kinetic = false,
  className,
}: {
  children: ReactNode
  /** Base drift, in % of one copy per second. */
  speed?: number
  reverse?: boolean
  kinetic?: boolean
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const skewRef = useRef<HTMLDivElement>(null)
  const inView = useInView(ref)
  const reduce = useReducedMotion()
  const baseX = useMotionValue(0)
  const { scrollY } = useScroll()
  const velocity = useVelocity(scrollY)
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 })
  const boost = useTransform(smooth, [-2000, 0, 2000], [-5, 0, 5], { clamp: false })
  const direction = useRef(reverse ? 1 : -1)
  const x = useTransform(baseX, (v) => `${wrap(-100 / COPIES, 0, v)}%`)

  useAnimationFrame((_, delta) => {
    if (reduce || !inView) return
    const b = boost.get()
    const flip = reverse ? -1 : 1
    if (b < 0) direction.current = flip
    else if (b > 0) direction.current = -flip
    const step = direction.current * (speed / COPIES) * (delta / 1000)
    baseX.set(baseX.get() + step + step * Math.abs(b))

    if (kinetic && skewRef.current) {
      const energy = Math.min(1, Math.abs(b) / 3)
      skewRef.current.style.fontStretch = `${100 + 25 * energy}%`
      skewRef.current.style.transform = `skewX(${(-direction.current * energy * 9).toFixed(2)}deg)`
    }
  })

  return (
    <div ref={ref} className={cn("overflow-hidden whitespace-nowrap", className)}>
      <div ref={skewRef} className="will-change-transform">
        <motion.div className="flex w-max" style={{ x }}>
          {Array.from({ length: COPIES }, (_, i) => (
            <div key={i} aria-hidden={i > 0} className="flex shrink-0">
              {children}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
