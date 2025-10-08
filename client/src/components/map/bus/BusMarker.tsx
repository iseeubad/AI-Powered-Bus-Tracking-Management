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
          // Compact professional design
          "flex items-center justify-center",
          "w-7 h-7",
          "rounded-md",
          "font-semibold text-[10px]",
          // Clean minimal colors matching sidebar
          isOnTime 
            ? "bg-primary text-primary-foreground border border-primary" 
            : "bg-amber-500 text-white border border-amber-600",
          // Subtle professional shadow
          "shadow-sm",
          // Smooth interactions
          "cursor-pointer",
          "transition-all duration-150",
          "hover:scale-110 hover:shadow-md",
          // Custom className
          className,
        )}">
          ${displayId}
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
      popupAnchor: [0, -14],
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
        <div className="p-2 min-w-[140px]">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-semibold text-sm">{id}</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Rte {route}</span>
          </div>
          <div className={cn(
            "inline-block text-[9px] px-1.5 py-0.5 rounded font-medium uppercase tracking-wide",
            isOnTime
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
              : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
          )}>
            {isOnTime ? "On Time" : "Delayed"}
          </div>
          <div className="text-[10px] text-muted-foreground mt-2 border-t border-border pt-2">
            Click to track on map
          </div>
        </div>
      </Popup>
    </Marker>
  )
}