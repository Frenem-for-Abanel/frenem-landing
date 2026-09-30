import { toJsonLd } from "../utils/structured-data"

/** Server-rendered schema.org block; see utils/structured-data. */
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(data) }} />
}
