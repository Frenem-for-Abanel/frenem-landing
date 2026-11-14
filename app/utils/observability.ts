"use client"

import posthog from "posthog-js"

let posthogInitialized = false

export function getPostHogHost(): string {
  const configured = process.env.NEXT_PUBLIC_POSTHOG_HOST?.trim()
  if (configured) return configured
  if (typeof window !== "undefined") return `${window.location.origin}/ingest`
  return "https://us.i.posthog.com"
}

export function initLandingPostHog(): boolean {
  if (typeof window === "undefined") return false
  if (posthogInitialized) return true

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY?.trim()
  if (!key) return false

  posthog.init(key, {
    api_host: getPostHogHost(),
    ui_host: process.env.NEXT_PUBLIC_POSTHOG_UI_HOST?.trim() || "https://us.posthog.com",
    person_profiles: "identified_only",
    capture_pageview: true,
    capture_pageleave: true,
    session_recording: {
      maskAllInputs: true,
      blockClass: "ph-no-capture",
      blockSelector: "[data-ph-no-capture]",
    },
  })

  posthogInitialized = true
  return true
}

export function isPostHogReady(): boolean {
  return posthogInitialized
}

export function getPostHogCrossLinkContext(): {
  sessionUrl?: string
  distinctId?: string
} {
  if (!posthogInitialized || typeof window === "undefined") return {}
  try {
    const sessionUrl = posthog.get_session_replay_url?.()
    const distinctId = posthog.get_distinct_id?.()
    return {
      sessionUrl: sessionUrl || undefined,
      distinctId: distinctId || undefined,
    }
  } catch {
    return {}
  }
}

export function capturePostHogExceptionLink(sentryEventId: string, errorMessage?: string): void {
  if (!posthogInitialized || typeof window === "undefined") return
  try {
    posthog.capture("$exception", {
      sentry_event_id: sentryEventId,
      ...(errorMessage ? { $exception_message: errorMessage } : {}),
    })
  } catch {
    // Telemetry must never interfere with user experience.
  }
}

export { posthog }
