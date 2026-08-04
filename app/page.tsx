"use client"

import { useProduct } from "./context/ProductContext"
import HeroBuild from "./components/HeroBuild"
import ProblemSection from "./components/ProblemSection"
import TransformationSection from "./components/TransformationSection"
import CapitalReadySection from "./components/CapitalReadySection"
import HowItWorksSection from "./components/HowItWorksSection"
import PositioningSection from "./components/PositioningSection"
import TeamSection from "./components/TeamSection"
import SecuritySection from "./components/SecuritySection"
import FinalCtaSection from "./components/FinalCtaSection"
import SubHero from "./components/SubHero"
import FeatureListSection from "./components/FeatureListSection"
import PrismHeroVisual from "./components/PrismHeroVisual"
import PulseHeroVisual from "./components/PulseHeroVisual"
import PulseLensesSection from "./components/PulseLensesSection"
import PulseMethodSection from "./components/PulseMethodSection"
import PulseReportsSection from "./components/PulseReportsSection"
import PulsePrivacySection from "./components/PulsePrivacySection"

const prismFeatures = [
  {
    num: "01",
    title: "Dynamic Org Charts",
    description:
      "Live org charts and reporting chains that update as your team grows. Always current, always visible.",
  },
  {
    num: "02",
    title: "Transparent KRAs, KPIs, and Responsibilities",
    description:
      "Everyone knows what they own, what they're measured on, and what success looks like in their role.",
  },
  {
    num: "03",
    title: "Seamless Performance Review Cycles",
    description:
      "From goal setting through to reviews. A complete, continuous cycle that doesn't live in spreadsheets.",
  },
  {
    num: "04",
    title: "Employee-driven Innovation",
    description:
      "Moonshot idea submissions that give every person in the company a voice in shaping what comes next.",
  },
  {
    num: "05",
    title: "Secure Whistleblower Channel",
    description: "A safe, anonymous channel for raising concerns. Built in, not bolted on.",
  },
  {
    num: "06",
    title: "Edit Histories and Audit Trails",
    description: "Every change tracked. Full transparency for governance, compliance, and peace of mind.",
  },
]

const pulseFeatures = [
  {
    num: "01",
    title: "Exit risk, visible early",
    description:
      "Strain, silence, and isolation rarely appear alone. Pulse cross-references them to flag likely departures while there is still time to act.",
  },
  {
    num: "02",
    title: "Hidden brokers, surfaced",
    description:
      "The people quietly holding your network together, trusted across teams, absent from every succession plan. Pulse names the single points of failure.",
  },
  {
    num: "03",
    title: "The manager effect, isolated",
    description:
      "When a team struggles, Pulse separates the workload from the manager. So you fix the actual problem, not the visible one.",
  },
  {
    num: "04",
    title: "Cross-functional friction, mapped",
    description:
      "Where collaboration between departments creates energy, and where it drains it. Silos stop being a feeling and become a map.",
  },
  {
    num: "05",
    title: "Five minutes per person",
    description:
      "Fifteen questions, tailored by who each person actually works with. One secure link, answered on a phone. No login, no survey fatigue.",
  },
]

const PRISM_SHADER_COLORS = {
  bg: "#f0f9ff", // Pale sky blue
  bg2: "#e0f2fe", // Slightly deeper sky blue
  accent: "#ffffff", // Pure white clouds
  accent2: "#0284c7", // Deep sky blue for depth
  highlight: "#bae6fd", // Soft blue highlight
} as const

const PULSE_SHADER_COLORS = {
  bg: "#f0fdf4", // Soft mint
  bg2: "#dcfce7", // Slightly deeper mint
  accent: "#ffffff", // Pure white clouds
  accent2: "#059669", // Deep emerald for depth
  highlight: "#bbf7d0", // Soft green highlight
} as const

const emAccent = "italic font-normal text-[var(--frenem-accent)]"

export default function Home() {
  const { activeProduct } = useProduct()

  return (
    <div>
      {activeProduct === "build" && (
        <>
          <HeroBuild />
          <ProblemSection />
          <TransformationSection />
          <CapitalReadySection />
          <HowItWorksSection />
          <PositioningSection />
          <TeamSection />
          <SecuritySection />
          <FinalCtaSection
            sectionName="Contact"
            sectionNum="09"
            modalMode="assessment"
            title={
              <>
                Design the organisation your strategy <em className={emAccent}>needs.</em>
              </>
            }
            subtitle="Structure, governance, roles, and talent. Aligned to growth. One sprint. No consultant theatre."
          />
        </>
      )}

      {activeProduct === "prism" && (
        <>
          <SubHero
            label="Frenem Prism · Employee Management"
            title={
              <>
                Your single source of <em className={emAccent}>truth.</em>
              </>
            }
            subtitle="Lightweight employee management that gives your people clarity on who does what, how they're measured, and where they stand."
            ctaText="Get started →"
            visual={<PrismHeroVisual />}
            shaderColors={PRISM_SHADER_COLORS}
          />
          <FeatureListSection
            label="What Prism Does"
            heading={
              <>
                Clarity across your <em className={emAccent}>entire</em> organisation.
              </>
            }
            features={prismFeatures}
          />
          <FinalCtaSection
            label="Get Started with Prism"
            sectionName="Contact"
            sectionNum="03"
            title={
              <>
                One place for your people. <em className={emAccent}>Always current.</em>
              </>
            }
            subtitle="Org charts, performance cycles, KPIs, and governance. In a tool your team will actually use."
          />
        </>
      )}

      {activeProduct === "pulse" && (
        <>
          <SubHero
            label="Frenem Pulse · Relational Diagnostics"
            title={
              <>
                See how your people <em className={emAccent}>actually work together.</em>
              </>
            }
            subtitle="Engagement surveys measure how people feel. Pulse measures how they work together: the friction, energy, and hidden connections between the people doing the work."
            ctaText="Get started →"
            secondaryHref="how-pulse"
            secondaryText="See how"
            visual={<PulseHeroVisual />}
            shaderColors={PULSE_SHADER_COLORS}
          />
          <PulseLensesSection />
          <FeatureListSection
            label="What Pulse Does"
            heading={
              <>
                The signals standard tools <em className={emAccent}>can&apos;t see.</em>
              </>
            }
            features={pulseFeatures}
            sectionNum="03"
          />
          <PulseMethodSection />
          <PulseReportsSection />
          <PulsePrivacySection />
          <FinalCtaSection
            label="Get Started with Pulse"
            sectionName="Contact"
            sectionNum="07"
            title={
              <>
                See your organisation as it <em className={emAccent}>really works.</em>
              </>
            }
            subtitle="One link, one short pulse, three report cuts. Friction, energy, and risk, visible while you can still act on them."
          />
        </>
      )}
    </div>
  )
}
