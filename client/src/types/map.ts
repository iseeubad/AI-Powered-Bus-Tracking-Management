import { BusItem } from "./bus"

export interface MapProps {
  buses?: BusItem[]
  center?: [number, number]
  zoom?: number
  height?: string | number
  className?: string
  style?: React.CSSProperties
  markerClassName?: string
  children?: React.ReactNode
  onBusClick?: (bus: BusItem) => void
  focusBus?: BusItem | null
  onShowMore?: (bus: BusItem) => void
}
