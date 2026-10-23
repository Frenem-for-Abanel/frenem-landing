export const dynamic = "force-static"

/**
 * IndexNow key file (indexnow.org). Bing, Yandex, Seznam, and Naver pick up
 * new and changed URLs within minutes instead of waiting for a crawl, and
 * Bing's index also feeds Copilot and ChatGPT search. Submissions name this
 * file as their keyLocation (see scripts/indexnow.mjs). Without a key set,
 * the file does not exist.
 */
export function GET() {
  const key = process.env.INDEXNOW_KEY?.trim()
  if (!key || !/^[A-Za-z0-9-]{8,128}$/.test(key)) {
    return new Response("Not found", { status: 404 })
  }
  return new Response(key, { headers: { "Content-Type": "text/plain; charset=utf-8" } })
}
