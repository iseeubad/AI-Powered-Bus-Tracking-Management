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
    <div className="space-y-0.5">
      {buses.map((bus) => (
        <div
          key={bus.id}
          className="border-b border-border/50 hover:bg-muted/30 transition-all overflow-hidden"
        >
          <button
            onClick={() => setExpandedBus(expandedBus === bus.id ? null : bus.id)}
            className="w-full text-left px-3 py-2 transition-colors"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center shrink-0">
                  <Bus className="w-4 h-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <p className="font-semibold text-sm text-foreground">{bus.id}</p>
                    <p className="text-xs text-muted-foreground">Rte {bus.route}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 text-xs">
                    <span className="text-muted-foreground truncate">{bus.nextStop}</span>
                    <span className="text-primary font-medium shrink-0">{bus.eta}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded font-medium uppercase tracking-wide",
                    bus.status === "On Time"
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                      : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
                  )}
                >
                  {bus.status === "On Time" ? "On Time" : "Delayed"}
                </span>
                <span className="text-muted-foreground/60 text-sm w-4 text-center">
                  {expandedBus === bus.id ? "−" : "+"}
                </span>
              </div>
            </div>
          </button>

          {expandedBus === bus.id && (
            <div className="px-3 pb-3 bg-muted/20 border-t border-border/50">
              <div className="pt-3 space-y-3">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-background rounded p-2">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">Price</p>
                    <p className="font-semibold text-sm text-foreground">{bus.price}</p>
                  </div>
                  <div className="bg-background rounded p-2">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">Capacity</p>
                    <p className="font-semibold text-sm text-foreground">{bus.passengers}/{bus.capacity}</p>
                  </div>
                  <div className="bg-background rounded p-2">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">Driver</p>
                    <p className="font-semibold text-sm text-foreground truncate">{bus.driver.split(' ')[0]}</p>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1.5">Route</p>
                  <div className="flex flex-wrap gap-1">
                    {bus.path.map((stop, idx) => (
                      <span key={idx} className="text-[10px] bg-background border border-border px-2 py-0.5 rounded">
                        {stop}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    className="h-8 text-xs"
                    onClick={(e) => {
                      e.stopPropagation()
                      onTrackBus(bus)
                    }}
                  >
                    Track
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs"
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