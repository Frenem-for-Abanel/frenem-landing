"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import ScrollReveal from "./ScrollReveal"
import { smoothScrollTo } from "../utils/smooth-scroll"

const products = [
  {
    id: 1,
    title: "FRENEM BUILD",
    description: "Top-tier consulting without traditional costs",
    imageUrl: "/placeholder.svg?height=600&width=800",
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
    title: "FRENEM PRISM",
    description: "Your Single Source of Truth",
    imageUrl: "/placeholder.svg?height=800&width=600",
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
    title: "FRENEM PULSE",
    description: "Deep Employee Insights, Delivered Precisely",
    imageUrl: "/placeholder.svg?height=600&width=800",
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
  const [filter, setFilter] = useState("All")
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -50])
  const filteredProducts = filter === "All" ? products : products.filter((product) => product.category === filter)

  const handleLearnMoreClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    smoothScrollTo("contact")
  }

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

        <ScrollReveal delay={0.2}>
          <div className="flex justify-center space-x-4 mb-8">
            <button
              onClick={() => setFilter("All")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === "All" ? "bg-[#1e0e62] text-white" : "bg-gray-100 text-[#1e0e62] hover:bg-gray-200"
              }`}
            >
              All
            </button>
            {products.map((product) => (
              <button
                key={product.category}
                onClick={() => setFilter(product.category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === product.category
                    ? "bg-[#1e0e62] text-white"
                    : "bg-gray-100 text-[#1e0e62] hover:bg-gray-200"
                }`}
              >
                {product.category}
              </button>
            ))}
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
                  className="bg-white rounded-3xl shadow-lg overflow-hidden hover-lift transition-all duration-300 ease-in-out border-2 border-transparent hover:border-[#1e0e62]/10"
                >
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={product.imageUrl || "/placeholder.svg"}
                      alt={product.title}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-300 ease-in-out group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-semibold text-[#1e0e62] mb-2">{product.title}</h3>
                    <p className="text-lg font-medium text-[#1e0e62] mb-4">{product.description}</p>
                    <ul className="space-y-2 mb-6">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-[#1e0e62] mr-2">•</span>
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <a
                      href="#contact"
                      onClick={handleLearnMoreClick}
                      className="text-[#1e0e62] hover:underline inline-flex items-center"
                    >
                      Learn More
                      <svg
                        className="w-4 h-4 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </a>
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

