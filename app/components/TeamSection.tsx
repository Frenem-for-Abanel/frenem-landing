"use client"

import Reveal from "./Reveal"

const alumniTags = [
  "Goldman Sachs",
  "Cisco",
  "Times Internet",
  "Godrej & Boyce",
  "Novell Software",
]

const educationTags = [
  "XLRI Jamshedpur",
  "IISc Bangalore",
  "IIIT Hyderabad",
  "RVCE Bangalore",
  "St. Stephen's College, Delhi",
]

export default function TeamSection() {
  return (
    <section className="py-[120px] bg-[#edeae4]">
      <div className="container-v2">
        <Reveal>
          <div className="font-sans text-sm font-medium tracking-[2.5px] uppercase text-[#b8860b] mb-5">
            Who Built This
          </div>
        </Reveal>
        <Reveal delay={0.04}>
          <h2 className="font-serif text-[clamp(36px,5vw,56px)] font-normal leading-[1.12] tracking-[-1px] mb-10 text-[#1a1a18]">
            100+ years of consulting and HR experience. Built into the product.
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="font-serif text-[22px] text-[#6b6860] leading-[1.7] mb-14">
            Frenem isn&apos;t a tool built by engineers guessing what organisations need. It&apos;s built by people
            who&apos;ve done this work, in the room, for decades.
          </p>
        </Reveal>
        <Reveal delay={0.12}>
          <div className="mb-8">
            <div className="font-sans text-[11px] font-medium tracking-[2px] uppercase text-[#9b978f] mb-4">
              Team alumni from
            </div>
            <div className="flex flex-wrap gap-2.5">
              {alumniTags.map((tag) => (
                <span
                  key={tag}
                  className="font-sans text-sm font-normal text-[#6b6860] bg-white border border-[rgba(26,26,24,0.08)] px-4 py-2 rounded-[980px] whitespace-nowrap"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.16}>
          <div className="mb-8">
            <div className="font-sans text-[11px] font-medium tracking-[2px] uppercase text-[#9b978f] mb-4">
              Educated at
            </div>
            <div className="flex flex-wrap gap-2.5">
              {educationTags.map((tag) => (
                <span
                  key={tag}
                  className="font-sans text-sm font-normal text-[#6b6860] bg-white border border-[rgba(26,26,24,0.08)] px-4 py-2 rounded-[980px] whitespace-nowrap"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="font-serif text-[19px] text-[#6b6860] leading-[1.6] mt-2">
            The playbooks we&apos;ve used across <strong className="font-normal text-[#1a1a18]">hundreds of engagements</strong> are now embedded directly in the platform. You get the thinking without the billing.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
