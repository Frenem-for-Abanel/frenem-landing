import { renderBrandMark } from "../components/brand-mark"

export const dynamic = "force-static"

/** Web app manifest icon, and the logo in the Organization structured data. */
export function GET() {
  return renderBrandMark(512, { rounded: false })
}
