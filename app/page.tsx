import type { Metadata } from "next"
import HeroShell from "./components/HeroShell"
import ContactCta from "./components/ContactCta"
import SmoothScrollLink from "./components/SmoothScrollLink"
import IntentOpener from "./components/contact/IntentOpener"
import ProductRouterSection from "./components/home/ProductRouterSection"
import KineticBand from "./components/home/KineticBand"
import FaqSection from "./components/FaqSection"
import TeamSection from "./components/TeamSection"
import SecuritySection from "./components/SecuritySection"
import FinalCtaSection from "./components/FinalCtaSection"
import JsonLd from "./components/JsonLd"
import { HOME_DESCRIPTION, HOME_TITLE, pageMetadata } from "./utils/seo"
import { absoluteUrl, faq, graph, ORG_ID, webPage } from "./utils/structured-data"
import { HOME_FAQS } from "./utils/faqs"

export const metadata: Metadata = pageMetadata({
  path: "/",
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  socialTitle: "Frenem: the whole organisation, in focus",
})

const PRODUCTS = [
  { name: "Frenem Pulse", path: "/pulse", description: "Relational diagnostics: how work actually moves through your business." },
  { name: "Frenem Build", path: "/build", description: "Organisation design: the structure your strategy needs." },
  { name: "Frenem Prism", path: "/prism", description: "The operating record: org charts, ownership, and governance, kept current." },
]

const jsonLd = graph(
  webPage({ path: "/", name: "Frenem: organisation clarity", description: HOME_DESCRIPTION, about: ORG_ID }),
  {
    "@type": "ItemList",
    name: "Frenem products",
    itemListElement: PRODUCTS.map((product, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: product.name,
      description: product.description,
      url: absoluteUrl(product.path),
    })),
  },
  faq("/", HOME_FAQS)
)

export default function HomePage() {
  return (
    <div className="tint-brand">
      <JsonLd data={jsonLd} />
      <IntentOpener />

      <HeroShell
        title={
          <>
            The whole organisation, <em>in focus.</em>
          </>
        }
        subtitle="Organisation design and diagnostics for founder-led and scaling companies. See how work and decisions actually move through the business, design the structure your strategy needs, and keep it current as you scale."
        actions={
          <>
            <ContactCta mode="default" className="w-full sm:w-auto">
              Get in touch
            </ContactCta>
            <SmoothScrollLink targetId="products">Explore the products</SmoothScrollLink>
          </>
        }
        note="Tell us what's breaking. We reply within one business day."
        scene="suite"
      />

      <KineticBand />

      <ProductRouterSection />
      <TeamSection compact tone="soft" />
      <SecuritySection variant="strip" />
      <FaqSection
        heading={
          <>
            New to Frenem? <em>Start here.</em>
          </>
        }
        items={HOME_FAQS}
      />
      <FinalCtaSection
        title={
          <>
            Start with a <em>conversation.</em>
          </>
        }
        subtitle="Tell us what's breaking, whether that's execution, structure, or key-person risk, and we'll point you at the right starting place. No commitment, no decks."
      />
    </div>
  )
}
