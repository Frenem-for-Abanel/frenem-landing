"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { ASSESSMENT_QUESTIONS } from "../../utils/assessment-questions"
import { PULSE_QUESTIONS } from "../../utils/pulse-questions"
import { INTEREST_BY_PRODUCT } from "../../utils/interest"
import { questionnaireAnswersComplete } from "../../utils/contact-modal-helpers"
import ContactFieldsForm, { type ContactFields } from "./ContactFieldsForm"
import SuccessState from "./SuccessState"
import { submitContact } from "./submit-contact"

type QuestionnaireMode = "assessment" | "pulseQuestionnaire"
type AnswerKey = "q1" | "q2" | "q3" | "q4"
type Answers = Record<AnswerKey, string>

const TOTAL_STEPS = 5
const AUTO_ADVANCE_MS = 300

const emptyAnswers = (): Answers => ({ q1: "", q2: "", q3: "", q4: "" })

/**
 * Four single-select questions with auto-advance, then contact details.
 * Registers a close guard so mid-flow closes ask for confirmation.
 */
export default function QuestionnaireFlow({
  mode,
  registerCloseGuard,
}: {
  mode: QuestionnaireMode
  registerCloseGuard: (guard: () => boolean) => void
}) {
  const isPulse = mode === "pulseQuestionnaire"
  const questions = isPulse ? PULSE_QUESTIONS : ASSESSMENT_QUESTIONS
  const interest = isPulse ? INTEREST_BY_PRODUCT.pulse : INTEREST_BY_PRODUCT.build
  const reduceMotion = useReducedMotion()

  const [step, setStep] = useState(1)
  const [answers, setAnswers] = useState<Answers>(emptyAnswers)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const stateRef = useRef({ step, success })
  stateRef.current = { step, success }

  useEffect(() => {
    registerCloseGuard(() => {
      const { step: s, success: done } = stateRef.current
      return s > 1 && s <= TOTAL_STEPS && !done
    })
  }, [registerCloseGuard])

  useEffect(() => {
    return () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current)
    }
  }, [])

  const clearAdvanceTimer = useCallback(() => {
    if (advanceTimer.current) {
      clearTimeout(advanceTimer.current)
      advanceTimer.current = null
    }
  }, [])

  const goBack = () => {
    clearAdvanceTimer()
    setStep((s) => Math.max(1, s - 1))
  }

  const selectOption = (key: AnswerKey, value: string) => {
    const fromStep = step
    setAnswers((prev) => ({ ...prev, [key]: value }))
    clearAdvanceTimer()
    advanceTimer.current = setTimeout(() => {
      advanceTimer.current = null
      setStep((s) => (s === fromStep ? Math.min(s + 1, TOTAL_STEPS) : s))
    }, AUTO_ADVANCE_MS)
  }

  async function handleSubmit(values: ContactFields) {
    if (!questionnaireAnswersComplete(answers)) {
      toast.error("Please answer all questions", {
        description: "Go back and complete each step before submitting.",
      })
      return
    }
    setIsSubmitting(true)
    try {
      await submitContact({
        flow: mode,
        name: values.name,
        email: values.email,
        company: values.company,
        website: values.website,
        interest,
        answers,
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
      <SuccessState srTitle={isPulse ? "Pulse read submitted" : "Assessment submitted"}>
        Thanks — we&apos;ll review your answers and reach out within a day with what stands out,
        plus a time to talk if useful.
      </SuccessState>
    )
  }

  const currentQuestion = step <= 4 ? questions[step - 1] : null
  const slide = {
    initial: { opacity: 0, x: 12 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -12 },
    transition: reduceMotion ? { duration: 0 } : { duration: 0.2 },
  }

  return (
    <>
      <div className="mb-[22px]">
        <div
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={TOTAL_STEPS}
          aria-valuenow={step}
          aria-label="Questionnaire progress"
          className="h-[3px] w-full overflow-hidden rounded-sm bg-[rgba(10,10,10,0.08)]"
        >
          <div
            className="h-full rounded-sm bg-(--tint-bright) transition-[width] duration-300 ease-out"
            style={{ width: `${(Math.min(step, TOTAL_STEPS) / TOTAL_STEPS) * 100}%` }}
          />
        </div>
        <div className="mt-2.5 flex min-h-[18px] items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={goBack}
              className="border-none bg-transparent p-0 font-sans text-[13px] text-ink-secondary transition-colors hover:text-ink"
            >
              ← Back
            </button>
          ) : (
            <span />
          )}
          <span className="ml-auto font-sans text-xs text-ink-tertiary">
            Step {Math.min(step, TOTAL_STEPS)} of {TOTAL_STEPS}
          </span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {currentQuestion ? (
          <motion.div key={currentQuestion.key} {...slide}>
            <h3
              id="contact-modal-title"
              className="mb-5 pr-5 font-sans text-2xl font-semibold leading-[1.2] tracking-[-0.02em] text-ink"
            >
              {currentQuestion.title}
            </h3>
            <div className="flex flex-col gap-2.5">
              {currentQuestion.options.map((option) => {
                const selected = answers[currentQuestion.key] === option
                return (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => selectOption(currentQuestion.key, option)}
                    className={cn(
                      "flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border-[1.5px] px-[18px] py-4 text-left font-sans text-[15px] font-medium text-ink transition-[border-color,background] duration-200",
                      selected
                        ? "border-ink bg-(--tint-soft)"
                        : "border-[rgba(10,10,10,0.1)] bg-paper hover:border-ink"
                    )}
                  >
                    <span>{option}</span>
                    {selected ? <span className="font-semibold text-(--tint-ink)">✓</span> : null}
                  </button>
                )
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div key="questionnaire-contact" {...slide}>
            <h3
              id="contact-modal-title"
              className="mb-5 pr-5 font-sans text-2xl font-semibold tracking-[-0.02em] text-ink"
            >
              Where should we send this?
            </h3>
            <ContactFieldsForm
              idPrefix={mode}
              onSubmit={handleSubmit}
              submitLabel={isPulse ? "Get my Pulse read" : "Get my HR Maturity read"}
              isSubmitting={isSubmitting}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
