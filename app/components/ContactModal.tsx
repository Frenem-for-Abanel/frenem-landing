"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useContactModal } from "../context/ContactModalContext"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  company: z.string().min(2, { message: "Company name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  team_size: z.string().optional(),
  interest: z.string().optional(),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export default function ContactModal() {
  const { isOpen, closeModal } = useContactModal()
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
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-[rgba(26,26,24,0.45)] backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          onClick={handleOverlayClick}
        >
          <motion.div
            className="bg-[#f6f4f0] rounded-3xl w-full max-w-[520px] max-h-[calc(100vh-2rem)] overflow-y-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none] p-6 md:p-8 relative shadow-[0_24px_80px_rgba(0,0,0,0.15)] my-auto"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.4 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={resetAndClose}
              className="absolute top-4 right-5 w-10 h-10 rounded-full bg-[rgba(26,26,24,0.05)] flex items-center justify-center text-[#6b6860] hover:bg-[rgba(26,26,24,0.1)] transition-colors text-xl"
              aria-label="Close"
            >
              <span aria-hidden>×</span>
            </button>

            {showSuccess ? (
              <div className="text-center py-5">
                <div className="w-16 h-16 rounded-full bg-[rgba(184,134,11,0.1)] flex items-center justify-center mx-auto mb-6 text-[28px]">
                  ✓
                </div>
                <h3 className="font-serif text-[32px] font-normal mb-4">We&apos;ll be in touch</h3>
                <p className="font-serif text-[19px] text-[#6b6860] leading-relaxed">
                  Thanks for reaching out. We&apos;ll get back to you within 24 hours to set up a conversation.
                </p>
              </div>
            ) : (
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <h3 className="font-serif text-[28px] md:text-[32px] font-normal">Get in Touch</h3>
                <p className="font-serif text-[17px] md:text-[19px] text-[#6b6860] leading-relaxed mb-5">
                  Tell us a little about your business. We&apos;ll get back to you within 24 hours.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block font-serif text-base md:text-lg text-[#1a1a18] mb-1.5">
                      Your name
                    </label>
                    <input
                      id="name"
                      type="text"
                      placeholder="First and last name"
                      className={cn(
                        "w-full font-serif text-base md:text-lg text-[#1a1a18] bg-white border border-[rgba(26,26,24,0.12)] rounded-xl px-4 py-3 outline-none transition-colors",
                        "focus:border-[#b8860b] focus:shadow-[0_0_0_3px_rgba(184,134,11,0.1)]",
                        "placeholder:text-[#9b978f]",
                        form.formState.errors.name && "border-red-500"
                      )}
                      {...form.register("name")}
                    />
                    {form.formState.errors.name && (
                      <p className="mt-1 text-sm text-red-500">{form.formState.errors.name.message}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="company" className="block font-serif text-base md:text-lg text-[#1a1a18] mb-1.5">
                      Company
                    </label>
                    <input
                      id="company"
                      type="text"
                      placeholder="Company name"
                      className={cn(
                        "w-full font-serif text-base md:text-lg text-[#1a1a18] bg-white border border-[rgba(26,26,24,0.12)] rounded-xl px-4 py-3 outline-none transition-colors",
                        "focus:border-[#b8860b] focus:shadow-[0_0_0_3px_rgba(184,134,11,0.1)]",
                        "placeholder:text-[#9b978f]",
                        form.formState.errors.company && "border-red-500"
                      )}
                      {...form.register("company")}
                    />
                    {form.formState.errors.company && (
                      <p className="mt-1 text-sm text-red-500">{form.formState.errors.company.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block font-serif text-base md:text-lg text-[#1a1a18] mb-1.5">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    className={cn(
                      "w-full font-serif text-base md:text-lg text-[#1a1a18] bg-white border border-[rgba(26,26,24,0.12)] rounded-xl px-4 py-3 outline-none transition-colors",
                      "focus:border-[#b8860b] focus:shadow-[0_0_0_3px_rgba(184,134,11,0.1)]",
                      "placeholder:text-[#9b978f]",
                      form.formState.errors.email && "border-red-500"
                    )}
                    {...form.register("email")}
                  />
                  {form.formState.errors.email && (
                    <p className="mt-1 text-sm text-red-500">{form.formState.errors.email.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-serif text-base md:text-lg text-[#1a1a18] mb-1.5">Team size</label>
                    <Select
                      value={form.watch("team_size")}
                      onValueChange={(v) => form.setValue("team_size", v)}
                    >
                      <SelectTrigger className="w-full rounded-xl border-[rgba(26,26,24,0.12)] bg-white h-11 md:h-[48px] px-4 font-serif text-base md:text-lg">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10-50">10 – 50</SelectItem>
                        <SelectItem value="50-200">50 – 200</SelectItem>
                        <SelectItem value="200-500">200 – 500</SelectItem>
                        <SelectItem value="500+">500+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block font-serif text-base md:text-lg text-[#1a1a18] mb-1.5">Interested in</label>
                    <Select
                      value={form.watch("interest")}
                      onValueChange={(v) => form.setValue("interest", v)}
                    >
                      <SelectTrigger className="w-full rounded-xl border-[rgba(26,26,24,0.12)] bg-white h-11 md:h-[48px] px-4 font-serif text-base md:text-lg">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Build · Org Design Sprint">Build · Org Design Sprint</SelectItem>
                        <SelectItem value="Prism · Employee Management">Prism · Employee Management</SelectItem>
                        <SelectItem value="Pulse · Multirater Feedback">Pulse · Multirater Feedback</SelectItem>
                        <SelectItem value="Multiple products">Multiple products</SelectItem>
                        <SelectItem value="Not sure yet">Not sure yet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label htmlFor="notes" className="block font-serif text-base md:text-lg text-[#1a1a18] mb-1.5">
                    Anything else? <span className="text-[#9b978f] text-base">(optional)</span>
                  </label>
                  <textarea
                    id="notes"
                    placeholder="Brief context about your business or what you're looking to solve"
                    rows={2}
                    className={cn(
                      "w-full font-serif text-base md:text-lg text-[#1a1a18] bg-white border border-[rgba(26,26,24,0.12)] rounded-xl px-4 py-3 outline-none transition-colors resize-none min-h-[64px] overflow-y-auto",
                      "focus:border-[#b8860b] focus:shadow-[0_0_0_3px_rgba(184,134,11,0.1)]",
                      "placeholder:text-[#9b978f]"
                    )}
                    {...form.register("notes")}
                    onInput={(e) => adjustNotesHeight(e.currentTarget)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="w-full font-sans text-base md:text-lg font-medium py-3.5 px-9 rounded-[980px] bg-[#1a1a18] text-[#f6f4f0] hover:opacity-85 transition-opacity mt-1 disabled:opacity-50"
                >
                  {form.formState.isSubmitting ? "Sending..." : "Send →"}
                </button>
                <p className="font-serif text-sm text-[#9b978f] text-center mt-3">
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
