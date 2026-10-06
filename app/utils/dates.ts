const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

/** Calendar date from a `YYYY-MM-DD` content date. No timezone shift. */
export function formatEntryDate(iso: string): string {
  const [year, month, day] = iso.split("-")
  const monthName = MONTHS[Number(month) - 1]
  if (!year || !monthName || !day) return iso
  return `${Number(day)} ${monthName} ${year}`
}
