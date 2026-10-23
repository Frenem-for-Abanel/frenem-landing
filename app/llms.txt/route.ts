import { llmsIndex } from "../utils/llms"

export const dynamic = "force-static"

/** llms.txt (llmstxt.org): the site map for AI assistants. Built in utils/llms.ts. */
export function GET() {
  return new Response(llmsIndex(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      // For assistants to read, not for search results: the pages themselves rank.
      "X-Robots-Tag": "noindex",
    },
  })
}
