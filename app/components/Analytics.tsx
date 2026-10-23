"use client"

import { useEffect } from "react"
import { useReportWebVitals } from "next/web-vitals"
import { track } from "../utils/analytics"
import { captureAttribution } from "../utils/attribution"

/**
 * Records where a visitor came from and reports Core Web Vitals from real
 * sessions through the analytics layer. Renders nothing.
 */
export default function Analytics() {
  useEffect(() => {
    captureAttribution()
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
