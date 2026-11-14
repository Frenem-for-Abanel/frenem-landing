"use client"

import { useEffect } from "react"
import { useReportWebVitals } from "next/web-vitals"
import { registerAnalyticsSink, track } from "../utils/analytics"
import { captureAttribution } from "../utils/attribution"
import { initLandingPostHog, posthog } from "../utils/observability"

/**
 * Records where a visitor came from, connects PostHog when configured, and
 * reports Core Web Vitals from real sessions through the analytics layer.
 * Renders nothing and keeps all pages statically generated.
 */
export default function Analytics() {
  useEffect(() => {
    captureAttribution()
    if (initLandingPostHog()) {
      registerAnalyticsSink(({ event, ...properties }) => {
        posthog.capture(event, properties)
      })
      return () => registerAnalyticsSink(null)
    }
  }, [])

  useReportWebVitals((metric) => {
    track("web_vital", {
      name: metric.name,
      // CLS is a unitless score; the rest are milliseconds.
      value: metric.name === "CLS" ? Number(metric.value.toFixed(4)) : Math.round(metric.value),
      rating: metric.rating,
      id: metric.id,
    })
  })

  return null
}
