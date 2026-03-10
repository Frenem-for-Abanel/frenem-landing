"use client"

import { useProduct } from "./context/ProductContext"
import HeroBuild from "./components/HeroBuild"
import ProblemSection from "./components/ProblemSection"
import TransformationSection from "./components/TransformationSection"
import CapitalReadySection from "./components/CapitalReadySection"
import HowItWorksSection from "./components/HowItWorksSection"
import PositioningSection from "./components/PositioningSection"
import TeamSection from "./components/TeamSection"
import FinalCtaSection from "./components/FinalCtaSection"
import SubHero from "./components/SubHero"
import FeatureListSection from "./components/FeatureListSection"

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
    description:
      "A safe, anonymous channel for raising concerns. Built in, not bolted on.",
  },
  {
    num: "06",
    title: "Edit Histories and Audit Trails",
    description:
      "Every change tracked. Full transparency for governance, compliance, and peace of mind.",
  },
]

const pulseFeatures = [
  {
    num: "01",
    title: "Comprehensive Competency Evaluation",
    description:
      "Assess the competencies that actually matter for each role. Not generic checklists, but evaluations built around your organisation's needs.",
  },
  {
    num: "02",
    title: "Actionable Behavioural Insights",
    description:
      "Go beyond scores. Understand the behavioural patterns that drive performance, and the ones that hold it back.",
  },
  {
    num: "03",
    title: "Data-Driven Development Plans",
    description:
      "Clear, individual development plans generated from real feedback data. Not templated advice.",
  },
  {
    num: "04",
    title: "Structured Multi-Perspective Feedback",
    description:
      "Peers, managers, direct reports, and stakeholders. Feedback gathered from every angle, organised for clarity.",
  },
  {
    num: "05",
    title: "Tailored Leadership Recommendations",
    description:
      "Personalised recommendations for leadership development based on where each individual stands today and where they need to go.",
  },
]

export default function Home() {
  const { activeProduct } = useProduct()

  return (
    <div className="pt-[52px]">
      {activeProduct === "build" && (
        <>
          <HeroBuild />
          <ProblemSection />
          <TransformationSection />
          <CapitalReadySection />
          <HowItWorksSection />
          <PositioningSection />
          <TeamSection />
          <FinalCtaSection
            title={
              <>
                Design the organisation your strategy <em className="italic text-[#d4a843]">needs</em>
              </>
            }
            subtitle="Structure, governance, roles, and talent, aligned to growth. One sprint. No consultant theatre."
          />
        </>
      )}

      {activeProduct === "prism" && (
        <>
          <SubHero
            label="Frenem Prism"
            title={
              <>
                Your single source of <em className="italic text-[#b8860b]">truth</em>
              </>
            }
            subtitle="Lightweight employee management that gives your people clarity on who does what, how they're measured, and where they stand."
          />
          <FeatureListSection
            label="What Prism Does"
            heading="Clarity across your entire organisation"
            features={prismFeatures}
          />
          <FinalCtaSection
            label="Get Started with Prism"
            title={
              <>
                One place for your people, <em className="italic text-[#d4a843]">always current</em>
              </>
            }
            subtitle="Org charts, performance cycles, KPIs, and governance. In a tool your team will actually use."
          />
        </>
      )}

      {activeProduct === "pulse" && (
        <>
          <SubHero
            label="Frenem Pulse"
            title={
              <>
                Deep employee insights, <em className="italic text-[#b8860b]">delivered precisely</em>
              </>
            }
            subtitle="Multirater feedback that goes beyond ratings. Structured perspectives, competency evaluation, and clear development paths."
          />
          <FeatureListSection
            label="What Pulse Does"
            heading="Feedback that drives real development"
            features={pulseFeatures}
          />
          <FinalCtaSection
            label="Get Started with Pulse"
            title={
              <>
                Feedback that builds <em className="italic text-[#d4a843]">leaders</em>
              </>
            }
            subtitle="Multirater insights, competency mapping, and development plans. All in one place."
          />
        </>
      )}
    </div>
  )
}
