import { renderOgImage, OG_SIZE } from "../../components/og-template"
import { getAllEntries, getEntryBySlug } from "../../../lib/engineering/content"

export const size = OG_SIZE
export const contentType = "image/png"
export const alt = "An essay or field note from Frenem Engineering"

export function generateStaticParams() {
  return getAllEntries().map((entry) => ({ slug: entry.slug }))
}

/** Each essay shares as its own card: the title and summary on the section's sand. */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const essay = getEntryBySlug(slug)
  return renderOgImage({
    title: essay?.title ?? "Frenem Engineering",
    subtitle: essay?.summary ?? "Essays and field notes from Frenem Engineering.",
    tint: "#ece5d5",
    deep: "#c9b287",
  })
}
