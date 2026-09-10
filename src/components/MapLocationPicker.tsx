import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default leaflet marker icon assets
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface MapLocationPickerProps {
  latitude?: number;
  longitude?: number;
  onLocationSelect?: (lat: number, lng: number) => void;
  serviceRadiusMeters?: number;
  readOnly?: boolean;
  className?: string;
}

export const MapLocationPicker: React.FC<MapLocationPickerProps> = ({
  latitude = 18.5204,
  longitude = 73.8567,
  onLocationSelect,
  serviceRadiusMeters = 3000,
  readOnly = false,
  className = 'h-64 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-inner'
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const circleRef = useRef<L.Circle | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    if (!leafletMapRef.current) {
      const map = L.map(mapRef.current).setView([latitude, longitude], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(map);

      leafletMapRef.current = map;

      const marker = L.marker([latitude, longitude], { draggable: !readOnly }).addTo(map);
      markerRef.current = marker;

      if (serviceRadiusMeters > 0) {
        const circle = L.circle([latitude, longitude], {
          radius: serviceRadiusMeters,
          color: '#10b981',
          fillColor: '#10b981',
          fillOpacity: 0.15,
        }).addTo(map);
        circleRef.current = circle;
      }

      if (!readOnly) {
        map.on('click', (e: L.LeafletMouseEvent) => {
          marker.setLatLng(e.latlng);
          if (circleRef.current) {
            circleRef.current.setLatLng(e.latlng);
          }
          onLocationSelect?.(e.latlng.lat, e.latlng.lng);
        });

        marker.on('dragend', () => {
          const pos = marker.getLatLng();
          if (circleRef.current) {
            circleRef.current.setLatLng(pos);
          }
          onLocationSelect?.(pos.lat, pos.lng);
        });
      }
    } else {
      leafletMapRef.current.setView([latitude, longitude], 13);
      if (markerRef.current) markerRef.current.setLatLng([latitude, longitude]);
      if (circleRef.current) circleRef.current.setLatLng([latitude, longitude]);
    }

    return () => {
      // Map cleanup on unmount
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [latitude, longitude, readOnly]);

  return (
    <div className="relative">
      <div ref={mapRef} className={className} />
      {!readOnly && (
        <div className="absolute top-2 right-2 z-[1000] bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1 text-[11px] rounded-md shadow border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 pointer-events-none">
          Click map or drag pin to choose location
        </div>
      )}
    </div>
  );
};
