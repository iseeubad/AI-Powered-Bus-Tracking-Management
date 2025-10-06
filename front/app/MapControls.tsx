import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

export default function MapControl({ children }: { children: React.ReactNode }) {
  const map = useMap();

  useEffect(() => {
    const control = L.Control.extend({
      onAdd() {
        const container = L.DomUtil.create('div', 'leaflet-bar my-control');
        container.style.background = 'white';
        container.style.padding = '6px';
        container.style.borderRadius = '6px';
        container.innerHTML = (children as any) || '';
        // prevent map interactions when interacting with the control
        L.DomEvent.disableClickPropagation(container);
        return container;
      }
    });

    const c = new (control as any)({ position: 'topright' });
    map.addControl(c);

    return () => {
      map.removeControl(c);
    };
  }, [map, children]);

  return null;
}