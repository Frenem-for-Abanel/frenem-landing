import { renderOgImage, OG_SIZE } from "./components/og-template"

export const size = OG_SIZE
export const contentType = "image/png"
export const alt = "Frenem organisation clarity: diagnose, design, operate"

export default function Image() {
  return renderOgImage({
    title: "The whole organisation, in focus.",
    subtitle: "Diagnose with Pulse. Design with Build. Operate with Prism.",
    tint: "#ff5b1f",
  })
}
