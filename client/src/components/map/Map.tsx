"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useMemo, type ReactNode } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import ZoomControl from "./ZoomControl";

export type Bus = {
  id: string;
  lat: number;
  lon: number;
  route: string;
};

export interface MapProps {
  buses?: Bus[];
  center?: [number, number];
  zoom?: number;
  height?: string | number;
  title?: string;
  description?: string;
  zoomControlClassName?: string;
  children?: ReactNode;
}

export default function Map({
  buses = [],
  center = [35.57249206623414, -5.355249154765646],
  zoom = 14,
  height = 480,
  title = "Live Map",
  description,
  zoomControlClassName = "custom-zoom-dark",
  children,
}: MapProps) {
  useEffect(() => {
    // Fix Leaflet marker icons for Next.js / bundlers
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);

  const normalizedHeight = useMemo(() => {
    if (typeof height === "number") return `${height}px`;
    return height;
  }, [height]);

  return (
    <div
      style={{ position: "relative", height: normalizedHeight, width: "100%" }}
    >
      <MapContainer
        center={center}
        zoom={zoom}
        zoomControl={false}
        style={{ height: "100%", width: "100%" }}
      >
        <ZoomControl position="topright" className={zoomControlClassName} />
        <TileLayer
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.stadiamaps.com/">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          minZoom={0}
          maxZoom={20}
        />
        {buses.map((bus) => (
          <Marker key={bus.id} position={[bus.lat, bus.lon]}>
            <Popup>
              Bus {bus.id} — Route {bus.route}
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {children ? (
        <div
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            zIndex: 999,
            pointerEvents: "auto",
          }}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}
