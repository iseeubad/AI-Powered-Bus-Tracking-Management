"use client"

import { useState, useEffect } from "react"
import { MapPin, Bus, TrendingUp, Navigation, Menu, Users } from "lucide-react"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet"
import { BusSidebar, type BusItem } from "@/components/map/bus/BusSidebar"
import { StatsCard } from "@/components/map/bus/StatsCards"
import { BusDetailsDialog } from "@/components/map/bus/BusDetailsModal"

// Dynamically import Map component with SSR disabled
const Map = dynamic(() => import("@/components/map/Map"), {
  ssr: false,
})

export default function BusTrackerPage() {
  const [buses, setBuses] = useState<BusItem[]>([
    {
      id: "B-101",
      lat: 35.5725,
      lon: -5.3552,
      route: "1A",
      status: "On Time",
      passengers: 23,
      nextStop: "City Center",
      price: "2.50 MAD",
      eta: "3 min",
      path: ["Airport", "University", "City Center", "Train Station"],
      driver: "Ahmed Benali",
      capacity: 45,
    },
    {
      id: "B-102",
      lat: 35.5735,
      lon: -5.3562,
      route: "2B",
      status: "Delayed",
      passengers: 18,
      nextStop: "University",
      price: "3.00 MAD",
      eta: "7 min",
      path: ["Train Station", "University", "Hospital", "Shopping Mall"],
      driver: "Fatima Alami",
      capacity: 50,
    },
    {
      id: "B-103",
      lat: 35.5715,
      lon: -5.3542,
      route: "3C",
      status: "On Time",
      passengers: 31,
      nextStop: "Airport",
      price: "4.00 MAD",
      eta: "2 min",
      path: ["City Center", "Airport", "Industrial Zone"],
      driver: "Omar Tazi",
      capacity: 40,
    },
    {
      id: "B-104",
      lat: 35.5745,
      lon: -5.3572,
      route: "4D",
      status: "On Time",
      passengers: 15,
      nextStop: "Train Station",
      price: "2.00 MAD",
      eta: "5 min",
      path: ["University", "Train Station", "Port", "Beach"],
      driver: "Aicha Mansouri",
      capacity: 35,
    },
  ])

  const [selectedBus, setSelectedBus] = useState<BusItem | null>(null)

  const [sheetOpen, setSheetOpen] = useState(false)

  const stats = {
    active: buses.length,
    onTime: buses.filter((b) => b.status === "On Time").length,
    totalPassengers: buses.reduce((sum, b) => sum + b.passengers, 0),
    avgDelay: "2m",
  }

  const handleTrackBus = (bus: BusItem) => {
    setSelectedBus(bus)
    setSheetOpen(false)
  }

  const handleBusClick = (bus: { id: string; lat: number; lon: number; route: string }) => {
    // Find the full bus data from our buses array
    const fullBus = buses.find(b => b.id === bus.id)
    if (fullBus) {
      setSelectedBus(fullBus)
    }
  }

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background border-b flex-shrink-0">
        <div className="px-3 sm:px-4 py-2.5 sm:py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-primary rounded-lg flex items-center justify-center">
                <Bus className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-sm sm:text-base font-semibold">Bus Tracker</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  Real-time monitoring
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              
              <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs px-2 sm:px-3">
                <MapPin className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Tétouan</span>
              </Button>

              <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs px-2 sm:px-3">
                    <Menu className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Buses</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[85vw] sm:w-[400px] overflow-y-auto p-4 sm:p-6">
                  <SheetHeader>
                    <SheetTitle className="text-base sm:text-lg">Active Buses</SheetTitle>
                    <SheetDescription className="text-xs sm:text-sm">
                      {buses.length} buses currently in service
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-2 sm:mt-4">
                    <BusSidebar buses={buses} onTrackBus={handleTrackBus} />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Full Screen Map */}
      <main className="flex-1 relative overflow-hidden z-0">

        {/* Full Screen Map */}
        <div className="absolute inset-0 z-0">
          <Map
            center={[35.57249, -5.35525]}
            buses={buses.map(({ id, lat, lon, route }) => ({
              id,
              lat,
              lon,
              route,
            }))}
            className="h-full w-full"
            onBusClick={handleBusClick}
          >
            <div className="flex gap-2">
              <Button size="icon" variant="outline" className="bg-background shadow-lg h-8 w-8 sm:h-9 sm:w-9">
                <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </Button>
              <Button size="icon" variant="outline" className="bg-background shadow-lg h-8 w-8 sm:h-9 sm:w-9">
                <Navigation className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </Button>
            </div>
          </Map>
        </div>
      </main>

      {/* Bus Details Dialog */}
      <BusDetailsDialog
        bus={selectedBus}
        open={!!selectedBus}
        onOpenChange={(open: boolean) => !open && setSelectedBus(null)}
      />
    </div>
  )
}