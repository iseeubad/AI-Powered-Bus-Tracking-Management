"use client"

import "leaflet/dist/leaflet.css"
import { useMemo, type ReactNode, type CSSProperties, useEffect, useRef } from "react"
import { MapContainer, TileLayer, useMap } from "react-leaflet"
import ZoomControl from "./ZoomControl"
import BusMarker from "./bus/BusMarker" // Updated import path to use bus subfolder

// Component to handle map focus
function MapFocus({ focusBus }: { focusBus: Bus | null }) {
  const map = useMap()

  useEffect(() => {
    if (focusBus) {
      // Focus on the bus location
      map.setView([focusBus.lat, focusBus.lon], 16)
      
      // Open popup for the focused bus after a short delay
      setTimeout(() => {
        const marker = document.querySelector(`[data-bus-id="${focusBus.id}"]`)
        if (marker) {
          (marker as any)._popup?.openOn(map)
        }
      }, 100)
    }
  }, [focusBus, map])

  return null
}

export type Bus = {
  id: string
  lat: number
  lon: number
  route: string
  isOnTime?: boolean
  eta?: string
  price?: string
  passengers?: number
  capacity?: number
  nextStop?: string
  driver?: string
  path?: string[]
}

export interface MapProps {
  buses?: Bus[]
  center?: [number, number]
  zoom?: number
  height?: string | number
  className?: string
  style?: CSSProperties
  markerClassName?: string
  children?: ReactNode
  onBusClick?: (bus: Bus) => void
  focusBus?: Bus | null
  onShowMore?: (bus: Bus) => void
}

export default function Map({
  buses = [],
  center = [35.57249206623414, -5.355249154765646],
  zoom = 14,
  height = "100dvh",
  className,
  style,
  markerClassName,
  children,
  onBusClick,
  focusBus,
  onShowMore,
}: MapProps) {
  const normalizedHeight = useMemo(() => {
    if (typeof height === "number") return `${height}px`
    return height
  }, [height])

  return (
    <div className="custom-leaflet-map" style={{ position: "relative", height: normalizedHeight, width: "100%", ...style }}>
      <MapContainer center={center} zoom={zoom} zoomControl={false} style={{ height: "100%", width: "100%" }}>
        <ZoomControl position="topright" />
        <MapFocus focusBus={focusBus ?? null} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          minZoom={0}
          maxZoom={19}
        />
        {buses.map((bus) => (
          <BusMarker
            key={bus.id}
            id={bus.id}
            lat={bus.lat}
            lon={bus.lon}
            route={bus.route}
            isOnTime={bus.isOnTime ?? Math.random() > 0.3}
            className={markerClassName}
            onClick={() => onBusClick?.(bus)}
            eta={bus.eta}
            price={bus.price}
            passengers={bus.passengers}
            capacity={bus.capacity}
            nextStop={bus.nextStop}
            driver={bus.driver}
            path={bus.path}
            onShowMore={() => onShowMore?.(bus)}
          />
        ))}
      </MapContainer>

      {children ? (
        <div
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            zIndex: 999,
            pointerEvents: "auto",
          }}
        >
          {children}
        </div>
      ) : null}
    </div>
  )
}
