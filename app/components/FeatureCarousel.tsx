"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useAnimation, useMotionValue, useScroll, useTransform } from "framer-motion"
import ScrollReveal from "./ScrollReveal"

const features = [
  {
    title: "Proven Methodologies",
    description: "Distilled from decades of high-calibre consulting experience",
  },
  {
    title: "Technology-Enhanced",
    description: "Processes that remove redundancy and inefficiency",
  },
  {
    title: "Advanced Vector Databases",
    description: "Leverage extensive experience for maximum quality",
  },
  {
    title: "Rapid Deployment",
    description: "Measurable results without unnecessary complexity",
  },
]

export default function FeatureCarousel() {
  const [width, setWidth] = useState(0)
  const sectionRef = useRef<HTMLDivElement>(null)
  const carousel = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const controls = useAnimation()
  const [isDragging, setIsDragging] = useState(false)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -50])
  const cardsY = useTransform(scrollYProgress, [0.1, 0.6], [50, 0])
  const cardsOpacity = useTransform(scrollYProgress, [0.1, 0.5], [0, 1])

  useEffect(() => {
    const updateWidth = () => {
      if (carousel.current) {
        setWidth(carousel.current.scrollWidth - carousel.current.offsetWidth)
      }
    }

    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [])

  const handleDragEnd = () => {
    setIsDragging(false)
    const currentX = x.get()
    if (currentX > 0) {
      controls.start({ x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } })
    } else if (currentX < -width) {
      controls.start({ x: -width, transition: { type: "spring", stiffness: 300, damping: 30 } })
    }
  }

  const handleWheel = (e: React.WheelEvent) => {
    if (carousel.current) {
      e.preventDefault()
      const currentX = x.get()
      const newX = currentX - e.deltaX
      
      // Constrain the scroll within bounds
      if (newX <= 0 && newX >= -width) {
        x.set(newX)
      } else if (newX > 0) {
        x.set(0)
      } else if (newX < -width) {
        x.set(-width)
      }
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
          <h2 className="text-3xl font-bold text-center mb-12 text-[#1e0e62]">Why choose frenem?</h2>
        </ScrollReveal>

        <motion.div 
          ref={carousel} 
          className="cursor-grab overflow-hidden -mx-4 px-4 sm:mx-0 sm:px-0" 
          style={{ opacity: cardsOpacity, y: cardsY }}
          onWheel={handleWheel}
        >
          <motion.div
            drag="x"
            dragConstraints={{ right: 0, left: -width }}
            whileTap={{ cursor: "grabbing" }}
            animate={controls}
            style={{ x }}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={handleDragEnd}
            onClick={(e) => isDragging && e.stopPropagation()}
            className="flex touch-pan-x select-none"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="min-w-[280px] sm:min-w-[320px] h-auto p-6 m-2 sm:m-4 bg-white rounded-2xl sm:rounded-3xl shadow-lg flex flex-col justify-between hover-lift transition-all duration-300 ease-in-out border-2 border-transparent hover:border-[#1e0e62]/10"
                whileHover={{ y: -5, transition: { duration: 0.3 } }}
              >
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 text-[#1e0e62] line-clamp-2">{feature.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600 line-clamp-3">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

