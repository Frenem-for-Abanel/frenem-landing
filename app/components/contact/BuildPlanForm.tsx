"use client"

import { useMemo, useState } from "react"
import { toast } from "sonner"
import { useContactModal } from "../../context/ContactModalContext"
import { INTEREST_BY_PRODUCT } from "../../utils/interest"
import { resolveBuildPlan, SCOPE_LABELS } from "../../utils/build-plan"
import ContactFieldsForm, { type ContactFields } from "./ContactFieldsForm"
import SuccessState from "./SuccessState"
import { submitContact } from "./submit-contact"

/** Sends the plan assembled in the Build planner, with the contact trio. */
export default function BuildPlanForm() {
  const { plan: painIds } = useContactModal()
  const plan = useMemo(() => resolveBuildPlan(painIds), [painIds])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(values: ContactFields) {
    setIsSubmitting(true)
    try {
      await submitContact({
        flow: "buildPlan",
        name: values.name,
        email: values.email,
        company: values.company,
        website: values.website,
        interest: INTEREST_BY_PRODUCT.build,
        plan: painIds,
      })
      setSuccess(true)
    } catch (error) {
      toast.error("Failed to send your plan", {
        description: error instanceof Error ? error.message : "Please try again later.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <SuccessState srTitle="Plan sent">
        Thanks. We&apos;re analysing your plan and will come back to you soon with what we&apos;d
        tackle first.
      </SuccessState>
    )
  }

  return (
    <>
      <p className="text-[14px] font-semibold text-ink-secondary">
        {plan.scope ? SCOPE_LABELS[plan.scope] : "Your Build"}
      </p>
      <h3 id="contact-modal-title" className="mt-2 text-[30px] font-extrabold leading-[1.02] tracking-[-0.035em] [font-stretch:106%] text-ink">
        We&apos;ll analyse your plan.
      </h3>
      <p className="mt-3 text-[16px] leading-relaxed text-ink-secondary">
        Tell us where to reach you. We&apos;ll look at what you picked against how your business
        runs, and come back soon with what we&apos;d tackle first.
      </p>

      <div className="mb-7 mt-6 bg-(--tint-soft) p-5">
        <p className="text-[14px] font-semibold text-ink-secondary">
          What you picked
        </p>
        <ul className="mt-3 space-y-2">
          {plan.pains.map((p) => (
            <li key={p.id} className="flex items-center gap-3 text-[15px] font-medium text-ink">
              <span aria-hidden className="h-2.5 w-2.5 shrink-0 rounded-full bg-ink" />
              {p.outcome}
            </li>
          ))}
        </ul>
      </div>

      <ContactFieldsForm
        idPrefix="buildPlan"
        onSubmit={handleSubmit}
        submitLabel="Send for analysis"
        isSubmitting={isSubmitting}
      />
    </>
  )
}
