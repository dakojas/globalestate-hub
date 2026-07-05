import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Bed, Maximize, Home, X, Menu, MessageCircle } from "lucide-react";
import CountryMap from "@/components/public/CountryMap";
import Logo from "@/components/Logo";
import GlobeWireframe from "@/components/public/GlobeWireframe";
import HomeAboutStory from "@/components/public/HomeAboutStory";
import BuyingProcessTimeline from "@/components/public/BuyingProcessTimeline";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { PublicLanguageProvider, usePublicLang } from "@/components/PublicLanguageContext";
import PublicLangSwitcher from "@/components/PublicLangSwitcher";

const COUNTRIES = ["Albania", "Bali", "Hungary", "Bulgaria", "Croatia", "Dominican Republic", "Egypt", "Georgia", "Mauritius", "Oman", "UAE", "Spain", "Italy", "Thailand", "Turkey"];

const COUNTRY_NAMES = {
  sk: { Albania: "Albánsko", Bali: "Bali", Hungary: "Maďarsko", Bulgaria: "Bulharsko", Croatia: "Chorvátsko", "Dominican Republic": "Dominikánska republika", Egypt: "Egypt", Georgia: "Gruzínsko", Mauritius: "Maurícius", Oman: "Omán", UAE: "SAE (Dubaj)", Spain: "Španielsko", Italy: "Taliansko", Thailand: "Thajsko", Turkey: "Turecko" },
  en: { Albania: "Albania", Bali: "Bali", Hungary: "Hungary", Bulgaria: "Bulgaria", Croatia: "Croatia", "Dominican Republic": "Dominican Republic", Egypt: "Egypt", Georgia: "Georgia", Mauritius: "Mauritius", Oman: "Oman", UAE: "UAE (Dubai)", Spain: "Spain", Italy: "Italy", Thailand: "Thailand", Turkey: "Turkey" },
  de: { Albania: "Albanien", Bali: "Bali", Hungary: "Ungarn", Bulgaria: "Bulgarien", Croatia: "Kroatien", "Dominican Republic": "Dominikanische Republik", Egypt: "Ägypten", Georgia: "Georgien", Mauritius: "Mauritius", Oman: "Oman", UAE: "VAE (Dubai)", Spain: "Spanien", Italy: "Italien", Thailand: "Thailand", Turkey: "Türkei" },
  fr: { Albania: "Albanie", Bali: "Bali", Hungary: "Hongrie", Bulgaria: "Bulgarie", Croatia: "Croatie", "Dominican Republic": "République dominicaine", Egypt: "Égypte", Georgia: "Géorgie", Mauritius: "Maurice", Oman: "Oman", UAE: "EAU (Dubaï)", Spain: "Espagne", Italy: "Italie", Thailand: "Thaïlande", Turkey: "Turquie" },
  it: { Albania: "Albania", Bali: "Bali", Hungary: "Ungheria", Bulgaria: "Bulgaria", Croatia: "Croazia", "Dominican Republic": "Repubblica Dominicana", Egypt: "Egitto", Georgia: "Georgia", Mauritius: "Mauritius", Oman: "Oman", UAE: "EAU (Dubai)", Spain: "Spagna", Italy: "Italia", Thailand: "Tailandia", Turkey: "Turchia" },
  ru: { Albania: "Албания", Bali: "Бали", Hungary: "Венгрия", Bulgaria: "Болгария", Croatia: "Хорватия", "Dominican Republic": "Доминиканская Республика", Egypt: "Египет", Georgia: "Грузия", Mauritius: "Маврикий", Oman: "Оман", UAE: "ОАЭ (Дубай)", Spain: "Испания", Italy: "Италия", Thailand: "Таиланд", Turkey: "Турция" },
  pl: { Albania: "Albania", Bali: "Bali", Hungary: "Węgry", Bulgaria: "Bułgaria", Croatia: "Chorwacja", "Dominican Republic": "Dominikana", Egypt: "Egipt", Georgia: "Gruzja", Mauritius: "Mauritius", Oman: "Oman", UAE: "ZEA (Dubaj)", Spain: "Hiszpania", Italy: "Włochy", Thailand: "Tajlandia", Turkey: "Turcja" },
  hu: { Albania: "Albánia", Bali: "Bali", Hungary: "Magyarország", Bulgaria: "Bulgária", Croatia: "Horvátország", "Dominican Republic": "Dominikai Köztársaság", Egypt: "Egyiptom", Georgia: "Grúzia", Mauritius: "Mauritius", Oman: "Omán", UAE: "EAE (Dubai)", Spain: "Spanyolország", Italy: "Olaszország", Thailand: "Thaiföld", Turkey: "Törökország" },
};

