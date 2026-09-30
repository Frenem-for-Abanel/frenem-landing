"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { Check } from "lucide-react"
import { useContactModal } from "../../context/ContactModalContext"
import { BUILD_PAINS, resolveBuildPlan, SCOPE_LABELS, type PainId } from "../../utils/build-plan"
import { DEEP, INK, MID, WHITE } from "../../utils/palette"
import { smoothScrollTo } from "../../utils/smooth-scroll"
import { CtaInner, magnetic, primaryCtaClass } from "../ContactCta"
import Reveal from "../Reveal"
import { Section, SectionHead } from "../Section"

type ShapeKind = "circle" | "square" | "pill"

/**
 * Each problem is its own block: a shape and a tone from the Build palette,
 * used for its marker in the list and its piece of the structure.
 */
const LOOK: Record<PainId, { kind: ShapeKind; fill: string }> = {
  bottleneck: { kind: "circle", fill: INK },
  roles: { kind: "square", fill: DEEP.clay },
  execution: { kind: "pill", fill: MID.clay },
  ownership: { kind: "square", fill: MID.sand },
  control: { kind: "circle", fill: WHITE },
  succession: { kind: "pill", fill: MID.rose },
}

/** Where each problem's block lands: foundations at the base, the founder on top. */
const SLOT: Record<PainId, { x: number; y: number }> = {
  roles: { x: 22, y: 170 },
  ownership: { x: 112, y: 170 },
  execution: { x: 202, y: 170 },
  control: { x: 67, y: 92 },
  succession: { x: 157, y: 92 },
  bottleneck: { x: 112, y: 14 },
}
const CELL = 76

const ALL: PainId[] = BUILD_PAINS.map((p) => p.id)
const inOrder = (ids: Iterable<PainId>) => {
  const set = new Set(ids)
  return ALL.filter((id) => set.has(id))
}

function shapeRect(kind: ShapeKind, x: number, y: number) {
  if (kind === "circle") return { x, y, width: CELL, height: CELL, rx: CELL / 2 }
  if (kind === "pill") return { x, y: y + CELL * 0.22, width: CELL, height: CELL * 0.56, rx: CELL * 0.28 }
  return { x, y, width: CELL, height: CELL, rx: 0 }
}

function Marker({ id, on }: { id: PainId; on: boolean }) {
  const look = LOOK[id]
  const shape = look.kind === "circle" ? "rounded-full h-8 w-8" : look.kind === "pill" ? "rounded-full h-5 w-9 my-1.5" : "h-8 w-8"
  return (
    <span
      aria-hidden
      className={`relative mt-0.5 flex shrink-0 items-center justify-center border-2 transition-[background-color,border-color,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink ${shape} ${
        on ? "scale-110 border-ink" : "border-ink/30 group-hover:border-ink"
      }`}
      style={{ backgroundColor: on ? look.fill : "transparent" }}
    >
      <Check
        className={`h-4 w-4 transition-transform duration-300 ${on ? "scale-100" : "scale-0"} ${
          look.fill === INK || look.fill === DEEP.clay ? "text-paper" : "text-ink"
        }`}
        strokeWidth={3}
      />
    </span>
  )
}

/**
 * Build, pick and mix. Founders tick the problems they recognise; each one
 * unfolds to show life after Build and drops its block into a structure
 * beside the list. Six of six completes it. The plan names outcomes and a
 * scope, never steps or timelines: those are shaped with the team.
 */
