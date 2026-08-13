"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { cn } from "@/lib/utils"
import { FieldError, HoneypotField, inputClass, labelClass, submitBtnClass } from "./form-shared"

const contactFieldsSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  company: z.string().min(2, { message: "Company name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
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
  const { errors } = form.formState

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="relative flex flex-col gap-3.5">
      <HoneypotField registration={form.register("website")} />
      <div>
        <label htmlFor={`${idPrefix}-name`} className={labelClass}>
          Your name
        </label>
        <input
          id={`${idPrefix}-name`}
          type="text"
          placeholder="First and last name"
          className={cn(inputClass, errors.name && "border-red-500")}
          {...form.register("name")}
        />
        <FieldError message={errors.name?.message} />
      </div>
      <div>
        <label htmlFor={`${idPrefix}-email`} className={labelClass}>
          Work email
        </label>
        <input
          id={`${idPrefix}-email`}
          type="email"
          placeholder="you@company.com"
          className={cn(inputClass, errors.email && "border-red-500")}
          {...form.register("email")}
        />
        <FieldError message={errors.email?.message} />
      </div>
      <div>
        <label htmlFor={`${idPrefix}-company`} className={labelClass}>
          Company name
        </label>
        <input
          id={`${idPrefix}-company`}
          type="text"
          placeholder="Company name"
          className={cn(inputClass, errors.company && "border-red-500")}
          {...form.register("company")}
        />
        <FieldError message={errors.company?.message} />
      </div>
      <button type="submit" disabled={isSubmitting} className={submitBtnClass}>
        {isSubmitting ? "Sending..." : submitLabel}
      </button>
    </form>
  )
}
