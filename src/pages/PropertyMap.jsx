import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Bed, Bath, Maximize } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix leaflet default icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const createCustomIcon = (status) => {
  const colors = {
    available: "#10b981",
    reserved: "#f59e0b",
    sold: "#ef4444",
    off_market: "#6b7280",
  };
  const color = colors[status] || "#c9a84c";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 42" width="32" height="42">
    <path d="M16 0C7.163 0 0 7.163 0 16c0 10 16 26 16 26s16-16 16-26C32 7.163 24.837 0 16 0z" fill="${color}" stroke="white" stroke-width="2"/>
    <circle cx="16" cy="16" r="7" fill="white"/>
  </svg>`;
  return L.divIcon({
    html: svg,
    className: "",
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -44],
  });
};

const statusColors = {
  available: "bg-emerald-50 text-emerald-700",
  reserved: "bg-amber-50 text-amber-700",
  sold: "bg-red-50 text-red-700",
  off_market: "bg-gray-100 text-gray-600",
};

const COUNTRIES = ["All", "Albania", "Bali", "Hungary", "Bulgaria", "Dominican Republic", "Egypt", "Georgia", "Mauritius", "Oman", "UAE", "Spain", "Italy", "Thailand", "Turkey"];

export default function PropertyMap() {
  const [countryFilter, setCountryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: properties = [], isLoading } = useQuery({
    queryKey: ["properties"],
    queryFn: () => base44.entities.Property.list("-created_date", 200),
  });

  const mappable = properties.filter(p => {
    const hasCoords = p.latitude && p.longitude;
    const matchCountry = countryFilter === "All" || p.country === countryFilter;
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return hasCoords && matchCountry && matchStatus;
  });

  if (isLoading) return <Skeleton className="h-[600px] rounded-2xl" />;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <p className="text-sm text-gray-500">
          {mappable.length} of {properties.length} properties on map
          {properties.length - mappable.length > 0 && properties.filter(p => !p.latitude || !p.longitude).length > 0 && (
            <span className="text-gray-400"> • {properties.filter(p => !p.latitude || !p.longitude).length} missing coordinates</span>
          )}
        </p>
        <div className="flex gap-3">
          <Select value={countryFilter} onValueChange={setCountryFilter}>
            <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
            <SelectContent>{COUNTRIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="reserved">Reserved</SelectItem>
              <SelectItem value="sold">Sold</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="border-0 shadow-sm overflow-hidden">
        <div className="h-[600px]">
          <MapContainer center={[30, 20]} zoom={3} style={{ height: "100%", width: "100%" }} className="rounded-2xl">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {mappable.map(p => (
              <Marker key={p.id} position={[p.latitude, p.longitude]} icon={createCustomIcon(p.status)}>
                <Popup maxWidth={300} className="custom-popup">
                  <div style={{ fontFamily: "inherit", minWidth: 240, borderRadius: 12, overflow: "hidden", margin: -1 }}>
                    {p.images?.[0] ? (
                      <div style={{ height: 140, overflow: "hidden", margin: "-1px -1px 0 -1px" }}>
                        <img src={p.images[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                    ) : (
                      <div style={{ height: 80, background: "linear-gradient(135deg, #0a1628, #1a2844)", display: "flex", alignItems: "center", justifyContent: "center", margin: "-1px -1px 0 -1px" }}>
                        <span style={{ color: "#c9a84c", fontSize: 28 }}>🏠</span>
                      </div>
                    )}
                    <div style={{ padding: "12px 14px 10px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                        <h3 style={{ fontWeight: 700, fontSize: 13, margin: 0, color: "#0a1628", lineHeight: 1.3, flex: 1, marginRight: 8 }}>{p.title}</h3>
                        <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 20, background: p.status === "available" ? "#d1fae5" : p.status === "reserved" ? "#fef3c7" : "#fee2e2", color: p.status === "available" ? "#065f46" : p.status === "reserved" ? "#92400e" : "#991b1b", whiteSpace: "nowrap" }}>
                          {p.status}
                        </span>
                      </div>
                      <p style={{ fontSize: 11, color: "#6b7280", margin: "0 0 8px" }}>📍 {p.city}, {p.country}</p>
                      <p style={{ fontSize: 18, fontWeight: 800, color: "#c9a84c", margin: "0 0 8px" }}>€{p.price?.toLocaleString()}</p>
                      <div style={{ display: "flex", gap: 12, fontSize: 11, color: "#6b7280", marginBottom: 10 }}>
                        {p.bedrooms && <span>🛏 {p.bedrooms}</span>}
                        {p.bathrooms && <span>🚿 {p.bathrooms}</span>}
                        {p.area_sqm && <span>📐 {p.area_sqm} m²</span>}
                      </div>
                      <Link to={createPageUrl(`PropertyDetail?id=${p.id}`)} style={{ display: "block", textAlign: "center", background: "#0a1628", color: "white", borderRadius: 8, padding: "7px 0", fontSize: 12, fontWeight: 600, textDecoration: "none" }}>
                        Zobraziť detail →
                      </Link>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </Card>
    </div>
  );
}