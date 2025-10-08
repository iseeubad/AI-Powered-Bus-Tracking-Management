"use client"

import "leaflet/dist/leaflet.css"
import { useMemo, useEffect } from "react"
import { MapContainer, TileLayer, useMap } from "react-leaflet"
import ZoomControl from "./ZoomControl"
import BusMarker from "./bus/BusMarker"
import type { MapBus, MapProps } from "@/types"
import { MAP_CONFIG } from "@/constants"

// Component to handle map focus
function MapFocus({ focusBus }: { focusBus: MapBus | null }) {
  const map = useMap()

  useEffect(() => {
    if (focusBus) {
      // Focus on the bus location
      map.setView([focusBus.lat, focusBus.lon], MAP_CONFIG.FOCUS_ZOOM)
      
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

export default function Map({
  buses = [],
  center = MAP_CONFIG.DEFAULT_CENTER,
  zoom = MAP_CONFIG.DEFAULT_ZOOM,
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
        <MapFocus focusBus={focusBus} />
        <TileLayer
          url={MAP_CONFIG.TILE_URL}
          attribution={MAP_CONFIG.ATTRIBUTION}
          minZoom={MAP_CONFIG.MIN_ZOOM}
          maxZoom={MAP_CONFIG.MAX_ZOOM}
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
