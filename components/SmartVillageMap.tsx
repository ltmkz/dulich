"use client";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 15);
    const t = setTimeout(() => map.invalidateSize(), 100);
    return () => clearTimeout(t);
  }, [center, map]);
  return null;
}

interface Household {
  id: string;
  headName: string;
  address: string;
  memberCount: number;
  status: string;
  latitude: number;
  longitude: number;
}

interface SmartVillageMapProps {
  households: Household[];
  onSelectAddress: (address: string) => void;
  selectedAddress: string | null;
}

export default function SmartVillageMap({ households, onSelectAddress, selectedAddress }: SmartVillageMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
      iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    });
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Group households by address
  const addressGroups = households.reduce((acc, curr) => {
    if (!acc[curr.address]) {
      acc[curr.address] = {
        name: curr.address,
        lat: curr.latitude,
        lng: curr.longitude,
        count: 0
      };
    }
    acc[curr.address].count++;
    return acc;
  }, {} as Record<string, { name: string, lat: number, lng: number, count: number }>);

  const locations = Object.values(addressGroups);
  const center: [number, number] = locations.length > 0 
    ? [locations[0].lat, locations[0].lng] 
    : [16.634, 106.721]; // Default to Khe Sanh rough coords

  const createIcon = (name: string, isSelected: boolean) => {
    return L.divIcon({
      html: `
        <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-full whitespace-nowrap shadow-md transition-all border-2 border-white
          ${isSelected ? 'bg-blue-700 text-white z-50' : 'bg-blue-800/90 text-white'}">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
          <span class="font-bold text-[13px]">${name}</span>
        </div>
      `,
      className: "custom-leaflet-icon",
      iconSize: [0, 0], // HTML handles sizing
      iconAnchor: [16, 16],
    });
  };

  return (
    <MapContainer center={center} zoom={15} style={{ height: "100%", width: "100%", zIndex: 0 }}>
      <MapUpdater center={center} />
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {locations.map((loc, idx) => (
        <Marker 
          key={idx} 
          position={[loc.lat, loc.lng]} 
          icon={createIcon(loc.name, selectedAddress === loc.name)}
          eventHandlers={{
            click: () => onSelectAddress(loc.name)
          }}
        >
        </Marker>
      ))}
    </MapContainer>
  );
}
