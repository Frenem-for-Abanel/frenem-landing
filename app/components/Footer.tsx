"use client"

export default function Footer() {
  return (
    <footer
      className="flex flex-col md:flex-row justify-between items-center gap-4 py-9 px-6 md:px-12 bg-[#1a1a18] border-t border-[rgba(255,255,255,0.08)]"
    >
      <div className="font-logo font-bold text-xl text-[rgba(246,244,240,0.4)] lowercase">
        frenem
      </div>
      <div>
        <a
          href="https://frenem.com"
          target="_blank"
          rel="noopener noreferrer"
          className="font-serif text-lg text-[rgba(246,244,240,0.35)] hover:text-[rgba(246,244,240,0.7)] transition-colors"
        >
          frenem.com
        </a>
      </div>
    </footer>
  )
}
