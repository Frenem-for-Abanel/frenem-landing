"use client"

import { useState } from "react"
import { Pause, Play } from "lucide-react"
import Marquee from "../motion/Marquee"
import { track } from "../../utils/analytics"

const BAND = [
  { word: "Diagnose", shape: "h-[0.6em] w-[0.6em] rounded-full bg-sage" },
  { word: "Design", shape: "h-[0.56em] w-[0.56em] bg-clay" },
  { word: "Operate", shape: "h-[0.4em] w-[1.1em] rounded-full bg-heather" },
]

/**
 * The home page's two moving type bands, with a pause control: anything
 * that moves for longer than five seconds must be stoppable (WCAG 2.2.2).
 */
export default function KineticBand() {
  const [paused, setPaused] = useState(false)

  return (
    <div className="grain grain-light relative overflow-clip bg-ink py-6 text-sand md:py-9">
      <Marquee
        kinetic
        speed={4}
        paused={paused}
        className="text-[clamp(56px,9vw,140px)] font-extrabold leading-[1] tracking-[-0.05em] [font-stretch:100%]"
      >
        {BAND.map(({ word, shape }) => (
          <span key={word} className="flex items-center gap-[0.35em] pr-[0.35em]">
            {word}
            <span aria-hidden className={`inline-block shrink-0 ${shape}`} />
          </span>
        ))}
      </Marquee>
      <Marquee
        kinetic
        reverse
        speed={3}
        paused={paused}
        className="-mt-1 text-[clamp(56px,9vw,140px)] font-extrabold leading-[1] tracking-[-0.05em] text-transparent [-webkit-text-stroke:1.5px_var(--color-sand)]"
      >
        {["Pulse", "Build", "Prism"].map((word) => (
          <span key={word} aria-hidden className="pr-[0.5em]">
            {word}
          </span>
        ))}
      </Marquee>
      <button
        type="button"
        onClick={() => {
          setPaused((p) => !p)
          if (!paused) track("marquee_paused")
        }}
        aria-pressed={paused}
        className="absolute bottom-3 right-3 z-[1] inline-flex h-11 w-11 items-center justify-center rounded-full bg-paper/10 text-sand transition-colors hover:bg-paper/20 md:bottom-4 md:right-4 motion-reduce:hidden"
      >
        <span className="sr-only">{paused ? "Play the moving text" : "Pause the moving text"}</span>
        {paused ? (
          <Play aria-hidden className="h-4 w-4" strokeWidth={2.4} />
        ) : (
          <Pause aria-hidden className="h-4 w-4" strokeWidth={2.4} />
        )}
      </button>
    </div>
  )
}
