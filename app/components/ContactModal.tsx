"use client"

import { useState, useEffect, useRef, useCallback, type ReactNode, type MouseEvent, type KeyboardEvent } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useContactModal } from "../context/ContactModalContext"
import { useProduct } from "../context/ProductContext"
import { INTEREST_BY_PRODUCT } from "../utils/interest"
import {
  ASSESSMENT_QUESTIONS,
  type AssessmentAnswerKey,
} from "../utils/assessment-questions"
import { PULSE_QUESTIONS, type PulseAnswerKey } from "../utils/pulse-questions"
import {
  questionnaireAnswersComplete,
  readContactApiError,
} from "../utils/contact-modal-helpers"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

type QuestionnaireAnswerKey = AssessmentAnswerKey | PulseAnswerKey

const inputClass =
  "w-full rounded-lg border border-[var(--frenem-border-strong)] bg-[var(--frenem-bg)] px-3.5 py-3 font-sans text-[15px] text-[var(--frenem-ink)] outline-none transition-[border-color,box-shadow] placeholder:text-[var(--frenem-ink-tertiary)] focus:border-[var(--frenem-ink)] focus:shadow-[0_0_0_3px_rgba(10,10,10,0.06)]"

const selectClass = cn(
  inputClass,
  "min-h-[48px] cursor-pointer appearance-none bg-[length:14px_14px] bg-[right_14px_center] bg-no-repeat pr-11 [-webkit-appearance:none]",
)

const LABEL_CHEVRON =
  "data:image/svg+xml," +
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
  { value: INTEREST_BY_PRODUCT.pulse, label: INTEREST_BY_PRODUCT.pulse },
  { value: INTEREST_BY_PRODUCT.build, label: INTEREST_BY_PRODUCT.build },
  { value: INTEREST_BY_PRODUCT.prism, label: INTEREST_BY_PRODUCT.prism },
  { value: "Multiple products", label: "Multiple products" },
  { value: "Not sure yet", label: "Not sure yet" },
] as const

const contactFieldsSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  company: z.string().min(2, { message: "Company name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
})

const legacyFormSchema = contactFieldsSchema.extend({
  team_size: z.string().optional(),
  interest: z.string().optional(),
  notes: z.string().optional(),
})

type ContactFields = z.infer<typeof contactFieldsSchema>
type LegacyFormValues = z.infer<typeof legacyFormSchema>

type QuestionnaireAnswers = Record<QuestionnaireAnswerKey, string>

const emptyQuestionnaireAnswers = (): QuestionnaireAnswers => ({
  q1: "",
  q2: "",
  q3: "",
  q4: "",
})

function isQuestionnaireMode(mode: string): mode is "assessment" | "pulseQuestionnaire" {
  return mode === "assessment" || mode === "pulseQuestionnaire"
}

function isQuickContactMode(mode: string): mode is "contact" | "pulseContact" {
  return mode === "contact" || mode === "pulseContact"
}

const labelClass = "mb-1.5 block font-sans text-[13px] font-medium text-[var(--frenem-ink-secondary)]"

const submitBtnClass =
  "mt-2 min-h-12 w-full cursor-pointer rounded-full border-none bg-[var(--frenem-ink)] px-7 py-3.5 font-sans text-[15px] font-medium text-[var(--frenem-bg)] transition-colors hover:bg-[var(--frenem-accent)] disabled:cursor-not-allowed disabled:opacity-50"

function SuccessCheck({ children }: { children: ReactNode }) {
  return (
    <div className="px-1 py-4 text-center">
      <div className="mx-auto mb-5 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[var(--frenem-accent-soft)] text-[22px] text-[var(--frenem-accent)]">
        ✓
      </div>
      <h3 className="mx-auto max-w-[400px] font-sans text-xl font-semibold leading-[1.4] tracking-[-0.01em] text-[var(--frenem-ink)]">
        {children}
      </h3>
    </div>
  )
}

