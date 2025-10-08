export const MAP_CONFIG = {
  DEFAULT_CENTER: [35.57249206623414, -5.355249154765646] as [number, number],
  DEFAULT_ZOOM: 14,
  FOCUS_ZOOM: 16,
  MIN_ZOOM: 0,
  MAX_ZOOM: 19,
  TILE_URL: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  ATTRIBUTION: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
} as const

export const APP_CONFIG = {
  CITY: "Tétouan",
  APP_NAME: "Bus Tracker",
  APP_DESCRIPTION: "Real-time monitoring"
} as const
