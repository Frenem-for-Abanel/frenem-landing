import { renderBrandMark } from "../components/brand-mark"

export const dynamic = "force-static"

/** Web app manifest icon. */
export function GET() {
  return renderBrandMark(192, { rounded: false })
}
