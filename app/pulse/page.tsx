import type { Metadata } from "next"
import HeroShell from "../components/HeroShell"
import ContactCta from "../components/ContactCta"
import SmoothScrollLink from "../components/SmoothScrollLink"
import IntentOpener from "../components/contact/IntentOpener"
import PulseNetworkVisual from "../components/pulse/PulseNetworkVisual"
import LensesSection from "../components/pulse/LensesSection"
import SignalsSection from "../components/pulse/SignalsSection"
import ComparisonSection from "../components/pulse/ComparisonSection"
import ReportsSection from "../components/pulse/ReportsSection"
import PrivacySection from "../components/pulse/PrivacySection"
import TimelineSection from "../components/TimelineSection"
import FaqSection from "../components/FaqSection"
import FinalCtaSection from "../components/FinalCtaSection"
import { SITE_URL } from "../utils/site"

export const metadata: Metadata = {
  title: "Pulse — Relational Diagnostics",
  description:
    "Engagement surveys measure how people feel. Pulse measures how they work together: exit risk, hidden brokers, and cross-team friction, visible in a four-week pilot.",
  alternates: { canonical: "/pulse" },
  openGraph: {
    title: "Frenem Pulse — Relational Diagnostics",
    description:
      "See how your people actually work together: exit risk, hidden brokers, and friction, visible while you can still act on them.",
    url: "/pulse",
  },
}

const PULSE_SHADER_COLORS = {
  bg: "#f0fdf4",
  bg2: "#dcfce7",
  accent: "#ffffff",
  accent2: "#059669",
  highlight: "#bbf7d0",
} as const

const phases = [
  {
    label: "Phase 01",
    title: "Ingest",
    description:
      "One export from your HR system: reporting lines, teams, tenure. Plus a short intake on what's changing in the business.",
    time: "Week 1",
  },
  {
    label: "Phase 02",
    title: "Route & Collect",
    description:
      "Every person inside the boundary receives a secure link. Each pulse is tailored to who they actually work with.",
    time: "Week 2",
  },
  {
    label: "Phase 03",
    title: "Protect & Process",
    description:
      "The engine calculates gaps, thresholds, and confidence, and withholds anything that could identify an individual.",
    time: "Week 3",
  },
  {
    label: "Phase 04",
    title: "Deliver",
    description:
      "Three report cuts land: private coaching guides, a systemic view for leadership, and the relational network map.",
    time: "Week 4",
  },
]

const faqItems = [
  {
    question: "Can leadership see individual answers?",
    answer:
      "No. Individual reports go to the individual alone. Leadership sees patterns at team level and above, protected by response thresholds — never names.",
  },
  {
    question: "How much time does it ask of each person?",
    answer:
      "About fifteen questions, roughly five minutes, answered on a phone through one secure link. No login, no app, no survey fatigue.",
  },
  {
    question: "What do we need to provide?",
    answer:
      "One export from your HR system — reporting lines, teams, tenure — plus a short intake about what's changing in the business. That's the whole ask.",
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

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Frenem Pulse",
  serviceType: "Relational diagnostics for organisations",
  provider: { "@type": "Organization", name: "Frenem", url: SITE_URL },
  description:
    "A four-week relational diagnostic that maps how people actually work together: exit risk, hidden brokers, manager effect, and cross-functional friction.",
  url: `${SITE_URL}/pulse`,
}

export default function PulsePage() {
  return (
    <div className="tint-pulse">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <IntentOpener />

      <HeroShell
        eyebrow="Frenem Pulse · Relational Diagnostics"
        title={
          <>
            See how your people <em>actually work together.</em>
          </>
        }
        subtitle="Engagement surveys measure how people feel. Pulse measures how they work together: the friction, energy, and hidden connections between the people doing the work."
        colors={PULSE_SHADER_COLORS}
        tall
        actions={
          <>
            <ContactCta mode="pulseQuestionnaire" className="w-full sm:w-auto">
              Get my Pulse read →
            </ContactCta>
            <ContactCta mode="pulseContact" variant="text" className="justify-center self-center sm:self-auto">
              Just get in touch
            </ContactCta>
            <SmoothScrollLink targetId="how-pulse">See how</SmoothScrollLink>
          </>
        }
        visual={<PulseNetworkVisual />}
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
        sub="A standard pilot runs four weeks, boundary to reports. Your part: one file from HR, and a few minutes from each person."
        phases={phases}
        tintHex="#0d9488"
        soft
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
        label="Get Started with Pulse"
        modalMode="pulseQuestionnaire"
        buttonText="Get my Pulse read →"
        secondaryButtonText="Just get in touch"
        secondaryModalMode="pulseContact"
        title={
          <>
            See your organisation as it <em>really works.</em>
          </>
        }
        subtitle="One link, one short pulse, three report cuts. Friction, energy, and risk, visible while you can still act on them."
      />
    </div>
  )
}
