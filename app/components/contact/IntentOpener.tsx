"use client"

import { Suspense, useEffect, useRef } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useContactModal } from "../../context/ContactModalContext"
import { hrefWithoutIntent, modalModeForIntent } from "../../utils/intent"
import { productFromPathname } from "../../utils/product"

function IntentOpenerInner() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const { openModal } = useContactModal()
  const handled = useRef(false)

  useEffect(() => {
    if (handled.current) return
    const intent = searchParams.get("intent")
    const mode = modalModeForIntent(productFromPathname(pathname), intent)
    if (mode) {
      handled.current = true
      openModal(mode)
      // Strip only `intent` so refresh/back doesn't re-open the modal while
      // campaign params (utm_*, etc.) stay in the URL for analytics.
      router.replace(hrefWithoutIntent(pathname, searchParams.toString()), { scroll: false })
    }
  }, [searchParams, pathname, router, openModal])

  return null
}

/**
 * Deep-linkable contact intents: `?intent=read` opens the product
 * questionnaire, `?intent=contact` the quick contact flow.
 */
export default function IntentOpener() {
  return (
    <Suspense fallback={null}>
      <IntentOpenerInner />
    </Suspense>
  )
}
