import { getAllEntries, TYPE_LABELS } from "../../../lib/engineering/content"
import { SITE_URL } from "../../utils/site"

export const dynamic = "force-static"

const escape = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")

/** Frontmatter dates are calendar days; publish them at midday UTC. */
const rfc822 = (date: string) => new Date(`${date}T12:00:00Z`).toUTCString()

/**
 * RSS 2.0 for the whole engineering log, so essays and notes reach feed
 * readers and aggregators. Essays link to their page; notes to their anchor
 * on the log.
 */
export function GET() {
  const entries = getAllEntries()
  const channelUrl = `${SITE_URL}/engineering`
  const items = entries
    .map((entry) => {
      const link =
        entry.type === "essay" ? `${SITE_URL}/engineering/${entry.slug}` : `${SITE_URL}/engineering/log#${entry.slug}`
      return [
        "    <item>",
        `      <title>${escape(entry.title)}</title>`,
        `      <link>${link}</link>`,
        `      <guid isPermaLink="true">${link}</guid>`,
        `      <description>${escape(entry.summary)}</description>`,
        `      <category>${TYPE_LABELS[entry.type]}</category>`,
        `      <pubDate>${rfc822(entry.date)}</pubDate>`,
        "    </item>",
      ].join("\n")
    })
    .join("\n")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Frenem Engineering</title>
    <link>${channelUrl}</link>
    <atom:link href="${SITE_URL}/engineering/feed.xml" rel="self" type="application/rss+xml" />
    <description>Essays and field notes from Frenem Engineering: the method, design, and trust decisions behind the clarity suite.</description>
    <language>en-IN</language>
${entries[0] ? `    <lastBuildDate>${rfc822(entries[0].date)}</lastBuildDate>\n` : ""}${items}
  </channel>
</rss>
`

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  })
}
