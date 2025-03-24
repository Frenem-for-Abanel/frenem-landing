"use client"

import type React from "react"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import ScrollReveal from "./ScrollReveal"
import { smoothScrollTo } from "../utils/smooth-scroll"

export default function WearYourStory() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -50])

  const handleDiscoverClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    smoothScrollTo("products")
  }

  return (
    <section ref={ref} className="bg-white py-20 overflow-hidden">
      <motion.div
        className="absolute inset-0 w-full h-full bg-gradient-to-b from-white via-white to-gray-50 z-0"
        style={{ y: backgroundY }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <ScrollReveal>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#1e0e62] mb-4">Consulting Reimagined</h2>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <p className="text-xl md:text-2xl text-[#1e0e62] mb-6 max-w-3xl mx-auto">
              Software and Consulting Converging for Exceptional Outcomes
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.4}>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
              At FRENEM, we combine cutting-edge software with proven consulting methodologies to deliver exceptional
              outcomes for your organization. Our solutions are designed to provide clarity, insights, and actionable
              recommendations at a fraction of traditional consulting costs.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.6}>
            <div className="mt-10">
              <a
                href="#products"
                onClick={handleDiscoverClick}
                className="px-8 py-4 rounded-full bg-[#1e0e62] text-white font-semibold text-lg hover:bg-opacity-90 transition-all"
              >
                Discover Our Solutions
                <svg
                  className="w-5 h-5 ml-2 inline"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}

