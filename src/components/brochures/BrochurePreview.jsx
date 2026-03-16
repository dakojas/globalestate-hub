import React from "react";
import { Card } from "@/components/ui/card";
import { MapPin, Bed, Bath, Maximize, Mail, Phone } from "lucide-react";

export default function BrochurePreview({ property, template = "luxury" }) {
  const images = property?.images || [];
  const mainImage = images[0];

  if (template === "luxury") {
    return (
      <div className="bg-white w-full max-w-2xl mx-auto" style={{ fontFamily: 'Georgia, serif' }}>
        {/* Header */}
        <div className="bg-[#0a1628] text-white p-8 text-center">
          <h1 className="text-xs tracking-[0.3em] uppercase text-[#c9a84c] mb-2">Exclusive Property</h1>
          <h2 className="text-3xl font-light mb-1">{property?.title}</h2>
          <p className="text-sm text-gray-300 flex items-center justify-center gap-1">
            <MapPin className="w-4 h-4" />
            {property?.city}, {property?.country}
          </p>
        </div>

        {/* Main Image */}
        {mainImage && (
          <div className="relative h-96 bg-gray-100">
            <img src={mainImage} alt="" className="w-full h-full object-cover" />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-8">
              <p className="text-white text-4xl font-light">€{property?.price?.toLocaleString()}</p>
            </div>
          </div>
        )}

        {/* Details */}
        <div className="p-8">
          <div className="flex justify-center gap-12 mb-8 pb-8 border-b border-gray-200">
            {property?.bedrooms && (
              <div className="text-center">
                <Bed className="w-6 h-6 text-[#c9a84c] mx-auto mb-2" />
                <p className="text-2xl font-light text-[#0a1628]">{property.bedrooms}</p>
                <p className="text-xs text-gray-400 uppercase tracking-wider">Bedrooms</p>
              </div>
            )}
            {property?.bathrooms && (
              <div className="text-center">
                <Bath className="w-6 h-6 text-[#c9a84c] mx-auto mb-2" />
                <p className="text-2xl font-light text-[#0a1628]">{property.bathrooms}</p>
                <p className="text-xs text-gray-400 uppercase tracking-wider">Bathrooms</p>
              </div>
            )}
            {property?.area_sqm && (
              <div className="text-center">
                <Maximize className="w-6 h-6 text-[#c9a84c] mx-auto mb-2" />
                <p className="text-2xl font-light text-[#0a1628]">{property.area_sqm}</p>
                <p className="text-xs text-gray-400 uppercase tracking-wider">m²</p>
              </div>
            )}
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-light text-[#0a1628] mb-4 uppercase tracking-wide">Description</h3>
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{property?.description}</p>
          </div>

          {property?.features?.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-light text-[#0a1628] mb-4 uppercase tracking-wide">Features</h3>
              <div className="grid grid-cols-2 gap-2">
                {property.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-[#c9a84c] rounded-full" />
                    <span className="text-sm text-gray-600">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Gallery */}
          {images.length > 1 && (
            <div className="grid grid-cols-3 gap-3 mb-8">
              {images.slice(1, 4).map((img, i) => (
                <div key={i} className="aspect-square bg-gray-100 rounded overflow-hidden">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-8 text-center border-t border-gray-200">
          <h3 className="text-xs tracking-[0.3em] uppercase text-[#c9a84c] mb-3">Contact Us</h3>
          <p className="text-sm text-gray-600 mb-2">Nehnuteľnosti v zahraničí</p>
          <p className="text-sm text-gray-500 flex items-center justify-center gap-4">
            <span className="flex items-center gap-1"><Mail className="w-3 h-3" />info@nvz.sk</span>
            <span className="flex items-center gap-1"><Phone className="w-3 h-3" />+421 XXX XXX XXX</span>
          </p>
        </div>
      </div>
    );
  }

  // Modern template
  return (
    <div className="bg-white w-full max-w-2xl mx-auto">
      {mainImage && (
        <div className="relative h-80 bg-gray-900">
          <img src={mainImage} alt="" className="w-full h-full object-cover opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
          <div className="absolute bottom-6 left-6 text-white">
            <h2 className="text-3xl font-bold mb-2">{property?.title}</h2>
            <p className="flex items-center gap-1 text-sm">
              <MapPin className="w-4 h-4" />
              {property?.city}, {property?.country}
            </p>
          </div>
        </div>
      )}

      <div className="p-8">
        <div className="flex items-center justify-between mb-6 pb-6 border-b">
          <p className="text-3xl font-bold text-[#c9a84c]">€{property?.price?.toLocaleString()}</p>
          <div className="flex gap-6 text-sm text-gray-600">
            {property?.bedrooms && <span className="flex items-center gap-1"><Bed className="w-4 h-4" />{property.bedrooms} beds</span>}
            {property?.bathrooms && <span className="flex items-center gap-1"><Bath className="w-4 h-4" />{property.bathrooms} baths</span>}
            {property?.area_sqm && <span className="flex items-center gap-1"><Maximize className="w-4 h-4" />{property.area_sqm} m²</span>}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">About This Property</h3>
          <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{property?.description}</p>
        </div>

        {property?.features?.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Features</h3>
            <ul className="grid grid-cols-2 gap-2">
              {property.features.map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 bg-[#c9a84c] rounded-full" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        )}

        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-2 mb-6">
            {images.slice(1, 5).map((img, i) => (
              <div key={i} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img src={img} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-[#0a1628] text-white p-6 text-center">
        <p className="text-sm mb-1">Nehnuteľnosti v zahraničí</p>
        <p className="text-xs text-gray-300">info@nvz.sk • +421 XXX XXX XXX</p>
      </div>
    </div>
  );
}