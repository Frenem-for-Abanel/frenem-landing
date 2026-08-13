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
        Thanks. Someone from the team will reach out within a day.
      </SuccessState>
    )
  }

  return (
    <>
      <h3
        id="contact-modal-title"
        className="mb-5 pr-8 font-sans text-[23px] font-semibold leading-[1.3] tracking-[-0.02em] text-ink"
      >
        {isPulse
          ? "Curious what a relational diagnostic would surface in your org? Tell us where to send it."
          : "Curious what an org design review would find? Tell us where to send it."}
      </h3>
      <ContactFieldsForm
        idPrefix={mode}
        onSubmit={handleSubmit}
        submitLabel="Get in touch"
        isSubmitting={isSubmitting}
      />
    </>
  )
}
