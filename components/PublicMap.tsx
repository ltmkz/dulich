"use client";
import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import { CATEGORY_ICONS, CategoryKey } from "@/lib/constants";

function MapUpdater() {
  const map = useMap();
  useEffect(() => {
    const t1 = setTimeout(() => map.invalidateSize(), 100);
    const t2 = setTimeout(() => map.invalidateSize(), 500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [map]);
  return null;
}

interface PublicMapProps {
  point: { lat: number; lng: number; name: string };
  routePoints?: { lat: number; lng: number; name: string; id: string; category: string }[];
  routeColor?: string;
}

export default function PublicMap({ point, routePoints, routeColor }: PublicMapProps) {
  useEffect(() => {
    delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
      iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    });
  }, []);

  const polylinePositions = routePoints?.map((p) => [p.lat, p.lng] as [number, number]) || [];

  const mainIcon = L.divIcon({
    html: `<div style="background:#e94560;width:44px;height:44px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid white;box-shadow:0 4px 12px rgba(233,69,96,0.5);display:flex;align-items:center;justify-content:center">
      <span style="transform:rotate(45deg);font-size:20px">📍</span>
    </div>`,
    className: "",
    iconSize: [44, 44],
    iconAnchor: [22, 44],
    popupAnchor: [0, -44],
  });

  const routeIcon = L.divIcon({
    html: `<div style="background:#666;width:24px;height:24px;border-radius:50%;border:2px solid white;"></div>`,
    className: "",
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

  return (
    <MapContainer center={[point.lat, point.lng]} zoom={15} style={{ height: "100%", width: "100%", zIndex: 0 }}>
      <MapUpdater />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />

      {/* Route polyline */}
      {routePoints && routePoints.length > 1 && (
        <Polyline
          positions={polylinePositions}
          color={routeColor || "#FF6B35"}
          weight={4}
          opacity={0.8}
          dashArray="8, 4"
        />
      )}

      {/* Other route markers */}
      {routePoints?.filter((p) => !(p.lat === point.lat && p.lng === point.lng)).map((p) => (
        <Marker key={p.id} position={[p.lat, p.lng]} icon={routeIcon}>
          <Popup>
            <a href={`/p/${p.id}`} style={{ color: "#e94560", fontWeight: 600 }}>
              {CATEGORY_ICONS[p.category as CategoryKey]} {p.name}
            </a>
          </Popup>
        </Marker>
      ))}

      {/* Main point marker (rendered last so it stays on top) */}
      <Marker position={[point.lat, point.lng]} icon={mainIcon}>
        <Popup>{point.name}</Popup>
      </Marker>
    </MapContainer>
  );
}
