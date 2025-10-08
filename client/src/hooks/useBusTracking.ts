import { useState, useMemo } from 'react'
import type { BusItem, MapBus } from '@/types'

export function useBusTracking() {
  const [selectedBus, setSelectedBus] = useState<BusItem | null>(null)
  const [focusBus, setFocusBus] = useState<BusItem | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  const handleTrackBus = (bus: BusItem) => {
    setFocusBus(bus)
    setSheetOpen(false)
  }

  const handleShowMore = (bus: BusItem) => {
    setSelectedBus(bus)
  }

  const focusBusForMap = useMemo(() => {
    if (!focusBus) return null
    return {
      id: focusBus.id,
      lat: focusBus.lat,
      lon: focusBus.lon,
      route: focusBus.route,
      isOnTime: focusBus.status === "On Time",
      eta: focusBus.eta,
      price: focusBus.price,
      passengers: focusBus.passengers,
      capacity: focusBus.capacity,
      nextStop: focusBus.nextStop,
      driver: focusBus.driver,
      path: focusBus.path,
    }
  }, [focusBus])

  return {
    selectedBus,
    setSelectedBus,
    focusBus,
    setFocusBus,
    sheetOpen,
    setSheetOpen,
    handleTrackBus,
    handleShowMore,
    focusBusForMap,
  }
}
