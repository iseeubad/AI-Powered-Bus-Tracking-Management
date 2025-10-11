"use client"

import "leaflet/dist/leaflet.css"
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polyline, useMap } from "react-leaflet"
import { Icon } from "leaflet"
import { MAP_CONFIG } from "@/constants"
import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X, Navigation } from "lucide-react"

interface MarkerData {
  id: string
  position: [number, number]
  label: string
  color?: string
}

interface AdminMapProps {
  markers?: MarkerData[]
  onMapClick?: (lat: number, lon: number) => void
  onMarkerClick?: (marker: MarkerData) => void
  onMarkerRemove?: (marker: MarkerData) => void
  height?: string
  center?: [number, number]
  zoom?: number
  clickToAdd?: boolean
  polylines?: [number, number][][]
}

function MapClickHandler({
  onMapClick,
  clickToAdd,
  onMapInteraction
}: {
  onMapClick?: (lat: number, lon: number) => void
  clickToAdd?: boolean
  onMapInteraction?: () => void
}) {
  useMapEvents({
    click: (e) => {
      if (clickToAdd && onMapClick) {
        onMapClick(e.latlng.lat, e.latlng.lng)
      }
      onMapInteraction?.()
    },
    drag: () => {
      onMapInteraction?.()
    },
    zoom: () => {
      onMapInteraction?.()
    },
  })
  return null
}

// Component to track and center on a marker
function MarkerTracker({
  trackedMarkerId,
  markers,
  onStopTracking
}: {
  trackedMarkerId: string | null
  markers: MarkerData[]
  onStopTracking: () => void
}) {
  const map = useMap()

  useEffect(() => {
    if (!trackedMarkerId) return

    const trackedMarker = markers.find(m => m.id === trackedMarkerId)
    if (!trackedMarker) {
      onStopTracking()
      return
    }

    // Center the map on the marker
    map.setView(trackedMarker.position, 16, { animate: true })

    // Check if marker is out of bounds
    const checkBounds = () => {
      if (!trackedMarkerId) return

      const currentMarker = markers.find(m => m.id === trackedMarkerId)
      if (!currentMarker) {
        onStopTracking()
        return
      }

      const bounds = map.getBounds()
      const markerLatLng = { lat: currentMarker.position[0], lng: currentMarker.position[1] }

      if (!bounds.contains(markerLatLng)) {
        // Marker is out of view, re-center
        map.setView(currentMarker.position, map.getZoom(), { animate: true })
      }
    }

    // Check bounds periodically
    const interval = setInterval(checkBounds, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [trackedMarkerId, markers, map, onStopTracking])

  return null
}

export function AdminMap({
  markers = [],
  onMapClick,
  onMarkerClick,
  onMarkerRemove,
  height = "500px",
  center = MAP_CONFIG.DEFAULT_CENTER,
  zoom = MAP_CONFIG.DEFAULT_ZOOM,
  clickToAdd = true,
  polylines = [],
}: AdminMapProps) {
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null)
  const [trackedMarker, setTrackedMarker] = useState<string | null>(null)

  // Create custom icons for different marker colors
  const createIcon = (color: string = "#3b82f6") => {
    return new Icon({
      iconUrl: `data:image/svg+xml;base64,${btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
          <path fill="${color}" stroke="white" stroke-width="2" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      `)}`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    })
  }

  const markerIcons = useMemo(() => {
    const icons: Record<string, Icon> = {}
    markers.forEach((marker) => {
      if (!icons[marker.color || "default"]) {
        icons[marker.color || "default"] = createIcon(marker.color)
      }
    })
    return icons
  }, [markers])

  const handleMarkerClick = (marker: MarkerData) => {
    setSelectedMarker(marker.id)
    setTrackedMarker(marker.id)
    onMarkerClick?.(marker)
  }

  const handleStopTracking = () => {
    setTrackedMarker(null)
  }

  const handleMapInteraction = () => {
    // Stop tracking when user manually interacts with the map
    if (trackedMarker) {
      setTrackedMarker(null)
    }
  }

  return (
    <div
      className={`rounded-lg overflow-hidden border shadow-sm z-10 relative ${clickToAdd ? 'cursor-crosshair' : ''}`}
      style={{ height }}
    >
      {/* Tracking Indicator */}
      {trackedMarker && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-800 px-4 py-3 rounded-lg shadow-lg border flex items-center gap-2">
          <Navigation className="w-4 h-4 text-blue-600 animate-pulse" />
          <span className="text-sm font-medium">Tracking marker</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={handleStopTracking}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        zoomControl={true}
      >
        <TileLayer
          url={MAP_CONFIG.TILE_URL}
          attribution={MAP_CONFIG.ATTRIBUTION}
          minZoom={MAP_CONFIG.MIN_ZOOM}
          maxZoom={MAP_CONFIG.MAX_ZOOM}
        />

        <MapClickHandler
          onMapClick={onMapClick}
          clickToAdd={clickToAdd}
          onMapInteraction={handleMapInteraction}
        />

        <MarkerTracker
          trackedMarkerId={trackedMarker}
          markers={markers}
          onStopTracking={handleStopTracking}
        />

        {/* Render polylines for routes */}
        {polylines.map((line, index) => (
          <Polyline
            key={`polyline-${index}`}
            positions={line}
            color="#3b82f6"
            weight={4}
            opacity={0.7}
          />
        ))}

        {/* Render markers */}
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={marker.position}
            icon={markerIcons[marker.color || "default"] || createIcon(marker.color)}
            eventHandlers={{
              click: () => handleMarkerClick(marker),
            }}
          >
            <Popup>
              <div className="p-2 min-w-[150px]">
                <div className="flex justify-between items-start gap-2">
                  <p className="font-semibold text-sm">{marker.label}</p>
                  {onMarkerRemove && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => onMarkerRemove(marker)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Lat: {marker.position[0].toFixed(6)}
                  <br />
                  Lon: {marker.position[1].toFixed(6)}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
