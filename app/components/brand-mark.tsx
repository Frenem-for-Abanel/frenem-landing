import { ImageResponse } from "next/og"

/**
 * The favicon mark as a PNG at any size: a small relational network on ink,
 * one node per product in its own colour (Pulse sage, Build clay, Prism
 * heather). Drawn on a 32-unit grid and scaled.
 */
export function renderBrandMark(px: number, { rounded = true }: { rounded?: boolean } = {}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#151515",
          borderRadius: rounded ? px * 0.22 : 0,
        }}
      >
        <svg width={px} height={px} viewBox="0 0 32 32">
          <line x1="11" y1="12" x2="22" y2="11" stroke="#ffffff" strokeOpacity="0.45" strokeWidth="1.5" />
          <line x1="11" y1="12" x2="20" y2="22" stroke="#ffffff" strokeOpacity="0.45" strokeWidth="1.5" />
          <line x1="22" y1="11" x2="20" y2="22" stroke="#ffffff" strokeOpacity="0.45" strokeWidth="1.5" />
          <circle cx="11" cy="12" r="3.5" fill="#7aad93" />
          <circle cx="22" cy="11" r="2.75" fill="#d4876a" />
          <circle cx="20" cy="22" r="2.75" fill="#948cc9" />
        </svg>
      </div>
    ),
    { width: px, height: px }
  )
}
