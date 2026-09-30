import { cn } from "@/lib/utils"

export interface ComparisonRow {
  label: string
  them: string
  us: string
}

const cellLabel =
  "before:mb-1.5 before:block before:text-[13px] before:font-semibold before:text-ink-tertiary before:content-[attr(data-label)] md:before:hidden"

/**
 * Two-column comparison: the alternative in plain grey, Frenem on the
 * page's pastel. One DOM for every width: below `md` each row restacks and
 * cells carry their column name.
 */
export default function ComparisonTable({
  caption,
  them,
  us,
  rows,
  className,
}: {
  caption: string
  them: string
  us: string
  rows: readonly ComparisonRow[]
  className?: string
}) {
  return (
    <table className={cn("w-full border-collapse text-left max-md:block", className)}>
      <caption className="sr-only">{caption}</caption>
      <thead className="max-md:sr-only">
        <tr>
          <th scope="col" className="w-[24%] pb-5">
            <span className="sr-only">Dimension</span>
          </th>
          <th scope="col" className="w-[34%] pb-5 pr-6 text-[15px] font-semibold text-ink-tertiary">
            {them}
          </th>
          <th scope="col" className="pb-5 pl-7 text-[15px] font-semibold">
            <span className="inline-flex items-center gap-2.5">
              <span aria-hidden className="h-3 w-3 rounded-full bg-(--tint-bright)" />
              {us}
            </span>
          </th>
        </tr>
      </thead>
      <tbody className="max-md:block">
        {rows.map((row) => (
          <tr key={row.label} className="border-t-2 border-ink max-md:grid max-md:grid-cols-1 max-md:gap-3 max-md:py-6">
            <th scope="row" className="align-top text-[17px] font-bold tracking-[-0.01em] md:py-6 md:pr-6">
              {row.label}
            </th>
            <td data-label={them} className={cn("align-top text-[17px] leading-snug text-ink-tertiary md:py-6 md:pr-6", cellLabel)}>
              {row.them}
            </td>
            <td
              data-label={us}
              className={cn(
                "bg-(--tint-soft) px-5 py-4 align-top text-[17px] font-semibold leading-snug md:px-7 md:py-6 md:text-lg",
                cellLabel
              )}
            >
              {row.us}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
