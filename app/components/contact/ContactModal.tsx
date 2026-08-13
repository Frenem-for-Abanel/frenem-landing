"use client"

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { useContactModal } from "../../context/ContactModalContext"
import QuestionnaireFlow from "./QuestionnaireFlow"
import QuickContactForm from "./QuickContactForm"
import GeneralContactForm from "./GeneralContactForm"

function isQuestionnaireMode(mode: string): mode is "assessment" | "pulseQuestionnaire" {
  return mode === "assessment" || mode === "pulseQuestionnaire"
}

function isQuickContactMode(mode: string): mode is "contact" | "pulseContact" {
  return mode === "contact" || mode === "pulseContact"
}

/**
 * Modal shell: overlay, dialog chrome, focus management, and the
 * discard-confirm guard. Flow content lives in the flow components.
 */
export default function ContactModal() {
  const { isOpen, mode, closeModal } = useContactModal()
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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[1000] flex items-end justify-center bg-[rgba(10,10,10,0.5)] p-0 backdrop-blur-[8px] sm:items-center sm:p-5 md:p-6"
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
            className="relative my-0 w-full max-h-[min(92dvh,calc(100dvh-1rem))] overflow-y-auto rounded-t-2xl bg-paper px-5 py-8 shadow-[0_24px_80px_rgba(0,0,0,0.2)] outline-none sm:my-auto sm:max-h-[calc(100dvh-2rem)] sm:max-w-[460px] sm:rounded-xl sm:px-9 sm:py-9 md:px-9 md:pb-[34px] md:pt-9 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handlePanelKeyDown}
          >
            {!discardConfirm && (
              <button
                type="button"
                onClick={requestClose}
                data-modal-initial-focus={isQuestionnaireMode(mode) ? true : undefined}
                className="absolute right-3.5 top-3.5 flex h-10 w-10 items-center justify-center rounded-full bg-paper-soft font-sans text-lg text-ink-secondary transition-colors hover:bg-line"
                aria-label="Close"
              >
                <span aria-hidden>×</span>
              </button>
            )}

            {/* Keep the flow mounted (hidden) during discard-confirm so answers survive. */}
            <div className={discardConfirm ? "hidden" : undefined}>
              {isQuestionnaireMode(mode) ? (
                <QuestionnaireFlow mode={mode} registerCloseGuard={registerCloseGuard} />
              ) : isQuickContactMode(mode) ? (
                <QuickContactForm mode={mode} />
              ) : (
                <GeneralContactForm />
              )}
            </div>

            {discardConfirm && (
              <div className="px-1 py-6 text-center">
                <h3
                  id="contact-modal-title"
                  className="mb-2.5 font-sans text-[22px] font-semibold tracking-[-0.02em] text-ink"
                >
                  Discard your answers?
                </h3>
                <p className="mb-6 font-sans text-sm text-ink-secondary">
                  You&apos;ll lose progress on this {isPulseFlow ? "Pulse check" : "assessment"}.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2.5">
                  <button
                    type="button"
                    data-modal-initial-focus
                    onClick={() => setDiscardConfirm(false)}
                    className="inline-flex h-11 cursor-pointer items-center rounded-full border-none bg-ink px-[22px] font-sans text-sm font-medium text-paper transition-colors hover:bg-accent"
                  >
                    Keep going
                  </button>
                  <button
                    type="button"
                    onClick={confirmDiscard}
                    className="inline-flex h-11 cursor-pointer items-center rounded-full border border-line-strong bg-transparent px-[22px] font-sans text-sm font-medium text-ink-secondary transition-colors hover:border-ink hover:text-ink"
                  >
                    Discard
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
