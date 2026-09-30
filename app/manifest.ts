import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Frenem: organisation clarity",
    short_name: "Frenem",
    description:
      "Pulse maps how people actually work together, Build designs the structure your strategy needs, and Prism keeps it current.",
    start_url: "/",
    display: "browser",
    background_color: "#ffffff",
    theme_color: "#151515",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  }
}
