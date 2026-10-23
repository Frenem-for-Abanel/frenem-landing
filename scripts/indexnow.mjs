#!/usr/bin/env node
/**
 * Submit every URL in the live sitemap to IndexNow after a deploy:
 *
 *   INDEXNOW_KEY=... npm run indexnow
 *
 * The same key must be set on the deployed app, which serves it at
 * /indexnow.txt. SITE_URL defaults to https://www.frenem.com.
 */

const site = (process.env.SITE_URL || "https://www.frenem.com").replace(/\/$/, "")
const key = process.env.INDEXNOW_KEY?.trim()

if (!key) {
  console.error("Set INDEXNOW_KEY (the same value the deployed site serves at /indexnow.txt).")
  process.exit(1)
}

const live = await fetch(`${site}/indexnow.txt`)
if (!live.ok || (await live.text()).trim() !== key) {
  console.error(`${site}/indexnow.txt does not serve this key yet. Deploy with INDEXNOW_KEY set first.`)
  process.exit(1)
}

const sitemap = await (await fetch(`${site}/sitemap.xml`)).text()
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1])
if (urls.length === 0) {
  console.error("The sitemap listed no URLs.")
  process.exit(1)
}

const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: new URL(site).host,
    key,
    keyLocation: `${site}/indexnow.txt`,
    urlList: urls,
  }),
})

console.log(`IndexNow answered ${response.status} for ${urls.length} URLs.`)
process.exit(response.ok ? 0 : 1)
