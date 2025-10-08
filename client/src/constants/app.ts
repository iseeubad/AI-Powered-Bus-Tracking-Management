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

export const UI_CONFIG = {
  POPUP_DELAY: 100, // ms delay before opening popup after focus
  ANIMATION_DURATION: 300, // ms for transitions
} as const

// Combined config for easier access
export const MAP_CONFIG_WITH_UI = {
  ...MAP_CONFIG,
  POPUP_DELAY: UI_CONFIG.POPUP_DELAY,
} as const
