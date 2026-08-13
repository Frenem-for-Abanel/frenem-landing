"use client"

import { usePathname } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useState } from "react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { productFromPathname } from "../../utils/product"
import { getInterestForProduct, INTEREST_BY_PRODUCT } from "../../utils/interest"
import {
  FieldError,
  HoneypotField,
  inputClass,
  labelClass,
  SELECT_CHEVRON,
  selectClass,
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

const schema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  company: z.string().min(2, { message: "Company name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  team_size: z.string().optional(),
  interest: z.string().optional(),
  notes: z.string().optional(),
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
  const { errors, isSubmitting } = form.formState

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
      toast.success("Thank you for your message", {
        description: "We'll get back to you within 24 hours.",
      })
    } catch (error) {
      toast.error("Failed to send message", {
        description: error instanceof Error ? error.message : "Please try again later.",
      })
    }
  }

  if (success) {
    return (
      <SuccessState srTitle="Message sent">
        Thanks for reaching out. We&apos;ll get back to you within 24 hours to set up a
        conversation.
      </SuccessState>
    )
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="relative space-y-[18px]">
      <HoneypotField registration={form.register("website")} />
      <h3
        id="contact-modal-title"
        className="pr-10 font-sans text-[26px] font-semibold leading-tight tracking-[-0.02em] md:text-[32px]"
      >
        Get in touch.
      </h3>
      <p className="mb-2 font-sans text-[15px] leading-relaxed text-ink-secondary">
        Tell us a little about your business. We&apos;ll get back to you within 24 hours.
      </p>

      <div className="grid grid-cols-1 gap-[14px] md:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className={labelClass}>
            Your name
          </label>
          <input
            id="contact-name"
            type="text"
            placeholder="First and last name"
            className={cn(inputClass, errors.name && "border-red-500")}
            {...form.register("name")}
          />
          <FieldError message={errors.name?.message} />
        </div>
        <div>
          <label htmlFor="contact-company" className={labelClass}>
            Company
          </label>
          <input
            id="contact-company"
            type="text"
            placeholder="Company name"
            className={cn(inputClass, errors.company && "border-red-500")}
            {...form.register("company")}
          />
          <FieldError message={errors.company?.message} />
        </div>
      </div>

      <div>
        <label htmlFor="contact-email" className={labelClass}>
          Email
        </label>
        <input
          id="contact-email"
          type="email"
          placeholder="you@company.com"
          className={cn(inputClass, errors.email && "border-red-500")}
          {...form.register("email")}
        />
        <FieldError message={errors.email?.message} />
      </div>

      <div className="grid grid-cols-1 gap-[14px] md:grid-cols-2">
        <div>
          <label htmlFor="contact-team-size" className={labelClass}>
            Team size
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
          Anything else? <span className="font-normal text-ink-tertiary">(optional)</span>
        </label>
        <textarea
          id="contact-notes"
          placeholder="Brief context about your business or what you're looking to solve"
          rows={3}
          className={cn(inputClass, "min-h-[72px] resize-y")}
          {...form.register("notes")}
          onInput={(e) => adjustNotesHeight(e.currentTarget)}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 min-h-11 w-full cursor-pointer rounded-full border-none bg-ink px-7 py-3.5 font-sans text-[15px] font-medium text-paper transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "Sending..." : "Send →"}
      </button>
      <p className="mt-3.5 text-center font-sans text-[13px] text-ink-tertiary">
        No commitment. No decks. Just a conversation.
      </p>
    </form>
  )
}
