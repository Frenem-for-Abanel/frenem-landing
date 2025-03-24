"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useAnimation, useMotionValue, useScroll, useTransform } from "framer-motion"
import ScrollReveal from "./ScrollReveal"

const features = [
  {
    title: "Proven Methodologies",
    description: "Distilled from decades of high-calibre consulting experience",
    icon: "✓",
  },
  {
    title: "Technology-Enhanced",
    description: "Processes that remove redundancy and inefficiency",
    icon: "⚙️",
  },
  {
    title: "Advanced Vector Databases",
    description: "Leverage extensive experience for maximum quality",
    icon: "🔍",
  },
  {
    title: "Rapid Deployment",
    description: "Measurable results without unnecessary complexity",
    icon: "⚡",
  },
]

export default function FeatureCarousel() {
  const [width, setWidth] = useState(0)
  const sectionRef = useRef<HTMLDivElement>(null)
  const carousel = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const controls = useAnimation()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -50])
  const cardsY = useTransform(scrollYProgress, [0.1, 0.6], [50, 0])
  const cardsOpacity = useTransform(scrollYProgress, [0.1, 0.5], [0, 1])

  useEffect(() => {
    if (carousel.current) {
      setWidth(carousel.current.scrollWidth - carousel.current.offsetWidth)
    }
  }, [])

  const handleDragEnd = () => {
    const currentX = x.get()
    if (currentX > 0) {
      controls.start({ x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } })
    } else if (currentX < -width) {
      controls.start({ x: -width, transition: { type: "spring", stiffness: 300, damping: 30 } })
    }
  }

  return (
    <div ref={sectionRef} className="py-20 bg-white relative overflow-hidden">
      <motion.div
        className="absolute inset-0 w-full h-full bg-gradient-to-b from-white via-gray-50 to-white z-0"
        style={{ y: backgroundY }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal>
          <h2 className="text-3xl font-bold text-center mb-12 text-[#1e0e62]">Why Choose FRENEM?</h2>
        </ScrollReveal>

        <motion.div ref={carousel} className="cursor-grab overflow-hidden" style={{ opacity: cardsOpacity, y: cardsY }}>
          <motion.div
            drag="x"
            dragConstraints={{ right: 0, left: -width }}
            whileTap={{ cursor: "grabbing" }}
            animate={controls}
            style={{ x }}
            onDragEnd={handleDragEnd}
            className="flex"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="min-w-[300px] h-[400px] p-8 m-4 bg-white rounded-3xl shadow-lg flex flex-col justify-between hover-lift transition-all duration-300 ease-in-out border-2 border-transparent hover:border-[#1e0e62]/10"
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
              >
                <div>
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2 text-[#1e0e62]">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
                <div className="mt-4">
                  <p className="text-[#1e0e62]">Join us in reshaping how organisations evolve.</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

