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

function HouseholdMarker({ household, isFocused, icon }: { household: Household, isFocused: boolean, icon: any }) {
  const [markerRef, setMarkerRef] = useState<any>(null);
  const map = useMap();

  useEffect(() => {
    if (markerRef && isFocused) {
      markerRef.openPopup();
      map.flyTo([household.latitude, household.longitude], 18, {
        animate: true,
        duration: 1.5
      });
    }
  }, [markerRef, isFocused, map, household.latitude, household.longitude]);

  return (
    <Marker 
      position={[household.latitude, household.longitude]} 
      icon={icon}
      ref={setMarkerRef}
    >
      <Popup>
        <div className="p-1 min-w-[200px]">
          <h3 className="font-bold text-lg text-slate-800 mb-1">{household.headName}</h3>
          <p className="text-sm text-slate-500 mb-3">{household.address} Số nhân khẩu: {household.memberCount}</p>
          <div className="inline-block px-3 py-1.5 rounded-lg text-sm font-bold text-white bg-blue-600">
            {household.status}
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

interface SmartVillageMapProps {
  households: Household[];
  onSelectAddress: (address: string) => void;
  selectedAddress: string | null;
  focusedHouseholdId?: string | null;
}

export default function SmartVillageMap({ households, onSelectAddress, selectedAddress, focusedHouseholdId }: SmartVillageMapProps) {
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
  
  // Find focused household for map panning
  const focusedHousehold = focusedHouseholdId ? households.find(h => h.id === focusedHouseholdId) : null;

  const center: [number, number] = focusedHousehold 
    ? [focusedHousehold.latitude, focusedHousehold.longitude]
    : locations.length > 0 
      ? [locations[0].lat, locations[0].lng] 
      : [16.634, 106.721]; // Default to Khe Sanh rough coords

  const createAddressIcon = (name: string, isSelected: boolean) => {
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

  const createHouseholdIcon = (status: string) => {
    const color = status === 'Hộ nghèo' ? 'bg-red-500' : status === 'Hộ cận nghèo' ? 'bg-orange-500' : 'bg-blue-500';
    return L.divIcon({
      html: `
        <div class="w-8 h-8 rounded-full ${color} text-white flex items-center justify-center border-2 border-white shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        </div>
      `,
      className: "custom-leaflet-icon",
      iconSize: [32, 32], 
      iconAnchor: [16, 16],
    });
  };

  const selectedHouseholds = households.filter(h => h.address === selectedAddress);

  return (
    <MapContainer center={center} zoom={15} style={{ height: "100%", width: "100%", zIndex: 0 }}>
      <MapUpdater center={center} />
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Render road markers */}
      {locations.map((loc, idx) => (
        <Marker 
          key={idx} 
          position={[loc.lat, loc.lng]} 
          icon={createAddressIcon(loc.name, selectedAddress === loc.name)}
          eventHandlers={{
            click: () => onSelectAddress(loc.name)
          }}
        >
        </Marker>
      ))}

      {/* Render individual households for selected address */}
      {selectedHouseholds.map((h, idx) => {
        return (
          <HouseholdMarker 
            key={`h-${h.id}`} 
            household={h} 
            isFocused={h.id === focusedHouseholdId} 
            icon={createHouseholdIcon(h.status)}
          />
        );
      })}
    </MapContainer>
  );
}
