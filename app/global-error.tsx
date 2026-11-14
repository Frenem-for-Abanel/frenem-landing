"use client"

import * as Sentry from "@sentry/nextjs"
import { useEffect } from "react"
import { capturePostHogExceptionLink } from "./utils/observability"

export default function GlobalError({
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
    <html lang="en-GB">
      <body className="flex min-h-screen items-center justify-center bg-[#FAF9F6] px-6 text-[#151515] antialiased">
        <main className="max-w-lg">
          <p className="text-xs font-semibold uppercase tracking-widest opacity-60">Frenem</p>
          <h1 className="mt-2 text-2xl font-bold">Something went wrong.</h1>
          <p className="mt-2 text-sm opacity-75">
            An unexpected error interrupted this page. Please try reloading.
          </p>
          {error.digest ? (
            <p className="mt-2 font-mono text-xs opacity-50">Reference: {error.digest}</p>
          ) : null}
          <button
            type="button"
            onClick={() => reset()}
            className="mt-6 rounded-full bg-[#151515] px-5 py-2.5 text-sm font-semibold text-[#FAF9F6]"
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  )
}