export default function PlanBuilder() {
  const { openModal } = useContactModal()
  const reduce = useReducedMotion()
  const [selected, setSelected] = useState<PainId[]>([])
  const plan = useMemo(() => resolveBuildPlan(selected), [selected])

  const sectionRef = useRef<HTMLDivElement>(null)
  const sheetRef = useRef<HTMLDivElement>(null)
  const [sectionInView, setSectionInView] = useState(false)
  const [sheetInView, setSheetInView] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    const sheet = sheetRef.current
    if (!section || !sheet) return
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === section) setSectionInView(entry.isIntersecting)
        if (entry.target === sheet) setSheetInView(entry.isIntersecting)
      }
    })
    io.observe(section)
    io.observe(sheet)
    return () => io.disconnect()
  }, [])

  const toggle = (id: PainId) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : inOrder([...prev, id])))

  const count = selected.length
  const allSelected = count === ALL.length
  const showBar = count > 0 && sectionInView && !sheetInView

  return (
    <Section id="plan">
      <SectionHead
        kicker="The founder's dilemma"
        title={
          <>
            You built this business. Now it can&apos;t run <em>without you.</em>
          </>
        }
        aside={
          <p>
            Build doesn&apos;t have to be all or nothing. Tick the problems you recognise, and
            we&apos;ll analyse them and shape Build around your business. All six, and you have the
            complete Build.
          </p>
        }
      />

      <div ref={sectionRef} className="grid grid-cols-1 gap-x-10 gap-y-14 lg:grid-cols-12">
        {/* The picker */}
        <Reveal className="lg:col-span-7">
          <fieldset>
            <legend className="sr-only">Which of these sound familiar?</legend>
            <div className="flex items-end justify-between gap-4 border-b-2 border-ink pb-4">
              <p aria-hidden className="type-kicker">
                Which of these sound familiar?
              </p>
              <button
                type="button"
                onClick={() => setSelected(allSelected ? [] : ALL)}
                className="link-line shrink-0 text-[15px] font-semibold"
              >
                {allSelected ? "Clear all" : "Select all"}
              </button>
            </div>

            <ul>
              {BUILD_PAINS.map((pain) => {
                const on = selected.includes(pain.id)
                return (
                  <li key={pain.id} className="border-b border-line-strong">
                    <label
                      className={`group relative -mx-4 grid cursor-pointer grid-cols-[40px_minmax(0,1fr)] gap-x-4 px-4 py-6 transition-colors duration-500 md:-mx-6 md:gap-x-6 md:px-6 md:py-7 ${
                        on ? "bg-(--tint-soft)" : "hover:bg-paper-soft"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={on}
                        onChange={() => toggle(pain.id)}
                        aria-label={pain.title}
                        aria-describedby={`pain-${pain.id}`}
                        className="peer sr-only"
                      />
                      <Marker id={pain.id} on={on} />

                      <span className="min-w-0">
                        <span className="block text-[21px] font-bold leading-tight tracking-[-0.025em] [font-stretch:106%] md:text-[26px]">
                          {pain.title}
                        </span>
                        <span id={`pain-${pain.id}`} className="mt-2 block max-w-[560px] text-[16px] leading-relaxed text-ink-secondary md:text-[17px]">
                          {pain.description}
                        </span>

                        <span
                          aria-hidden={!on}
                          className={`grid transition-[grid-template-rows] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                            on ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                          }`}
                        >
                          <span className="overflow-hidden">
                            <span className="mt-5 block">
                              <span className="text-[14px] font-semibold text-ink-secondary">After Build</span>
                              <span className="mt-1 block max-w-[560px] text-[clamp(22px,2.2vw,30px)] font-light leading-[1.12] tracking-[-0.03em]">
                                {pain.after}.
                              </span>
                            </span>
                          </span>
                        </span>
                      </span>
                    </label>
                  </li>
                )
              })}
            </ul>
          </fieldset>
        </Reveal>

        {/* The plan */}
        <div className="lg:col-span-5">
          {/* Sticky only where the whole sheet fits under the header; shorter
              screens (most laptops) get the floating bar below instead, so
              the call to action is never stuck out of reach. */}
          <div ref={sheetRef} id="your-plan" className="scroll-mt-24 lg-tall:sticky lg-tall:top-24">
            <Reveal delay={0.1} variant="clip">
              <div className="bg-(--tint-soft) p-6 md:p-7">
                <p className="type-kicker text-ink-secondary">Your Build</p>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.h3
                    key={plan.scope ?? "empty"}
                    initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="mt-2 text-[clamp(30px,3vw,44px)] font-extrabold leading-[0.95] tracking-[-0.04em] [font-stretch:108%]"
                  >
                    {plan.scope ? SCOPE_LABELS[plan.scope] : "Tick what sounds familiar."}
                  </motion.h3>
                </AnimatePresence>

                <Structure selected={selected} complete={allSelected} reduce={Boolean(reduce)} />

                <p className="text-[15px] font-semibold" aria-live="polite">
                  {count === 0 ? "Nothing in place yet" : `${count} of ${ALL.length} in place`}
                </p>

                <ul className="mt-3 space-y-2">
                  <AnimatePresence initial={false}>
                    {plan.pains.map((p) => (
                      <motion.li
                        key={p.id}
                        layout={!reduce}
                        initial={{ opacity: 0, x: reduce ? 0 : -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: reduce ? 0 : 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="flex items-center gap-3 text-[16px] font-medium"
                      >
                        <span aria-hidden className="h-3 w-3 shrink-0 rounded-full ring-1 ring-ink/15" style={{ backgroundColor: LOOK[p.id].fill }} />
                        {p.outcome}
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>

                <div className="mt-7">
                  {count === 0 ? (
                    <button type="button" onClick={() => setSelected(ALL)} className={`${primaryCtaClass} w-full`} {...magnetic}>
                      <CtaInner>Start with everything</CtaInner>
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => openModal("buildPlan", { plan: selected })}
                        className={`${primaryCtaClass} w-full`}
                        {...magnetic}
                      >
                        <CtaInner>Analyse my plan</CtaInner>
                      </button>
                      {!allSelected ? (
                        <button
                          type="button"
                          onClick={() => setSelected(ALL)}
                          className="link-line mt-5 text-[15px] font-semibold"
                        >
                          Make it the complete Build
                        </button>
                      ) : null}
                    </>
                  )}
                  <p className="mt-5 text-[14px] leading-relaxed text-ink-secondary">
                    {count === 0
                      ? "Pick what applies and we'll analyse it against how your business runs."
                      : "We'll analyse it against how your business runs and come back to you soon."}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      {/* Keep the plan in reach while the list scrolls: phones, tablets, and
          any screen too short for the sticky sheet. */}
      <div
        aria-hidden={!showBar}
        className={`fixed inset-x-3 bottom-3 z-50 rounded-full bg-ink py-2 pl-5 pr-2 text-paper shadow-[0_12px_40px_rgba(0,0,0,0.25)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:inset-x-auto md:bottom-6 md:right-6 md:w-[420px] lg-tall:hidden ${
          showBar ? "translate-y-0" : "pointer-events-none translate-y-[160%]"
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <p className="min-w-0 truncate text-[15px] font-semibold">
            {count} of {ALL.length}
            <span className="font-normal text-white/60"> · {plan.scope ? SCOPE_LABELS[plan.scope] : ""}</span>
          </p>
          <button
            type="button"
            tabIndex={showBar ? 0 : -1}
            onClick={() => smoothScrollTo("your-plan", { align: "end" })}
            className="h-11 shrink-0 rounded-full bg-(--tint-soft) px-5 text-[15px] font-semibold text-ink"
          >
            View plan
          </button>
        </div>
      </div>
    </Section>
  )
}

/** The structure the plan builds: one block per problem, dropping into place. */
function Structure({ selected, complete, reduce }: { selected: PainId[]; complete: boolean; reduce: boolean }) {
  return (
    <svg viewBox="0 0 300 262" role="img" aria-label={`${selected.length} of ${ALL.length} blocks in place`} className="my-5 block h-auto w-full max-w-[300px]">
      {ALL.map((id) => {
        const { x, y } = SLOT[id]
        const r = shapeRect(LOOK[id].kind, x, y)
        return (
          <rect
            key={`ghost-${id}`}
            {...r}
            fill="none"
            stroke="var(--color-ink)"
            strokeOpacity={0.28}
            strokeWidth={1.5}
            strokeDasharray="5 5"
            style={{ opacity: selected.includes(id) ? 0 : 1, transition: "opacity 0.4s ease" }}
          />
        )
      })}
      <AnimatePresence>
        {selected.map((id) => {
          const { x, y } = SLOT[id]
          const r = shapeRect(LOOK[id].kind, x, y)
          const order = ALL.indexOf(id)
          return (
            // Outer group: the hop when the structure completes.
            <motion.g
              key={id}
              initial={false}
              animate={complete && !reduce ? { y: [0, -18, 0] } : { y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 + order * 0.07, ease: [0.33, 1, 0.68, 1] }}
            >
              {/* Inner group: the drop, landing with a squash and settle. */}
              <motion.g
                initial={reduce ? { opacity: 0 } : { y: -260, opacity: 0, rotate: -14, scaleX: 0.9, scaleY: 1.12 }}
                animate={
                  reduce
                    ? { opacity: 1 }
                    : { y: [-260, 0, 0, 0], opacity: 1, rotate: [-14, 0, 0, 0], scaleX: [0.9, 1, 1.14, 1], scaleY: [1.12, 1, 0.84, 1] }
                }
                exit={reduce ? { opacity: 0 } : { y: 60, opacity: 0, rotate: 12, transition: { duration: 0.35 } }}
                transition={
                  reduce
                    ? { duration: 0 }
                    : { duration: 0.75, times: [0, 0.55, 0.72, 1], ease: ["easeIn", "easeOut", "easeOut"], opacity: { duration: 0.2 } }
                }
                style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}
              >
                <rect {...r} fill={LOOK[id].fill} stroke={LOOK[id].fill === WHITE ? INK : "none"} strokeOpacity={0.2} />
              </motion.g>
            </motion.g>
          )
        })}
      </AnimatePresence>
      <motion.rect
        x={22}
        y={252}
        width={256}
        height={8}
        rx={4}
        fill="var(--color-ink)"
        initial={false}
        animate={{ scaleX: complete ? 1 : 0.35, opacity: complete ? 1 : 0.3 }}
        transition={{ duration: reduce ? 0 : 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      />
    </svg>
  )
}
