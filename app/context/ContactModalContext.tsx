"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

export type ContactModalMode = "assessment" | "contact" | "default"

type ContactModalContextType = {
  isOpen: boolean
  mode: ContactModalMode
  openModal: (mode?: ContactModalMode) => void
  closeModal: () => void
}

const ContactModalContext = createContext<ContactModalContextType | null>(null)

export function ContactModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [mode, setMode] = useState<ContactModalMode>("default")

  const openModal = useCallback((nextMode: ContactModalMode = "default") => {
    setMode(nextMode)
    setIsOpen(true)
  }, [])

  // Keep mode until the next open so exit animations don't flash the wrong flow.
  const closeModal = useCallback(() => {
    setIsOpen(false)
  }, [])

  return (
    <ContactModalContext.Provider value={{ isOpen, mode, openModal, closeModal }}>
      {children}
    </ContactModalContext.Provider>
  )
}

export function useContactModal() {
  const ctx = useContext(ContactModalContext)
  if (!ctx) throw new Error("useContactModal must be used within ContactModalProvider")
  return ctx
}
