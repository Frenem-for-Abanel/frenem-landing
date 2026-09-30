import { renderOgImage, OG_SIZE } from "../components/og-template"

export const size = OG_SIZE
export const contentType = "image/png"
export const alt = "Frenem Pulse, relational diagnostics"

export default function Image() {
  return renderOgImage({
    title: "See how your people actually work together.",
    subtitle: "Exit risk, hidden brokers, and friction, visible while you can still act.",
    tint: "#d2e4d7",
    deep: "#7aad93",
  })
}
