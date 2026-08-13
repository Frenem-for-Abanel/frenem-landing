import type { Metadata } from "next"
import HeroShell from "./components/HeroShell"
import ContactCta from "./components/ContactCta"
import SmoothScrollLink from "./components/SmoothScrollLink"
import IntentOpener from "./components/contact/IntentOpener"
import ProductRouterSection from "./components/home/ProductRouterSection"
import TeamSection from "./components/TeamSection"
import SecuritySection from "./components/SecuritySection"
import FinalCtaSection from "./components/FinalCtaSection"

export const metadata: Metadata = {
  alternates: { canonical: "/" },
}

const HOME_SHADER_COLORS = {
  bg: "#fdf8f3",
  bg2: "#faeee2",
  accent: "#ffffff",
  accent2: "#ea580c",
  highlight: "#fed7aa",
} as const

export default function HomePage() {
  return (
    <div className="tint-brand">
      <IntentOpener />

      <HeroShell
        eyebrow="Frenem · Organisation Clarity"
        title={
          <>
            The whole organisation, <em>in focus.</em>
          </>
        }
        subtitle="Diagnose how your people actually work together. Design the structure your strategy needs. Keep it current as you scale. Three products, one operating picture."
        colors={HOME_SHADER_COLORS}
        tall
        actions={
          <>
            <ContactCta mode="default" className="w-full sm:w-auto">
              Get in touch →
            </ContactCta>
            <SmoothScrollLink targetId="products">Explore the products</SmoothScrollLink>
          </>
        }
      />

      <ProductRouterSection />
      <TeamSection label="Who We Are" compact />
      <SecuritySection variant="strip" />
      <FinalCtaSection
        label="Get Started"
        title={
          <>
            Start with a <em>conversation.</em>
          </>
        }
        subtitle="Tell us what's breaking — attrition, structure, or clarity — and we'll point you at the right starting place. No commitment, no decks."
      />
    </div>
  )
}
