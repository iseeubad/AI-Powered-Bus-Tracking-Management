"use client"

import { Marker, Popup } from "react-leaflet"
import L from "leaflet"
import { useMemo } from "react"
import { cn } from "@/lib/utils"

export interface BusMarkerProps {
  id: string
  lat: number
  lon: number
  route: string
  className?: string
  isOnTime?: boolean
  onClick?: () => void
}

export default function BusMarker({ id, lat, lon, route, className, isOnTime = true, onClick }: BusMarkerProps) {
  const busIcon = useMemo(() => {
    const displayId = id.replace("B-", "")

    return L.divIcon({
      className: "custom-bus-marker",
      html: `
        <div class="${cn(
          // Base styles - clean and minimal
          "flex items-center justify-center",
          "p-1",
          "rounded-full",
          "font-medium text-xs",
          // Minimal colors - neutral with subtle status indication
          isOnTime ? "bg-blue-500/90 text-white border-white" : "bg-purple-900 text-white border-white",
          // Subtle border and shadow
          "border-1",
          "shadow-md",
          // Interactions
          "cursor-pointer",
          "transition-all duration-200",
          "hover:scale-105 hover:shadow-lg",
          // Custom className for full control
          className,
        )}">
          ${displayId}
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
      popupAnchor: [0, -20],
    })
  }, [id, className, isOnTime])

  return (
    <Marker
      position={[lat, lon]}
      icon={busIcon}
      eventHandlers={{
        click: onClick,
      }}
    >
      <Popup>
        <div className="p-2 min-w-[120px]">
          <div className="font-semibold text-base">Bus {id}</div>
          <div className="text-sm text-muted-foreground">Route {route}</div>
          <div className="text-xs text-muted-foreground mt-1">Click to track</div>
        </div>
      </Popup>
    </Marker>
  )
}
