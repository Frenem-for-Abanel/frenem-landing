import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

/**
 * Shared section scaffolding. Plain functions (no client boundary) so server
 * and client components can both compose them.
 */

export function Section({
  id,
  children,
  className,
  dark = false,
  soft = false,
}: {
  id?: string
  children: ReactNode
  className?: string
  /** Near-black band. Adds `.on-dark` so type accents flip to bright tints. */
  dark?: boolean
  /** Soft warm-grey band. */
  soft?: boolean
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative overflow-hidden py-16 md:py-[140px]",
        dark && "on-dark bg-ink text-paper",
        soft && "bg-paper-soft",
        !dark && !soft && "bg-paper",
        className
      )}
    >
      <div className="container-site">{children}</div>
    </section>
  )
}

export function SectionLabel({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("type-eyebrow mb-6", className)}>{children}</div>
}

export function SectionHeading({
  children,
  className,
  size = 2,
}: {
  children: ReactNode
  className?: string
  size?: 1 | 2 | 3
}) {
  const sizeClass = size === 1 ? "type-display-1" : size === 3 ? "type-display-3" : "type-display-2"
  return <h2 className={cn(sizeClass, className)}>{children}</h2>
}