const PROPERTY_TYPE_LABELS = {
  sk: { studio: "Štúdio", "1_bedroom": "1 spálňa", "2_bedroom": "2 spálne", penthouse: "Penthouse", vila: "Vila" },
  en: { studio: "Studio", "1_bedroom": "1 Bedroom", "2_bedroom": "2 Bedrooms", penthouse: "Penthouse", vila: "Villa" },
  de: { studio: "Studio", "1_bedroom": "1 Schlafzimmer", "2_bedroom": "2 Schlafzimmer", penthouse: "Penthouse", vila: "Villa" },
  fr: { studio: "Studio", "1_bedroom": "1 Chambre", "2_bedroom": "2 Chambres", penthouse: "Penthouse", vila: "Villa" },
  it: { studio: "Monolocale", "1_bedroom": "1 Camera", "2_bedroom": "2 Camere", penthouse: "Penthouse", vila: "Villa" },
  ru: { studio: "Студия", "1_bedroom": "1 спальня", "2_bedroom": "2 спальни", penthouse: "Пентхаус", vila: "Вилла" },
  pl: { studio: "Studio", "1_bedroom": "1 sypialnia", "2_bedroom": "2 sypialnie", penthouse: "Penthouse", vila: "Willa" },
  hu: { studio: "Stúdió", "1_bedroom": "1 hálószoba", "2_bedroom": "2 hálószoba", penthouse: "Penthouse", vila: "Villa" },
};

