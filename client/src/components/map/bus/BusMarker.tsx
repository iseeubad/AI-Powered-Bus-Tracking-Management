"use client"

import { Marker, Popup } from "react-leaflet"
import L from "leaflet"
import { useMemo } from "react"
import { cn } from "@/lib/utils"
import type { BusMarkerProps } from "@/types"

export default function BusMarker({ 
  id, 
  lat, 
  lon, 
  route, 
  className, 
  isOnTime = true, 
  onClick,
  eta = "N/A",
  price = "N/A",
  passengers = 0,
  capacity = 0,
  nextStop = "N/A",
  driver = "N/A",
  path = [],
  onShowMore
}: BusMarkerProps) {
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
      data-bus-id={id}
    >
      <Popup>
        <div className="p-3 min-w-[180px]">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="font-semibold text-sm">{id}</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Rte {route}</span>
          </div>
          
          <div className={cn(
            "inline-block text-[9px] px-1.5 py-0.5 rounded font-medium uppercase tracking-wide mb-3",
            isOnTime
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
              : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
          )}>
            {isOnTime ? "On Time" : "Delayed"}
          </div>

          <div className="space-y-2 border-t border-border pt-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Next Stop</span>
              <span className="text-xs font-medium">{nextStop}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wide">ETA</span>
              <span className="text-xs font-semibold text-primary">{eta}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Price</span>
              <span className="text-xs font-semibold">{price}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Capacity</span>
              <span className="text-xs font-medium">{passengers}/{capacity}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Driver</span>
              <span className="text-xs font-medium">{driver}</span>
            </div>
          </div>

          {onShowMore && (
            <div className="mt-3 pt-2 border-t border-border">
              <button
                onClick={onShowMore}
                className="w-full bg-primary text-primary-foreground text-xs font-medium py-2 px-3 rounded hover:bg-primary/90 transition-colors"
              >
                Show More
              </button>
            </div>
          )}
        </div>
      </Popup>
    </Marker>
  )
}