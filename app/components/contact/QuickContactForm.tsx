"use client"

import { useState } from "react"
import { toast } from "sonner"
import { INTEREST_BY_PRODUCT } from "../../utils/interest"
import ContactFieldsForm, { type ContactFields } from "./ContactFieldsForm"
import SuccessState from "./SuccessState"
import { submitContact } from "./submit-contact"

type QuickContactMode = "contact" | "pulseContact"

/** Low-effort path: three fields, no questionnaire. */
export default function QuickContactForm({ mode }: { mode: QuickContactMode }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const isPulse = mode === "pulseContact"

  async function handleSubmit(values: ContactFields) {
    setIsSubmitting(true)
    try {
      await submitContact({
        flow: mode,
        name: values.name,
        email: values.email,
        company: values.company,
        website: values.website,
        interest: isPulse ? INTEREST_BY_PRODUCT.pulse : INTEREST_BY_PRODUCT.build,
      })
      setSuccess(true)
    } catch (error) {
      toast.error("Failed to send message", {
        description: error instanceof Error ? error.message : "Please try again later.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <SuccessState srTitle="Message sent">
        Thanks. Someone from the team will reply within one business day.
      </SuccessState>
    )
  }

  return (
    <>
      <h3
        id="contact-modal-title"
        className="mb-7 text-[26px] font-bold leading-[1.1] tracking-[-0.03em] [font-stretch:104%] text-ink"
      >
        {isPulse
          ? "Curious what a relational diagnostic would surface in your organisation?"
          : "Curious what an organisation design review would find?"}
      </h3>
      <p className="-mt-4 mb-7 text-[16px] leading-relaxed text-ink-secondary">
        Leave your details and we&apos;ll reply within one business day to find a time to talk it
        through. No commitment.
      </p>
      <ContactFieldsForm
        idPrefix={mode}
        onSubmit={handleSubmit}
        submitLabel="Get in touch"
        isSubmitting={isSubmitting}
      />
    </>
  )
}
