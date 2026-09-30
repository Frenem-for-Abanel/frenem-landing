import { renderOgImage, OG_SIZE } from "../components/og-template"

export const size = OG_SIZE
export const contentType = "image/png"
export const alt = "Frenem Engineering: essays and field notes"

export default function Image() {
  return renderOgImage({
    title: "Frenem Engineering",
    subtitle: "Essays and field notes: the method, design, and trust decisions behind the clarity suite.",
    tint: "#ece5d5",
    deep: "#c9b287",
  })
}
