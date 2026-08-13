import { readContactApiError } from "../../utils/contact-modal-helpers"

/** POST to the contact API; throws a user-facing Error on failure. */
export async function submitContact(payload: Record<string, unknown>): Promise<void> {
  const response = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  if (!response.ok) {
    throw new Error(await readContactApiError(response))
  }
}
