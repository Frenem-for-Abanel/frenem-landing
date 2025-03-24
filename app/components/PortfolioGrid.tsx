"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import ScrollReveal from "./ScrollReveal"

const products = [
  {
    id: 1,
    title: "Build",
    description: "Top-tier consulting without traditional costs",
    category: "Build",
    features: [
      "Job Descriptions and Job Families",
      "Job Grading and Banding",
      "Organisation Diagnostics and Insights",
      "Performance Management Systems",
      "Clear Roadmaps for Organisational Improvement",
    ],
  },
  {
    id: 2,
    title: "Prism",
    description: "Your Single Source of Truth",
    category: "Prism",
    features: [
      "Dynamic Org Charts and Reporting Chains",
      "Transparent KRAs, KPIs, and Role Responsibilities",
      "Seamless Performance Review Cycles (Goal Setting to Reviews)",
      "Employee-driven Innovation via Moonshot Idea Submissions",
      "Secure and Anonymous Whistleblower Channel",
      "Integrated Edit Histories and Audit Trails",
    ],
  },
  {
    id: 3,
    title: "Pulse",
    description: "Deep Employee Insights, Delivered Precisely",
    category: "Pulse",
    features: [
      "Comprehensive Competency Evaluation",
      "Actionable Behavioural Insights",
      "Clear, Data-Driven Individual Development Plans",
      "Structured Feedback from Multiple Perspectives",
      "Tailored Recommendations for Leadership Development",
    ],
  },
]

export default function PortfolioGrid() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [filter, setFilter] = useState("All")
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -50])
  const filteredProducts = filter === "All" ? products : products.filter((product) => product.category === filter)

  return (
    <section id="products" ref={ref} className="py-20 bg-white relative overflow-hidden">
      <motion.div
        className="absolute inset-0 w-full h-full bg-gradient-to-b from-gray-50 to-white z-0"
        style={{ y: backgroundY }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1e0e62] sm:text-4xl">Our Solutions</h2>
            <p className="mt-4 text-lg text-gray-600">Comprehensive consulting solutions powered by technology</p>
          </div>
        </ScrollReveal>

        <motion.div layout className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredProducts.map((product, index) => (
              <ScrollReveal key={product.id} delay={0.1 * (index + 3)}>
                <motion.div
                  id={product.category.toLowerCase()}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-3xl shadow-lg overflow-hidden hover-lift transition-all duration-300 ease-in-out border-2 border-transparent hover:border-[#1e0e62]/10 h-[460px] flex"
                >
                  <div className="p-6 h-full flex-grow flex flex-col">
                    <h3 className="text-2xl font-medium mb-2">
                      <span className="font-['League_Spartan'] font-black tracking-[-0.05em]">frenem</span>{" "}
                      <span className="text-gray-500">{product.title.toLowerCase()}</span>
                    </h3>
                    <p className="text-lg font-medium text-[#1e0e62] mb-4">{product.description}</p>
                    <ul className="space-y-2 mb-6 flex-grow">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-[#1e0e62] mr-2">•</span>
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}

