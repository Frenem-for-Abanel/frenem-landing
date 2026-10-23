import Link from "next/link"
import { ArrowRight } from "lucide-react"
import ContactCta from "./ContactCta"
import { PRODUCT_LABELS, PRODUCT_ROLES, PRODUCTS, type ProductKey } from "../utils/product"

const DOT: Record<ProductKey, string> = {
  pulse: "bg-sage-mid",
  build: "bg-clay-mid",
  prism: "bg-heather-mid",
}

/**
 * The end of an article: what Frenem does, a route into each product (the
 * article's own first), and a way to talk. Readers who finish a piece are
 * the warmest visitors the site gets.
 */
export default function ArticleCta({ product, line }: { product?: ProductKey; line?: string }) {
  const order = product ? [product, ...PRODUCTS.filter((p) => p !== product)] : PRODUCTS
  return (
    <aside aria-label="Work with Frenem" className="grain relative mt-16 bg-(--tint-soft) p-6 md:p-10">
      <p className="type-display-3 relative max-w-[22ch]">
        {line ?? "Frenem helps founder-led companies diagnose, design, and run the organisation."}
      </p>
      <ul className="relative mt-8 grid grid-cols-1 gap-2 sm:grid-cols-3">
        {order.map((key) => (
          <li key={key}>
            <Link
              href={`/${key}`}
              className="group flex min-h-11 items-center gap-3 bg-paper px-4 py-3 text-[16px] font-semibold transition-colors hover:bg-paper-soft"
            >
              <span aria-hidden className={`h-3 w-3 shrink-0 rounded-full ${DOT[key]}`} />
              <span className="min-w-0">
                {PRODUCT_LABELS[key]}
                <span className="block text-[14px] font-medium text-ink-secondary">{PRODUCT_ROLES[key]}</span>
              </span>
              <ArrowRight aria-hidden className="ml-auto h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" />
            </Link>
          </li>
        ))}
      </ul>
      <div className="relative mt-8">
        <ContactCta mode="default">Get in touch</ContactCta>
      </div>
    </aside>
  )
}