function slugify(text) {
  return (text || "")
    .toLowerCase()
    .replace(/[áàäâ]/g, "a").replace(/[éèëê]/g, "e").replace(/[íìïî]/g, "i")
    .replace(/[óòöôõ]/g, "o").replace(/[úùüû]/g, "u").replace(/[ýÿ]/g, "y")
    .replace(/[čć]/g, "c").replace(/š/g, "s").replace(/ž/g, "z").replace(/ň/g, "n")
    .replace(/ľĺ/g, "l").replace(/ř/g, "r").replace(/ď/g, "d").replace(/ť/g, "t")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function PropertyCard({ property, getCountryName, getTypeName, tr, lang, hideFeaturedBadge }) {
  const slug = property.slug || slugify(property.title) + "-" + property.id.slice(-6);
  return (
    <Link to={`/nehnutelnost/${slug}`} className="group block">
      <div className="rounded-xl overflow-hidden border border-[#c5a065]/20 bg-[#16223a] hover:border-[#c5a065]/60 transition-all duration-300 hover:shadow-xl hover:shadow-[#c5a065]/10">
        <div className="aspect-[4/3] relative overflow-hidden">
          {property.images?.[0] ? (
            <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#0e1a2e]">
              <Home className="w-10 h-10 text-white/20" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
            <span className="bg-[#c5a065] text-[#0a0a0a] text-[10px] font-bold px-2 py-0.5 rounded">{getCountryName(property.country)}</span>
            {property.construction_phase && (
              <span className={`text-white text-[10px] font-semibold px-2 py-0.5 rounded ${property.construction_phase === "vo_vystavbe" ? "bg-orange-500" : "bg-emerald-600"}`}>
                {property.construction_phase === "vo_vystavbe"
                  ? (lang === "sk" ? "Vo výstavbe" : "Off Plan")
                  : (lang === "sk" ? "Dokončené" : "Completed")}
              </span>
            )}
          </div>
          {!hideFeaturedBadge && property.is_featured && (
            <div className="absolute top-2 left-2">
              <span className="bg-[#c5a065] text-[#0a0a0a] text-[10px] font-black px-2 py-0.5 rounded">⭐ TOP</span>
            </div>
          )}
        </div>
        <div className="p-3">
          <h3 className="text-white font-semibold text-sm line-clamp-1 mb-1">{property.title}</h3>
          <p className="text-white/50 text-xs flex items-center gap-1 mb-2">
            <MapPin className="w-3 h-3" />{property.city}
          </p>
          <div className="flex items-center gap-3 text-white/40 text-xs mb-2">
            {property.bedrooms && <span className="flex items-center gap-1"><Bed className="w-3 h-3" />{property.bedrooms}</span>}
            {property.area_sqm && <span className="flex items-center gap-1"><Maximize className="w-3 h-3" />{property.area_sqm} m²</span>}
          </div>
          <div className="flex items-center justify-between">
            <p className="text-[#c5a065] font-bold text-base">{property.currency === "USD" ? "$" : property.currency === "THB" ? "฿" : "€"}{property.price?.toLocaleString()}</p>
            <span className="text-[10px] bg-[#c5a065] text-[#0a0a0a] font-semibold px-2 py-0.5 rounded cursor-pointer hover:bg-[#a88950] transition-colors">
              {tr("detail")}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function PublicHomeInner() {
  const { tr, lang } = usePublicLang();
  const [filters, setFilters] = useState({ country: "all", minBudget: "", maxBudget: "", propertyType: "all", constructionPhase: "all" });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMapSelect = (country) => {
    setFilters(f => ({ ...f, country }));
    document.getElementById("destinations")?.scrollIntoView({ behavior: "smooth" });
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

  const displayFeatured = properties
    .filter(p => p.is_featured && p.status === "available")
    .reduce((acc, p) => {
      if (!acc.find(x => x.country === p.country)) acc.push(p);
      return acc;
    }, [])
    .slice(0, 5);

  const getTypeName = (type) => (PROPERTY_TYPE_LABELS[lang]?.[type] || PROPERTY_TYPE_LABELS.en[type] || type);
  const getCountryName = (country) => country ? (COUNTRY_NAMES[lang]?.[country] || country) : country;

  return (
    <div className="min-h-screen font-body" style={{ background: "linear-gradient(180deg, #0e1a2e 0%, #0c1626 100%)" }}>
      <style>{`
        .gold-border { border: 1px solid rgba(197,160,101,0.3); }
        .gold-border:hover { border-color: rgba(197,160,101,0.7); }
        .glass-dark { background: rgba(14,26,46,0.82); backdrop-filter: blur(12px); }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-50 glass-dark border-b border-[#c5a065]/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link to="/"><Logo className="h-9" /></Link>
          <nav className="hidden md:flex items-center gap-7">
            <a href="#destinations" className="text-white/60 hover:text-[#c5a065] transition-colors text-sm tracking-wide">{tr("offers")}</a>
            <a href="#destinations" className="text-white/60 hover:text-[#c5a065] transition-colors text-sm tracking-wide">{tr("contact")}</a>
            <a href="https://wa.me/421951094706" target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-1.5 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-semibold text-xs px-3.5 py-2 rounded-full transition-all duration-200 shadow-lg shadow-[#25D366]/30 hover:shadow-[#25D366]/50 hover:scale-105">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <span>WhatsApp</span>
            </a>
            <a href="https://calendly.com/nehnutelnostivzahranici/30min" target="_blank" rel="noopener noreferrer">
              <Button size="sm" className="bg-[#c5a065] hover:bg-[#a88950] text-black font-semibold text-xs px-5">{tr("bookConsultation")}</Button>
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <PublicLangSwitcher />
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-white/70 hover:text-[#c5a065] p-1.5">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#c5a065]/15 glass-dark">
            <div className="px-4 py-4 space-y-1">
              <a href="#destinations" onClick={() => setMobileMenuOpen(false)} className="block text-white/70 hover:text-[#c5a065] py-2.5 text-sm">{tr("offers")}</a>
              <a href="#destinations" onClick={() => setMobileMenuOpen(false)} className="block text-white/70 hover:text-[#c5a065] py-2.5 text-sm">{tr("contact")}</a>
              <a href="https://calendly.com/nehnutelnostivzahranici/30min" target="_blank" rel="noopener noreferrer" className="block bg-[#c5a065] text-black font-semibold text-sm text-center py-2.5 rounded mt-2">{tr("bookConsultation")}</a>
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden px-4 sm:px-6 pt-12 pb-10 md:pt-20 md:pb-16"
        style={{ background: "linear-gradient(135deg, #0a1423 0%, #122036 100%)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-semibold text-white mb-4 leading-[1.1]">
                {tr("heroTitle")} <span className="text-[#c5a065]">{tr("heroTitleHighlight")}</span>
              </h1>
              <p className="text-white/75 text-base sm:text-lg mb-8 max-w-xl leading-relaxed">{tr("heroSubtitle")}</p>
              <div className="flex flex-wrap gap-3">
                <a href="https://calendly.com/nehnutelnostivzahranici/30min" target="_blank" rel="noopener noreferrer">
                  <Button className="bg-[#c5a065] hover:bg-[#a88950] text-black font-semibold px-6 h-11 text-sm">{tr("bookConsultation")}</Button>
                </a>
              </div>
            </div>
            <div className="hidden lg:block">
              <GlobeWireframe className="max-w-md mx-auto" />
            </div>
          </div>
        </div>
      </section>

      {/* Map + Properties */}
      <section id="destinations" className="px-4 sm:px-6 py-12 md:py-16" style={{ background: "transparent" }}>
        <div className="max-w-7xl mx-auto">
          {/* Map */}
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-[#c5a065]/20" />
            <h3 className="text-white text-sm font-semibold tracking-wide">{tr("exploreMap")}</h3>
            <div className="h-px flex-1 bg-[#c5a065]/20" />
          </div>
          <p className="text-white/65 text-sm text-center mb-6 max-w-2xl mx-auto">{tr("exploreMapSub")}</p>
          <div className="relative rounded-xl overflow-hidden gold-border mb-8" style={{ background: "rgba(22,34,58,0.5)", minHeight: 160 }}>
            <CountryMap
              propertiesByCountry={propertiesByCountry}
              selectedCountry={filters.country}
              onSelectCountry={handleMapSelect}
              getCountryName={getCountryName}
              lang={lang}
            />
            {filters.country !== "all" && (
              <button onClick={() => handleMapSelect("all")}
                className="absolute top-3 right-3 z-[1000] bg-[#c5a065] hover:bg-[#a88950] text-black text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1">
                <X className="w-3 h-3" /> {getCountryName(filters.country)}
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="rounded-xl gold-border p-4 mb-6" style={{ background: "rgba(22,34,58,0.6)" }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              <Select value={filters.country} onValueChange={v => setFilters({ ...filters, country: v })}>
                <SelectTrigger className="bg-[#16223a] border-[#c5a065]/30 text-white/80 text-sm h-9">
                  <SelectValue placeholder={tr("allCountries")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{tr("allCountries")}</SelectItem>
                  {COUNTRIES.map(c => <SelectItem key={c} value={c}>{getCountryName(c)}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={filters.propertyType} onValueChange={v => setFilters({ ...filters, propertyType: v })}>
                <SelectTrigger className="bg-[#16223a] border-[#c5a065]/30 text-white/80 text-sm h-9">
                  <SelectValue placeholder={tr("allTypes")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{tr("allTypes")}</SelectItem>
                  {Object.keys(PROPERTY_TYPE_LABELS.en).map(type => (
                    <SelectItem key={type} value={type}>{getTypeName(type)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filters.constructionPhase} onValueChange={v => setFilters({ ...filters, constructionPhase: v })}>
                <SelectTrigger className="bg-[#16223a] border-[#c5a065]/30 text-white/80 text-sm h-9">
                  <SelectValue placeholder={lang === "sk" ? "Fáza projektu" : "Phase"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{lang === "sk" ? "Všetky fázy" : "All phases"}</SelectItem>
                  <SelectItem value="vo_vystavbe">{lang === "sk" ? "Vo výstavbe / Off Plan" : "Off Plan"}</SelectItem>
                  <SelectItem value="dokoncene">{lang === "sk" ? "Dokončené" : "Completed"}</SelectItem>
                </SelectContent>
              </Select>
              <Input type="number" placeholder={tr("minPrice")} value={filters.minBudget}
                onChange={e => setFilters({ ...filters, minBudget: e.target.value })}
                className="bg-[#16223a] border-[#c5a065]/30 text-white placeholder:text-white/30 h-9 text-sm" />
              <Input type="number" placeholder={tr("maxPrice")} value={filters.maxBudget}
                onChange={e => setFilters({ ...filters, maxBudget: e.target.value })}
                className="bg-[#16223a] border-[#c5a065]/30 text-white placeholder:text-white/30 h-9 text-sm" />
            </div>
          </div>

          {/* Featured */}
          {displayFeatured.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[#c5a065] text-lg">⭐</span>
                <h3 className="text-base font-bold text-white tracking-wide">
                  {lang === "sk" ? "Odporúčané" : "Featured"}
                </h3>
                <div className="h-px flex-1 bg-[#c5a065]/20" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {displayFeatured.map(p => (
                  <PropertyCard key={p.id} property={p} getCountryName={getCountryName} getTypeName={getTypeName} tr={tr} lang={lang} />
                ))}
              </div>
            </div>
          )}

          {/* All properties */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white tracking-wide">{tr("availableOffers")}</h3>
            <span className="text-white/55 text-sm">{filtered.length} {tr("properties")}</span>
          </div>
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-white/45 text-lg">{tr("noProperties")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filtered.map(p => (
                  <PropertyCard key={p.id} property={p} getCountryName={getCountryName} getTypeName={getTypeName} tr={tr} lang={lang} hideFeaturedBadge />
                ))}
            </div>
          )}
        </div>
      </section>

      {/* Buying Process Timeline */}
      <section className="px-4 sm:px-6 py-12 md:py-16" style={{ background: "transparent" }}>
        <div className="max-w-5xl mx-auto">
          <BuyingProcessTimeline lang={lang} />
        </div>
      </section>

      {/* About / Brand Story */}
      <HomeAboutStory />

      {/* Mobile WhatsApp */}
      <a href="https://wa.me/421951094706" target="_blank" rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#25D366] text-white font-semibold px-4 py-3 rounded-full shadow-2xl">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        WhatsApp
      </a>

      {/* Footer */}
      <footer id="contact" style={{ background: "#0b1422", borderTop: "1px solid rgba(197,160,101,0.2)" }} className="px-4 sm:px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <Link to="/"><Logo className="h-10" /></Link>
            <div className="flex flex-col sm:flex-row items-center gap-6 text-white/50 text-sm">
              <a href="tel:+421951094706" className="flex items-center gap-2 hover:text-[#c5a065] transition-colors">
                <span className="text-[#c5a065]">📞</span> +421 951 094 706
              </a>
              <a href="mailto:info@globeya.com" className="flex items-center gap-2 hover:text-[#c5a065] transition-colors">
                <span className="text-[#c5a065]">✉️</span> info@globeya.com
              </a>
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(197,160,101,0.1)" }} className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-white/30 text-xs">© 2026 GLOBEYA. {tr("rights")}</p>
            <div className="flex items-center gap-4">
              <Link to={createPageUrl("PublicAbout")} className="text-[#c5a065]/60 hover:text-[#c5a065] text-xs transition-colors">{tr("aboutUs")}</Link>
              <Link to={createPageUrl("PublicFAQ")} className="text-[#c5a065]/60 hover:text-[#c5a065] text-xs transition-colors">FAQ</Link>
              <Link to={createPageUrl("PublicGDPR")} className="text-[#c5a065]/60 hover:text-[#c5a065] text-xs transition-colors">{tr("privacy")}</Link>
              <Link to={createPageUrl("PublicSubmit")} className="text-[#c5a065]/60 hover:text-[#c5a065] text-xs transition-colors">{tr("listProperty")}</Link>
              <Link to={createPageUrl("PublicPouceniePreKlienta")} className="text-[#c5a065]/60 hover:text-[#c5a065] text-xs transition-colors">Poučenie pre klienta</Link>
              <Link to={createPageUrl("PublicReklamacnyPoriadok")} className="text-[#c5a065]/60 hover:text-[#c5a065] text-xs transition-colors">Reklamačný poriadok</Link>
            </div>
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