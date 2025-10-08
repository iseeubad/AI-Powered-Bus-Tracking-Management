"use client"

import "leaflet/dist/leaflet.css"
import { useMemo, type ReactNode, type CSSProperties } from "react"
import { MapContainer, TileLayer } from "react-leaflet"
import ZoomControl from "./ZoomControl"
import BusMarker from "./bus/BusMarker" // Updated import path to use bus subfolder

export type Bus = {
  id: string
  lat: number
  lon: number
  route: string
  isOnTime?: boolean
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
}: MapProps) {
  const normalizedHeight = useMemo(() => {
    if (typeof height === "number") return `${height}px`
    return height
  }, [height])

  return (
    <div className="custom-leaflet-map" style={{ position: "relative", height: normalizedHeight, width: "100%", ...style }}>
      <MapContainer center={center} zoom={zoom} zoomControl={false} style={{ height: "100%", width: "100%" }}>
        <ZoomControl position="topright" />
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
