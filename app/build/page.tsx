import type { Metadata } from "next"
import HeroShell from "../components/HeroShell"
import ContactCta from "../components/ContactCta"
import SmoothScrollLink from "../components/SmoothScrollLink"
import IntentOpener from "../components/contact/IntentOpener"
import BuildOrgVisual from "../components/build/BuildOrgVisual"
import ProblemSection from "../components/build/ProblemSection"
import TransformationSection from "../components/build/TransformationSection"
import DeliverablesSection from "../components/build/DeliverablesSection"
import CapitalReadySection from "../components/build/CapitalReadySection"
import PositioningSection from "../components/build/PositioningSection"
import TimelineSection from "../components/TimelineSection"
import TeamSection from "../components/TeamSection"
import SecuritySection from "../components/SecuritySection"
import FaqSection from "../components/FaqSection"
import FinalCtaSection from "../components/FinalCtaSection"
import { SITE_URL } from "../utils/site"

export const metadata: Metadata = {
  title: "Build — Organisation Design Sprint",
  description:
    "An 8-week organisation-design sprint for founder-led companies: decision rights, job architecture, governance, and succession — a live operating system, not a slide deck.",
  alternates: { canonical: "/build" },
  openGraph: {
    title: "Frenem Build — Organisation Design Sprint",
    description:
      "Build an organisation that scales beyond you. Structure, governance, roles, and talent, aligned to growth in one 8-week sprint.",
    url: "/build",
  },
}

const BUILD_SHADER_COLORS = {
  bg: "#fffbeb",
  bg2: "#fef3c7",
  accent: "#ffffff",
  accent2: "#d97706",
  highlight: "#fde68a",
} as const

const phases = [
  {
    label: "Phase 01",
    title: "Diagnose",
    description:
      "Understand the baseline. People maturity, employee data, employee voice, and how decisions actually flow today. Build the foundation everything else sits on.",
    time: "Weeks 1–2",
  },
  {
    label: "Phase 02",
    title: "Design",
    description:
      "Build the architecture. The grade structure, role catalog, org map, job descriptions, and decision rights. Turn complexity into a simple organisation that executes.",
    time: "Weeks 3–5",
  },
  {
    label: "Phase 03",
    title: "Deploy",
    description:
      "Lock in the competency framework, map talent, and deliver a validated, boardroom-ready operating model. A leadership blueprint that outlasts individuals.",
    time: "Weeks 6–8",
  },
]

const faqItems = [
  {
    question: "How much of leadership's time does the sprint take?",
    answer:
      "Diagnose runs on structured interviews and data you already have, so the load comes in short, scheduled bursts rather than weeks of workshops. We agree the sprint calendar around your operating rhythm before we start.",
  },
  {
    question: "What happens after week 8?",
    answer:
      "You're left with a validated operating model your team runs day to day — decision rights, job architecture, governance, and succession live in the organisation, not in a deck. Prism can keep the structure current from there.",
  },
  {
    question: "Will this feel like consultants rebuilding my company?",
    answer:
      "No. You define the guardrails; Build makes control explicit instead of taking it away. The whole point is professionalising without losing the company's soul.",
  },
  {
    question: "We're not raising or listing right now. Is this still relevant?",
    answer:
      "Capital-readiness is a by-product, not the premise. The core outcome is founder-independent execution — decisions happening at the right level without routing through you — which pays off long before any transaction.",
  },
]

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Frenem Build",
  serviceType: "Organisation design sprint",
  provider: { "@type": "Organization", name: "Frenem", url: SITE_URL },
  description:
    "An 8-week organisation-design sprint: decision rights, grade structure, job architecture, governance guardrails, and a 9-box succession map.",
  url: `${SITE_URL}/build`,
}

export default function BuildPage() {
  return (
    <div className="tint-build">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <IntentOpener />

      <HeroShell
        eyebrow="Frenem Build · Organisation Design"
        title={
          <>
            Build an organisation that scales <em>beyond you.</em>
          </>
        }
        subtitle="Clarity in roles, decisions, and leadership. Without losing control. In weeks, not months."
        colors={BUILD_SHADER_COLORS}
        tall
        actions={
          <>
            <ContactCta mode="assessment" className="w-full sm:w-auto">
              Get started →
            </ContactCta>
            <ContactCta mode="contact" variant="text" className="justify-center self-center sm:self-auto">
              Just get in touch
            </ContactCta>
            <SmoothScrollLink targetId="how-build">See how</SmoothScrollLink>
          </>
        }
        visual={<BuildOrgVisual />}
      />

      <ProblemSection />
      <TransformationSection />
      <DeliverablesSection />
      <TimelineSection
        id="how-build"
        heading={
          <>
            Fit. Flat. Fast. <em>Ready for scale.</em>
          </>
        }
        sub="A structured sprint. Not a meandering engagement. You get a working operating system, not a binder."
        phases={phases}
        tintHex="#d97706"
        soft
      />
      <CapitalReadySection />
      <PositioningSection />
      <TeamSection soft={false} />
      <SecuritySection />
      <FaqSection
        heading={
          <>
            Asked before every <em>sprint.</em>
          </>
        }
        items={faqItems}
      />
      <FinalCtaSection
        label="Get Started with Build"
        modalMode="assessment"
        buttonText="Get started →"
        secondaryButtonText="Just get in touch"
        secondaryModalMode="contact"
        title={
          <>
            Design the organisation your strategy <em>needs.</em>
          </>
        }
        subtitle="Structure, governance, roles, and talent. Aligned to growth. One sprint. No consultant theatre."
      />
    </div>
  )
}
