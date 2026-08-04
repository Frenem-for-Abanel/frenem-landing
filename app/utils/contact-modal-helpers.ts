import type { ProductTab } from "../context/ProductContext"

export type HeaderContactMode = "contact" | "pulseContact" | "default"

/** Header "Get in Touch" opens the low-effort path for dual-path products. */
export function headerContactMode(product: ProductTab): HeaderContactMode {
  if (product === "build") return "contact"
  if (product === "pulse") return "pulseContact"
  return "default"
}

export async function readContactApiError(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { error?: unknown }
    if (typeof body.error === "string" && body.error.trim()) {
      return body.error.trim()
    }
  } catch {
    // ignore non-JSON bodies
  }
  return "Please try again later."
}

export function questionnaireAnswersComplete(answers: {
  q1: string
  q2: string
  q3: string
  q4: string
}): boolean {
  return Boolean(answers.q1 && answers.q2 && answers.q3 && answers.q4)
}