function ContactFieldsForm({
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
    defaultValues: { name: "", company: "", email: "" },
  })

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3.5">
      <div>
        <label htmlFor={`${idPrefix}-name`} className={labelClass}>
          Your name
        </label>
        <input
          id={`${idPrefix}-name`}
          type="text"
          placeholder="First and last name"
          className={cn(inputClass, form.formState.errors.name && "border-red-500")}
          {...form.register("name")}
        />
        {form.formState.errors.name && (
          <p className="mt-1 font-sans text-[13px] text-red-600">{form.formState.errors.name.message}</p>
        )}
      </div>
      <div>
        <label htmlFor={`${idPrefix}-email`} className={labelClass}>
          Work email
        </label>
        <input
          id={`${idPrefix}-email`}
          type="email"
          placeholder="you@company.com"
          className={cn(inputClass, form.formState.errors.email && "border-red-500")}
          {...form.register("email")}
        />
        {form.formState.errors.email && (
          <p className="mt-1 font-sans text-[13px] text-red-600">{form.formState.errors.email.message}</p>
        )}
      </div>
      <div>
        <label htmlFor={`${idPrefix}-company`} className={labelClass}>
          Company name
        </label>
        <input
          id={`${idPrefix}-company`}
          type="text"
          placeholder="Company name"
          className={cn(inputClass, form.formState.errors.company && "border-red-500")}
          {...form.register("company")}
        />
        {form.formState.errors.company && (
          <p className="mt-1 font-sans text-[13px] text-red-600">{form.formState.errors.company.message}</p>
        )}
      </div>
      <button type="submit" disabled={isSubmitting} className={submitBtnClass}>
        {isSubmitting ? "Sending..." : submitLabel}
      </button>
    </form>
  )
}

