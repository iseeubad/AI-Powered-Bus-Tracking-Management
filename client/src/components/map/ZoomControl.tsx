"use client"

import { useEffect } from "react"
import { useMap } from "react-leaflet"
import L from "leaflet"

export type ZoomControlProps = {
	className?: string
	position?: "topleft" | "topright" | "bottomleft" | "bottomright"
}

export default function ZoomControl({ className = "custom-zoom-dark", position = "topright" }: ZoomControlProps) {
	const map = useMap()

	useEffect(() => {
		if (!map) return

		const styleId = `leaflet-zoom-styles-${className}`
		const existingStyle = document.getElementById(styleId)
		if (existingStyle) existingStyle.remove()

		const style = document.createElement("style")
		style.id = styleId
		style.textContent = `
			.leaflet-control-zoom.${className} {
				border: none !important;
				box-shadow: 0 1px 2px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.1) !important;
				background: #fff !important;
				display: flex !important;
				flex-direction: column !important;
			}

			.leaflet-control-zoom.${className} a {
				background-color: hsl(var(--background)) !important;
				color: #000 !important;
				border: 1px solid hsl(var(--border)) !important;
				padding: .4rem;
				line-height: 1 !important;
				display: inline-flex;
				align-items: center;
				justify-content: center;
				width: 36px;
				height: 36px;
				transition: background-color 0.12s ease, color 0.12s ease, border-color 0.12s ease !important;
				margin: 0 !important;
			}

			.leaflet-control-zoom.${className} a:hover {
				background-color: hsl(var(--muted)) !important;
				color: hsl(var(--foreground)) !important;
				border-color: hsl(var(--input)) !important;
			}

			.leaflet-control-zoom.${className} a:first-child {
				border-top-left-radius: calc(var(--radius) - 2px) !important;
				border-top-right-radius: calc(var(--radius) - 2px) !important;
				border-bottom-left-radius: 0 !important;
				border-bottom-right-radius: 0 !important;
			}

			.leaflet-control-zoom.${className} a:last-child {
				border-bottom-left-radius: calc(var(--radius) - 2px) !important;
				border-bottom-right-radius: calc(var(--radius) - 2px) !important;
				border-top-left-radius: 0 !important;
				border-top-right-radius: 0 !important;
				border-top: none !important;
			}
		`
		document.head.appendChild(style)

		const control = L.control.zoom({ position })
		control.addTo(map)

		const container = control.getContainer?.()
		if (container && className) {
			container.classList.add(className)
		} else {
			const zoomControlEl = document.querySelector(".leaflet-control-zoom")
			if (zoomControlEl && className) (zoomControlEl as HTMLElement).classList.add(className)
		}

		return () => {
			const styleToRemove = document.getElementById(styleId)
			if (styleToRemove) styleToRemove.remove()
			try {
				control.remove()
			} catch {}
		}
	}, [map, className, position])

	return null
}
