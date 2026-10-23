import { renderOgImage, OG_SIZE, OG_TINTS } from "../components/og-template"

export const size = OG_SIZE
export const contentType = "image/png"
export const alt = "The Frenem organisation glossary"

export default function Image() {
  return renderOgImage({
    title: "The organisation glossary",
    subtitle: "Decision rights, RAPID and RACI, network analysis, span of control, and more, in plain words.",
    ...OG_TINTS.brand,
  })
}
