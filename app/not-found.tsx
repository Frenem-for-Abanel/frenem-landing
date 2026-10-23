import type { Metadata } from "next"
import Link from "next/link"
import ContactCta from "./components/ContactCta"
import { PRODUCT_LABELS, PRODUCT_ROLES, PRODUCTS } from "./utils/product"

// Next marks not-found responses noindex on its own; a second robots tag
// here would only duplicate it.
export const metadata: Metadata = {
  title: { absolute: "Page not found | Frenem" },
  description: "That page doesn't exist. Explore Frenem Pulse, Build, Prism, or our guides from here.",
}

const LINKS = [
  ...PRODUCTS.map((key) => ({ href: `/${key}`, label: PRODUCT_LABELS[key], detail: PRODUCT_ROLES[key] })),
  { href: "/insights", label: "Insights", detail: "Guides, glossary, and engineering" },
  { href: "/", label: "Home", detail: "Everything Frenem does, on one page" },
]

export default function NotFound() {
  return (
    <div className="tint-brand">
      <div className="grain relative bg-(--tint-soft)">
        <div className="container-site relative pb-20 pt-32 md:pb-28 md:pt-40">
          <h1 className="type-display-2 max-w-[14ch]">This page isn&apos;t here.</h1>
          <p className="type-lead mt-6 max-w-[46ch] text-ink-secondary">
            The address doesn&apos;t match a page. One of these probably has what you were after, or
            tell us what you&apos;re looking for.
          </p>
          <div className="mt-8">
            <ContactCta mode="default">Get in touch</ContactCta>
          </div>
        </div>
      </div>
      <div className="container-site pb-24 pt-12 md:pb-36">
        <ul className="grid grid-cols-1 gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
          {LINKS.map((link) => (
            <li key={link.href} className="border-b border-line-strong">
              <Link href={link.href} className="group flex min-h-11 flex-col py-5">
                <span className="text-[22px] font-bold tracking-[-0.02em] [font-stretch:106%] group-hover:underline group-hover:underline-offset-4">
                  {link.label}
                </span>
                <span className="mt-1 text-[16px] text-ink-secondary">{link.detail}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
