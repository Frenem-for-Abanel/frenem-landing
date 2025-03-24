"use client"

import type React from "react"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { smoothScrollTo } from "../utils/smooth-scroll"

export default function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1])
  const textY = useTransform(scrollYProgress, [0, 0.5], [0, -50])

  // Animation variants for the swarm effect
  const circle1Variants = {
    animate: {
      x: [0, 15, -10, 5, 0],
      y: [0, -10, 15, 5, 0],
      transition: {
        x: { repeat: Number.POSITIVE_INFINITY, duration: 20, ease: "easeInOut" },
        y: { repeat: Number.POSITIVE_INFINITY, duration: 18, ease: "easeInOut" },
      },
    },
  }

  const circle2Variants = {
    animate: {
      x: [0, -20, 10, -5, 0],
      y: [0, 15, -10, 5, 0],
      transition: {
        x: { repeat: Number.POSITIVE_INFINITY, duration: 22, ease: "easeInOut" },
        y: { repeat: Number.POSITIVE_INFINITY, duration: 19, ease: "easeInOut" },
      },
    },
  }

  const circle3Variants = {
    animate: {
      x: [0, 10, -15, 5, 0],
      y: [0, 5, -15, 10, 0],
      transition: {
        x: { repeat: Number.POSITIVE_INFINITY, duration: 24, ease: "easeInOut" },
        y: { repeat: Number.POSITIVE_INFINITY, duration: 21, ease: "easeInOut" },
      },
    },
  }

  const handleExploreClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    smoothScrollTo("products")
  }

  const handleContactClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    smoothScrollTo("contact")
  }

  return (
    <div ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* SVG Gradient Background with swarm animation */}
      <motion.div className="absolute inset-0 w-full h-full" style={{ scale, opacity }}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 640 380"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
        >
          <mask
            id="mask0"
            style={{ maskType: "alpha" }}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="640"
            height="380"
          >
            <rect width="640" height="380" fill="white" />
          </mask>
          <g mask="url(#mask0)">
            <motion.g filter="url(#filter0_f)" variants={circle1Variants} animate="animate">
              <circle cx="233.5" cy="189.5" r="60.5" fill="#FF0D6A" />
            </motion.g>
            <motion.g filter="url(#filter1_f)" variants={circle2Variants} animate="animate">
              <circle cx="310.5" cy="189.5" r="60.5" fill="#0500FF" />
            </motion.g>
            <motion.g filter="url(#filter2_f)" variants={circle3Variants} animate="animate">
              <circle cx="387.5" cy="189.5" r="60.5" fill="#00FFE0" />
            </motion.g>
          </g>
          <defs>
            <filter
              id="filter0_f"
              x="23"
              y="-21"
              width="421"
              height="421"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
              <feGaussianBlur stdDeviation="75" result="effect1_foregroundBlur" />
            </filter>
            <filter
              id="filter1_f"
              x="100"
              y="-21"
              width="421"
              height="421"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
              <feGaussianBlur stdDeviation="75" result="effect1_foregroundBlur" />
            </filter>
            <filter
              id="filter2_f"
              x="177"
              y="-21"
              width="421"
              height="421"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
              <feGaussianBlur stdDeviation="75" result="effect1_foregroundBlur" />
            </filter>
          </defs>
        </svg>
      </motion.div>

      <motion.div className="relative z-10 text-center px-6 max-w-4xl mx-auto" style={{ y: textY }}>
        <motion.h1
          className="font-['League_Spartan'] text-3xl md:text-5xl font-black tracking-[-0.05em] mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          frenem
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl text-[#1e0e62] mb-12 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          consulting reimagined
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <a
            href="#products"
            onClick={handleExploreClick}
            className="px-8 py-4 rounded-full bg-[#1e0e62] text-white font-semibold text-lg hover:bg-opacity-90 transition-all"
          >
            Explore Solutions
          </a>
          <a
            href="#contact"
            onClick={handleContactClick}
            className="px-8 py-4 rounded-full bg-white text-[#1e0e62] font-semibold text-lg border border-[#1e0e62] hover:bg-gray-50 transition-all"
          >
            Contact Us
          </a>
        </motion.div>
      </motion.div>
    </div>
  )
}

