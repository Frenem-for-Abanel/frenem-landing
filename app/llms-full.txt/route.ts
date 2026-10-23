import { llmsFull } from "../utils/llms"

export const dynamic = "force-static"

/** The whole site as one Markdown document, for assistants that read it in full. */
export function GET() {
  return new Response(llmsFull(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}
