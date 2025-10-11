export interface Stop {
  _id?: string
  code: string
  name: string
  location: {
    type: "Point"
    coordinates: [number, number] // [longitude, latitude]
  }
  zone?: string
  amenities?: string[]
  is_active?: boolean
  served_routes: string[]
  demand_score?: number
  last_demande_update?: Date
}

export interface Bus {
  _id?: string
  fleet_no: string
  plate?: string
  operator?: string
  busModel?: string
  capacity?: {
    seated?: number
    standing?: number
  }
  features?: string[]
  status: "IN_SERVICE" | "OUT_OF_SERVICE" | "MAINTENANCE"
  assigned_routes?: string
  current_trip_id?: string
  last_telemetry?: {
    ts: Date
    location: {
      type: "Point"
      coordinates: [number, number]
    }
    speed_kmh?: number
    heading_deg?: number
    near_stop_id?: string
    occupancy?: {
      observed?: number
      confidence?: number
    }
    anomalies?: string[]
  }
}

export interface Track {
  _id?: string
  ts: Date
  bus_meta: {
    bus_id: string
    fleet_no?: string
    route?: string
  }
  loc: {
    type: "Point"
    coordinates: [number, number]
  }
  speed_kmh?: number
  heading_deg?: number
  gps?: {
    hdop?: number
    fix?: number
  }
  near_stop_id?: string
  occupancy?: {
    observed?: number
    confidence?: number
  }
  source?: string
}

export interface Route {
  _id?: string
  name: string
  code: string
  stops: string[] // Array of stop IDs
  path: [number, number][] // Array of coordinates for the route path
  description?: string
  color?: string // For map display
}
