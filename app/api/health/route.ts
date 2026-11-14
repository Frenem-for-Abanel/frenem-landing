import { NextResponse } from "next/server"

/**
 * Unauthenticated liveness check for Railway service health probes.
 */
export async function GET() {
  return NextResponse.json(
    { status: "ok", service: "frenem-landing" },
    {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    }
  )
}
