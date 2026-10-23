"use client"

import dynamic from "next/dynamic"

/**
 * The contact flows (with zod, react-hook-form, and sonner) load on first
 * use instead of shipping in every page's shared bundle. `preloadContactFlows`
 * starts the download as soon as someone points at or focuses a contact
 * button, so the modal is usually ready by the time it opens.
 */

const loadQuestionnaire = () => import("./QuestionnaireFlow")
const loadQuickContact = () => import("./QuickContactForm")
const loadGeneral = () => import("./GeneralContactForm")
const loadBuildPlan = () => import("./BuildPlanForm")
const loadToaster = () => import("sonner").then((m) => m.Toaster)

function FlowLoading() {
  return (
    <div aria-busy="true" aria-live="polite" className="flex min-h-[320px] items-center justify-center">
      <span className="sr-only">Loading the form</span>
      <span aria-hidden className="h-3 w-3 animate-pulse rounded-full bg-(--tint-bright)" />
    </div>
  )
}

export const QuestionnaireFlow = dynamic(loadQuestionnaire, { ssr: false, loading: FlowLoading })
export const QuickContactForm = dynamic(loadQuickContact, { ssr: false, loading: FlowLoading })
export const GeneralContactForm = dynamic(loadGeneral, { ssr: false, loading: FlowLoading })
export const BuildPlanForm = dynamic(loadBuildPlan, { ssr: false, loading: FlowLoading })
export const Toaster = dynamic(loadToaster, { ssr: false })

let preloaded = false

export function preloadContactFlows(): void {
  if (preloaded) return
  preloaded = true
  void Promise.all([loadQuestionnaire(), loadQuickContact(), loadGeneral(), loadBuildPlan(), loadToaster()]).catch(() => {
    // Let the next intent retry if the network blipped.
    preloaded = false
  })
}
