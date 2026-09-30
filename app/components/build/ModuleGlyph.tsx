import type { ReactNode } from "react"
import type { ModuleId } from "../../utils/build-plan"

const A = "var(--tint-bright)"

/**
 * A miniature of each Build artefact, drawn as a 32px line diagram: the
 * matrix, the ladder, the tree. Ink strokes use currentColor; the one
 * highlighted element takes the page tint.
 */
const GLYPHS: Record<ModuleId, ReactNode> = {
  // A boundary around a handful of people: reading the baseline.
  baseline: (
    <>
      <rect x="4.5" y="4.5" width="23" height="23" strokeDasharray="2 2" />
      <circle cx="11" cy="12" r="2" />
      <circle cx="20" cy="10" r="2" />
      <circle cx="21" cy="21" r="2" fill={A} stroke={A} />
      <circle cx="11" cy="21" r="2" />
    </>
  ),
  // Decision × level grid, one decider per row.
  "decision-rights": (
    <>
      <path d="M4.5 10.5h23M4.5 17.5h23M4.5 24.5h23M13.5 4.5v23M20.5 4.5v23" opacity="0.45" />
      <rect x="4.5" y="4.5" width="23" height="23" />
      <rect x="6.5" y="6" width="5" height="3" fill="currentColor" stroke="none" />
      <rect x="15.5" y="13" width="3" height="3" fill={A} stroke="none" />
      <rect x="22" y="20" width="4" height="3" fill="currentColor" stroke="none" />
    </>
  ),
  // Stepped grades.
  grades: (
    <>
      <path d="M4.5 27.5h23" />
      <rect x="5.5" y="21.5" width="5" height="6" />
      <rect x="11.5" y="16.5" width="5" height="11" />
      <rect x="17.5" y="11.5" width="5" height="16" fill={A} stroke={A} />
      <rect x="23.5" y="5.5" width="4" height="22" />
    </>
  ),
  // Role rows, each with exactly one owner.
  "job-architecture": (
    <>
      <path d="M11.5 7.5h16M11.5 13.5h16M11.5 19.5h16M11.5 25.5h16" />
      <circle cx="6.5" cy="7.5" r="2" />
      <circle cx="6.5" cy="13.5" r="2" />
      <circle cx="6.5" cy="19.5" r="2" fill={A} stroke={A} />
      <circle cx="6.5" cy="25.5" r="2" />
    </>
  ),
  // R / A / C / I cells.
  raci: (
    <>
      <rect x="4.5" y="4.5" width="23" height="23" />
      <path d="M4.5 12.5h23M4.5 19.5h23M12.5 4.5v23M19.5 4.5v23" opacity="0.45" />
      <rect x="6" y="6" width="5" height="5" fill="currentColor" stroke="none" />
      <rect x="14" y="14" width="4" height="4" fill={A} stroke="none" />
      <rect x="21" y="21" width="5" height="5" fill="currentColor" stroke="none" opacity="0.35" />
      <rect x="14" y="6" width="4" height="5" fill="currentColor" stroke="none" opacity="0.35" />
    </>
  ),
  // Three layers, spans drawn in.
  "org-map": (
    <>
      <path d="M16 8v5M8 13h16M8 13v5M24 13v5M8 18l-3 6M8 18l3 6M24 18l-3 6M24 18l3 6" />
      <circle cx="16" cy="6" r="2.2" fill="currentColor" />
      <circle cx="8" cy="18" r="2" fill={A} stroke={A} />
      <circle cx="24" cy="18" r="2" fill={A} stroke={A} />
    </>
  ),
  // Rails either side of a delegated decision.
  guardrails: (
    <>
      <path d="M6.5 5v22M25.5 5v22M6.5 10.5h19M6.5 21.5h19" />
      <circle cx="16" cy="16" r="3" fill={A} stroke={A} />
    </>
  ),
  // The ladder: what good looks like at each rung.
  competency: (
    <>
      <path d="M9.5 4.5v23M22.5 4.5v23M9.5 9.5h13M9.5 15.5h13M9.5 21.5h13" />
      <path d="M9.5 15.5h13" stroke={A} strokeWidth="2.5" />
    </>
  ),
  // Performance × potential.
  "nine-box": (
    <>
      <rect x="4.5" y="4.5" width="23" height="23" />
      <path d="M12.17 4.5v23M19.83 4.5v23M4.5 12.17h23M4.5 19.83h23" opacity="0.45" />
      <rect x="20.8" y="5.5" width="5.7" height="5.7" fill={A} stroke="none" />
      <rect x="13.1" y="13.1" width="5.7" height="5.7" fill="currentColor" stroke="none" opacity="0.35" />
    </>
  ),
  // Every artefact, stacked into one model.
  "operating-model": (
    <>
      <path d="M16 4.5l11.5 5.5L16 15.5 4.5 10z" />
      <path d="M4.5 16l11.5 5.5L27.5 16" />
      <path d="M4.5 22l11.5 5.5L27.5 22" stroke={A} />
    </>
  ),
}

export default function ModuleGlyph({ id, className }: { id: ModuleId; className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
      className={className}
    >
      {GLYPHS[id]}
    </svg>
  )
}
