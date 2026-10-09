import { ImageResponse } from "next/og"
import { OG_IMAGE } from "../utils/seo"

export const OG_SIZE = { width: OG_IMAGE.width, height: OG_IMAGE.height }

/**
 * Shared OpenGraph card: the page's pastel field, the headline in ink, and
 * a deeper disc cropped off the corner, like the page heroes.
 */
export function renderOgImage({
  title,
  subtitle,
  tint,
  deep,
}: {
  title: string
  subtitle: string
  /** The pastel field. */
  tint: string
  /** The deeper shape colour. */
  deep: string
}) {
  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: tint,
          padding: "72px 80px",
          fontFamily: "sans-serif",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -160,
            top: -200,
            width: 560,
            height: 560,
            borderRadius: 9999,
            background: deep,
            opacity: 0.55,
            display: "flex",
          }}
        />
        <div style={{ display: "flex", fontSize: 44, fontWeight: 700, color: "#151515", letterSpacing: -2 }}>frenem</div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              display: "flex",
              fontSize: 80,
              fontWeight: 800,
              color: "#151515",
              letterSpacing: -4,
              lineHeight: 1,
              maxWidth: 980,
            }}
          >
            {title}
          </div>
          <div style={{ display: "flex", fontSize: 30, color: "#454545", lineHeight: 1.4, maxWidth: 900 }}>
            {subtitle}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", width: 22, height: 22, borderRadius: 9999, background: "#151515" }} />
          <div style={{ display: "flex", fontSize: 24, color: "#454545" }}>frenem.com · Bangalore, India</div>
        </div>
      </div>
    ),
    OG_SIZE
  )
}
