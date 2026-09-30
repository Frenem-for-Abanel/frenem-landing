"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import SplitText from "./motion/SplitText"

/**
 * The footer signature. Letters rise in one by one, and the wordmark's
 * weight swells from hairline to bold as the footer scrolls into view:
 * the variable axis doing the animation, not a transform.
 */
export default function FooterWordmark() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] })
  // Weight follows the reader's own scroll (nothing moves), so it stays on
  // under reduced motion and server and client render the same markup.
  const weight = useTransform(scrollYProgress, [0, 1], [200, 800])

  return (
    <motion.div ref={ref} aria-hidden className="select-none" style={{ fontWeight: weight }}>
      <SplitText
        as="p"
        by="char"
        aria-hidden
        className="-mb-[0.18em] mt-6 font-logo text-[29vw] lowercase leading-[0.8] tracking-[-0.05em] text-sand lg:text-[min(29vw,380px)]"
      >
        frenem
      </SplitText>
    </motion.div>
  )
}
