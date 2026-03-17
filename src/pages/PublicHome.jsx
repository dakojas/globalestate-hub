import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Bed, Maximize, Home, X } from "lucide-react";
import CountryMap from "@/components/public/CountryMap";
import Logo from "@/components/Logo";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { PublicLanguageProvider, usePublicLang } from "@/components/PublicLanguageContext";
import PublicLangSwitcher from "@/components/PublicLangSwitcher";

const COUNTRIES = ["Albania", "Bali", "Hungary", "Bulgaria", "Dominican Republic", "Egypt", "Georgia", "Mauritius", "Oman", "UAE", "Spain", "Italy", "Thailand", "Turkey"];
const PROPERTY_TYPES_DISPLAY = {
  "studio": "Štúdio",
  "1_bedroom": "1 Bedroom",
  "2_bedroom": "2 Bedroom",
  "penthouse": "Penthouse",
  "vila": "Vila"
};

function PublicHomeInner() {
  const { tr, lang } = usePublicLang();
  const [filters, setFilters] = useState({ country: "all", minBudget: "", maxBudget: "", propertyType: "all", constructionPhase: "all" });
  const [mapCountry, setMapCountry] = useState("all");

  const handleMapSelect = (country) => {
    setMapCountry(country);
    setFilters(f => ({ ...f, country }));
    document.getElementById("properties")?.scrollIntoView({ behavior: "smooth" });
  };

  const { data: properties = [] } = useQuery({
    queryKey: ["public-properties"],
    queryFn: () => base44.entities.Property.filter({ is_public: true }, "-created_date", 100),
  });

  const propertiesByCountry = properties
    .filter(p => p.status === "available")
    .reduce((acc, p) => { acc[p.country] = (acc[p.country] || 0) + 1; return acc; }, {});

  const filtered = properties.filter(p => {
    const matchCountry = filters.country === "all" || p.country === filters.country;
    const matchType = filters.propertyType === "all" || p.property_type === filters.propertyType;
    const matchBudget = (!filters.minBudget || p.price >= Number(filters.minBudget)) &&
                        (!filters.maxBudget || p.price <= Number(filters.maxBudget));
    const matchPhase = filters.constructionPhase === "all" || p.construction_phase === filters.constructionPhase;
    return matchCountry && matchType && matchBudget && matchPhase && p.status === "available";
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#132039] to-[#1a2844]">
      {/* Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Logo className="h-10" />
          <nav className="flex items-center gap-6">
            <Link to={createPageUrl("PublicAbout")} className="text-white/70 hover:text-[#c9a84c] transition-colors text-sm hidden sm:block">O nás</Link>
            <a href="#properties" className="text-white/70 hover:text-[#c9a84c] transition-colors text-sm hidden sm:block">{tr("offers")}</a>
            <a href="#contact" className="text-white/70 hover:text-[#c9a84c] transition-colors text-sm hidden sm:block">{tr("contact")}</a>
            <Link to={createPageUrl("PublicSubmit")} className="hidden sm:block">
              <Button size="sm" className="bg-[#c9a84c] hover:bg-[#b8973b] text-white text-xs">{tr("listProperty")}</Button>
            </Link>
            <PublicLangSwitcher />
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            {tr("heroTitle")} <span className="text-[#c9a84c]">{tr("heroTitleHighlight")}</span>
          </h1>
          <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto">{tr("heroSubtitle")}</p>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20 max-w-4xl mx-auto">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <Select value={filters.country} onValueChange={v => setFilters({...filters, country: v})}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder={tr("allCountries")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{tr("allCountries")}</SelectItem>
                    {COUNTRIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Input type="number" placeholder={tr("minPrice")} value={filters.minBudget} onChange={e => setFilters({...filters, minBudget: e.target.value})} className="bg-white/10 border-white/20 text-white placeholder:text-white/50" />
                <Input type="number" placeholder={tr("maxPrice")} value={filters.maxBudget} onChange={e => setFilters({...filters, maxBudget: e.target.value})} className="bg-white/10 border-white/20 text-white placeholder:text-white/50" />
                <Select value={filters.propertyType} onValueChange={v => setFilters({...filters, propertyType: v})}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder={tr("allTypes")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{tr("allTypes")}</SelectItem>
                    <SelectItem value="studio">Štúdio</SelectItem>
                    <SelectItem value="1_bedroom">1 Bedroom</SelectItem>
                    <SelectItem value="2_bedroom">2 Bedroom</SelectItem>
                    <SelectItem value="penthouse">Penthouse</SelectItem>
                    <SelectItem value="vila">Vila</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filters.constructionPhase} onValueChange={v => setFilters({...filters, constructionPhase: v})}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder={lang === "sk" ? "Fáza projektu" : "Phase"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{lang === "sk" ? "Všetky fázy" : "All phases"}</SelectItem>
                    <SelectItem value="vo_vystavbe">🏗 {lang === "sk" ? "Vo výstavbe / Off Plan" : "Off Plan"}</SelectItem>
                    <SelectItem value="dokoncene">✅ {lang === "sk" ? "Dokončené" : "Completed"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* World Map */}
      <section className="px-6 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white">{tr("exploreMap")}</h2>
            <p className="text-white/50 text-sm mt-1">{tr("exploreMapSub")}</p>
          </div>
          <div className="relative rounded-2xl overflow-hidden border border-white/10" style={{ height: 420 }}>
            <CountryMap
              propertiesByCountry={propertiesByCountry}
              selectedCountry={filters.country}
              onSelectCountry={handleMapSelect}
            />
            {filters.country !== "all" && (
              <button
                onClick={() => handleMapSelect("all")}
                className="absolute top-3 right-3 z-[1000] bg-[#c9a84c] hover:bg-[#b8973b] text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg"
              >
                <X className="w-3 h-3" /> {filters.country}
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="py-16 px-6 bg-white/5 backdrop-blur-lg border-t border-b border-white/10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#c9a84c] text-xs uppercase tracking-widest mb-4">BRATISLAVA • DUBAJ • SVET • 2024–</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              <em>Začali sme ako malý slovenský sen.</em>
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              <em>Stali sme sa bránou do celého sveta.</em>
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-xl p-8">
              <p className="text-[#c9a84c] text-xs uppercase tracking-widest font-semibold mb-4">KAPITOLA I – ZAČIATOK</p>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Jeden nápad. Jeden sen.</h3>
              <p className="text-gray-700 text-sm leading-relaxed">Bolo to jednoduché: Slováci chceli nehnuteľnosti v zahraničí. Jazyk bol cudzi, trh neznámy. Tak vznikla stránka Nehnuteľnosti v zahraničí — nie ako veľká korporácia, ale ako odpoveď na konkrétnu potrebu konkrétnych ľudí.</p>
            </div>
            <div className="bg-white rounded-xl p-8">
              <p className="text-[#c9a84c] text-xs uppercase tracking-widest font-semibold mb-4">KAPITOLA II – RAST</p>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Klienti nás vzali so sebou.</h3>
              <p className="text-gray-700 text-sm leading-relaxed">Prvá kúpa v Egypte. Potom Dubaj. Potom Bali. Každý spokojný klient otvoriť nové dvere — do novej krajiny, k novému developerovi. Tím rástol, portfólio rástlo, ale závázok zostal rovnaký.</p>
            </div>
          </div>

          <div className="text-center">
            <Link to={createPageUrl("PublicAbout")} className="inline-block text-[#c9a84c] hover:text-[#b8973b] transition-colors font-semibold text-sm uppercase tracking-widest">Čítaj celý príbeh →</Link>
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      <section id="properties" className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white">{tr("availableOffers")}</h2>
            <p className="text-white/60">{filtered.length} {tr("properties")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(property => (
              <Link key={property.id} to={createPageUrl(`PublicProperty?id=${property.id}`)} className="group">
                <Card className="bg-white/5 backdrop-blur-lg border-white/10 hover:border-[#c9a84c]/50 transition-all overflow-hidden">
                  <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 relative overflow-hidden">
                    {property.images?.[0] ? (
                      <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><Home className="w-16 h-16 text-white/20" /></div>
                    )}
                    <div className="absolute top-3 right-3 flex flex-col gap-1 items-end">
                      <span className="bg-[#c9a84c] text-white text-xs font-bold px-3 py-1 rounded-full">{property.country}</span>
                      {property.construction_phase && (
                        <span className={`text-white text-xs font-semibold px-2 py-0.5 rounded-full ${
                          property.construction_phase === "vo_vystavbe" ? "bg-orange-500" : "bg-emerald-600"
                        }`}>
                          {property.construction_phase === "vo_vystavbe"
                            ? (lang === "sk" ? "Vo výstavbe" : "Off Plan")
                            : (lang === "sk" ? "Dokončené" : "Completed")}
                        </span>
                      )}
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{property.title}</h3>
                    <p className="text-white/60 text-sm mb-3 flex items-center gap-1"><MapPin className="w-4 h-4" />{property.city}</p>
                    <div className="flex items-center gap-4 mb-4 text-sm text-white/60">
                      {property.bedrooms && <span className="flex items-center gap-1"><Bed className="w-4 h-4" />{property.bedrooms}</span>}
                      {property.area_sqm && <span className="flex items-center gap-1"><Maximize className="w-4 h-4" />{property.area_sqm} m²</span>}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-bold text-[#c9a84c]">€{property.price?.toLocaleString()}</p>
                      <Button size="sm" className="bg-[#c9a84c] hover:bg-[#b8973b] text-white">{tr("detail")}</Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20"><p className="text-white/40 text-lg">{tr("noProperties")}</p></div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="border-t border-white/10 bg-white/5 backdrop-blur-lg py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <Logo className="h-10" />
            <div className="flex flex-col sm:flex-row items-center gap-6 text-white/70 text-sm">
              <a href="tel:+421951094706" className="flex items-center gap-2 hover:text-[#c9a84c] transition-colors">
                <span className="text-[#c9a84c]">📞</span> +421 951 094 706
              </a>
              <a href="mailto:info@nehnutelnostivzahranici.sk" className="flex items-center gap-2 hover:text-[#c9a84c] transition-colors">
                <span className="text-[#c9a84c]">✉️</span> info@nehnutelnostivzahranici.sk
              </a>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-white/40 text-sm">© 2026 Nehnuteľnosti v zahraničí. {tr("rights")}</p>
            <a href="https://www.nehnutelnostivzahranici.sk/ochrana-sukromia/" target="_blank" rel="noopener noreferrer" className="text-[#c9a84c] text-sm hover:underline">
              {tr("privacy")}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function PublicHome() {
  return (
    <PublicLanguageProvider>
      <PublicHomeInner />
    </PublicLanguageProvider>
  );
}