import type { Metadata } from "next"
import HeroShell from "../components/HeroShell"
import ContactCta from "../components/ContactCta"
import SmoothScrollLink from "../components/SmoothScrollLink"
import IntentOpener from "../components/contact/IntentOpener"
import FeatureWalkthrough from "../components/prism/FeatureWalkthrough"
import SuiteLoopSection from "../components/SuiteLoopSection"
import SecuritySection from "../components/SecuritySection"
import FinalCtaSection from "../components/FinalCtaSection"
import FaqSection from "../components/FaqSection"
import MobileCtaBar from "../components/MobileCtaBar"
import { PRISM_FAQS } from "../utils/faqs"
import JsonLd from "../components/JsonLd"
import { pageMetadata } from "../utils/seo"
import { absoluteUrl, breadcrumbs, faq, graph, ogImage, ORG_ID, webPage } from "../utils/structured-data"

const DESCRIPTION =
  "The organisation, kept current: live org charts, who owns what, how it's measured, governance, and a full audit trail."

export const metadata: Metadata = pageMetadata({
  path: "/prism",
  title: "Prism by Frenem | Live org chart and accountability software",
  description: DESCRIPTION,
  socialTitle: "Frenem Prism: the organisation, kept current",
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
    applicationSubCategory: "Organisation operations",
    operatingSystem: "Web",
    description:
      "The organisation, kept current: dynamic org charts, ownership, measurement, review cycles, and a full audit trail.",
    image: ogImage("/prism"),
    featureList: [
      "Dynamic org charts",
      "Transparent KRAs, KPIs, and responsibilities",
      "Goals and reviews, on one cycle",
      "Ideas from every level",
      "Secure whistleblower channel",
      "Edit histories and audit trails",
    ],
    url: absoluteUrl("/prism"),
    publisher: { "@id": ORG_ID },
    provider: { "@id": ORG_ID },
  },
  breadcrumbs([{ name: "Prism", path: "/prism" }]),
  faq("/prism", PRISM_FAQS)
)

export default function PrismPage() {
  return (
    <div className="tint-prism">
      <JsonLd data={jsonLd} />
      <IntentOpener />

      <HeroShell
        crumbs={[{ name: "Prism, the operating record", path: "/prism" }]}
        title={
          <>
            The organisation, <em>kept current.</em>
          </>
        }
        subtitle="Live org charts, who owns what, how it's measured, and governance, with a full audit trail. One place for where the organisation stands."
        actions={
          <>
            <ContactCta mode="default" className="w-full sm:w-auto">
              Talk to us about Prism
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
        heading={
          <>
            Designed once. Kept true. <em>Checked against reality.</em>
          </>
        }
      />
      <SecuritySection variant="strip" />
      <FaqSection
        heading={
          <>
            Asked about <em>Prism.</em>
          </>
        }
        items={PRISM_FAQS}
      />
      <MobileCtaBar mode="default" label="Talk to us" summary="Prism · operating record" />
      <FinalCtaSection
        buttonText="Talk to us about Prism"
        title={
          <>
            One place for your organisation. <em>Always current.</em>
          </>
        }
        subtitle="Org charts, performance cycles, KPIs, and governance. In a tool your team will actually use."
      />
    </div>
  )
}
