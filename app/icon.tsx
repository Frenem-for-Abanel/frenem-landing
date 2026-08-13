import { ImageResponse } from "next/og"

export const size = { width: 32, height: 32 }
export const contentType = "image/png"

/** Favicon: a tiny relational network mark on the brand ink. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#0a0a0a",
          borderRadius: 7,
        }}
      >
        <svg width="32" height="32" viewBox="0 0 32 32">
          <line x1="11" y1="12" x2="22" y2="11" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="1.5" />
          <line x1="11" y1="12" x2="20" y2="22" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="1.5" />
          <line x1="22" y1="11" x2="20" y2="22" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="1.5" />
          <circle cx="11" cy="12" r="3.5" fill="#ff5b1f" />
          <circle cx="22" cy="11" r="2.5" fill="#ffffff" />
          <circle cx="20" cy="22" r="2.5" fill="#ffffff" />
        </svg>
      </div>
    ),
    { ...size }
  )
}
