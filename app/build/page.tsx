import type { Metadata } from "next"
import HeroShell from "../components/HeroShell"
import ContactCta from "../components/ContactCta"
import SmoothScrollLink from "../components/SmoothScrollLink"
import IntentOpener from "../components/contact/IntentOpener"
import PlanBuilder from "../components/build/PlanBuilder"
import DeliverablesSection from "../components/build/DeliverablesSection"
import CapitalReadySection from "../components/build/CapitalReadySection"
import PositioningSection from "../components/build/PositioningSection"
import TimelineSection from "../components/TimelineSection"
import TeamSection from "../components/TeamSection"
import SecuritySection from "../components/SecuritySection"
import FaqSection from "../components/FaqSection"
import SuiteLoopSection from "../components/SuiteLoopSection"
import FinalCtaSection from "../components/FinalCtaSection"
import { BUILD_PHASES, PHASE_VIEWBOX } from "../utils/compositions"
import JsonLd from "../components/JsonLd"
import { pageMetadata } from "../utils/seo"
import { BUILD_FAQS } from "../utils/faqs"
import { absoluteUrl, breadcrumbs, faq, graph, ORG_ID, webPage } from "../utils/structured-data"

const DESCRIPTION =
  "Organisation design for founder-led businesses: faster decisions, clear ownership, and leaders who run the business. The whole of Build, or only the parts you need."

export const metadata: Metadata = pageMetadata({
  path: "/build",
  title: "Build by Frenem | Organisation design for founder-led companies",
  description: DESCRIPTION,
  socialTitle: "Frenem Build: an organisation that scales beyond you",
  socialDescription:
    "Build an organisation that scales beyond you. Faster decisions, clear ownership, and leaders who run the business.",
})

const phases = [
  {
    label: "Phase 01",
    title: "Diagnose",
    description:
      "We learn how your business actually runs today: where decisions stall, where work doubles up, and where the risk sits.",
  },
  {
    label: "Phase 02",
    title: "Design",
    description:
      "We shape the organisation your strategy needs, with you: who decides, who owns what, and how work moves.",
  },
  {
    label: "Phase 03",
    title: "Deploy",
    description:
      "We put it to work and leave it running in your business, built to outlast any one person.",
  },
]

const SERVICE_ID = absoluteUrl("/build#service")

const OUTCOMES = [
  "Decisions at the right level",
  "One owner for every outcome",
  "A leaner way of working",
  "Control, built in",
  "A bench ready to lead",
  "An investor-grade operating model",
]

const jsonLd = graph(
  webPage({ path: "/build", name: "Frenem Build", description: DESCRIPTION, about: SERVICE_ID }),
  {
    "@type": "Service",
    "@id": SERVICE_ID,
    name: "Frenem Build",
    alternateName: "Build",
    serviceType: "Organisation design",
    category: "Organisation design and governance",
    provider: { "@id": ORG_ID },
    audience: { "@type": "BusinessAudience", name: "Founders and promoters of growing businesses" },
    description:
      "Organisation design for founder-led businesses, as a complete sprint or only the parts you need: faster decisions, clear ownership, governance, and a leadership bench.",
    url: absoluteUrl("/build"),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "What you walk away with",
      itemListElement: OUTCOMES.map((name) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name } })),
    },
  },
  breadcrumbs([{ name: "Build", path: "/build" }]),
  faq("/build", BUILD_FAQS)
)

export default function BuildPage() {
  return (
    <div className="tint-build">
      <JsonLd data={jsonLd} />
      <IntentOpener />

      <HeroShell
        crumbs={[{ name: "Build", path: "/build" }]}
        eyebrow="Frenem Build, organisation design"
        title={
          <>
            Build an organisation that scales <em>beyond you.</em>
          </>
        }
        subtitle="Faster decisions, clear ownership, and leaders who can run the business. Without losing control."
        actions={
          <>
            <SmoothScrollLink targetId="plan" variant="primary" className="w-full sm:w-auto">
              Build my plan
            </SmoothScrollLink>
            <ContactCta mode="contact" variant="text" className="justify-center sm:justify-start">
              Just get in touch
            </ContactCta>
          </>
        }
        note="The whole of Build, or only the parts you need."
        scene="build"
      />

      <PlanBuilder />
      <DeliverablesSection />
      <TimelineSection
        id="how-build"
        heading={
          <>
            Fit. Flat. Fast. <em>Ready for scale.</em>
          </>
        }
        sub="A structured sprint, not a meandering engagement. You get a working operating system, not a binder."
        phases={phases}
        layouts={BUILD_PHASES}
        viewBox={PHASE_VIEWBOX}
      />
      <CapitalReadySection />
      <PositioningSection />
      <TeamSection
        label="Who you'd work with"
        title={
          <>
            A combined <em>100+ years</em> of consulting.
          </>
        }
      />
      <SecuritySection />
      <FaqSection
        heading={
          <>
            Asked before every <em>sprint.</em>
          </>
        }
        items={BUILD_FAQS}
      />
      <SuiteLoopSection
        current="build"
        label="Works with Pulse and Prism"
        heading={
          <>
            Three products. One <em>operating picture.</em>
          </>
        }
      />
      <FinalCtaSection
        label="Get started with Build"
        modalMode="assessment"
        buttonText="Get started"
        secondaryButtonText="Just get in touch"
        secondaryModalMode="contact"
        title={
          <>
            Design the organisation your strategy <em>needs.</em>
          </>
        }
        subtitle="Decisions, ownership, governance, and leadership. Aligned to growth. No consultant theatre."
      />
    </div>
  )
}
