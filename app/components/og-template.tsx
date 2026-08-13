import { ImageResponse } from "next/og"

export const OG_SIZE = { width: 1200, height: 630 }

/** Shared OpenGraph card: ink background, wordmark, big title, tint bar. */
export function renderOgImage({
  title,
  subtitle,
  tint,
}: {
  title: string
  subtitle: string
  tint: string
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0a0a",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", fontSize: 44, fontWeight: 700, color: "#ffffff", letterSpacing: -2 }}>
            frenem
          </div>
          <div style={{ display: "flex", width: 120, height: 8, background: tint, borderRadius: 4 }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              display: "flex",
              fontSize: 76,
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: -3,
              lineHeight: 1.05,
              maxWidth: 980,
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 30,
              fontWeight: 400,
              color: "rgba(255,255,255,0.65)",
              lineHeight: 1.4,
              maxWidth: 900,
            }}
          >
            {subtitle}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", width: 28, height: 4, background: tint }} />
          <div style={{ display: "flex", fontSize: 24, color: "rgba(255,255,255,0.5)" }}>
            frenem.com · Bangalore, India
          </div>
        </div>
      </div>
    ),
    OG_SIZE
  )
}
