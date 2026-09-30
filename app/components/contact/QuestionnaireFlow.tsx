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
      <SuccessState srTitle={isPulse ? "Pulse answers submitted" : "Assessment submitted"}>
        Thanks. We&apos;ll review your answers and reach out within a day with what stands out,
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
          className="grid gap-1"
          style={{ gridTemplateColumns: `repeat(${TOTAL_STEPS}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: TOTAL_STEPS }, (_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-colors duration-500 ${
                i < Math.min(step, TOTAL_STEPS) ? "bg-ink" : "bg-ink/10"
              }`}
            />
          ))}
        </div>
        <div className="mt-2.5 flex min-h-[18px] items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={goBack}
              className="border-none bg-transparent p-0 text-[14px] font-semibold text-ink-secondary transition-colors hover:text-ink"
            >
              ← Back
            </button>
          ) : (
            <span />
          )}
          <span className="ml-auto text-[14px] font-semibold text-ink-tertiary">
            {Math.min(step, TOTAL_STEPS)} / {TOTAL_STEPS}
          </span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {currentQuestion ? (
          <motion.div key={currentQuestion.key} {...slide}>
            <h3
              id="contact-modal-title"
              className="mb-6 text-[30px] font-extrabold leading-[1.02] tracking-[-0.035em] [font-stretch:106%] text-ink"
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
                      "group flex w-full cursor-pointer items-center gap-3.5 rounded-full border-2 px-5 py-3.5 text-left text-[16px] font-semibold text-ink transition-[border-color,background] duration-300",
                      selected
                        ? "border-ink bg-(--tint-soft)"
                        : "border-ink/12 bg-paper hover:border-ink"
                    )}
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                        selected ? "border-ink bg-ink" : "border-ink/30 group-hover:border-ink"
                      )}
                    >
                      {selected ? <span className="h-2 w-2 rounded-full bg-(--tint-soft)" /> : null}
                    </span>
                    <span>{option}</span>
                  </button>
                )
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div key="questionnaire-contact" {...slide}>
            <h3
              id="contact-modal-title"
              className="mb-6 text-[30px] font-extrabold leading-[1.02] tracking-[-0.035em] [font-stretch:106%] text-ink"
            >
              Where should we send this?
            </h3>
            <ContactFieldsForm
              idPrefix={mode}
              onSubmit={handleSubmit}
              submitLabel="Send my answers"
              isSubmitting={isSubmitting}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
