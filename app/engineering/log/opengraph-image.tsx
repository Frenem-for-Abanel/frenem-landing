import { renderOgImage, OG_SIZE } from "../../components/og-template"

export const size = OG_SIZE
export const contentType = "image/png"
export const alt = "The Frenem Engineering log"

export default function Image() {
  return renderOgImage({
    title: "The Frenem Engineering log",
    subtitle: "Essays, shipped changes, and technical notes, newest first.",
    tint: "#ece5d5",
    deep: "#c9b287",
  })
}
