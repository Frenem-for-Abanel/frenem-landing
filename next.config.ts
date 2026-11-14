import type { NextConfig } from "next"
import { withSentryConfig } from "@sentry/nextjs/config"
import { APEX_HOST, CANONICAL_HOST } from "./app/utils/site"

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Two years. No includeSubDomains: apex DNS is still GoDaddy forwarding,
  // and preload is a one-way public commitment the owner should make later.
  { key: "Strict-Transport-Security", value: "max-age=63072000" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  // Directives that hold without per-request nonces, so every page stays
  // static: no framing by other sites, no plugins, no <base> hijack, and
  // forms only post back here. A script-src policy needs a nonce and would
  // make every page dynamic; add it when a third-party script arrives.
  {
    key: "Content-Security-Policy",
    value: "frame-ancestors 'self'; base-uri 'self'; form-action 'self'; object-src 'none'",
  },
]

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    // framer-motion is on every page via the header. Direct imports shrink
    // the barrel the client has to parse.
    optimizePackageImports: ["framer-motion"],
  },
  async redirects() {
    // Defense in depth alongside middleware. Literal www destination so
    // Railway's internal listen port cannot leak into Location.
    return [
      {
        source: "/",
        has: [{ type: "host", value: APEX_HOST }],
        destination: `https://${CANONICAL_HOST}/`,
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: APEX_HOST }],
        destination: `https://${CANONICAL_HOST}/:path*`,
        permanent: true,
      },
    ]
  },
  async headers() {
    return [
      { source: "/", headers: securityHeaders },
      { source: "/:path*", headers: securityHeaders },
    ]
  },
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
      {
        source: "/ingest/decide",
        destination: "https://us.i.posthog.com/decide",
      },
    ]
  },
  skipTrailingSlashRedirect: true,
}

export default withSentryConfig(nextConfig, {
  silent: true,
  tunnelRoute: "/monitoring",
  sourcemaps: {
    disable: !process.env.SENTRY_AUTH_TOKEN,
  },
})
