import * as Sentry from "@sentry/nextjs"
import { capturePostHogExceptionLink, getPostHogCrossLinkContext } from "./app/utils/observability"

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN?.trim()
const tracesSampleRate = Number(process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE ?? "0.2")

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || process.env.NODE_ENV,
    release: process.env.NEXT_PUBLIC_GIT_SHA || undefined,
    dataCollection: {
      userInfo: false,
      cookies: false,
      httpBodies: [],
    },
    tracesSampleRate: Number.isFinite(tracesSampleRate) ? tracesSampleRate : 0.2,
    integrations: [Sentry.browserTracingIntegration()],
    beforeSend(event) {
      if (event.request) {
        delete event.request.cookies
        if (event.request.url?.includes("/api/contact")) {
          event.request.data = "[Filtered]"
        }
      }
      event.tags = {
        ...event.tags,
        service: "frenem-landing",
      }
      const { sessionUrl, distinctId } = getPostHogCrossLinkContext()
      if (sessionUrl || distinctId) {
        event.extra = {
          ...event.extra,
          ...(sessionUrl ? { posthog_session_url: sessionUrl } : {}),
          ...(distinctId ? { posthog_distinct_id: distinctId } : {}),
        }
        if (distinctId) {
          event.tags.posthog_distinct_id = distinctId
        }
      }
      if (event.event_id && event.exception?.values?.length) {
        capturePostHogExceptionLink(event.event_id, event.exception.values[0]?.value)
      }
      return event
    },
  })
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart
