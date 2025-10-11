import { useState, useMemo } from 'react'
import type { BusItem } from '@/types'

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

  return {
    selectedBus,
    setSelectedBus,
    focusBus,
    setFocusBus,
    sheetOpen,
    setSheetOpen,
    handleTrackBus,
    handleShowMore,
  }
}
