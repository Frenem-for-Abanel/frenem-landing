import type { NextConfig } from "next"
import { APEX_HOST, CANONICAL_HOST } from "./app/utils/site"

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Two years. No includeSubDomains: apex DNS is still GoDaddy forwarding,
  // and preload is a one-way public commitment the owner should make later.
  { key: "Strict-Transport-Security", value: "max-age=63072000" },
]

const nextConfig: NextConfig = {
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
}

export default nextConfig
