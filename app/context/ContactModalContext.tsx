"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { PainId } from "../utils/build-plan"

export type ContactModalMode =
  | "assessment"
  | "contact"
  | "pulseQuestionnaire"
  | "pulseContact"
  | "buildPlan"
  | "default"

type OpenOptions = {
  /** Problems chosen in the Build planner; carried into the `buildPlan` flow. */
  plan?: PainId[]
}

type ContactModalContextType = {
  isOpen: boolean
  mode: ContactModalMode
  plan: PainId[]
  /** What the visitor has ticked in the Build planner so far. */
  planDraft: PainId[]
  setPlanDraft: (plan: PainId[]) => void
  openModal: (mode?: ContactModalMode, options?: OpenOptions) => void
  closeModal: () => void
}

const ContactModalContext = createContext<ContactModalContextType | null>(null)

export function ContactModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [mode, setMode] = useState<ContactModalMode>("default")
  const [plan, setPlan] = useState<PainId[]>([])
  const [planDraft, setPlanDraft] = useState<PainId[]>([])

  const openModal = useCallback(
    (nextMode: ContactModalMode = "default", options?: OpenOptions) => {
      // A visitor who has already built a plan should not be asked the same
      // questions again: the Build assessment becomes "send my plan".
      if (nextMode === "assessment" && !options?.plan && planDraft.length > 0) {
        setMode("buildPlan")
        setPlan(planDraft)
      } else {
        setMode(nextMode)
        setPlan(options?.plan ?? [])
      }
      setIsOpen(true)
    },
    [planDraft]
  )

  // Keep mode until the next open so exit animations don't flash the wrong flow.
  const closeModal = useCallback(() => {
    setIsOpen(false)
  }, [])

  return (
    <ContactModalContext.Provider value={{ isOpen, mode, plan, planDraft, setPlanDraft, openModal, closeModal }}>
      {children}
    </ContactModalContext.Provider>
  )
}

export function useContactModal() {
  const ctx = useContext(ContactModalContext)
  if (!ctx) throw new Error("useContactModal must be used within ContactModalProvider")
  return ctx
}