export default function ContactModal() {
  const { isOpen, mode, closeModal } = useContactModal()
  const { activeProduct } = useProduct()
  const [showSuccess, setShowSuccess] = useState(false)
  const [discardConfirm, setDiscardConfirm] = useState(false)
  const [step, setStep] = useState(1)
  const [questionnaireAnswers, setQuestionnaireAnswers] = useState<QuestionnaireAnswers>(
    emptyQuestionnaireAnswers
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isQuestionnaire = isQuestionnaireMode(mode)
  const isQuickContact = isQuickContactMode(mode)
  const isPulseFlow = mode === "pulseQuestionnaire" || mode === "pulseContact"
  const questions = mode === "pulseQuestionnaire" ? PULSE_QUESTIONS : ASSESSMENT_QUESTIONS
  const questionnaireInterest = isPulseFlow
    ? INTEREST_BY_PRODUCT.pulse
    : INTEREST_BY_PRODUCT.build
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)

  const NOTES_MAX_HEIGHT = 200

  const legacyForm = useForm<LegacyFormValues>({
    resolver: zodResolver(legacyFormSchema),
    defaultValues: {
      name: "",
      company: "",
      email: "",
      team_size: "",
      interest: "",
      notes: "",
    },
  })

  const clearAdvanceTimer = useCallback(() => {
    if (advanceTimer.current) {
      clearTimeout(advanceTimer.current)
      advanceTimer.current = null
    }
  }, [])

  useEffect(() => {
    if (isOpen && mode === "default") {
      legacyForm.setValue("interest", INTEREST_BY_PRODUCT[activeProduct])
    }
  }, [isOpen, mode, activeProduct, legacyForm])

  useEffect(() => {
    if (!isOpen) {
      setShowSuccess(false)
      setDiscardConfirm(false)
      setStep(1)
      setQuestionnaireAnswers(emptyQuestionnaireAnswers())
      setIsSubmitting(false)
      legacyForm.reset()
      clearAdvanceTimer()
    }
  }, [isOpen, legacyForm, clearAdvanceTimer])

  const resetAndClose = useCallback(() => {
    clearAdvanceTimer()
    setShowSuccess(false)
    setDiscardConfirm(false)
    setStep(1)
    setQuestionnaireAnswers(emptyQuestionnaireAnswers())
    legacyForm.reset()
    closeModal()
  }, [closeModal, legacyForm, clearAdvanceTimer])

  const requestClose = useCallback(() => {
    // Escape / overlay on discard confirm cancels the confirm (keep going).
    if (discardConfirm) {
      setDiscardConfirm(false)
      return
    }
    if (isQuestionnaireMode(mode) && step > 1 && step <= 5 && !showSuccess) {
      clearAdvanceTimer()
      setDiscardConfirm(true)
      return
    }
    resetAndClose()
  }, [discardConfirm, mode, step, showSuccess, resetAndClose, clearAdvanceTimer])

  useEffect(() => {
    const handleEscape = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) requestClose()
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isOpen, requestClose])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
      previouslyFocused.current = document.activeElement as HTMLElement | null
      // Defer so the dialog is in the DOM.
      requestAnimationFrame(() => {
        const panel = panelRef.current
        if (!panel) return
        const focusTarget =
          panel.querySelector<HTMLElement>("[data-modal-initial-focus]") ??
          panel.querySelector<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
        focusTarget?.focus()
      })
    } else {
      document.body.style.overflow = ""
      previouslyFocused.current?.focus?.()
      previouslyFocused.current = null
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen || !discardConfirm) return
    requestAnimationFrame(() => {
      panelRef.current?.querySelector<HTMLElement>("[data-modal-initial-focus]")?.focus()
    })
  }, [isOpen, discardConfirm])

  const adjustNotesHeight = (el: HTMLTextAreaElement | null) => {
    if (!el) return
    el.style.height = "auto"
    el.style.height = `${Math.min(el.scrollHeight, NOTES_MAX_HEIGHT)}px`
  }

  const handleOverlayClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) requestClose()
  }

  const handlePanelKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Tab" || !panelRef.current) return
    const focusable = Array.from(
      panelRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ).filter((el) => el.offsetParent !== null || el === document.activeElement)
    if (focusable.length === 0) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  const goBack = () => {
    clearAdvanceTimer()
    setStep((s) => Math.max(1, s - 1))
  }

  const selectOption = (key: QuestionnaireAnswerKey, value: string) => {
    const fromStep = step
    setQuestionnaireAnswers((prev) => ({ ...prev, [key]: value }))
    clearAdvanceTimer()
    advanceTimer.current = setTimeout(() => {
      advanceTimer.current = null
      setStep((s) => (s === fromStep ? Math.min(s + 1, 5) : s))
    }, 300)
  }

  async function submitQuestionnaire(values: ContactFields) {
    if (!isQuestionnaire) return
    if (!questionnaireAnswersComplete(questionnaireAnswers)) {
      toast.error("Please answer all questions", {
        description: "Go back and complete each step before submitting.",
      })
      return
    }
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          flow: mode,
          name: values.name,
          email: values.email,
          company: values.company,
          interest: questionnaireInterest,
          answers: {
            q1: questionnaireAnswers.q1,
            q2: questionnaireAnswers.q2,
            q3: questionnaireAnswers.q3,
            q4: questionnaireAnswers.q4,
          },
        }),
      })
      if (!response.ok) {
        throw new Error(await readContactApiError(response))
      }
      setShowSuccess(true)
    } catch (error) {
      toast.error("Failed to send message", {
        description: error instanceof Error ? error.message : "Please try again later.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  async function submitQuickContact(values: ContactFields) {
    if (!isQuickContact) return
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          flow: mode,
          name: values.name,
          email: values.email,
          company: values.company,
          interest: questionnaireInterest,
        }),
      })
      if (!response.ok) {
        throw new Error(await readContactApiError(response))
      }
      setShowSuccess(true)
    } catch (error) {
      toast.error("Failed to send message", {
        description: error instanceof Error ? error.message : "Please try again later.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  async function onLegacySubmit(values: LegacyFormValues) {
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

      if (!response.ok) {
        throw new Error(await readContactApiError(response))
      }

      setShowSuccess(true)
      legacyForm.reset()
      toast.success("Thank you for your message", {
        description: "We'll get back to you within 24 hours.",
      })
    } catch (error) {
      toast.error("Failed to send message", {
        description: error instanceof Error ? error.message : "Please try again later.",
      })
    }
  }

  const currentQuestion = isQuestionnaire && step >= 1 && step <= 4 ? questions[step - 1] : null
  const showCloseButton = isOpen && !discardConfirm
  const questionnaireSubmitLabel =
    mode === "pulseQuestionnaire" ? "Get my Pulse read" : "Get my HR Maturity read"
  const quickContactTitle =
    mode === "pulseContact"
      ? "Curious what a relational diagnostic would surface in your org? Tell us where to send it."
      : "Curious what an org design review would find? Tell us where to send it."

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[1000] flex items-end justify-center bg-[rgba(10,10,10,0.5)] p-0 backdrop-blur-[8px] sm:items-center sm:p-5 md:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          onClick={handleOverlayClick}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-modal-title"
            tabIndex={-1}
            className="relative my-0 w-full max-h-[min(92dvh,calc(100dvh-1rem))] overflow-y-auto rounded-t-2xl bg-[var(--frenem-bg)] px-5 py-8 shadow-[0_24px_80px_rgba(0,0,0,0.2)] outline-none sm:my-auto sm:max-h-[calc(100dvh-2rem)] sm:max-w-[460px] sm:rounded-xl sm:px-9 sm:py-9 md:px-9 md:pb-[34px] md:pt-9 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handlePanelKeyDown}
          >
            {showCloseButton && (
              <button
                type="button"
                onClick={requestClose}
                data-modal-initial-focus={
                  isQuestionnaire && step === 1 && !showSuccess ? true : undefined
                }
                className="absolute right-3.5 top-3.5 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--frenem-bg-soft)] font-sans text-lg text-[var(--frenem-ink-secondary)] transition-colors hover:bg-[var(--frenem-border)]"
                aria-label="Close"
              >
                <span aria-hidden>×</span>
              </button>
            )}

            {discardConfirm ? (
              <div className="px-1 py-6 text-center">
                <h3
                  id="contact-modal-title"
                  className="mb-2.5 font-sans text-[22px] font-semibold tracking-[-0.02em] text-[var(--frenem-ink)]"
                >
                  Discard your answers?
                </h3>
                <p className="mb-6 font-sans text-sm text-[var(--frenem-ink-secondary)]">
                  You&apos;ll lose progress on this {isPulseFlow ? "Pulse check" : "assessment"}.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2.5">
                  <button
                    type="button"
                    data-modal-initial-focus
                    onClick={() => setDiscardConfirm(false)}
                    className="inline-flex h-11 cursor-pointer items-center rounded-full border-none bg-[var(--frenem-ink)] px-[22px] font-sans text-sm font-medium text-[var(--frenem-bg)] transition-colors hover:bg-[var(--frenem-accent)]"
                  >
                    Keep going
                  </button>
                  <button
                    type="button"
                    onClick={resetAndClose}
                    className="inline-flex h-11 cursor-pointer items-center rounded-full border border-[var(--frenem-border-strong)] bg-transparent px-[22px] font-sans text-sm font-medium text-[var(--frenem-ink-secondary)] transition-colors hover:border-[var(--frenem-ink)] hover:text-[var(--frenem-ink)]"
                  >
                    Discard
                  </button>
                </div>
              </div>
            ) : isQuestionnaire ? (
              showSuccess ? (
                <div>
                  <h3
                    id="contact-modal-title"
                    className="absolute h-px w-px overflow-hidden whitespace-nowrap border-0 p-0"
                    style={{ clip: "rect(0, 0, 0, 0)" }}
                  >
                    {isPulseFlow ? "Pulse read submitted" : "Assessment submitted"}
                  </h3>
                  <SuccessCheck>
                    Thanks — we&apos;ll review your answers and reach out within a day with what stands out, plus a
                    time to talk if useful.
                  </SuccessCheck>
                </div>
              ) : (
                <>
                  <div className="mb-[22px]">
                    <div className="h-[3px] w-full overflow-hidden rounded-sm bg-[rgba(10,10,10,0.08)]">
                      <div
                        className="h-full rounded-sm bg-[var(--frenem-accent)] transition-[width] duration-300 ease-out"
                        style={{ width: `${(Math.min(step, 5) / 5) * 100}%` }}
                      />
                    </div>
                    <div className="mt-2.5 flex min-h-[18px] items-center justify-between">
                      {step > 1 ? (
                        <button
                          type="button"
                          onClick={goBack}
                          className="border-none bg-transparent p-0 font-sans text-[13px] text-[var(--frenem-ink-secondary)] transition-colors hover:text-[var(--frenem-ink)]"
                        >
                          ← Back
                        </button>
                      ) : (
                        <span />
                      )}
                      <span className="ml-auto font-sans text-xs text-[var(--frenem-ink-tertiary)]">
                        {Math.min(step, 5)} / 5
                      </span>
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    {currentQuestion ? (
                      <motion.div
                        key={currentQuestion.key}
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -12 }}
                        transition={{ duration: 0.2 }}
                      >
                        <h3
                          id="contact-modal-title"
                          className="mb-5 pr-5 font-sans text-2xl font-semibold leading-[1.2] tracking-[-0.02em] text-[var(--frenem-ink)]"
                        >
                          {currentQuestion.title}
                        </h3>
                        <div className="flex flex-col gap-2.5" role="listbox" aria-labelledby="contact-modal-title">
                          {currentQuestion.options.map((option) => {
                            const selected = questionnaireAnswers[currentQuestion.key] === option
                            return (
                              <button
                                key={option}
                                type="button"
                                role="option"
                                aria-selected={selected}
                                onClick={() => selectOption(currentQuestion.key, option)}
                                className={cn(
                                  "flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border-[1.5px] px-[18px] py-4 text-left font-sans text-[15px] font-medium text-[var(--frenem-ink)] transition-[border-color,background] duration-200",
                                  selected
                                    ? "border-[var(--frenem-ink)] bg-[var(--frenem-accent-soft)]"
                                    : "border-[rgba(10,10,10,0.1)] bg-[var(--frenem-bg)] hover:border-[var(--frenem-ink)]"
                                )}
                              >
                                <span>{option}</span>
                                {selected ? (
                                  <span className="font-semibold text-[var(--frenem-accent)]">✓</span>
                                ) : null}
                              </button>
                            )
                          })}
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="questionnaire-contact"
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -12 }}
                        transition={{ duration: 0.2 }}
                      >
                        <h3
                          id="contact-modal-title"
                          className="mb-5 pr-5 font-sans text-2xl font-semibold tracking-[-0.02em] text-[var(--frenem-ink)]"
                        >
                          Where should we send this?
                        </h3>
                        <ContactFieldsForm
                          idPrefix={mode}
                          onSubmit={submitQuestionnaire}
                          submitLabel={questionnaireSubmitLabel}
                          isSubmitting={isSubmitting}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )
            ) : isQuickContact ? (
              showSuccess ? (
                <div>
                  <h3
                    id="contact-modal-title"
                    className="absolute h-px w-px overflow-hidden whitespace-nowrap border-0 p-0"
                    style={{ clip: "rect(0, 0, 0, 0)" }}
                  >
                    Message sent
                  </h3>
                  <SuccessCheck>Thanks — someone from the team will reach out within a day.</SuccessCheck>
                </div>
              ) : (
                <>
                  <h3
                    id="contact-modal-title"
                    className="mb-5 pr-8 font-sans text-[23px] font-semibold leading-[1.3] tracking-[-0.02em] text-[var(--frenem-ink)]"
                  >
                    {quickContactTitle}
                  </h3>
                  <ContactFieldsForm
                    idPrefix={mode}
                    onSubmit={submitQuickContact}
                    submitLabel="Get in touch"
                    isSubmitting={isSubmitting}
                  />
                </>
              )
            ) : showSuccess ? (
              <div className="py-5 text-center">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--frenem-accent-soft)] text-2xl text-[var(--frenem-accent)]">
                  ✓
                </div>
                <h3
                  id="contact-modal-title"
                  className="mb-4 font-sans text-[26px] font-semibold tracking-[-0.02em] md:text-[32px]"
                >
                  We&apos;ll be in touch.
                </h3>
                <p className="font-sans text-[15px] leading-relaxed text-[var(--frenem-ink-secondary)]">
                  Thanks for reaching out. We&apos;ll get back to you within 24 hours to set up a conversation.
                </p>
              </div>
            ) : (
              <form onSubmit={legacyForm.handleSubmit(onLegacySubmit)} className="space-y-[18px]">
                <h3
                  id="contact-modal-title"
                  className="pr-10 font-sans text-[26px] font-semibold leading-tight tracking-[-0.02em] md:text-[32px]"
                >
                  Get in touch.
                </h3>
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
                      className={cn(inputClass, legacyForm.formState.errors.name && "border-red-500")}
                      {...legacyForm.register("name")}
                    />
                    {legacyForm.formState.errors.name && (
                      <p className="mt-1 font-sans text-sm text-red-500">
                        {legacyForm.formState.errors.name.message}
                      </p>
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
                      className={cn(inputClass, legacyForm.formState.errors.company && "border-red-500")}
                      {...legacyForm.register("company")}
                    />
                    {legacyForm.formState.errors.company && (
                      <p className="mt-1 font-sans text-sm text-red-500">
                        {legacyForm.formState.errors.company.message}
                      </p>
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
                    className={cn(inputClass, legacyForm.formState.errors.email && "border-red-500")}
                    {...legacyForm.register("email")}
                  />
                  {legacyForm.formState.errors.email && (
                    <p className="mt-1 font-sans text-sm text-red-500">
                      {legacyForm.formState.errors.email.message}
                    </p>
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
                      {...legacyForm.register("team_size")}
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
                      {...legacyForm.register("interest")}
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
                    Anything else?{" "}
                    <span className="font-normal text-[var(--frenem-ink-tertiary)]">(optional)</span>
                  </label>
                  <textarea
                    id="contact-notes"
                    placeholder="Brief context about your business or what you're looking to solve"
                    rows={3}
                    className={cn(inputClass, "min-h-[72px] resize-y")}
                    {...legacyForm.register("notes")}
                    onInput={(e) => adjustNotesHeight(e.currentTarget)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={legacyForm.formState.isSubmitting}
                  className="mt-2 min-h-11 w-full cursor-pointer rounded-full border-none bg-[var(--frenem-ink)] px-7 py-3.5 font-sans text-[15px] font-medium text-[var(--frenem-bg)] transition-colors hover:bg-[var(--frenem-accent)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {legacyForm.formState.isSubmitting ? "Sending..." : "Send →"}
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
