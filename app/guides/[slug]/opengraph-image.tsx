import { renderOgImage, OG_SIZE, OG_TINTS } from "../../components/og-template"
import { getGuideBySlug, getGuides } from "../../../lib/guides/content"

export const size = OG_SIZE
export const contentType = "image/png"
export const alt = "A guide from Frenem"

export function generateStaticParams() {
  return getGuides().map((guide) => ({ slug: guide.slug }))
}

/** Each guide shares as its own card on its product's colour. */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const guide = getGuideBySlug(slug)
  return renderOgImage({
    title: guide?.title ?? "Frenem guides",
    subtitle: guide?.summary ?? "Guides to organisation design and diagnostics.",
    ...OG_TINTS[guide?.product ?? "brand"],
  })
}
