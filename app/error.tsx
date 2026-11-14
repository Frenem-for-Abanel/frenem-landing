"use client"

import * as Sentry from "@sentry/nextjs"
import { useEffect } from "react"
import { capturePostHogExceptionLink } from "./utils/observability"

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    const eventId = Sentry.captureException(error)
    if (eventId) {
      capturePostHogExceptionLink(eventId, error.message)
    }
  }, [error])

  return (
    <section className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-start justify-center px-6 py-20">
      <p className="text-sm font-medium uppercase tracking-wider text-ink/60">Unexpected error</p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink">
        Something went wrong loading this page.
      </h1>
      <p className="mt-3 text-base text-ink/75">
        Our engineering team has been notified. You can retry right away.
      </p>
      {error.digest ? (
        <p className="mt-2 font-mono text-xs text-ink/50">Reference: {error.digest}</p>
      ) : null}
      <button
        type="button"
        onClick={() => reset()}
        className="mt-6 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-paper transition-opacity hover:opacity-90"
      >
        Try again
      </button>
    </section>
  )
}
