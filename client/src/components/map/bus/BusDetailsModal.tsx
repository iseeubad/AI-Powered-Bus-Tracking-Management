"use client"

import { useState } from "react"
import { MapPin, Clock, DollarSign, Users, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import type { BusItem } from "./BusSidebar"

interface BusDetailsDialogProps {
  bus: BusItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BusDetailsDialog({
  bus,
  open,
  onOpenChange,
}: BusDetailsDialogProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  if (!bus) return null

  const tagInfo = {
    price: {
      icon: DollarSign,
      label: "Fare",
      value: bus.price,
      color: "text-teal-600",
      bgColor: "bg-teal-50",
    },
    eta: {
      icon: Clock,
      label: "Arrival",
      value: bus.eta,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    passengers: {
      icon: Users,
      label: "Capacity",
      value: `${bus.passengers}/${bus.capacity}`,
      color: "text-purple-900",
      bgColor: "bg-purple-50",
    },
    nextStop: {
      icon: MapPin,
      label: "Next Stop",
      value: bus.nextStop,
      color: "text-red-700",
      bgColor: "bg-red-50",
    },
  }

  const getSelectedInfo = () => {
    if (!selectedTag) return null
    return tagInfo[selectedTag as keyof typeof tagInfo]
  }

  const selectedInfo = getSelectedInfo()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] p-0">
        <DialogHeader className="p-4 pb-4">
          <DialogTitle className="text-xl">Bus {bus.id}</DialogTitle>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant={bus.status === "On Time" ? "default" : "destructive"}>
              {bus.status}
            </Badge>
            <span className="text-sm text-muted-foreground">Route {bus.route}</span>
          </div>
        </DialogHeader>

        <div className="px-4 pb-4">
          {/* Clickable Tags */}
          <div className="grid grid-cols-2 gap-2 mb-2">
            {Object.entries(tagInfo).map(([key, info]) => {
              const Icon = info.icon
              return (
                <button
                  key={key}
                  onClick={() => setSelectedTag(selectedTag === key ? null : key)}
                  className={`p-2 rounded-lg border transition-all ${
                    selectedTag === key
                      ? `${info.bgColor} border-current`
                      : "bg-muted/50 border-border hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${info.color}`} />
                    <div className="text-left">
                      <div className="text-xs text-muted-foreground">{info.label}</div>
                      <div className={`font-semibold ${info.color}`}>{info.value}</div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Selected Info Details */}
          {selectedInfo && (
            <div className={`p-2 rounded-lg ${selectedInfo.bgColor} mb-2`}>
              <div className="flex items-center gap-2 mb-2">
                <selectedInfo.icon className={`w-5 h-5 ${selectedInfo.color}`} />
                <span className="font-medium">{selectedInfo.label}</span>
              </div>
              <p className={`text-lg font-bold ${selectedInfo.color}`}>
                {selectedInfo.value}
              </p>
              {selectedTag === "nextStop" && (
                <p className="text-sm text-muted-foreground mt-1">
                  Driver: {bus.driver}
                </p>
              )}
            </div>
          )}

          {/* Route Path */}
          <div className="mb-2">
            <p className="text-sm font-medium mb-2">Route Stops</p>
            <div className="flex flex-wrap gap-1">
              {bus.path.map((stop, idx) => (
                <Badge
                  key={idx}
                  variant="outline"
                  className="text-xs"
                >
                  {stop}
                </Badge>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
            <Button className="flex-1 gap-2">
              <Navigation className="w-4 h-4" />
              Track
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}