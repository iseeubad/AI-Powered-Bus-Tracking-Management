"use client"

import { useEffect } from "react"
import { useMap } from "react-leaflet"
import L from "leaflet"

export type ZoomControlProps = {
	position?: "topleft" | "topright" | "bottomleft" | "bottomright"
}

export default function ZoomControl({ position = "topright" }: ZoomControlProps) {
	const map = useMap()

	useEffect(() => {
		if (!map) return

		const control = L.control.zoom({ position })
		control.addTo(map)

		return () => {
			try {
				control.remove()
			} catch {}
		}
	}, [map, position])

	return null
}
