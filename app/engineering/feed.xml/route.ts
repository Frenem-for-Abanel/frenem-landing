import {
  BYLINE,
  getAllEntries,
  neutralUtcInstant,
  TYPE_LABELS,
  type EngineeringEntry,
} from "../../../lib/engineering/content"
import { escapeHtml } from "../../utils/escape-html"
import { SITE_URL } from "../../utils/site"

export const dynamic = "force-static"

/** Essays have pages; shipped work and notes deep-link into the log. */
function entryUrl(entry: EngineeringEntry): string {
  return entry.type === "essay"
    ? `${SITE_URL}/engineering/${entry.slug}`
    : `${SITE_URL}/engineering/log#${entry.slug}`
}

/**
 * Feed-safe HTML for inline entries: MDX comments and JSX components drop
 * out, prose paragraphs survive. Readers get the words; the site renders the
 * figures.
 */
function mdxToRssHtml(body: string): string {
  return body
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
    .replace(/<([A-Z][A-Za-z]*)\b[\s\S]*?<\/\1>/g, "")
    .replace(/<[A-Z][A-Za-z]*\b[^>]*\/>/g, "")
    .split(/\n{2,}/)
    .map((block) => block.replace(/\s+/g, " ").trim())
    .filter((block) => block !== "")
    .map((block) => `<p>${escapeHtml(block)}</p>`)
    .join("")
}

function item(entry: EngineeringEntry): string {
  const url = entryUrl(entry)
  const embedded =
    entry.type === "essay"
      ? ""
      : `\n      <content:encoded><![CDATA[${mdxToRssHtml(entry.body)}]]></content:encoded>`
  return `    <item>
      <title>${escapeHtml(entry.title)}</title>
      <link>${url}</link>
      <guid>${url}</guid>
      <pubDate>${neutralUtcInstant(entry.date).toUTCString()}</pubDate>
      <category>${TYPE_LABELS[entry.type]}</category>
      <description>${escapeHtml(entry.summary)}</description>${embedded}
    </item>`
}

export function GET() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeHtml(BYLINE)}</title>
    <link>${SITE_URL}/engineering</link>
    <atom:link href="${SITE_URL}/engineering/feed.xml" rel="self" type="application/rss+xml"/>
    <description>Essays and field notes from ${escapeHtml(BYLINE)}: the method, design, and trust decisions behind the clarity suite.</description>
    <language>en-gb</language>
${getAllEntries().map(item).join("\n")}
  </channel>
</rss>
`
  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  })
}
