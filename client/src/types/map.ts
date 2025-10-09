export interface MapBus {
  id: string
  lat: number
  lon: number
  route: string
  isOnTime?: boolean
  eta?: string
  price?: string
  passengers?: number
  capacity?: number
  nextStop?: string
  driver?: string
  path?: string[]
}

export interface MapProps {
  buses?: MapBus[]
  center?: [number, number]
  zoom?: number
  height?: string | number
  className?: string
  style?: React.CSSProperties
  markerClassName?: string
  children?: React.ReactNode
  onBusClick?: (bus: MapBus) => void
  focusBus?: MapBus | null
  onShowMore?: (bus: MapBus) => void
}
