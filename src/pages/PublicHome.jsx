import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search, MapPin, Home, Bed, Maximize, Euro } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const COUNTRIES = ["Albania", "Bali", "Hungary", "Bulgaria", "Dominican Republic", "Egypt", "Georgia", "Mauritius", "Oman", "UAE", "Spain", "Italy", "Thailand", "Turkey"];

export default function PublicHome() {
  const [filters, setFilters] = useState({
    country: "all",
    minBudget: "",
    maxBudget: "",
    propertyType: "all",
  });

  const { data: properties = [] } = useQuery({
    queryKey: ["public-properties"],
    queryFn: () => base44.entities.Property.filter({ is_public: true }, "-created_date", 100),
  });

  const filtered = properties.filter(p => {
    const matchCountry = filters.country === "all" || p.country === filters.country;
    const matchType = filters.propertyType === "all" || p.property_type === filters.propertyType;
    const matchBudget = (!filters.minBudget || p.price >= Number(filters.minBudget)) &&
                        (!filters.maxBudget || p.price <= Number(filters.maxBudget));
    return matchCountry && matchType && matchBudget && p.status === "available";
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#132039] to-[#1a2844]">
      {/* Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b801924dae038161790d9a/9193a9184_nehnutelnosti_logo-07.jpg" 
              alt="Nehnuteľnosti v zahraničí" 
              className="h-10 w-auto object-contain"
            />
          </div>
          <nav className="flex gap-6 text-sm">
            <a href="#properties" className="text-white/70 hover:text-[#c9a84c] transition-colors">Ponuky</a>
            <a href="#contact" className="text-white/70 hover:text-[#c9a84c] transition-colors">Kontakt</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Luxusné nehnuteľnosti <span className="text-[#c9a84c]">v zahraničí</span>
          </h1>
          <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto">
            Investujte do prémiových projektov v top destináciách sveta
          </p>

          {/* Search Filters */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 max-w-4xl mx-auto">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Select value={filters.country} onValueChange={v => setFilters({...filters, country: v})}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Krajina" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Všetky krajiny</SelectItem>
                    {COUNTRIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>

                <Input
                  type="number"
                  placeholder="Min. cena (€)"
                  value={filters.minBudget}
                  onChange={e => setFilters({...filters, minBudget: e.target.value})}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />

                <Input
                  type="number"
                  placeholder="Max. cena (€)"
                  value={filters.maxBudget}
                  onChange={e => setFilters({...filters, maxBudget: e.target.value})}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />

                <Select value={filters.propertyType} onValueChange={v => setFilters({...filters, propertyType: v})}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Typ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Všetky typy</SelectItem>
                    <SelectItem value="apartment">Apartmán</SelectItem>
                    <SelectItem value="villa">Vila</SelectItem>
                    <SelectItem value="penthouse">Penthouse</SelectItem>
                    <SelectItem value="studio">Štúdio</SelectItem>
                    <SelectItem value="townhouse">Townhouse</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Properties Grid */}
      <section id="properties" className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white">Dostupné ponuky</h2>
            <p className="text-white/60">{filtered.length} nehnuteľností</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(property => (
              <Link
                key={property.id}
                to={createPageUrl(`PublicProperty?id=${property.id}`)}
                className="group"
              >
                <Card className="bg-white/5 backdrop-blur-lg border-white/10 hover:border-[#c9a84c]/50 transition-all overflow-hidden">
                  <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 relative overflow-hidden">
                    {property.images?.[0] ? (
                      <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Home className="w-16 h-16 text-white/20" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <span className="bg-[#c9a84c] text-white text-xs font-bold px-3 py-1 rounded-full">
                        {property.country}
                      </span>
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{property.title}</h3>
                    <p className="text-white/60 text-sm mb-3 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {property.city}
                    </p>
                    <div className="flex items-center gap-4 mb-4 text-sm text-white/60">
                      {property.bedrooms && (
                        <span className="flex items-center gap-1">
                          <Bed className="w-4 h-4" />{property.bedrooms}
                        </span>
                      )}
                      {property.area_sqm && (
                        <span className="flex items-center gap-1">
                          <Maximize className="w-4 h-4" />{property.area_sqm} m²
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-bold text-[#c9a84c]">
                        €{property.price?.toLocaleString()}
                      </p>
                      <Button size="sm" className="bg-[#c9a84c] hover:bg-[#b8973b] text-white">
                        Detail
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-white/40 text-lg">Nenašli sa žiadne nehnuteľnosti</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="border-t border-white/10 bg-white/5 backdrop-blur-lg py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-white/60 mb-4">© 2026 Nehnuteľnosti v zahraničí. All rights reserved.</p>
          <a
            href="https://www.nehnutelnostivzahranici.sk/ochrana-sukromia/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#c9a84c] text-sm hover:underline"
          >
            Ochrana osobných údajov (GDPR)
          </a>
        </div>
      </footer>
    </div>
  );
}