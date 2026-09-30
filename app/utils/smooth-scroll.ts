/**
 * Scroll to an element, clear of the fixed header. `align: "end"` is for
 * panels that end in an action: when the element is taller than the room
 * below the header, it lands with its bottom edge in view instead of its top.
 * Instant under reduced motion.
 */
export function smoothScrollTo(elementId: string, { align = "start" }: { align?: "start" | "end" } = {}) {
  const id = elementId.startsWith("#") ? elementId.substring(1) : elementId
  const element = document.getElementById(id)
  if (!element) return

  // Matches the fixed `Header` bar: h-16, and h-20 from `md`.
  const header = window.matchMedia("(min-width: 768px)").matches ? 80 : 64
  const rect = element.getBoundingClientRect()
  const tooTall = rect.height > window.innerHeight - header
  const top =
    align === "end" && tooTall
      ? rect.bottom + window.scrollY - window.innerHeight + 16
      : rect.top + window.scrollY - header

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" })
}
