"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion"
import { SectionHead } from "../Section"
import ModuleField from "../motion/ModuleField"
import { magnetic } from "../ContactCta"

const products = [
  {
    tintClass: "tint-pulse",
    product: "Pulse",
    tagline: "Relational diagnostics",
    problem: "People you counted on keep leaving, and it keeps surprising you.",
    description:
      "Pulse maps how your people actually work together: exit risk, hidden brokers, and cross-team friction, visible early.",
    meta: ["Network map", "3 report cuts", "Privacy by design"],
    href: "/pulse",
    mark: "pulse",
  },
  {
    tintClass: "tint-build",
    product: "Build",
    tagline: "Organisation design",
    problem: "The company still can't run without you.",
    description:
      "A focused sprint, or just the parts you need, to redesign how decisions, ownership, and leadership work as you grow. Without losing control.",
    meta: ["Pick and mix", "Faster decisions", "Leadership bench"],
    href: "/build",
    mark: "build",
  },
  {
    tintClass: "tint-prism",
    product: "Prism",
    tagline: "Employee management",
    problem: "Nobody's quite sure who owns what anymore.",
    description:
      "Lightweight employee management: live org charts, KRAs, review cycles, and governance in one place your team actually uses.",
    meta: ["Live org charts", "KRAs and reviews", "Audit trails"],
    href: "/prism",
    mark: "prism",
  },
] as const

function useWide() {
  const [wide, setWide] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)")
    const update = () => setWide(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])
  return wide
}

function StackCard({
  index,
  total,
  progress,
  animate,
  children,
}: {
  index: number
  total: number
  progress: MotionValue<number>
  animate: boolean
  children: ReactNode
}) {
  // Each card shrinks and dims a touch as the ones after it slide over.
  const scale = useTransform(progress, [index / total, 1], [1, 1 - (total - 1 - index) * 0.05])
  const shade = useTransform(progress, [index / total, 1], [0, (total - 1 - index) * 0.12])
  return (
    <div className="md:sticky md:top-0 md:flex md:h-[100svh] md:items-center" style={{ zIndex: index + 1 }}>
      <motion.div
        className="relative w-full origin-top"
        style={animate ? { scale, top: `${index * 22}px` } : undefined}
      >
        {children}
        {animate ? (
          <motion.span aria-hidden className="pointer-events-none absolute inset-0 bg-ink" style={{ opacity: shade }} />
        ) : null}
      </motion.div>
    </div>
  )
}

/**
 * The suite as three full-colour cards that stack as you scroll: each one
 * pins, and the next slides up over it while it settles back. Phones get a
 * plain stack; nothing pins below `md`.
 */
export default function ProductRouterSection() {
  const listRef = useRef<HTMLDivElement>(null)
  const wide = useWide()
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start start", "end end"] })
  const animate = wide && !reduce

  return (
    <section id="products" className="relative scroll-mt-20 bg-paper pt-24 md:pt-36">
      <div className="container-site">
        <SectionHead
          kicker="Start with the problem"
          title={
            <>
              Three products. One <em>operating picture.</em>
            </>
          }
          className="md:mb-4"
        />
      </div>

      <div ref={listRef} className="container-site flex flex-col gap-3 pb-24 md:gap-0 md:pb-36">
        {products.map((p, i) => (
          <StackCard key={p.product} index={i} total={products.length} progress={scrollYProgress} animate={animate}>
            <article className={`${p.tintClass} grain relative grid min-h-[560px] grid-cols-1 gap-10 overflow-clip bg-(--tint-soft) p-7 sm:p-10 md:min-h-[min(640px,78svh)] md:grid-cols-12 md:p-14`}>
              <ModuleField
                mark={p.mark}
                cell={16}
                scatter={false}
                className="absolute right-6 top-6 hidden h-60 w-60 sm:block md:right-12 md:top-10 md:h-80 md:w-80"
              />

              <div className="relative flex flex-col md:col-span-7">
                <p className="type-kicker text-ink-secondary">{p.tagline}</p>
                <h3 className="mt-3 text-[clamp(64px,10vw,150px)] font-extrabold leading-[0.85] tracking-[-0.055em] [font-stretch:112%]">
                  {p.product}
                </h3>
                <p className="mt-auto max-w-[16ch] pt-16 text-[clamp(28px,3.4vw,48px)] font-light leading-[1.02] tracking-[-0.035em] [font-stretch:104%]">
                  {p.problem}
                </p>
              </div>

              <div className="relative flex flex-col justify-end md:col-span-5">
                <p className="text-[17px] leading-relaxed text-ink-secondary md:text-lg">{p.description}</p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {p.meta.map((item) => (
                    <li key={item} className="rounded-full bg-paper/70 px-4 py-2 text-[14px] font-semibold">
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href={p.href}
                  {...magnetic}
                  className="group/cta mt-8 inline-flex min-h-14 items-center justify-between gap-4 self-start rounded-full bg-ink py-2 pl-7 pr-2 text-[16px] font-semibold text-paper [font-stretch:108%] [translate:var(--mx,0px)_var(--my,0px)] transition-[translate] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                >
                  Explore {p.product}
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-(--tint-soft) text-ink transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/cta:scale-110">
                    <ArrowRight aria-hidden className="h-[18px] w-[18px] transition-transform duration-500 group-hover/cta:-rotate-45" strokeWidth={2.2} />
                  </span>
                </Link>
              </div>
            </article>
          </StackCard>
        ))}
      </div>
    </section>
  )
}
