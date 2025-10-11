export interface BusItem {
  id: string
  lat: number
  lon: number
  route: string
  status: "On Time" | "Delayed" | "Canceled"
  passengers: number
  nextStop: string
  price: string
  eta: string
  path: string[]
  driver: string
  capacity: number
}

export interface BusMarkerProps {
  id: string
  lat: number
  lon: number
  route: string
  className?: string
  isOnTime?: boolean
  onClick?: () => void
  eta?: string
  price?: string
  passengers?: number
  capacity?: number
  nextStop?: string
  driver?: string
  path?: string[]
  onShowMore?: () => void
}

export interface BusStats {
  active: number
  onTime: number
  totalPassengers: number
  avgDelay: string
}
