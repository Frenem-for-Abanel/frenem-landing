import { renderOgImage, OG_SIZE } from "../components/og-template"

export const size = OG_SIZE
export const contentType = "image/png"
export const alt = "Frenem Prism, employee management"

export default function Image() {
  return renderOgImage({
    title: "Your single source of truth.",
    subtitle: "Live org charts, KRAs, review cycles, and governance in one place.",
    tint: "#0284c7",
  })
}
