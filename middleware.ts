import { NextRequest, NextResponse } from "next/server"
import { apexToWwwRedirectLocation, requestHostname } from "./app/utils/site"

/**
 * Apex → www for every path. This only runs once `frenem.com` DNS points at
 * this Railway service. Today GoDaddy forwarding intercepts the apex host
 * and 404s deep links before they reach Next.js.
 */
export function middleware(request: NextRequest) {
  const hostname = requestHostname(request.headers.get("x-forwarded-host") ?? request.headers.get("host"))
  const location = apexToWwwRedirectLocation(hostname, request.nextUrl.pathname, request.nextUrl.search)
  if (location) return NextResponse.redirect(location, 308)
  return NextResponse.next()
}

export const config = {
  // Spell `/` out as well as `/:path*`. Next's matcher treats `*` as
  // zero-or-more today; the explicit root keeps the homepage covered if that
  // ever changes.
  matcher: ["/", "/:path*"],
}
