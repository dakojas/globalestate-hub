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
              <Marker key={p.id} position={[p.latitude, p.longitude]}>
                <Popup maxWidth={280}>
                  <div className="p-1">
                    {p.images?.[0] && (
                      <img src={p.images[0]} alt="" className="w-full h-32 object-cover rounded-lg mb-2" />
                    )}
                    <h3 className="font-semibold text-sm mb-1">{p.title}</h3>
                    <p className="text-xs text-gray-500 mb-2">{p.city}, {p.country}</p>
                    <p className="text-lg font-bold text-[#c9a84c] mb-2">€{p.price?.toLocaleString()}</p>
                    <div className="flex gap-3 text-xs text-gray-500 mb-2">
                      {p.bedrooms && <span className="flex items-center gap-1"><Bed className="w-3 h-3" />{p.bedrooms}</span>}
                      {p.bathrooms && <span className="flex items-center gap-1"><Bath className="w-3 h-3" />{p.bathrooms}</span>}
                      {p.area_sqm && <span className="flex items-center gap-1"><Maximize className="w-3 h-3" />{p.area_sqm}m²</span>}
                    </div>
                    <Link to={createPageUrl(`PropertyDetail?id=${p.id}`)} className="text-xs text-blue-600 hover:underline">View details →</Link>
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