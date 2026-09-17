import type { NextConfig } from "next"
import { APEX_HOST, CANONICAL_HOST } from "./app/utils/site"

const nextConfig: NextConfig = {
  async redirects() {
    // Defense in depth alongside middleware. Uses a literal www destination so
    // Railway's internal listen port cannot leak into Location (a known issue
    // when cloning request.nextUrl and rewriting host).
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
}

export default nextConfig
