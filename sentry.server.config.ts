import * as Sentry from "@sentry/nextjs"

const dsn = (process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN || "").trim()
const tracesSampleRate = Number(process.env.SENTRY_TRACES_SAMPLE_RATE ?? "0.2")

if (dsn) {
  Sentry.init({
    dsn,
    environment:
      process.env.SENTRY_ENVIRONMENT ||
      process.env.RAILWAY_ENVIRONMENT_NAME ||
      process.env.NODE_ENV,
    release:
      process.env.SENTRY_RELEASE ||
      process.env.RAILWAY_GIT_COMMIT_SHA ||
      process.env.NEXT_PUBLIC_GIT_SHA ||
      undefined,
    dataCollection: {
      userInfo: false,
      cookies: false,
      httpBodies: [],
    },
    tracesSampleRate: Number.isFinite(tracesSampleRate) ? tracesSampleRate : 0.2,
    beforeSend(event) {
      if (event.request) {
        delete event.request.cookies
        if (event.request.headers) {
          const scrubbed: Record<string, string> = {}
          for (const [key, val] of Object.entries(event.request.headers)) {
            scrubbed[key] = /authorization|cookie|token/i.test(key) ? "[Filtered]" : val
          }
          event.request.headers = scrubbed
        }
        event.request.data = "[Filtered]"
      }
      event.tags = {
        ...event.tags,
        service: "frenem-landing",
      }
      return event
    },
  })
}
