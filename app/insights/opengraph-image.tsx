import { renderOgImage, OG_SIZE, OG_TINTS } from "../components/og-template"

export const size = OG_SIZE
export const contentType = "image/png"
export const alt = "Frenem Insights: guides on organisation design and diagnostics"

export default function Image() {
  return renderOgImage({
    title: "How organisations actually run.",
    subtitle: "Guides, a glossary, and field notes on organisation design and diagnostics.",
    ...OG_TINTS.brand,
  })
}
