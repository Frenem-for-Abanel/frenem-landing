import Link from "next/link"
import ContactCta from "./ContactCta"
import FooterWordmark from "./FooterWordmark"
import { LINKEDIN_URL } from "../utils/site"

const linkClass =
  "group inline-flex min-h-11 items-center gap-3 text-[17px] font-medium text-white/75 transition-colors hover:text-white md:min-h-10"

const products = [
  { href: "/pulse", name: "Pulse", role: "Relational diagnostics", dot: "bg-sage-mid" },
  { href: "/build", name: "Build", role: "Organisation design", dot: "bg-clay-mid" },
  { href: "/prism", name: "Prism", role: "Operating record", dot: "bg-heather-mid" },
]

export default function Footer() {
  return (
    <footer className="grain grain-light relative overflow-clip bg-ink text-paper">
      <div className="container-site pt-20 md:pt-28">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <p className="type-display-3 max-w-[16ch] text-paper">
              Organisation clarity: diagnose, design, <em>operate.</em>
            </p>
            <ContactCta mode="default" className="mt-10 bg-paper text-ink">
              Get in touch
            </ContactCta>
          </div>

          <nav className="lg:col-span-3 lg:col-start-8" aria-label="Products">
            <p className="type-kicker mb-4 text-white/45">Products</p>
            <ul>
              {products.map((p) => (
                <li key={p.href}>
                  <Link href={p.href} className={linkClass}>
                    <span
                      aria-hidden
                      className={`h-3 w-3 shrink-0 rounded-full transition-transform duration-500 group-hover:scale-150 ${p.dot}`}
                    />
                    <span className="font-semibold text-white">{p.name}</span>
                    <span className="text-white/45">{p.role}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="lg:col-span-2" aria-label="Company">
            <p className="type-kicker mb-4 text-white/45">Company</p>
            <ul>
              <li>
                <Link href="/engineering" className={linkClass}>
                  Engineering
                </Link>
              </li>
              <li>
                <Link href="/" className={linkClass}>
                  frenem.com
                </Link>
              </li>
              <li>
                <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  LinkedIn
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-20 flex flex-col justify-between gap-2 text-[14px] text-white/45 md:mt-28 md:flex-row">
          <span>© Frenem {new Date().getFullYear()}</span>
        </div>
      </div>

      {/* The wordmark as a signature. */}
      <div className="container-site">
        <FooterWordmark />
      </div>
    </footer>
  )
}
