"use client"

import type { UseFormRegisterReturn } from "react-hook-form"
import { cn } from "@/lib/utils"

export const inputClass =
  "w-full rounded-lg border border-line-strong bg-paper px-3.5 py-3 font-sans text-[15px] text-ink outline-none transition-[border-color,box-shadow] placeholder:text-ink-tertiary focus:border-ink focus:shadow-[0_0_0_3px_rgba(10,10,10,0.06)]"

export const selectClass = cn(
  inputClass,
  "min-h-12 cursor-pointer appearance-none bg-[length:14px_14px] bg-[right_14px_center] bg-no-repeat pr-11 [-webkit-appearance:none]"
)

export const labelClass = "mb-1.5 block font-sans text-[13px] font-medium text-ink-secondary"

export const submitBtnClass =
  "mt-2 min-h-12 w-full cursor-pointer rounded-full border-none bg-ink px-7 py-3.5 font-sans text-[15px] font-medium text-paper transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"

export const SELECT_CHEVRON =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#555" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>`
  )

export function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="mt-1 font-sans text-[13px] text-red-600">{message}</p>
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
