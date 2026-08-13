import { renderOgImage, OG_SIZE } from "../components/og-template"

export const size = OG_SIZE
export const contentType = "image/png"
export const alt = "Frenem Build — organisation design sprint"

export default function Image() {
  return renderOgImage({
    title: "Build an organisation that scales beyond you.",
    subtitle: "Decision rights, job architecture, and succession — in an 8-week sprint.",
    tint: "#d97706",
  })
}
