"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useContactModal } from "../context/ContactModalContext"
import { useProduct } from "../context/ProductContext"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const inputClass =
  "w-full rounded-lg border border-[var(--frenem-border-strong)] bg-[var(--frenem-bg)] px-3.5 py-3 font-sans text-[15px] text-[var(--frenem-ink)] outline-none transition-[border-color,box-shadow] placeholder:text-[var(--frenem-ink-tertiary)] focus:border-[var(--frenem-ink)] focus:shadow-[0_0_0_3px_rgba(10,10,10,0.06)]"

/** Native select: no portal / z-index vs modal; instant OS menu */
const selectClass = cn(
  inputClass,
  "min-h-[48px] cursor-pointer appearance-none bg-[length:14px_14px] bg-[right_14px_center] bg-no-repeat pr-11 [-webkit-appearance:none]",
)

const LABEL_CHEVRON =
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#555" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>`
  )

const TEAM_OPTIONS = [
  { value: "10-50", label: "10 – 50" },
  { value: "50-200", label: "50 – 200" },
  { value: "200-500", label: "200 – 500" },
  { value: "500+", label: "500+" },
]

const INTEREST_OPTIONS = [
  { value: "Build · Org Design Sprint", label: "Build · Org Design Sprint" },
  { value: "Prism · Employee Management", label: "Prism · Employee Management" },
  { value: "Pulse · Multirater Feedback", label: "Pulse · Multirater Feedback" },
  { value: "Multiple products", label: "Multiple products" },
  { value: "Not sure yet", label: "Not sure yet" },
] as const

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  company: z.string().min(2, { message: "Company name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  team_size: z.string().optional(),
  interest: z.string().optional(),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

const INTEREST_BY_PRODUCT = {
  build: "Build · Org Design Sprint",
  prism: "Prism · Employee Management",
  pulse: "Pulse · Multirater Feedback",
} as const

const labelClass = "mb-1.5 block font-sans text-[13px] font-medium text-[var(--frenem-ink-secondary)]"

export default function ContactModal() {
  const { isOpen, closeModal } = useContactModal()
  const { activeProduct } = useProduct()
  const [showSuccess, setShowSuccess] = useState(false)

  const NOTES_MAX_HEIGHT = 200

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      company: "",
      email: "",
      team_size: "",
      interest: "",
      notes: "",
    },
  })

  useEffect(() => {
    if (isOpen) {
      form.setValue("interest", INTEREST_BY_PRODUCT[activeProduct])
    }
  }, [isOpen, activeProduct, form])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) closeModal()
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isOpen, closeModal])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  const resetAndClose = () => {
    setShowSuccess(false)
    form.reset()
    closeModal()
  }

  const adjustNotesHeight = (el: HTMLTextAreaElement | null) => {
    if (!el) return
    el.style.height = "auto"
    el.style.height = `${Math.min(el.scrollHeight, NOTES_MAX_HEIGHT)}px`
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) resetAndClose()
  }

  async function onSubmit(values: FormValues) {
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          company: values.company,
          team_size: values.team_size || undefined,
          interest: values.interest || undefined,
          notes: values.notes || undefined,
        }),
      })

      if (!response.ok) throw new Error("Failed to send message")

      setShowSuccess(true)
      form.reset()
      toast.success("Thank you for your message", {
        description: "We'll get back to you within 24 hours.",
      })
    } catch {
      toast.error("Failed to send message", {
        description: "Please try again later.",
      })
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-[rgba(10,10,10,0.5)] p-6 backdrop-blur-[8px] max-md:p-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          onClick={handleOverlayClick}
        >
          <motion.div
            className="relative my-auto w-full max-w-[540px] max-h-[calc(100vh-2rem)] overflow-y-auto rounded-xl bg-[var(--frenem-bg)] px-7 py-10 shadow-[0_24px_80px_rgba(0,0,0,0.2)] max-md:px-7 max-md:py-10 md:px-11 md:pb-10 md:pt-12 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={resetAndClose}
              className="absolute right-5 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-[var(--frenem-bg-soft)] font-sans text-lg text-[var(--frenem-ink-secondary)] transition-colors hover:bg-[var(--frenem-border)]"
              aria-label="Close"
            >
              <span aria-hidden>×</span>
            </button>

            {showSuccess ? (
              <div className="py-5 text-center">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--frenem-accent-soft)] text-2xl text-[var(--frenem-accent)]">
                  ✓
                </div>
                <h3 className="mb-4 font-sans text-[32px] font-semibold tracking-[-0.02em]">We&apos;ll be in touch.</h3>
                <p className="font-sans text-[15px] leading-relaxed text-[var(--frenem-ink-secondary)]">
                  Thanks for reaching out. We&apos;ll get back to you within 24 hours to set up a conversation.
                </p>
              </div>
            ) : (
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-[18px]">
                <h3 className="font-sans text-[32px] font-semibold leading-tight tracking-[-0.02em]">Get in touch.</h3>
                <p className="mb-2 font-sans text-[15px] leading-relaxed text-[var(--frenem-ink-secondary)]">
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
                      className={cn(inputClass, form.formState.errors.name && "border-red-500")}
                      {...form.register("name")}
                    />
                    {form.formState.errors.name && (
                      <p className="mt-1 font-sans text-sm text-red-500">{form.formState.errors.name.message}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="contact-company" className={labelClass}>
                      Company
                    </label>
                    <input
                      id="contact-company"
                      type="text"
                      placeholder="Company name"
                      className={cn(inputClass, form.formState.errors.company && "border-red-500")}
                      {...form.register("company")}
                    />
                    {form.formState.errors.company && (
                      <p className="mt-1 font-sans text-sm text-red-500">{form.formState.errors.company.message}</p>
                    )}
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
                    className={cn(inputClass, form.formState.errors.email && "border-red-500")}
                    {...form.register("email")}
                  />
                  {form.formState.errors.email && (
                    <p className="mt-1 font-sans text-sm text-red-500">{form.formState.errors.email.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-[14px] md:grid-cols-2">
                  <div>
                    <label htmlFor="contact-team-size" className={labelClass}>
                      Team size
                    </label>
                    <select
                      id="contact-team-size"
                      className={cn(selectClass, "text-[var(--frenem-ink)]")}
                      style={{ backgroundImage: `url("${LABEL_CHEVRON}")` }}
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
                      className={cn(selectClass, "text-[var(--frenem-ink)]")}
                      style={{ backgroundImage: `url("${LABEL_CHEVRON}")` }}
                      {...form.register("interest")}
                    >
                      <option value="">Select</option>
                      {INTEREST_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-notes" className={labelClass}>
                    Anything else? <span className="font-normal text-[var(--frenem-ink-tertiary)]">(optional)</span>
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
                  disabled={form.formState.isSubmitting}
                  className="mt-2 w-full cursor-pointer rounded-full border-none bg-[var(--frenem-ink)] px-7 py-3.5 font-sans text-[15px] font-medium text-[var(--frenem-bg)] transition-colors hover:bg-[var(--frenem-accent)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {form.formState.isSubmitting ? "Sending..." : "Send →"}
                </button>
                <p className="mt-3.5 text-center font-sans text-[13px] text-[var(--frenem-ink-tertiary)]">
                  No commitment. No decks. Just a conversation.
                </p>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
