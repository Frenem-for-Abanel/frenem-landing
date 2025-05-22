"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { smoothScrollTo } from "../utils/smooth-scroll"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    setIsOpen(false)
    
    // Remove the # if it's included
    const targetId = id.startsWith("#") ? id.substring(1) : id
    
    setTimeout(() => {
      smoothScrollTo(targetId)
    }, 200)
  }

  return (
    <motion.header
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-md"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">frenem</span>
            <svg width="196" height="46" viewBox="0 0 196 46" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-8 w-auto">
              <path d="M0.672 18.728H5.024V11.784C5.024 9.224 5.568 7.09066 6.656 5.384C7.744 3.67733 9.152 2.38666 10.88 1.512C12.608 0.63733 14.4 0.199997 16.256 0.199997C18.56 0.199997 20.3093 0.509331 21.504 1.128C22.72 1.74667 23.488 2.20533 23.808 2.504L20.096 9.64C19.9893 9.46933 19.7227 9.224 19.296 8.904C18.8693 8.584 18.304 8.424 17.6 8.424C17.152 8.424 16.704 8.54133 16.256 8.776C15.808 9.01066 15.4347 9.42666 15.136 10.024C14.8587 10.6213 14.72 11.496 14.72 12.648V18.728H21.216V26.728H14.72V45H5.024V26.728H0.672V18.728ZM34.1465 45H24.4185V18.728H34.1465V22.792H33.9865C34.1572 22.3013 34.5732 21.6827 35.2345 20.936C35.8958 20.168 36.8238 19.4853 38.0185 18.888C39.2132 18.2693 40.6745 17.96 42.4025 17.96C43.6185 17.96 44.7385 18.152 45.7625 18.536C46.7865 18.8987 47.5332 19.2507 48.0025 19.592L44.2265 27.496C43.9278 27.1333 43.3945 26.76 42.6265 26.376C41.8798 25.9707 40.9412 25.768 39.8105 25.768C38.5092 25.768 37.4318 26.0987 36.5785 26.76C35.7465 27.4213 35.1278 28.2213 34.7225 29.16C34.3385 30.0987 34.1465 30.984 34.1465 31.816V45ZM57.682 33.928C57.746 34.8667 58.0447 35.6987 58.578 36.424C59.1113 37.1493 59.8473 37.7253 60.786 38.152C61.746 38.5573 62.8767 38.76 64.178 38.76C65.4153 38.76 66.5247 38.632 67.506 38.376C68.5087 38.12 69.3727 37.8 70.098 37.416C70.8447 37.032 71.4207 36.6373 71.826 36.232L75.602 42.248C75.0687 42.824 74.3113 43.3893 73.33 43.944C72.37 44.4773 71.1007 44.9147 69.522 45.256C67.9433 45.5973 65.9487 45.768 63.538 45.768C60.6367 45.768 58.0553 45.224 55.794 44.136C53.5327 43.048 51.7513 41.448 50.45 39.336C49.1487 37.224 48.498 34.6427 48.498 31.592C48.498 29.032 49.0527 26.728 50.162 24.68C51.2927 22.6107 52.9247 20.9787 55.058 19.784C57.1913 18.568 59.762 17.96 62.77 17.96C65.6287 17.96 68.1033 18.4827 70.194 19.528C72.306 20.5733 73.9273 22.1307 75.058 24.2C76.21 26.248 76.786 28.808 76.786 31.88C76.786 32.0507 76.7753 32.392 76.754 32.904C76.754 33.416 76.733 33.7573 76.69 33.928H57.682ZM67.634 28.84C67.6127 28.1573 67.4313 27.4853 67.09 26.824C66.7487 26.1413 66.2367 25.5867 65.554 25.16C64.8713 24.712 63.9967 24.488 62.93 24.488C61.8633 24.488 60.9567 24.7013 60.21 25.128C59.4847 25.5333 58.93 26.0667 58.546 26.728C58.162 27.3893 57.9487 28.0933 57.906 28.84H67.634ZM99.893 17.96C101.728 17.96 103.52 18.3333 105.269 19.08C107.018 19.8267 108.458 21.0107 109.589 22.632C110.72 24.232 111.285 26.344 111.285 28.968V45H101.525V30.568C101.525 28.6907 101.077 27.2827 100.181 26.344C99.285 25.384 98.1117 24.904 96.661 24.904C95.701 24.904 94.7943 25.16 93.941 25.672C93.109 26.1627 92.4263 26.8667 91.893 27.784C91.381 28.68 91.125 29.7147 91.125 30.888V45H81.397V18.728H91.125V22.6C91.381 21.896 91.9143 21.192 92.725 20.488C93.557 19.7627 94.5917 19.1653 95.829 18.696C97.0877 18.2053 98.4423 17.96 99.893 17.96ZM124.682 33.928C124.746 34.8667 125.045 35.6987 125.578 36.424C126.111 37.1493 126.847 37.7253 127.786 38.152C128.746 38.5573 129.877 38.76 131.178 38.76C132.415 38.76 133.525 38.632 134.506 38.376C135.509 38.12 136.373 37.8 137.098 37.416C137.845 37.032 138.421 36.6373 138.826 36.232L142.602 42.248C142.069 42.824 141.311 43.3893 140.33 43.944C139.37 44.4773 138.101 44.9147 136.522 45.256C134.943 45.5973 132.949 45.768 130.538 45.768C127.637 45.768 125.055 45.224 122.794 44.136C120.533 43.048 118.751 41.448 117.45 39.336C116.149 37.224 115.498 34.6427 115.498 31.592C115.498 29.032 116.053 26.728 117.162 24.68C118.293 22.6107 119.925 20.9787 122.058 19.784C124.191 18.568 126.762 17.96 129.77 17.96C132.629 17.96 135.103 18.4827 137.194 19.528C139.306 20.5733 140.927 22.1307 142.058 24.2C143.21 26.248 143.786 28.808 143.786 31.88C143.786 32.0507 143.775 32.392 143.754 32.904C143.754 33.416 143.733 33.7573 143.69 33.928H124.682ZM134.634 28.84C134.613 28.1573 134.431 27.4853 134.09 26.824C133.749 26.1413 133.237 25.5867 132.554 25.16C131.871 24.712 130.997 24.488 129.93 24.488C128.863 24.488 127.957 24.7013 127.21 25.128C126.485 25.5333 125.93 26.0667 125.546 26.728C125.162 27.3893 124.949 28.0933 124.906 28.84H134.634ZM184.941 17.96C186.925 17.96 188.674 18.376 190.189 19.208C191.704 20.0187 192.888 21.2773 193.741 22.984C194.616 24.6907 195.053 26.888 195.053 29.576V45H185.485V31.048C185.485 29.2133 185.208 27.7307 184.653 26.6C184.098 25.4693 183 24.904 181.357 24.904C180.376 24.904 179.512 25.16 178.765 25.672C178.018 26.184 177.442 26.8987 177.037 27.816C176.632 28.712 176.429 29.7893 176.429 31.048V45H167.501V31.048C167.501 29.2133 167.192 27.7307 166.573 26.6C165.976 25.4693 164.909 24.904 163.373 24.904C162.392 24.904 161.528 25.16 160.781 25.672C160.034 26.1627 159.458 26.8667 159.053 27.784C158.669 28.68 158.477 29.768 158.477 31.048V45H148.813V18.728H158.477V22.472C158.733 21.8107 159.288 21.1387 160.141 20.456C161.016 19.752 162.093 19.1653 163.373 18.696C164.653 18.2053 166.008 17.96 167.437 17.96C168.994 17.96 170.296 18.1947 171.341 18.664C172.386 19.112 173.24 19.72 173.901 20.488C174.584 21.256 175.128 22.088 175.533 22.984C175.832 22.216 176.418 21.448 177.293 20.68C178.189 19.8907 179.298 19.24 180.621 18.728C181.965 18.216 183.405 17.96 184.941 17.96Z" fill="black"/>
            </svg>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden lg:flex gap-x-12">
          <a
            href="#build"
            onClick={(e) => handleNavClick(e, "build")}
            className="text-xl font-semibold leading-6 text-[#1e0e62] hover:text-[#1e0e62]/70 transition-colors"
          >
            Build
          </a>
          <a
            href="#prism"
            onClick={(e) => handleNavClick(e, "prism")}
            className="text-xl font-semibold leading-6 text-[#1e0e62] hover:text-[#1e0e62]/70 transition-colors"
          >
            Prism
          </a>
          <a
            href="#pulse"
            onClick={(e) => handleNavClick(e, "pulse")}
            className="text-xl font-semibold leading-6 text-[#1e0e62] hover:text-[#1e0e62]/70 transition-colors"
          >
            Pulse
          </a>
        </div>
        
        {/* Desktop Contact Button */}
        <div className="hidden lg:flex flex-1 justify-end">
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, "contact")}
            className="rounded-full px-4 py-2 bg-[#1e0e62] text-white text-sm font-medium hover:bg-[#1e0e62]/90 transition-colors"
          >
            Contact Us
          </a>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="p-2 text-[#1e0e62]"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
          >
            <span className="sr-only">Toggle menu</span>
            {!isOpen ? (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-white border-t border-gray-200"
          >
            <div className="space-y-1 px-4 pb-4 pt-2">
              <a
                href="#build"
                onClick={(e) => handleNavClick(e, "build")}
                className="block py-2 text-base font-semibold text-[#1e0e62] hover:text-[#1e0e62]/70 transition-colors"
              >
                Build
              </a>
              <a
                href="#prism"
                onClick={(e) => handleNavClick(e, "prism")}
                className="block py-2 text-base font-semibold text-[#1e0e62] hover:text-[#1e0e62]/70 transition-colors"
              >
                Prism
              </a>
              <a
                href="#pulse"
                onClick={(e) => handleNavClick(e, "pulse")}
                className="block py-2 text-base font-semibold text-[#1e0e62] hover:text-[#1e0e62]/70 transition-colors"
              >
                Pulse
              </a>
              <a
                href="#contact"
                onClick={(e) => handleNavClick(e, "contact")}
                className="block py-2 text-base font-semibold text-[#1e0e62] hover:text-[#1e0e62]/70 transition-colors"
              >
                Contact Us
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

