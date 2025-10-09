"use client"

import { useState } from "react"
import { MapPin, Clock, DollarSign, Users, Navigation, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { BusItem } from "@/types"

interface BusDetailsDialogProps {
  bus: BusItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onTrackBus?: (bus: BusItem) => void
}

export function BusDetailsDialog({
  bus,
  open,
  onOpenChange,
  onTrackBus,
}: BusDetailsDialogProps) {
  if (!bus) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[380px] p-0">
        <DialogHeader className="px-4 pt-4 pb-3 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-lg font-semibold">{bus.id}</DialogTitle>
              <span className="text-xs text-muted-foreground">Route {bus.route}</span>
            </div>
            <span
              className={cn(
                "text-[10px] px-2 py-1 rounded font-medium uppercase tracking-wide",
                bus.status === "On Time"
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                  : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
              )}
            >
              {bus.status}
            </span>
          </div>
        </DialogHeader>

        <div className="px-4 py-4 space-y-3">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-muted/50 rounded-lg p-3 border border-border/50">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="w-4 h-4 text-primary" />
                <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Price</span>
              </div>
              <p className="font-semibold text-base">{bus.price}</p>
            </div>

            <div className="bg-muted/50 rounded-lg p-3 border border-border/50">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-[10px] text-muted-foreground uppercase tracking-wide">ETA</span>
              </div>
              <p className="font-semibold text-base text-primary">{bus.eta}</p>
            </div>

            <div className="bg-muted/50 rounded-lg p-3 border border-border/50">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Capacity</span>
              </div>
              <p className="font-semibold text-base">{bus.passengers}/{bus.capacity}</p>
            </div>

            <div className="bg-muted/50 rounded-lg p-3 border border-border/50">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Next</span>
              </div>
              <p className="font-semibold text-sm truncate">{bus.nextStop}</p>
            </div>
          </div>

          {/* Driver Info */}
          <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Driver</p>
                <p className="text-sm font-medium">{bus.driver}</p>
              </div>
            </div>
          </div>

          {/* Route Path */}
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-2">Route Stops</p>
            <div className="flex flex-wrap gap-1.5">
              {bus.path.map((stop, idx) => (
                <span
                  key={idx}
                  className="text-[10px] bg-background border border-border px-2.5 py-1 rounded-md font-medium"
                >
                  {stop}
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <Button
              size="sm"
              variant="outline"
              className="h-9 text-xs"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
            <Button
              size="sm"
              className="h-9 text-xs gap-1.5"
              onClick={() => {
                if (bus && onTrackBus) {
                  onTrackBus(bus)
                  onOpenChange(false)
                }
              }}
            >
              <Navigation className="w-3.5 h-3.5" />
              Track
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}