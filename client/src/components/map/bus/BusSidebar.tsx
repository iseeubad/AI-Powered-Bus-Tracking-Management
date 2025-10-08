"use client"

import { useState } from "react"
import { Bus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type BusItem = {
  id: string
  lat: number
  lon: number
  route: string
  status: string
  passengers: number
  nextStop: string
  price: string
  eta: string
  path: string[]
  driver: string
  capacity: number
}

interface BusSidebarProps {
  buses: BusItem[]
  onTrackBus: (bus: BusItem) => void
}

export function BusSidebar({ buses, onTrackBus }: BusSidebarProps) {
  const [expandedBus, setExpandedBus] = useState<string | null>(null)

  return (
    <div className="space-y-1">
      {buses.map((bus) => (
        <div
          key={bus.id}
          className="rounded-lg border border-border hover:border-muted-foreground/30 transition-all overflow-hidden"
        >
          <button
            onClick={() => setExpandedBus(expandedBus === bus.id ? null : bus.id)}
            className="w-full text-left p-2 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center shrink-0">
                  <Bus className="w-5 h-5 text-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{bus.id}</p>
                  <p className="text-sm text-muted-foreground">Route {bus.route}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "text-xs px-2 py-1 rounded-full whitespace-nowrap",
                    bus.status === "On Time"
                      ? "bg-green-100 text-teal-700 dark:bg-green-900/30 dark:text-teal-400"
                      : "bg-orange-100 text-red-700 dark:bg-orange-900/30 dark:text-red-400",
                  )}
                >
                  {bus.status}
                </span>
                <span className="text-muted-foreground text-lg font-light w-5 text-center">
                  {expandedBus === bus.id ? "−" : "+"}
                </span>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
              <span>
                {bus.passengers}/{bus.capacity} passengers
              </span>
              <span>→ {bus.nextStop}</span>
              <span className="font-medium text-teal-600 dark:text-teal-400">{bus.eta}</span>
            </div>
          </button>

          {expandedBus === bus.id && (
            <div className="px-4 pb-4 border-t border-border bg-muted/30">
              <div className="pt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Price</p>
                    <p className="font-semibold text-teal-600 dark:text-teal-400">{bus.price}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">ETA</p>
                    <p className="font-semibold text-blue-500 dark:text-blue-400">{bus.eta}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-2">Driver</p>
                  <p className="text-sm font-medium">{bus.driver}</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-2">Route Path</p>
                  <div className="flex flex-wrap gap-1">
                    {bus.path.map((stop, idx) => (
                      <span key={idx} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        {stop}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-1">Position</p>
                  <p className="text-xs font-mono text-muted-foreground">
                    {bus.lat.toFixed(6)}, {bus.lon.toFixed(6)}
                  </p>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation()
                      onTrackBus(bus)
                    }}
                  >
                    Track on Map
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Directions
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
