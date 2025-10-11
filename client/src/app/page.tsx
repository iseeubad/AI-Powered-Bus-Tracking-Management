"use client"

import { useState, useMemo } from "react"
import { MapPin, Bus, Menu, Settings } from "lucide-react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet"
import { BusSidebar } from "@/components/map/bus/BusSidebar"
import { BusDetailsDialog } from "@/components/map/bus/BusDetailsModal"
import { useBusTracking } from "@/hooks"
import { MOCK_BUSES } from "@/data"
import { MAP_CONFIG, APP_CONFIG } from "@/constants"
import type { BusItem } from "@/types"
import './leaflet.scss'

// Dynamically import Map component with SSR disabled
const Map = dynamic(() => import("@/components/map/Map"), {
  ssr: false,
})

export default function BusTrackerPage() {
  const [buses] = useState(MOCK_BUSES)
  const {
    selectedBus,
    setSelectedBus,
    sheetOpen,
    focusBus,
    setFocusBus,
    setSheetOpen,
    handleTrackBus,
  } = useBusTracking()

  const handleShowMore = (mapBus: BusItem) => {
    // Convert MapBus to BusItem by finding the full bus data
    if (mapBus) {
      setSelectedBus(mapBus)
    }
  }

  return (
    <div className="h-dvh flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <header className="absolute top-0 m-2 z-40 rounded-sm bg-card shadow-2xl backdrop-blur-xs flex-shrink-0  ">
        <div className="px-3 sm:px-4 py-2.5 sm:py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 mr-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-primary rounded-lg flex items-center justify-center">
                <Bus className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-sm sm:text-base font-semibold">{APP_CONFIG.APP_NAME}</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  {APP_CONFIG.APP_DESCRIPTION}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs px-2 sm:px-3">
                <MapPin className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{APP_CONFIG.CITY}</span>
              </Button>

              <Link href="/admin">
                <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs px-2 sm:px-3">
                  <Settings className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Admin</span>
                </Button>
              </Link>

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
            center={MAP_CONFIG.DEFAULT_CENTER}
            buses={buses}
            className="h-full w-full"
            onShowMore={handleShowMore}
            focusBus={focusBus}
            onBusClick={setFocusBus}
          />
        </div>
      </main>

      {/* Bus Details Dialog */}
      <BusDetailsDialog
        bus={selectedBus}
        open={!!selectedBus}
        onOpenChange={(open: boolean) => !open && setSelectedBus(null)}
        onTrackBus={handleTrackBus}
      />
    </div>
  )
}
