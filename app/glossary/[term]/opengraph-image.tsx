import { renderOgImage, OG_SIZE, OG_TINTS } from "../../components/og-template"
import { getTerm, GLOSSARY } from "../../utils/glossary"

export const size = OG_SIZE
export const contentType = "image/png"
export const alt = "A definition from the Frenem organisation glossary"

export function generateStaticParams() {
  return GLOSSARY.map((entry) => ({ term: entry.slug }))
}

export default async function Image({ params }: { params: Promise<{ term: string }> }) {
  const { term } = await params
  const entry = getTerm(term)
  return renderOgImage({
    title: entry?.term ?? "The organisation glossary",
    subtitle: entry?.definition ?? "Plain definitions of organisation design and diagnostics terms.",
    ...OG_TINTS[entry?.product ?? "brand"],
  })
}
