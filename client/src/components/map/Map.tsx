"use client"

import "leaflet/dist/leaflet.css"
import { useMemo, useEffect, useState } from "react"
import { MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet"
import ZoomControl from "./ZoomControl"
import BusMarker from "./bus/BusMarker"
import type { BusItem, MapProps } from "@/types"
import { MAP_CONFIG } from "@/constants"
import { Button } from "@/components/ui/button"
import { X, Navigation } from "lucide-react"

// Component to detect user interactions with the map
function MapInteractionHandler({
  onInteraction
}: {
  onInteraction: () => void
}) {
  useMapEvents({
    drag: () => onInteraction(),
    zoom: () => onInteraction(),
    click: () => onInteraction(),
  })
  return null
}

// Component to handle continuous bus tracking
function BusTracker({
  focusBus,
}: {
  focusBus: BusItem | null
}) {
  const map = useMap()

  useEffect(() => {
    if (!focusBus) return

    // Initial center on the bus
    const t = setTimeout(() => {
      map.setView([focusBus.lat, focusBus.lon])
    }, 50);

    
    return () => {
      clearTimeout(t)
    }
  }, [focusBus, focusBus?.lat, focusBus?.lon, map])

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
        <BusTracker
          focusBus={focusBus ?? null}
        />
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
            isOnTime={bus.status == "On Time"}
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
