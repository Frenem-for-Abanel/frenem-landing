"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

type ContactModalContextType = {
  isOpen: boolean
  openModal: () => void
  closeModal: () => void
}

const ContactModalContext = createContext<ContactModalContextType | null>(null)

export function ContactModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const openModal = useCallback(() => setIsOpen(true), [])
  const closeModal = useCallback(() => setIsOpen(false), [])

  return (
    <ContactModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
    </ContactModalContext.Provider>
  )
}

export function useContactModal() {
  const ctx = useContext(ContactModalContext)
  if (!ctx) throw new Error("useContactModal must be used within ContactModalProvider")
  return ctx
}
