import { renderBrandMark } from "./components/brand-mark"

export const size = { width: 180, height: 180 }
export const contentType = "image/png"

/** Home-screen icon; iOS rounds the corners itself. */
export default function AppleIcon() {
  return renderBrandMark(180, { rounded: false })
}
