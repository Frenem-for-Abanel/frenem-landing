"use client"

import { createContext, useContext, useEffect } from "react"
import type { UseFormRegisterReturn } from "react-hook-form"
import * as z from "zod"
import { cn } from "@/lib/utils"

export const inputClass =
  "w-full border-2 border-ink/45 bg-paper px-4 py-3.5 text-[16px] text-ink outline-none transition-[border-color,box-shadow] duration-300 placeholder:text-ink-tertiary focus:border-ink focus:shadow-[0_0_0_4px_var(--tint-soft)]"

export const selectClass = cn(
  inputClass,
  "min-h-12 cursor-pointer appearance-none bg-[length:14px_14px] bg-[right_14px_center] bg-no-repeat pr-11 [-webkit-appearance:none]"
)

export const labelClass = "mb-2 block text-[14px] font-semibold text-ink-secondary"

export const SELECT_CHEVRON =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#454545" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>`
  )

/** Optional marker for a label. Required fields are the default and stay unmarked. */
export function OptionalTag() {
  return <span className="font-normal text-ink-tertiary"> (optional)</span>
}

/** Border for a field in error, paired with `FieldError` below it. */
export const inputErrorClass = "border-danger"

/** Error id for a field, so the input can point at its message. */
export function errorId(fieldId: string): string {
  return `${fieldId}-error`
}

/**
 * Accessibility wiring for one field: marks it required, flags it invalid,
 * and links it to its error so screen readers announce the message.
 */
export function fieldA11y(fieldId: string, error: string | undefined, required = true) {
  return {
    id: fieldId,
    "aria-required": required || undefined,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? errorId(fieldId) : undefined,
  } as const
}

export function FieldError({ fieldId, message }: { fieldId: string; message?: string }) {
  if (!message) return null
  return (
    <p id={errorId(fieldId)} role="alert" className="mt-1.5 font-sans text-[14px] font-medium text-danger">
      {message}
    </p>
  )
}

/** Required text with a plain "missing" message before the length check. Trims first. */
export function requiredText(missing: string, tooShort: string) {
  return z.string().trim().min(1, { message: missing }).min(2, { message: tooShort }).max(120, {
    message: "Please keep this under 120 characters.",
  })
}

export const emailField = z
  .string()
  .trim()
  .min(1, { message: "Please enter your email address." })
  .email({ message: "That email address doesn't look right. Check for a typo." })
  .max(254, { message: "Please use a shorter email address." })

/**
 * Lets a form tell the modal it holds unsent input, so an overlay click or
 * Escape asks before throwing the text away.
 */
export const DirtyFormContext = createContext<(dirty: boolean) => void>(() => {})

export function useReportDirty(dirty: boolean) {
  const report = useContext(DirtyFormContext)
  useEffect(() => {
    report(dirty)
    return () => report(false)
  }, [dirty, report])
}

/**
 * Spam honeypot: invisible to people (and to screen readers / tab order),
 * tempting to bots. The API silently drops submissions that fill it.
 */
export function HoneypotField({ registration }: { registration: UseFormRegisterReturn }) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label htmlFor={registration.name}>Leave this field empty</label>
      <input id={registration.name} type="text" tabIndex={-1} autoComplete="off" {...registration} />
    </div>
  )
}
