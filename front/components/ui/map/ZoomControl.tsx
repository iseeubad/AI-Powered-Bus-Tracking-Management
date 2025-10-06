"use client"

import { useEffect } from "react"
import { useMap } from "react-leaflet"
import L from "leaflet"

type ZoomControlProps = {
  className?: string
  position?: "topleft" | "topright" | "bottomleft" | "bottomright"
}

export default function ZoomControl({ className = "custom-zoom-dark", position = "topright" }: ZoomControlProps) {
  const map = useMap()

  useEffect(() => {
    if (!map) return

    const styleId = `leaflet-zoom-styles-${className}`

    // Remove any old style tag (idempotent)
    const existingStyle = document.getElementById(styleId)
    if (existingStyle) existingStyle.remove()

    // Create and inject styles (you can adjust these rules)
    const style = document.createElement("style")
    style.id = styleId
    style.textContent = `
      .leaflet-control-zoom.${className} {
        border: none !important;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3) !important;
        /* Ensure buttons stack vertically */
        display: flex !important;
        flex-direction: column !important;
      }

      .leaflet-control-zoom.${className} a {
        background-color: transparent !important;
        backdrop-filter: blur(10px) !important;
        -webkit-backdrop-filter: blur(10px) !important;
        color: rgb(255, 255, 255) !important;
        border: 1px solid rgb(87, 87, 87) !important;
        padding: .4rem;
        line-height: 1 !important;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        transition: all 0.12s ease !important;
        /* Remove margin between buttons */
        margin: 0 !important;
      }

      .leaflet-control-zoom.${className} a:hover {
        background-color: #313131 !important;
        color: #fafafa !important;
        border-color: #fafafa !important;
      }

      .leaflet-control-zoom.${className} a:first-child {
        border-top-left-radius: 8px !important;
        border-top-right-radius: 8px !important;
        /* Remove bottom border radius for seamless stacking */
        border-bottom-left-radius: 0 !important;
        border-bottom-right-radius: 0 !important;
      }

      .leaflet-control-zoom.${className} a:last-child {
        border-bottom-left-radius: 8px !important;
        border-bottom-right-radius: 8px !important;
        /* Remove top border radius for seamless stacking */
        border-top-left-radius: 0 !important;
        border-top-right-radius: 0 !important;
        /* Remove top border to avoid double border */
        border-top: none !important;
      }
    `
    document.head.appendChild(style)

    // Create and add the Leaflet zoom control at requested position
    const control = L.control.zoom({ position })
    control.addTo(map)

    // Add the className to the control container (if created)
    const container = control.getContainer?.()
    if (container && className) {
      container.classList.add(className)
    } else {
      // fallback: try to find the control by query (rare)
      const zoomControlEl = document.querySelector(".leaflet-control-zoom")
      if (zoomControlEl && className) zoomControlEl.classList.add(className)
    }

    // cleanup on unmount
    return () => {
      // remove injected style
      const styleToRemove = document.getElementById(styleId)
      if (styleToRemove) styleToRemove.remove()

      // remove control from map
      try {
        control.remove()
      } catch (e) {
        // ignore if already removed
      }
    }
  }, [map, className, position])

  return null
}
