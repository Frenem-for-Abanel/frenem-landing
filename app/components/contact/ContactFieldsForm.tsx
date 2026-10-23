"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { cn } from "@/lib/utils"
import { CtaInner, primaryCtaClass } from "../ContactCta"
import {
  emailField,
  FieldError,
  fieldA11y,
  HoneypotField,
  inputClass,
  inputErrorClass,
  labelClass,
  requiredText,
  useReportDirty,
} from "./form-shared"

const contactFieldsSchema = z.object({
  name: requiredText("Please enter your name.", "Please enter your full name."),
  company: requiredText("Please enter your company name.", "Please enter your full company name."),
  email: emailField,
  website: z.string().optional(), // honeypot
})

export type ContactFields = z.infer<typeof contactFieldsSchema>

/** Name / work email / company trio shared by questionnaire and quick flows. */
export default function ContactFieldsForm({
  idPrefix,
  onSubmit,
  submitLabel,
  isSubmitting,
}: {
  idPrefix: string
  onSubmit: (values: ContactFields) => Promise<void>
  submitLabel: string
  isSubmitting: boolean
}) {
  const form = useForm<ContactFields>({
    resolver: zodResolver(contactFieldsSchema),
    defaultValues: { name: "", company: "", email: "", website: "" },
  })
  const { errors, isDirty } = form.formState
  // The flow swaps this form for its success state once sent, which clears it.
  useReportDirty(isDirty)

  const ids = {
    name: `${idPrefix}-name`,
    email: `${idPrefix}-email`,
    company: `${idPrefix}-company`,
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="relative flex flex-col gap-3.5">
      <HoneypotField registration={form.register("website")} />
      <div>
        <label htmlFor={ids.name} className={labelClass}>
          Your name
        </label>
        <input
          {...fieldA11y(ids.name, errors.name?.message)}
          type="text"
          autoComplete="name"
          placeholder="First and last name"
          className={cn(inputClass, errors.name && inputErrorClass)}
          {...form.register("name")}
        />
        <FieldError fieldId={ids.name} message={errors.name?.message} />
      </div>
      <div>
        <label htmlFor={ids.email} className={labelClass}>
          Work email
        </label>
        <input
          {...fieldA11y(ids.email, errors.email?.message)}
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="you@company.com"
          className={cn(inputClass, errors.email && inputErrorClass)}
          {...form.register("email")}
        />
        <FieldError fieldId={ids.email} message={errors.email?.message} />
      </div>
      <div>
        <label htmlFor={ids.company} className={labelClass}>
          Company name
        </label>
        <input
          {...fieldA11y(ids.company, errors.company?.message)}
          type="text"
          autoComplete="organization"
          placeholder="Company name"
          className={cn(inputClass, errors.company && inputErrorClass)}
          {...form.register("company")}
        />
        <FieldError fieldId={ids.company} message={errors.company?.message} />
      </div>
      <button type="submit" disabled={isSubmitting} className={cn(primaryCtaClass, "mt-2 w-full")}>
        <CtaInner>{isSubmitting ? "Sending…" : submitLabel}</CtaInner>
      </button>
    </form>
  )
}
