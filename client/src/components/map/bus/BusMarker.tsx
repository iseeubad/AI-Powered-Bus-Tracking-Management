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
          "w-10 h-10 flex items-center justify-center font-bold text-xs text-white rounded-full border-1 border-white/90 shadow-lg cursor-pointer transition-transform hover:scale-110 opacity-80",
          isOnTime ? "bg-emerald-500" : "bg-amber-500",
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
        <div className="p-2">
          <div className="font-semibold text-lg">Bus {id}</div>
          <div className="text-sm text-muted-foreground">Route {route}</div>
          <div className="text-xs text-muted-foreground mt-1">Click to track this bus</div>
        </div>
      </Popup>
    </Marker>
  )
}
