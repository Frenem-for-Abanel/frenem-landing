import type { Metadata } from "next"
import HeroShell from "../components/HeroShell"
import ContactCta from "../components/ContactCta"
import SmoothScrollLink from "../components/SmoothScrollLink"
import IntentOpener from "../components/contact/IntentOpener"
import FeatureWalkthrough from "../components/prism/FeatureWalkthrough"
import SuiteLoopSection from "../components/SuiteLoopSection"
import SecuritySection from "../components/SecuritySection"
import FinalCtaSection from "../components/FinalCtaSection"
import JsonLd from "../components/JsonLd"
import { pageMetadata } from "../utils/seo"
import { absoluteUrl, breadcrumbs, graph, ogImage, ORG_ID, webPage } from "../utils/structured-data"

const DESCRIPTION =
  "Lightweight employee management: live org charts, transparent KRAs and KPIs, review cycles, moonshot ideas, a whistleblower channel, and audit trails."

export const metadata: Metadata = pageMetadata({
  path: "/prism",
  title: "Prism by Frenem | Employee management software",
  description: DESCRIPTION,
  socialTitle: "Frenem Prism: your single source of truth",
  socialDescription:
    "Org charts, performance cycles, KPIs, and governance in a tool your team will actually use.",
})

const APP_ID = absoluteUrl("/prism#software")

const jsonLd = graph(
  webPage({ path: "/prism", name: "Frenem Prism", description: DESCRIPTION, about: APP_ID }),
  {
    "@type": "SoftwareApplication",
    "@id": APP_ID,
    name: "Frenem Prism",
    alternateName: "Prism",
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Employee management",
    operatingSystem: "Web",
    description:
      "Lightweight employee management: dynamic org charts, KRAs and KPIs, review cycles, moonshot idea submissions, a secure whistleblower channel, and audit trails.",
    image: ogImage("/prism"),
    featureList: [
      "Dynamic org charts",
      "Transparent KRAs, KPIs, and responsibilities",
      "Seamless performance review cycles",
      "Employee-driven innovation",
      "Secure whistleblower channel",
      "Edit histories and audit trails",
    ],
    url: absoluteUrl("/prism"),
    publisher: { "@id": ORG_ID },
    provider: { "@id": ORG_ID },
  },
  breadcrumbs([{ name: "Prism", path: "/prism" }])
)

export default function PrismPage() {
  return (
    <div className="tint-prism">
      <JsonLd data={jsonLd} />
      <IntentOpener />

      <HeroShell
        eyebrow="Frenem Prism, employee management"
        title={
          <>
            Your single source of <em>truth.</em>
          </>
        }
        subtitle="Lightweight employee management that gives your people clarity on who does what, how they're measured, and where they stand."
        actions={
          <>
            <ContactCta mode="default" className="w-full sm:w-auto">
              Get started
            </ContactCta>
            <SmoothScrollLink targetId="features">See what Prism does</SmoothScrollLink>
          </>
        }
        note="Org charts, KRAs, reviews, and audit trails, in one place."
        scene="prism"
      />

      <FeatureWalkthrough />
      <SuiteLoopSection
        current="prism"
        label="Works with Pulse and Build"
        heading={
          <>
            Designed once. Kept true. <em>Checked against reality.</em>
          </>
        }
      />
      <SecuritySection variant="strip" />
      <FinalCtaSection
        label="Get started with Prism"
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
