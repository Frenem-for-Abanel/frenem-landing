import Link from "next/link"

export type Crumb = { name: string; path: string }

/** Visible trail. Home is always first; the current page is not a link. */
export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  const trail: Crumb[] = [{ name: "Home", path: "/" }, ...items]
  return (
    <nav aria-label="Breadcrumb" className="anim-fade-up mb-5">
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[13px] text-ink-tertiary">
        {trail.map((crumb, index) => {
          const last = index === trail.length - 1
          return (
            <li key={crumb.path} className="inline-flex items-center gap-1.5">
              {index > 0 ? (
                <span aria-hidden className="text-ink-tertiary/70">
                  /
                </span>
              ) : null}
              {last ? (
                <span aria-current="page" className="text-ink-secondary">
                  {crumb.name}
                </span>
              ) : (
                <Link href={crumb.path} className="transition-colors hover:text-ink">
                  {crumb.name}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
