import { renderOgImage, OG_SIZE } from "../components/og-template"

export const size = OG_SIZE
export const contentType = "image/png"
export const alt = "Frenem Prism, the organisation kept current"

export default function Image() {
  return renderOgImage({
    title: "The organisation, kept current.",
    subtitle: "Live org charts, ownership, KPIs, and governance in one place.",
    tint: "#dcd8ee",
    deep: "#948cc9",
  })
}
