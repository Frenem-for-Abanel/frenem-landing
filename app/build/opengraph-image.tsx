import { renderOgImage, OG_SIZE } from "../components/og-template"

export const size = OG_SIZE
export const contentType = "image/png"
export const alt = "Frenem Build, an organisation design sprint"

export default function Image() {
  return renderOgImage({
    title: "Build an organisation that scales beyond you.",
    subtitle: "Faster decisions, clear ownership, and a leadership bench, shaped around your business.",
    tint: "#f0d7c7",
    deep: "#d4876a",
  })
}
