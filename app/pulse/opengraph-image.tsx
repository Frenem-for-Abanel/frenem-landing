import { renderOgImage, OG_SIZE } from "../components/og-template"

export const size = OG_SIZE
export const contentType = "image/png"
export const alt = "Frenem Pulse, relational diagnostics"

export default function Image() {
  return renderOgImage({
    title: "See how your people actually work together.",
    subtitle: "Exit risk, hidden brokers, and friction, visible in a four-week pilot.",
    tint: "#0d9488",
  })
}
