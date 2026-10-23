"use client"

import { usePathname } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useState } from "react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { CtaInner, primaryCtaClass } from "../ContactCta"
import { productFromPathname } from "../../utils/product"
import { getInterestForProduct, INTEREST_BY_PRODUCT } from "../../utils/interest"
import {
  emailField,
  FieldError,
  fieldA11y,
  HoneypotField,
  inputClass,
  inputErrorClass,
  labelClass,
  OptionalTag,
  requiredText,
  SELECT_CHEVRON,
  selectClass,
  useReportDirty,
} from "./form-shared"
import SuccessState from "./SuccessState"
import { submitContact } from "./submit-contact"

const TEAM_OPTIONS = [
  { value: "10-50", label: "10 – 50" },
  { value: "50-200", label: "50 – 200" },
  { value: "200-500", label: "200 – 500" },
  { value: "500+", label: "500+" },
]

const INTEREST_OPTIONS = [
  INTEREST_BY_PRODUCT.pulse,
  INTEREST_BY_PRODUCT.build,
  INTEREST_BY_PRODUCT.prism,
  "Multiple products",
  "Not sure yet",
]

const NOTES_MAX_HEIGHT = 200
const NOTES_MAX_LENGTH = 4000

const schema = z.object({
  name: requiredText("Please enter your name.", "Please enter your full name."),
  company: requiredText("Please enter your company name.", "Please enter your full company name."),
  email: emailField,
  team_size: z.string().optional(),
  interest: z.string().optional(),
  notes: z
    .string()
    .max(NOTES_MAX_LENGTH, { message: `Please keep this under ${NOTES_MAX_LENGTH} characters.` })
    .optional(),
  website: z.string().optional(), // honeypot
})

type FormValues = z.infer<typeof schema>

/** Full contact form: the default "Get in touch" flow. */
export default function GeneralContactForm() {
  const pathname = usePathname()
  const [success, setSuccess] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      company: "",
      email: "",
      team_size: "",
      interest: getInterestForProduct(productFromPathname(pathname)),
      notes: "",
      website: "",
    },
  })
  const { errors, isSubmitting, dirtyFields } = form.formState
  // `interest` is prefilled from the page, so only typed fields count as unsent work.
  useReportDirty(Boolean(dirtyFields.name || dirtyFields.company || dirtyFields.email || dirtyFields.notes))

  const adjustNotesHeight = (el: HTMLTextAreaElement | null) => {
    if (!el) return
    el.style.height = "auto"
    el.style.height = `${Math.min(el.scrollHeight, NOTES_MAX_HEIGHT)}px`
  }

  async function onSubmit(values: FormValues) {
    try {
      await submitContact({
        name: values.name,
        email: values.email,
        company: values.company,
        website: values.website,
        team_size: values.team_size || undefined,
        interest: values.interest || undefined,
        notes: values.notes || undefined,
      })
      setSuccess(true)
    } catch (error) {
      toast.error("Failed to send message", {
        description: error instanceof Error ? error.message : "Please try again later.",
      })
    }
  }

  if (success) {
    return (
      <SuccessState srTitle="Message sent">
        Thanks for reaching out. We&apos;ll reply within one business day to set up a
        conversation.
      </SuccessState>
    )
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="relative space-y-[18px]">
      <HoneypotField registration={form.register("website")} />
      <h3
        id="contact-modal-title"
        className="text-[40px] font-extrabold leading-[0.95] tracking-[-0.045em] [font-stretch:108%]"
      >
        Get in <span className="font-light">touch.</span>
      </h3>
      <p className="mb-2 text-[16px] leading-relaxed text-ink-secondary">
        Tell us a little about your business. We&apos;ll reply within one business day with a
        suggested starting point and a time to talk.
      </p>

      <div className="grid grid-cols-1 gap-[14px] md:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className={labelClass}>
            Your name
          </label>
          <input
            {...fieldA11y("contact-name", errors.name?.message)}
            autoComplete="name"
            type="text"
            placeholder="First and last name"
            className={cn(inputClass, errors.name && inputErrorClass)}
            {...form.register("name")}
          />
          <FieldError fieldId="contact-name" message={errors.name?.message} />
        </div>
        <div>
          <label htmlFor="contact-company" className={labelClass}>
            Company
          </label>
          <input
            {...fieldA11y("contact-company", errors.company?.message)}
            autoComplete="organization"
            type="text"
            placeholder="Company name"
            className={cn(inputClass, errors.company && inputErrorClass)}
            {...form.register("company")}
          />
          <FieldError fieldId="contact-company" message={errors.company?.message} />
        </div>
      </div>

      <div>
        <label htmlFor="contact-email" className={labelClass}>
          Work email
        </label>
        <input
          {...fieldA11y("contact-email", errors.email?.message)}
          autoComplete="email"
          inputMode="email"
          type="email"
          placeholder="you@company.com"
          className={cn(inputClass, errors.email && inputErrorClass)}
          {...form.register("email")}
        />
        <FieldError fieldId="contact-email" message={errors.email?.message} />
      </div>

      <div className="grid grid-cols-1 gap-[14px] md:grid-cols-2">
        <div>
          <label htmlFor="contact-team-size" className={labelClass}>
            Team size
            <OptionalTag />
          </label>
          <select
            id="contact-team-size"
            className={cn(selectClass, "text-ink")}
            style={{ backgroundImage: `url("${SELECT_CHEVRON}")` }}
            {...form.register("team_size")}
          >
            <option value="">Select</option>
            {TEAM_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="contact-interest" className={labelClass}>
            Interested in
            <OptionalTag />
          </label>
          <select
            id="contact-interest"
            className={cn(selectClass, "text-ink")}
            style={{ backgroundImage: `url("${SELECT_CHEVRON}")` }}
            {...form.register("interest")}
          >
            <option value="">Select</option>
            {INTEREST_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="contact-notes" className={labelClass}>
          Anything else?
          <OptionalTag />
        </label>
        <textarea
          {...fieldA11y("contact-notes", errors.notes?.message, false)}
          maxLength={NOTES_MAX_LENGTH}
          placeholder="Brief context about your business or what you're looking to solve"
          rows={3}
          className={cn(inputClass, "min-h-[72px] resize-y", errors.notes && inputErrorClass)}
          {...form.register("notes")}
          onInput={(e) => adjustNotesHeight(e.currentTarget)}
        />
        <FieldError fieldId="contact-notes" message={errors.notes?.message} />
      </div>

      <button type="submit" disabled={isSubmitting} className={cn(primaryCtaClass, "mt-2 w-full")}>
        <CtaInner>{isSubmitting ? "Sending…" : "Send"}</CtaInner>
      </button>
      <p className="mt-3.5 text-center font-sans text-[13px] text-ink-tertiary">
        No commitment. No decks. Just a conversation.
      </p>
    </form>
  )
}
