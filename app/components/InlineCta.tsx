import type { ReactNode } from "react"
import ContactCta from "./ContactCta"
import type { ContactModalMode } from "../context/ContactModalContext"

/**
 * A short call to action between long sections, so the next step is never
 * a long scroll away. One line of copy on the page's colour field, the
 * primary action, and optionally a lighter one.
 */
export default function InlineCta({
  children,
  mode,
  label,
  secondaryLabel,
  secondaryMode = "default",
}: {
  children: ReactNode
  mode: ContactModalMode
  label: string
  secondaryLabel?: string
  secondaryMode?: ContactModalMode
}) {
  return (
    <aside aria-label="Next step" className="grain relative bg-(--tint-soft) py-12 md:py-16">
      <div className="container-site relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between md:gap-12">
        <p className="type-display-3 max-w-[26ch]">{children}</p>
        <div className="flex shrink-0 flex-col items-stretch gap-5 sm:flex-row sm:items-center sm:gap-8">
          <ContactCta mode={mode} className="w-full sm:w-auto">
            {label}
          </ContactCta>
          {secondaryLabel ? (
            <ContactCta mode={secondaryMode} variant="text" className="justify-center sm:justify-start">
              {secondaryLabel}
            </ContactCta>
          ) : null}
        </div>
      </div>
    </aside>
  )
}
