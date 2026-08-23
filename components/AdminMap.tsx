"use client";
import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";
import { CATEGORY_COLORS, CATEGORY_ICONS, CategoryKey } from "@/lib/constants";

function createCategoryIcon(category: string) {
  const color = CATEGORY_COLORS[category as CategoryKey] || "#e94560";
  const icon = CATEGORY_ICONS[category as CategoryKey] || "📍";
  return L.divIcon({
    html: `<div style="background:${color};width:36px;height:36px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:2px solid white;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.4)">
      <span style="transform:rotate(45deg);font-size:16px;line-height:1">${icon}</span>
    </div>`,
    className: "",
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
}

function AutoFitBounds({ points }: { points: { latitude: number; longitude: number }[] }) {
  const map = useMap();
  useEffect(() => {
    const t1 = setTimeout(() => map.invalidateSize(), 100);
    const t2 = setTimeout(() => map.invalidateSize(), 500);

    if (points.length > 0) {
      const bounds = L.latLngBounds(points.map((p) => [p.latitude, p.longitude]));
      map.fitBounds(bounds, { padding: [40, 40] });
    }

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [points, map]);
  return null;
}

interface Point {
  id: string;
  name: string;
  category: string;
  latitude: number;
  longitude: number;
  visitCount: number;
  route: { name: string; color: string } | null;
}

export default function AdminMap({ points }: { points: Point[] }) {
  useEffect(() => {
    delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
      iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    });
  }, []);

  const center: [number, number] = points.length > 0
    ? [points[0].latitude, points[0].longitude]
    : [10.8231, 106.6297];

  return (
    <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {points.length > 0 && <AutoFitBounds points={points} />}
      {points.map((point) => (
        <Marker
          key={point.id}
          position={[point.latitude, point.longitude]}
          icon={createCategoryIcon(point.category)}
        >
          <Popup>
            <div style={{ minWidth: "200px" }}>
              <div style={{ fontWeight: 700, fontSize: "14px", marginBottom: "6px" }}>
                {CATEGORY_ICONS[point.category as CategoryKey]} {point.name}
              </div>
              {point.route && (
                <div style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}>
                  🛤️ {point.route.name}
                </div>
              )}
              <div style={{ fontSize: "12px", color: "#666", marginBottom: "8px" }}>
                👁️ {point.visitCount} lượt xem
              </div>
              <a href={`/admin/points/${point.id}`} style={{ display: "inline-block", background: "#e94560", color: "white", padding: "4px 12px", borderRadius: "6px", fontSize: "12px", textDecoration: "none" }}>
                ✏️ Chỉnh sửa
              </a>
              {" "}
              <a href={`/p/${point.id}`} target="_blank" style={{ display: "inline-block", background: "#27ae60", color: "white", padding: "4px 12px", borderRadius: "6px", fontSize: "12px", textDecoration: "none" }}>
                👁️ Xem
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
