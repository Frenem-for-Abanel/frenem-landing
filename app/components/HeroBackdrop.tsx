"use client"

import { useEffect, useState } from "react"
import ShaderBackground, { type ShaderBackgroundColors } from "./ShaderBackground"

type NavigatorWithHints = Navigator & {
  deviceMemory?: number
  connection?: { saveData?: boolean }
}

function useShaderAllowed() {
  // SSR renders the gradient fallback; the shader mounts only on capable clients.
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    const nav = navigator as NavigatorWithHints
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const lowMemory = typeof nav.deviceMemory === "number" && nav.deviceMemory <= 4
    const saveData = Boolean(nav.connection?.saveData)
    setAllowed(!reducedMotion && !lowMemory && !saveData)
  }, [])

  return allowed
}

/**
 * Hero atmosphere: interactive WebGL wallpaper on capable devices, a static
 * gradient everywhere else (reduced motion, low memory, data saver, SSR).
 * Always paints a soft top/bottom wash so hero text stays legible.
 */
export default function HeroBackdrop({ colors }: { colors: Required<ShaderBackgroundColors> }) {
  const shaderAllowed = useShaderAllowed()

  return (
    <>
      <div className="absolute inset-0" aria-hidden>
        {shaderAllowed ? (
          <ShaderBackground colors={colors} intensity={1} className="h-full w-full" />
        ) : (
          <div
            className="h-full w-full"
            style={{
              background: `
                radial-gradient(120% 90% at 15% 0%, ${colors.bg} 0%, transparent 60%),
                radial-gradient(110% 80% at 85% 20%, ${colors.highlight} 0%, transparent 55%),
                radial-gradient(130% 100% at 50% 100%, ${colors.bg2} 0%, ${colors.bg} 70%)
              `,
              backgroundColor: colors.bg,
            }}
          />
        )}
      </div>
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background: `linear-gradient(to bottom, ${colors.bg}99, transparent 30%, transparent 65%, ${colors.bg}CC)`,
        }}
      />
    </>
  )
}
