"use client"

import { useEffect } from "react"
import { logAliasRedirects } from "../../../lib/engineering/slug-aliases"

const ALIASES = logAliasRedirects()

/** Hash fragments never hit the server; rewrite retired log slugs in place. */
export default function LogHashRedirect() {
  useEffect(() => {
    const from = window.location.hash.replace(/^#/, "")
    const to = ALIASES[from]
    if (!to) return
    history.replaceState(null, "", `#${to}`)
    document.getElementById(to)?.scrollIntoView()
  }, [])
  return null
}