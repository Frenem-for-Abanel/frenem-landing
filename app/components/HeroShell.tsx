import type { CSSProperties, ReactNode } from "react"
import SplitText from "./motion/SplitText"
import { HeroScene, SceneStage } from "./motion/HeroScene"
import Breadcrumbs, { type Crumb } from "./Breadcrumbs"
import type { SceneSet } from "../utils/scenes"

interface HeroShellProps {
  eyebrow: string
  title: ReactNode
  subtitle: string
  /** CTA row content: compose ContactCta / links at the call site. */
  actions?: ReactNode
  /** Short line under the actions. */
  note?: ReactNode
  /** Which dot-matrix story the hero tells. */
  scene: SceneSet
  crumbs?: Crumb[]
}

const at = (delay: number): CSSProperties => ({ animationDelay: `${delay}s` })

/**
 * Shared hero, the same on every page. The whole hero is one dot-matrix
 * field on the page's own colour: copy on the left, and on the right a
 * scene that grows out of the same lattice rather than sitting in a box.
 * On phones the copy comes first (headline, promise, action) and the scene
 * follows it. Entrances are CSS so the hero paints even before hydration.
 */
export default function HeroShell({ eyebrow, title, subtitle, actions, note, scene, crumbs }: HeroShellProps) {
  return (
    <section className="grain relative overflow-clip bg-(--tint-soft) text-ink">
      <HeroScene set={scene}>
        <div className="container-site relative grid grid-cols-1 items-center gap-x-12 gap-y-12 pb-16 pt-28 md:pt-32 lg:min-h-[max(calc(100svh-56px),620px)] lg:grid-cols-12 lg:py-20 xl:gap-x-16">
          <div className="flex min-w-0 flex-col lg:col-span-6">
            {crumbs ? <Breadcrumbs items={crumbs} /> : null}
            <p className="type-kicker anim-fade-up flex items-center gap-3 text-ink-secondary" style={at(0.05)}>
              <span aria-hidden className="h-3 w-3 shrink-0 rounded-full bg-(--tint-deep)" />
              {eyebrow}
            </p>
            <SplitText as="h1" trigger="load" delay={0.1} className="type-hero mt-6 md:mt-8">
              {title}
            </SplitText>
            <p className="type-lead anim-fade-up mt-6 max-w-[500px] text-ink-secondary md:mt-8" style={at(0.35)}>
              {subtitle}
            </p>
            {actions ? (
              <div
                className="anim-fade-up mt-8 flex w-full flex-col items-stretch gap-5 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-8 md:mt-10"
                style={at(0.45)}
              >
                {actions}
              </div>
            ) : null}
            {note ? (
              <p className="anim-fade-up mt-7 text-[15px] font-medium text-ink-secondary" style={at(0.55)}>
                {note}
              </p>
            ) : null}
          </div>

          {/* No transform on the stage: the canvas measures where it sits. */}
          <div className="min-w-0 lg:col-span-6">
            <SceneStage className="mx-auto w-full max-w-[540px] lg:max-w-[min(100%,calc(100svh-270px))]" />
          </div>
        </div>
      </HeroScene>
    </section>
  )
}
