import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import Reveal from "./Reveal"
import SplitText from "./motion/SplitText"
import FieldBackdrop from "./motion/FieldBackdrop"

type Tone = "white" | "soft" | "tint" | "deep" | "ink"

/** Quiet tones paint the section; coloured tones grow in as a field. */
const TONE: Record<Tone, string> = {
  white: "bg-paper",
  soft: "bg-paper-soft",
  tint: "",
  deep: "text-paper",
  ink: "text-paper",
}

const FIELD: Partial<Record<Tone, string>> = {
  tint: "bg-(--tint-soft)",
  deep: "bg-(--tint-deep) grain-light",
  ink: "bg-ink grain-light",
}

/**
 * Shared section scaffolding: a full-bleed colour field around the content
 * column. Sections separate by colour, not by rules; coloured fields sweep
 * in from `revealFrom` as the section arrives.
 */
export function Section({
  id,
  children,
  className,
  tone = "white",
  revealFrom,
}: {
  id?: string
  children: ReactNode
  className?: string
  tone?: Tone
  revealFrom?: string
}) {
  const field = FIELD[tone]
  return (
    <section id={id} className={cn("relative scroll-mt-20 overflow-clip py-24 md:py-36", TONE[tone], className)}>
      {field ? <FieldBackdrop className={field} origin={revealFrom} /> : null}
      <div className="container-site relative">{children}</div>
    </section>
  )
}

/**
 * Section opener: a big heading that rises in word by word and speaks for
 * itself (no eyebrow label), with an optional aside on its baseline.
 */
export function SectionHead({
  title,
  aside,
  dark = false,
  className,
  size = 2,
}: {
  title: ReactNode
  aside?: ReactNode
  dark?: boolean
  className?: string
  size?: 2 | 3
}) {
  return (
    <header className={cn("mb-14 grid grid-cols-1 gap-y-8 md:mb-20 lg:grid-cols-12 lg:items-end lg:gap-x-10", className)}>
      <div className={aside ? "lg:col-span-8" : "lg:col-span-11"}>
        <SplitText as="h2" className={size === 3 ? "type-display-3 max-w-[22ch]" : "type-display-2 max-w-[16ch]"}>
          {title}
        </SplitText>
      </div>
      {aside ? (
        <Reveal delay={0.15} className="lg:col-span-4">
          <div className={cn("type-lead max-w-[460px]", dark ? "text-white/75" : "text-ink-secondary")}>{aside}</div>
        </Reveal>
      ) : null}
    </header>
  )
}
