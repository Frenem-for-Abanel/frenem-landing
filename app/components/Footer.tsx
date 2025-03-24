"use client"

import type React from "react"

import { smoothScrollTo } from "../utils/smooth-scroll"

export default function Footer() {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    if (id.startsWith("#")) {
      e.preventDefault()
      smoothScrollTo(id.substring(1))
    }
  }

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
        <nav className="-mb-6 columns-2 sm:flex sm:justify-center sm:space-x-12" aria-label="Footer">
          {[
            { name: "About", href: "#" },
            { name: "Build", href: "#build" },
            { name: "Prism", href: "#prism" },
            { name: "Pulse", href: "#pulse" },
            { name: "Contact", href: "#contact" },
            { name: "Privacy", href: "#" },
          ].map((item) => (
            <div key={item.name} className="pb-6">
              <a
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="text-sm leading-6 text-gray-600 hover:text-[#1e0e62]"
              >
                {item.name}
              </a>
            </div>
          ))}
        </nav>
        <p className="mt-10 text-center text-sm leading-5 text-gray-500">
          &copy; {new Date().getFullYear()} FRENEM. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

