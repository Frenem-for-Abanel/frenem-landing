import type { Metadata } from "next"
import HeroShell from "../components/HeroShell"
import ContactCta from "../components/ContactCta"
import IntentOpener from "../components/contact/IntentOpener"
import PrismProductVisual from "../components/prism/PrismProductVisual"
import FeatureWalkthrough from "../components/prism/FeatureWalkthrough"
import SuiteLoopSection from "../components/SuiteLoopSection"
import SecuritySection from "../components/SecuritySection"
import FinalCtaSection from "../components/FinalCtaSection"
import { SITE_URL } from "../utils/site"

export const metadata: Metadata = {
  title: "Prism · Employee Management",
  description:
    "Lightweight employee management: live org charts, transparent KRAs and KPIs, performance review cycles, moonshot ideas, a whistleblower channel, and full audit trails.",
  alternates: { canonical: "/prism" },
  openGraph: {
    title: "Frenem Prism · Employee Management",
    description:
      "Your single source of truth: org charts, performance cycles, KPIs, and governance in a tool your team will actually use.",
    url: "/prism",
  },
}

const PRISM_SHADER_COLORS = {
  bg: "#f0f9ff",
  bg2: "#e0f2fe",
  accent: "#ffffff",
  accent2: "#0284c7",
  highlight: "#bae6fd",
} as const

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Frenem Prism",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "Lightweight employee management: dynamic org charts, KRAs and KPIs, review cycles, moonshot idea submissions, a secure whistleblower channel, and audit trails.",
  url: `${SITE_URL}/prism`,
  publisher: { "@type": "Organization", name: "Frenem", url: SITE_URL },
}

export default function PrismPage() {
  return (
    <div className="tint-prism">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }}
      />
      <IntentOpener />

      <HeroShell
        eyebrow="Frenem Prism · Employee Management"
        title={
          <>
            Your single source of <em>truth.</em>
          </>
        }
        subtitle="Lightweight employee management that gives your people clarity on who does what, how they're measured, and where they stand."
        colors={PRISM_SHADER_COLORS}
        tall
        actions={
          <>
            <ContactCta mode="default" className="w-full sm:w-auto">
              Get started →
            </ContactCta>
          </>
        }
        visual={<PrismProductVisual />}
      />

      <FeatureWalkthrough />
      <SuiteLoopSection
        current="prism"
        label="Works With Pulse and Build"
        heading={
          <>
            Designed once. Kept true. <em>Checked against reality.</em>
          </>
        }
      />
      <SecuritySection variant="strip" />
      <FinalCtaSection
        label="Get Started with Prism"
        title={
          <>
            One place for your people. <em>Always current.</em>
          </>
        }
        subtitle="Org charts, performance cycles, KPIs, and governance. In a tool your team will actually use."
      />
    </div>
  )
}
