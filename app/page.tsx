import type { Metadata } from "next"
import HeroShell from "./components/HeroShell"
import ContactCta from "./components/ContactCta"
import SmoothScrollLink from "./components/SmoothScrollLink"
import IntentOpener from "./components/contact/IntentOpener"
import ProductRouterSection from "./components/home/ProductRouterSection"
import Marquee from "./components/motion/Marquee"
import TeamSection from "./components/TeamSection"
import SecuritySection from "./components/SecuritySection"
import FinalCtaSection from "./components/FinalCtaSection"
import JsonLd from "./components/JsonLd"
import { HOME_DESCRIPTION, HOME_TITLE, pageMetadata } from "./utils/seo"
import { absoluteUrl, graph, ORG_ID, webPage } from "./utils/structured-data"

export const metadata: Metadata = pageMetadata({
  path: "/",
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  socialTitle: "Frenem: the whole organisation, in focus",
})

const PRODUCTS = [
  { name: "Frenem Pulse", path: "/pulse", description: "Relational diagnostics: how your people actually work together." },
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
  }
)

const BAND = [
  { word: "Diagnose", shape: "h-[0.6em] w-[0.6em] rounded-full bg-sage" },
  { word: "Design", shape: "h-[0.56em] w-[0.56em] bg-clay" },
  { word: "Operate", shape: "h-[0.4em] w-[1.1em] rounded-full bg-heather" },
]

export default function HomePage() {
  return (
    <div className="tint-brand">
      <JsonLd data={jsonLd} />
      <IntentOpener />

      <HeroShell
        eyebrow="Frenem, organisation clarity"
        title={
          <>
            The whole organisation, <em>in focus.</em>
          </>
        }
        subtitle="Diagnose how your people actually work together. Design the structure your strategy needs. Keep it current as you scale. Three products, one operating picture."
        actions={
          <>
            <ContactCta mode="default" className="w-full sm:w-auto">
              Get in touch
            </ContactCta>
            <SmoothScrollLink targetId="products">Explore the products</SmoothScrollLink>
          </>
        }
        scene="suite"
      />

      <div className="grain grain-light relative overflow-clip bg-ink py-6 text-sand md:py-9">
        <Marquee kinetic speed={4} className="text-[clamp(56px,9vw,140px)] font-extrabold leading-[1] tracking-[-0.05em] [font-stretch:100%]">
          {BAND.map(({ word, shape }) => (
            <span key={word} className="flex items-center gap-[0.35em] pr-[0.35em]">
              {word}
              <span aria-hidden className={`inline-block shrink-0 ${shape}`} />
            </span>
          ))}
        </Marquee>
        <Marquee
          kinetic
          reverse
          speed={3}
          className="-mt-1 text-[clamp(56px,9vw,140px)] font-extrabold leading-[1] tracking-[-0.05em] text-transparent [-webkit-text-stroke:1.5px_var(--color-sand)]"
        >
          {["Pulse", "Build", "Prism"].map((word) => (
            <span key={word} aria-hidden className="pr-[0.5em]">
              {word}
            </span>
          ))}
        </Marquee>
      </div>

      <ProductRouterSection />
      <TeamSection label="Who we are" compact tone="soft" />
      <SecuritySection variant="strip" />
      <FinalCtaSection
        label="Get started"
        title={
          <>
            Start with a <em>conversation.</em>
          </>
        }
        subtitle="Tell us what's breaking, whether that's attrition, structure, or clarity, and we'll point you at the right starting place. No commitment, no decks."
      />
    </div>
  )
}
