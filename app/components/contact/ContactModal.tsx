"use client"

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from "react"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { X } from "lucide-react"
import { useContactModal, type ContactModalMode } from "../../context/ContactModalContext"
import { productFromPathname, PRODUCT_LABELS, type ProductKey } from "../../utils/product"
import QuestionnaireFlow from "./QuestionnaireFlow"
import QuickContactForm from "./QuickContactForm"
import GeneralContactForm from "./GeneralContactForm"
import BuildPlanForm from "./BuildPlanForm"

function isQuestionnaireMode(mode: string): mode is "assessment" | "pulseQuestionnaire" {
  return mode === "assessment" || mode === "pulseQuestionnaire"
}

function isQuickContactMode(mode: string): mode is "contact" | "pulseContact" {
  return mode === "contact" || mode === "pulseContact"
}

/** Product flows take their product's tint; the general form follows the page. */
function productForMode(mode: ContactModalMode, pathname: string): ProductKey | null {
  if (mode === "assessment" || mode === "contact" || mode === "buildPlan") return "build"
  if (mode === "pulseQuestionnaire" || mode === "pulseContact") return "pulse"
  return productFromPathname(pathname)
}

/**
 * Modal shell: overlay, dialog chrome, focus management, and the
 * discard-confirm guard. Flow content lives in the flow components.
 */
export default function ContactModal() {
  const { isOpen, mode, closeModal } = useContactModal()
  const pathname = usePathname()
  const [discardConfirm, setDiscardConfirm] = useState(false)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)
  const closeGuardRef = useRef<() => boolean>(() => false)
  const reduceMotion = useReducedMotion()

  const registerCloseGuard = useCallback((guard: () => boolean) => {
    closeGuardRef.current = guard
  }, [])

  const requestClose = useCallback(() => {
    // Escape / overlay clicks during the confirm just cancel the confirm.
    if (discardConfirm) {
      setDiscardConfirm(false)
      return
    }
    if (isQuestionnaireMode(mode) && closeGuardRef.current()) {
      setDiscardConfirm(true)
      return
    }
    setDiscardConfirm(false)
    closeModal()
  }, [discardConfirm, mode, closeModal])

  const confirmDiscard = useCallback(() => {
    setDiscardConfirm(false)
    closeModal()
  }, [closeModal])

  useEffect(() => {
    if (!isOpen) setDiscardConfirm(false)
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) requestClose()
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isOpen, requestClose])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
      previouslyFocused.current = document.activeElement as HTMLElement | null
      // Defer so the dialog is in the DOM.
      requestAnimationFrame(() => {
        const panel = panelRef.current
        if (!panel) return
        const focusTarget =
          panel.querySelector<HTMLElement>("[data-modal-initial-focus]") ??
          panel.querySelector<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
        focusTarget?.focus()
      })
    } else {
      document.body.style.overflow = ""
      previouslyFocused.current?.focus?.()
      previouslyFocused.current = null
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen || !discardConfirm) return
    requestAnimationFrame(() => {
      panelRef.current?.querySelector<HTMLElement>("[data-modal-initial-focus]")?.focus()
    })
  }, [isOpen, discardConfirm])

  const handleOverlayClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) requestClose()
  }

  const handlePanelKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Tab" || !panelRef.current) return
    const focusable = Array.from(
      panelRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ).filter((el) => el.offsetParent !== null || el === document.activeElement)
    if (focusable.length === 0) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  const isPulseFlow = mode === "pulseQuestionnaire" || mode === "pulseContact"
  const product = productForMode(mode, pathname)

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[1000] flex items-end justify-center bg-[rgba(21,21,21,0.5)] p-0 backdrop-blur-[4px] sm:items-center sm:p-5 md:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.35 }}
          onClick={handleOverlayClick}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-modal-title"
            tabIndex={-1}
            className={`${product ? `tint-${product}` : "tint-brand"} relative my-0 w-full max-h-[min(92dvh,calc(100dvh-1rem))] overflow-y-auto rounded-t-[24px] bg-paper shadow-[0_40px_100px_rgba(0,0,0,0.3)] outline-none sm:my-auto sm:max-h-[calc(100dvh-2rem)] sm:max-w-[500px] sm:rounded-none [&::-webkit-scrollbar]:hidden [scrollbar-width:none]`}
            initial={{ opacity: 0, y: 60, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 26, mass: 0.8 }}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handlePanelKeyDown}
          >
            <div className="sticky top-0 z-[1] flex h-16 items-center justify-between bg-(--tint-soft) pl-5 pr-3 sm:pl-8">
              <p className="flex items-center gap-3 text-[15px] font-bold [font-stretch:106%]">
                <span aria-hidden className="h-3 w-3 rounded-full bg-(--tint-bright)" />
                Frenem{product ? ` · ${PRODUCT_LABELS[product]}` : ""}
              </p>
              {!discardConfirm && (
                <button
                  type="button"
                  onClick={requestClose}
                  data-modal-initial-focus={isQuestionnaireMode(mode) ? true : undefined}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-paper text-ink transition-transform duration-300 hover:rotate-90"
                  aria-label="Close"
                >
                  <X aria-hidden className="h-5 w-5" strokeWidth={2.2} />
                </button>
              )}
            </div>

            <div className="px-5 pb-8 pt-7 sm:px-8 sm:pb-9 sm:pt-8">
              {/* Keep the flow mounted (hidden) during discard-confirm so answers survive. */}
              <div className={discardConfirm ? "hidden" : undefined}>
                {isQuestionnaireMode(mode) ? (
                  <QuestionnaireFlow mode={mode} registerCloseGuard={registerCloseGuard} />
                ) : isQuickContactMode(mode) ? (
                  <QuickContactForm mode={mode} />
                ) : mode === "buildPlan" ? (
                  <BuildPlanForm />
                ) : (
                  <GeneralContactForm />
                )}
              </div>

              {discardConfirm && (
                <div className="px-1 py-6 text-center">
                  <h3
                    id="contact-modal-title"
                    className="mb-2.5 text-[30px] font-extrabold tracking-[-0.035em] [font-stretch:106%] text-ink"
                  >
                    Discard your answers?
                  </h3>
                  <p className="mb-7 text-[16px] text-ink-secondary">
                    You&apos;ll lose progress on this {isPulseFlow ? "Pulse check" : "assessment"}.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2.5">
                    <button
                      type="button"
                      data-modal-initial-focus
                      onClick={() => setDiscardConfirm(false)}
                      className="inline-flex h-11 cursor-pointer items-center rounded-full border-none bg-ink px-6 text-[15px] font-semibold text-paper transition-transform hover:scale-[1.03]"
                    >
                      Keep going
                    </button>
                    <button
                      type="button"
                      onClick={confirmDiscard}
                      className="inline-flex h-11 cursor-pointer items-center rounded-full border-2 border-ink/15 bg-transparent px-6 text-[15px] font-semibold text-ink-secondary transition-colors hover:border-ink hover:text-ink"
                    >
                      Discard
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
