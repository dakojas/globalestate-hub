import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Bed, Bath, Maximize, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const statusColors = {
  available: "bg-emerald-50 text-emerald-700 border-emerald-200",
  reserved: "bg-amber-50 text-amber-700 border-amber-200",
  sold: "bg-red-50 text-red-700 border-red-200",
  off_market: "bg-gray-100 text-gray-600 border-gray-200",
};

const countryFlags = {
  "Albania": "🇦🇱", "Bali": "🇮🇩", "Hungary": "🇭🇺", "Bulgaria": "🇧🇬",
  "Dominican Republic": "🇩🇴", "Egypt": "🇪🇬", "Georgia": "🇬🇪", "Mauritius": "🇲🇺",
  "Oman": "🇴🇲", "UAE": "🇦🇪", "Spain": "🇪🇸", "Italy": "🇮🇹",
  "Thailand": "🇹🇭", "Turkey": "🇹🇷"
};

export default function PropertyCard({ property }) {
  const mainImage = property.images?.[0];

  return (
    <Link to={createPageUrl(`PropertyDetail?id=${property.id}`)}>
      <Card className="border-0 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer">
        <div className="relative h-48 bg-gray-100 overflow-hidden">
          {mainImage ? (
            <img src={mainImage} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0a1628] to-[#132039]">
              <MapPin className="w-10 h-10 text-[#c9a84c]/50" />
            </div>
          )}
          {property.approval_status === "pending_review" ? (
            <Badge variant="outline" className="absolute top-3 left-3 bg-orange-100 text-orange-700 border-orange-300 font-medium">
              ⏳ Čaká na schválenie
            </Badge>
          ) : property.approval_status === "rejected" ? (
            <Badge variant="outline" className="absolute top-3 left-3 bg-red-100 text-red-700 border-red-300 font-medium">
              ✗ Zamietnuté
            </Badge>
          ) : (
            <Badge variant="outline" className={`absolute top-3 left-3 ${statusColors[property.status] || statusColors.available}`}>
              {property.status?.replace("_", " ")}
            </Badge>
          )}
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 text-xs font-medium">
            {countryFlags[property.country]} {property.country}
          </div>
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-[#0a1628] text-sm truncate flex-1 mr-2">{property.title}</h3>
            {property.portal_links?.length > 0 && (
              <ExternalLink className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            )}
          </div>
          <p className="text-xs text-gray-400 mb-3 flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {property.city || property.country}
          </p>
          <div className="flex items-center justify-between">
            <p className="text-lg font-bold text-[#c9a84c]">
              €{property.price?.toLocaleString()}
            </p>
            <div className="flex items-center gap-3 text-xs text-gray-400">
              {property.bedrooms && (
                <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5" />{property.bedrooms}</span>
              )}
              {property.bathrooms && (
                <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" />{property.bathrooms}</span>
              )}
              {property.area_sqm && (
                <span className="flex items-center gap-1"><Maximize className="w-3.5 h-3.5" />{property.area_sqm}m²</span>
              )}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}