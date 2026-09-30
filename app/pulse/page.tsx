import type { Metadata } from "next"
import HeroShell from "../components/HeroShell"
import ContactCta from "../components/ContactCta"
import IntentOpener from "../components/contact/IntentOpener"
import LensesSection from "../components/pulse/LensesSection"
import SignalsSection from "../components/pulse/SignalsSection"
import ComparisonSection from "../components/pulse/ComparisonSection"
import ReportsSection from "../components/pulse/ReportsSection"
import PrivacySection from "../components/pulse/PrivacySection"
import TimelineSection from "../components/TimelineSection"
import FaqSection from "../components/FaqSection"
import FinalCtaSection from "../components/FinalCtaSection"
import { PHASE_VIEWBOX, PULSE_PHASES } from "../utils/compositions"
import JsonLd from "../components/JsonLd"
import { pageMetadata } from "../utils/seo"
import { absoluteUrl, breadcrumbs, faq, graph, ORG_ID, webPage } from "../utils/structured-data"

const DESCRIPTION =
  "Engagement surveys measure how people feel. Pulse measures how they work together: exit risk, hidden brokers, and friction, visible while you can still act."

export const metadata: Metadata = pageMetadata({
  path: "/pulse",
  title: "Pulse by Frenem | Relational diagnostics & network analysis",
  description: DESCRIPTION,
  socialTitle: "Frenem Pulse: see how your people actually work together",
  socialDescription:
    "See how your people actually work together: exit risk, hidden brokers, and friction, visible while you can still act on them.",
})

const phases = [
  {
    label: "Phase 01",
    title: "Ingest",
    description:
      "One export from your HR system: reporting lines, teams, tenure. Plus a short intake on what's changing in the business.",
  },
  {
    label: "Phase 02",
    title: "Route & Collect",
    description:
      "Every person inside the boundary receives a secure link. Each pulse is tailored to who they actually work with.",
  },
  {
    label: "Phase 03",
    title: "Protect & Process",
    description:
      "The engine calculates gaps, thresholds, and confidence, and withholds anything that could identify an individual.",
  },
  {
    label: "Phase 04",
    title: "Deliver",
    description:
      "Three report cuts land: a private read for each person, a systemic view for leadership, and the relational network map.",
  },
]

const faqItems = [
  {
    question: "Can leadership see individual answers?",
    answer:
      "No. Individual reports go to the individual alone. Leadership sees patterns at team level and above, protected by response thresholds, never names.",
  },
  {
    question: "What does it ask of each person?",
    answer:
      "A focused set of questions, tailored to the people each person actually works with, answered through one secure link on any device. No login, no app, no survey fatigue.",
  },
  {
    question: "What do we need to provide?",
    answer:
      "One export from your HR system (reporting lines, teams, tenure), plus a short intake about what's changing in the business. That's the whole ask.",
  },
  {
    question: "Is there a minimum team size?",
    answer:
      "Pulse enforces response thresholds, so relationship and team views only appear when enough people take part. On the intro call we'll confirm whether your headcount and structure will produce a useful read.",
  },
  {
    question: "Is this monitoring or surveillance?",
    answer:
      "No. Pulse never reads email, calendars, or chat. Every data point is an answer someone chose to give, and the privacy rules are structural, not policy.",
  },
]

const SERVICE_ID = absoluteUrl("/pulse#service")

const jsonLd = graph(
  webPage({ path: "/pulse", name: "Frenem Pulse", description: DESCRIPTION, about: SERVICE_ID }),
  {
    "@type": "Service",
    "@id": SERVICE_ID,
    name: "Frenem Pulse",
    alternateName: "Pulse",
    serviceType: "Relational diagnostics and organisational network analysis",
    category: "Organisational diagnostics",
    provider: { "@id": ORG_ID },
    areaServed: { "@type": "Country", name: "India" },
    audience: { "@type": "BusinessAudience", name: "Leadership teams of scaling organisations" },
    description:
      "A relational diagnostic that maps how people actually work together: exit risk, hidden brokers, the manager effect, and cross-functional friction.",
    url: absoluteUrl("/pulse"),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Pulse report cuts",
      itemListElement: [
        { name: "The Individual Report", description: "A confidential personal read for every employee." },
        { name: "The Org Pulse Report", description: "A systemic, top-down read for leadership." },
        { name: "The Relational Network Map", description: "Structural silos, hidden brokers, and an isolation watchlist." },
      ].map((report) => ({ "@type": "Offer", itemOffered: { "@type": "Service", ...report } })),
    },
  },
  breadcrumbs([{ name: "Pulse", path: "/pulse" }]),
  faq("/pulse", faqItems)
)

export default function PulsePage() {
  return (
    <div className="tint-pulse">
      <JsonLd data={jsonLd} />
      <IntentOpener />

      <HeroShell
        eyebrow="Frenem Pulse, relational diagnostics"
        title={
          <>
            See how your people <em>actually work together.</em>
          </>
        }
        subtitle="Engagement surveys measure how people feel. Pulse measures how they work together: the friction, energy, and hidden connections between the people doing the work."
        actions={
          <>
            <ContactCta mode="pulseQuestionnaire" className="w-full sm:w-auto">
              Map my organisation
            </ContactCta>
            <ContactCta mode="pulseContact" variant="text" className="justify-center sm:justify-start">
              Just get in touch
            </ContactCta>
          </>
        }
        note="Three report cuts. Privacy by design. No surveillance."
        scene="pulse"
      />

      <LensesSection />
      <SignalsSection />
      <ComparisonSection />
      <TimelineSection
        id="how-pulse"
        heading={
          <>
            Ingest. Route. Protect. <em>Deliver.</em>
          </>
        }
        sub="From boundary to reports in four clear steps. Your part: one file from HR, and honest answers from your people."
        phases={phases}
        layouts={PULSE_PHASES}
        viewBox={PHASE_VIEWBOX}
      />
      <ReportsSection />
      <PrivacySection />
      <FaqSection
        heading={
          <>
            Asked before every <em>pilot.</em>
          </>
        }
        items={faqItems}
      />
      <FinalCtaSection
        label="Get started with Pulse"
        modalMode="pulseQuestionnaire"
        buttonText="Map my organisation"
        secondaryButtonText="Just get in touch"
        secondaryModalMode="pulseContact"
        title={
          <>
            See your organisation as it <em>really works.</em>
          </>
        }
        subtitle="One link, one tailored pulse, three report cuts. Friction, energy, and risk, visible while you can still act on them."
      />
    </div>
  )
}
