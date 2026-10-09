import fs from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"
import { GET as feed } from "./engineering/feed.xml/route"
import { GET as llms } from "./llms.txt/route"
import { getAllEntries, getEssays } from "../lib/engineering/content"
import robots from "./robots"
import sitemap from "./sitemap"
import { pageMetadata } from "./utils/seo"
import { DEFAULT_SITE_URL, SITE_URL } from "./utils/site"
import { ogImage, siteGraph, toJsonLd } from "./utils/structured-data"

const PAGE_FILES = [
  "app/page.tsx",
  "app/pulse/page.tsx",
  "app/build/page.tsx",
  "app/prism/page.tsx",
  "app/engineering/page.tsx",
  "app/engineering/log/page.tsx",
  "app/not-found.tsx",
]

function metaString(file: string, key: "title" | "description"): string {
  const text = fs.readFileSync(path.join(process.cwd(), file), "utf8")
  if (key === "description") {
    const constant = text.match(/const DESCRIPTION =\s*\n\s*"([^"]+)"/)
    if (constant) return constant[1]!
  }
  const inline = text.match(new RegExp(`${key}:\\s*(?:\\{\\s*absolute:\\s*)?"([^"]+)"`))
  if (!inline) throw new Error(`${file} has no ${key}`)
  return inline[1]!
}

describe("seo host", () => {
  it("uses the www origin for every sitemap loc and a real lastmod only where one exists", () => {
    expect(new URL(SITE_URL).hostname).toBe("www.frenem.com")
    const entries = sitemap()
    const byUrl = new Map(entries.map((entry) => [entry.url, entry]))
    const newest = getAllEntries()[0]!.date

    for (const entry of entries) {
      expect(entry.url === SITE_URL || entry.url.startsWith(`${SITE_URL}/`)).toBe(true)
      expect(entry.url).not.toMatch(/https:\/\/frenem\.com\b/)
    }
    expect(byUrl.has(`${SITE_URL}/`)).toBe(false)

    for (const route of ["/", "/pulse", "/build", "/prism"]) {
      const url = route === "/" ? SITE_URL : `${SITE_URL}${route}`
      expect(byUrl.get(url)?.lastModified).toBeUndefined()
    }

    for (const route of ["/engineering", "/engineering/log"]) {
      expect(new Date(byUrl.get(`${SITE_URL}${route}`)!.lastModified!).toISOString()).toBe(`${newest}T12:00:00.000Z`)
    }

    for (const essay of getEssays()) {
      const entry = byUrl.get(`${SITE_URL}/engineering/${essay.slug}`)
      expect(new Date(entry!.lastModified!).toISOString()).toBe(`${essay.date}T12:00:00.000Z`)
    }

    expect(entries.some((entry) => entry.url.includes("/api/"))).toBe(false)

    for (const entry of entries) {
      const pathname = new URL(entry.url).pathname
      const page =
        pathname === "/"
          ? "app/page.tsx"
          : pathname.startsWith("/engineering/") && pathname !== "/engineering/log"
            ? "app/engineering/[slug]/page.tsx"
            : `app${pathname}/page.tsx`
      expect(fs.existsSync(path.join(process.cwd(), page)), pathname).toBe(true)
    }
  })

  it("points robots.txt at the www sitemap and keeps the app crawlable", () => {
    const result = robots()
    expect(result.sitemap).toBe(`${SITE_URL}/sitemap.xml`)
    expect(result.sitemap).toBe(`${DEFAULT_SITE_URL}/sitemap.xml`)
    expect(result.rules).toMatchObject({ userAgent: "*", allow: "/", disallow: "/api/" })
  })

  it("keeps JSON-LD, the feed, and llms.txt on the www origin", async () => {
    const graph = toJsonLd(siteGraph())
    expect(graph).toContain(`${SITE_URL}/`)
    expect(graph).not.toMatch(/https:\/\/frenem\.com\b/)
    expect(ogImage("/pulse").url).toBe(`${SITE_URL}/pulse/opengraph-image`)

    const feedXml = await (await feed()).text()
    const llmsTxt = await (await llms()).text()
    for (const body of [feedXml, llmsTxt]) {
      expect(body).toContain(`${SITE_URL}/`)
      expect(body).not.toMatch(/https:\/\/frenem\.com\b/)
    }
  })

  it("gives every indexable page a distinct title and description", () => {
    const titles = PAGE_FILES.map((file) => metaString(file, "title"))
    const descriptions = PAGE_FILES.map((file) => metaString(file, "description"))
    expect(new Set(titles).size).toBe(titles.length)
    expect(new Set(descriptions).size).toBe(descriptions.length)
    for (const title of titles) expect(title.length).toBeLessThanOrEqual(70)
    for (const description of descriptions) {
      expect(description.length).toBeGreaterThan(40)
      expect(description.length).toBeLessThan(200)
    }
    for (const essay of getEssays()) {
      const title = `${essay.title} | Frenem Engineering`
      expect(titles).not.toContain(title)
      expect(title.length).toBeLessThanOrEqual(70)
      expect(essay.summary.length).toBeGreaterThan(40)
    }
  })

  it("leaves Twitter images unset so Next can reuse the Open Graph file", () => {
    const metadata = pageMetadata({ path: "/pulse", title: "Pulse", description: "A diagnostic." })
    expect(metadata.twitter).toMatchObject({ card: "summary_large_image", title: "Pulse" })
    expect(metadata.twitter).not.toHaveProperty("images")
    expect(metadata.alternates?.canonical).toBe("/pulse")
    expect(metadata.openGraph).toMatchObject({ url: "/pulse" })
  })
})
