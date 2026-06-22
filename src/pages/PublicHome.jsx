import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Bed, Maximize, Home, X, Search, Menu } from "lucide-react";
import CountryMap from "@/components/public/CountryMap";
import Logo from "@/components/Logo";
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

function PropertyCard({ property, getCountryName, getTypeName, tr, lang }) {
  const slug = property.slug || slugify(property.title) + "-" + property.id.slice(-6);
  return (
    <Link to={`/nehnutelnost/${slug}`} className="group block">
      <div className="rounded-xl overflow-hidden border border-[#c9a84c]/20 bg-[#0d1b35] hover:border-[#c9a84c]/60 transition-all duration-300 hover:shadow-xl hover:shadow-[#c9a84c]/10">
        <div className="aspect-[4/3] relative overflow-hidden">
          {property.images?.[0] ? (
            <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#0a1628]">
              <Home className="w-10 h-10 text-white/20" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
            <span className="bg-[#c9a84c] text-[#0a0a0a] text-[10px] font-bold px-2 py-0.5 rounded">{getCountryName(property.country)}</span>
            {property.construction_phase && (
              <span className={`text-white text-[10px] font-semibold px-2 py-0.5 rounded ${property.construction_phase === "vo_vystavbe" ? "bg-orange-500" : "bg-emerald-600"}`}>
                {property.construction_phase === "vo_vystavbe"
                  ? (lang === "sk" ? "Vo výstavbe" : "Off Plan")
                  : (lang === "sk" ? "Dokončené" : "Completed")}
              </span>
            )}
          </div>
          {property.is_featured && (
            <div className="absolute top-2 left-2">
              <span className="bg-[#c9a84c] text-[#0a0a0a] text-[10px] font-black px-2 py-0.5 rounded">⭐ TOP</span>
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
            <p className="text-[#c9a84c] font-bold text-base">€{property.price?.toLocaleString()}</p>
            <span className="text-[10px] bg-[#c9a84c] text-[#0a0a0a] font-semibold px-2 py-0.5 rounded cursor-pointer hover:bg-[#b8973b] transition-colors">
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
  const [mapCountry, setMapCountry] = useState("all");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const displayFeatured = properties.filter(p => p.is_featured && p.status === "available");

  const getTypeName = (type) => (PROPERTY_TYPE_LABELS[lang]?.[type] || PROPERTY_TYPE_LABELS.en[type] || type);
  const getCountryName = (country) => country ? (COUNTRY_NAMES[lang]?.[country] || country) : country;

  return (
    <div className="min-h-screen" style={{ background: "#0a0f1e" }}>
      <style>{`
        .gold-border { border: 1px solid rgba(201,168,76,0.3); }
        .gold-border:hover { border-color: rgba(201,168,76,0.7); }
        .glass-dark { background: rgba(13,27,53,0.8); backdrop-filter: blur(12px); }
        .gold-glow { box-shadow: 0 0 30px rgba(201,168,76,0.15), inset 0 0 30px rgba(201,168,76,0.05); }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-50 glass-dark border-b border-[#c9a84c]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Logo className="h-8 sm:h-9" />
          <nav className="hidden md:flex items-center gap-8">
            <Link to={createPageUrl("PublicAbout")} className="text-white/60 hover:text-[#c9a84c] transition-colors text-sm tracking-wide">{tr("aboutUs")}</Link>
            <a href="#properties" className="text-white/60 hover:text-[#c9a84c] transition-colors text-sm tracking-wide">{tr("offers")}</a>
            <a href="#contact" className="text-white/60 hover:text-[#c9a84c] transition-colors text-sm tracking-wide">{tr("contact")}</a>
            <Link to={createPageUrl("PublicSubmit")}>
              <Button size="sm" className="bg-[#c9a84c] hover:bg-[#b8973b] text-black font-semibold text-xs px-4">{tr("listProperty")}</Button>
            </Link>
            <a href="https://wa.me/421951094706" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-[#25D366] hover:bg-[#1eb956] text-white text-xs font-semibold px-3 py-1.5 rounded transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <PublicLangSwitcher />
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-white/70 hover:text-[#c9a84c] p-1.5">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#c9a84c]/20 glass-dark">
            <div className="px-4 py-4 space-y-1">
              <Link to={createPageUrl("PublicAbout")} onClick={() => setMobileMenuOpen(false)} className="block text-white/70 hover:text-[#c9a84c] py-2.5 text-sm">{tr("aboutUs")}</Link>
              <a href="#properties" onClick={() => setMobileMenuOpen(false)} className="block text-white/70 hover:text-[#c9a84c] py-2.5 text-sm">{tr("offers")}</a>
              <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="block text-white/70 hover:text-[#c9a84c] py-2.5 text-sm">{tr("contact")}</a>
              <Link to={createPageUrl("PublicSubmit")} onClick={() => setMobileMenuOpen(false)} className="block bg-[#c9a84c] text-black font-semibold text-sm text-center py-2.5 rounded mt-2">{tr("listProperty")}</Link>
              <a href="https://wa.me/421951094706" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 bg-[#25D366] text-white text-sm font-semibold py-2.5 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative pt-12 pb-10 px-4 sm:px-6 md:pt-20 md:pb-12" style={{ background: "linear-gradient(135deg, #080d1a 0%, #0d1b35 50%, #080d1a 100%)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 md:mb-10">
            <p className="text-[#c9a84c] text-xs uppercase tracking-[0.3em] font-semibold mb-3">Premium Real Estate</p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-3 leading-tight">
              {tr("heroTitle")} <span className="text-[#c9a84c]">{tr("heroTitleHighlight")}</span>
            </h1>
            <p className="text-white/70 text-lg sm:text-xl font-semibold mb-2 max-w-2xl">
              {lang === "sk" ? "Začnite svoj príbeh v zahraničí s nami!" : lang === "en" ? "Start your story abroad with us!" : lang === "de" ? "Beginnen Sie Ihre Geschichte im Ausland mit uns!" : lang === "fr" ? "Commencez votre histoire à l'étranger avec nous !" : lang === "it" ? "Inizia la tua storia all'estero con noi!" : lang === "ru" ? "Начните свою историю за рубежом с нами!" : lang === "pl" ? "Zacznij swoją historię za granicą z nami!" : lang === "hu" ? "Kezdje el külföldi történetét velünk!" : "Začnite svoj príbeh v zahraničí s nami!"}
            </p>
            <p className="text-white/50 text-sm sm:text-base mb-6 max-w-2xl">
              {lang === "sk" ? "Ak hľadáte miesto, kde by ste mohli napísať novú kapitolu vášho života alebo hľadáte atraktívnu investičnú príležitosť, sme tu pre vás." : lang === "en" ? "Whether you're looking for a place to write a new chapter of your life or seeking an attractive investment opportunity, we are here for you." : lang === "de" ? "Ob Sie einen Ort suchen, an dem Sie ein neues Kapitel Ihres Lebens schreiben können, oder eine attraktive Investitionsmöglichkeit suchen – wir sind für Sie da." : lang === "fr" ? "Que vous cherchiez un endroit pour écrire un nouveau chapitre de votre vie ou une opportunité d'investissement attrayante, nous sommes là pour vous." : lang === "it" ? "Che tu stia cercando un posto dove scrivere un nuovo capitolo della tua vita o un'attraente opportunità di investimento, siamo qui per te." : lang === "ru" ? "Если вы ищете место, где можно написать новую главу вашей жизни, или ищете привлекательную инвестиционную возможность — мы здесь для вас." : lang === "pl" ? "Jeśli szukasz miejsca, gdzie możesz napisać nowy rozdział swojego życia lub szukasz atrakcyjnej okazji inwestycyjnej, jesteśmy tu dla Ciebie." : lang === "hu" ? "Legyen szó arról, hogy helyet keres, ahol élete új fejezetét írhatná, vagy vonzó befektetési lehetőséget keres, mi itt vagyunk Önért." : "Ak hľadáte miesto, kde by ste mohli napísať novú kapitolu vášho života alebo hľadáte atraktívnu investičnú príležitosť, sme tu pre vás."}
            </p>
            <a href="https://calendly.com/nehnutelnostivzahranici/30min" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#c9a84c] hover:bg-[#b8973b] text-black font-bold px-6 py-2.5 rounded text-sm transition-all">
              📅 {tr("bookConsultation")}
            </a>
          </div>

          {/* Filter box */}
          <div className="rounded-xl gold-border gold-glow p-4 sm:p-5" style={{ background: "rgba(10,22,40,0.9)", border: "1px solid rgba(201,168,76,0.4)" }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-3">
              <Select value={filters.country} onValueChange={v => setFilters({...filters, country: v})}>
                <SelectTrigger className="bg-[#0d1b35] border-[#c9a84c]/30 text-white/80 text-sm h-9">
                  <SelectValue placeholder={tr("allCountries")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{tr("allCountries")}</SelectItem>
                  {COUNTRIES.map(c => <SelectItem key={c} value={c}>{getCountryName(c)}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={filters.propertyType} onValueChange={v => setFilters({...filters, propertyType: v})}>
                <SelectTrigger className="bg-[#0d1b35] border-[#c9a84c]/30 text-white/80 text-sm h-9">
                  <SelectValue placeholder={tr("allTypes")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{tr("allTypes")}</SelectItem>
                  {Object.keys(PROPERTY_TYPE_LABELS.en).map(type => (
                    <SelectItem key={type} value={type}>{getTypeName(type)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filters.constructionPhase} onValueChange={v => setFilters({...filters, constructionPhase: v})}>
                <SelectTrigger className="bg-[#0d1b35] border-[#c9a84c]/30 text-white/80 text-sm h-9">
                  <SelectValue placeholder={lang === "sk" ? "Fáza projektu" : "Phase"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{lang === "sk" ? "Všetky fázy" : "All phases"}</SelectItem>
                  <SelectItem value="vo_vystavbe">🏗 {lang === "sk" ? "Vo výstavbe / Off Plan" : "Off Plan"}</SelectItem>
                  <SelectItem value="dokoncene">✅ {lang === "sk" ? "Dokončené" : "Completed"}</SelectItem>
                </SelectContent>
              </Select>
              <Input type="number" placeholder={tr("minPrice")} value={filters.minBudget}
                onChange={e => setFilters({...filters, minBudget: e.target.value})}
                className="bg-[#0d1b35] border-[#c9a84c]/30 text-white placeholder:text-white/30 h-9 text-sm" />
              <Input type="number" placeholder={tr("maxPrice")} value={filters.maxBudget}
                onChange={e => setFilters({...filters, maxBudget: e.target.value})}
                className="bg-[#0d1b35] border-[#c9a84c]/30 text-white placeholder:text-white/30 h-9 text-sm" />
            </div>
            <div className="flex justify-end">
              <Button className="w-full sm:w-auto bg-[#c9a84c] hover:bg-[#b8973b] text-black font-bold px-8 text-sm gap-2">
                <Search className="w-4 h-4" /> {lang === "sk" ? "Hľadať" : "Search"}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="px-4 sm:px-6 py-8" style={{ background: "#080d1a" }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-[#c9a84c]/20" />
            <h2 className="text-white text-lg font-semibold tracking-wide">{tr("exploreMap")}</h2>
            <div className="h-px flex-1 bg-[#c9a84c]/20" />
          </div>
          <div className="relative rounded-xl overflow-hidden gold-border" style={{ background: "rgba(13,27,53,0.6)", minHeight: 160 }}>
            <CountryMap
              propertiesByCountry={propertiesByCountry}
              selectedCountry={filters.country}
              onSelectCountry={handleMapSelect}
              getCountryName={getCountryName}
              lang={lang}
            />
            {filters.country !== "all" && (
              <button onClick={() => handleMapSelect("all")}
                className="absolute top-3 right-3 z-[1000] bg-[#c9a84c] hover:bg-[#b8973b] text-black text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1">
                <X className="w-3 h-3" /> {getCountryName(filters.country)}
              </button>
            )}
          </div>
        </div>
      </section>

      {/* O nás / Brand story */}
      <section className="px-4 sm:px-6 py-10 md:py-14" style={{ background: "#0a0f1e" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[#c9a84c] text-xs uppercase tracking-[0.3em] font-semibold mb-3">
                {lang === "sk" ? "O nás" : lang === "en" ? "About Us" : lang === "de" ? "Über uns" : lang === "fr" ? "À propos" : lang === "it" ? "Chi siamo" : lang === "ru" ? "О нас" : lang === "pl" ? "O nas" : "O nás"}
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                {lang === "sk" ? "Začali sme ako malý slovenský sen." : lang === "en" ? "We started a small Slovak dream." : lang === "de" ? "Wir haben einen kleinen slowakischen Traum gestartet." : lang === "fr" ? "Nous avons commencé un petit rêve slovaque." : lang === "it" ? "Abbiamo iniziato un piccolo sogno slovacco." : lang === "ru" ? "Мы начали с маленькой словацкой мечты." : lang === "pl" ? "Zaczęliśmy od małego słowackiego marzenia." : "Začali sme ako malý slovenský sen."}
              </h2>
              <p className="text-white/60 leading-relaxed mb-4">
                {lang === "sk"
                  ? "Sme slovenská realitná kancelária špecializujúca sa na predaj zahraničných nehnuteľností. Pomáhame Slovákom a klientom z celej Európy investovať do nehnuteľností v top destináciách sveta."
                  : lang === "en"
                  ? "We are a Slovak real estate agency specializing in selling properties abroad. We help Slovaks and clients from across Europe invest in properties in the world's top destinations."
                  : lang === "de"
                  ? "Wir sind eine slowakische Immobilienagentur, die sich auf den Verkauf von Immobilien im Ausland spezialisiert hat. Wir helfen Slowaken und Kunden aus ganz Europa, in Immobilien in den besten Zielen der Welt zu investieren."
                  : lang === "fr"
                  ? "Nous sommes une agence immobilière slovaque spécialisée dans la vente de propriétés à l'étranger. Nous aidons les Slovaques et les clients de toute l'Europe à investir dans des propriétés dans les meilleures destinations du monde."
                  : "We are a Slovak real estate agency specializing in selling properties abroad. We help clients from across Europe invest in the world's top destinations."}
              </p>
              <div className="flex flex-wrap gap-6 mt-6">
                <div>
                  <p className="text-3xl font-bold text-[#c9a84c]">500+</p>
                  <p className="text-white/50 text-sm">{lang === "sk" ? "spokojných klientov" : "satisfied clients"}</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-[#c9a84c]">15+</p>
                  <p className="text-white/50 text-sm">{lang === "sk" ? "krajín sveta" : "countries worldwide"}</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-[#c9a84c]">7+</p>
                  <p className="text-white/50 text-sm">{lang === "sk" ? "rokov skúseností" : "years of experience"}</p>
                </div>
              </div>
              <Link to={createPageUrl("PublicAbout")} className="inline-flex items-center gap-2 mt-8 text-[#c9a84c] hover:text-[#e8d5a0] font-semibold text-sm transition-colors border border-[#c9a84c]/40 hover:border-[#c9a84c] px-5 py-2.5 rounded">
                {lang === "sk" ? "Zistiť viac o nás →" : lang === "en" ? "Learn more about us →" : "Zistiť viac →"}
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: "🌍", title: lang === "sk" ? "Overení developeri" : "Verified Developers", desc: lang === "sk" ? "Spolupracujeme len s preverenými partnermi" : "We work only with verified partners" },
                { icon: "💰", title: lang === "sk" ? "Výhodné podmienky" : "Favorable Terms", desc: lang === "sk" ? "Splátkové kalendáre bez bankového úveru" : "Payment plans without bank loans" },
                { icon: "🏡", title: lang === "sk" ? "Správa nehnuteľnosti" : "Property Management", desc: lang === "sk" ? "Postaráme sa o váš apartmán" : "We take care of your apartment" },
                { icon: "📋", title: lang === "sk" ? "Právna podpora" : "Legal Support", desc: lang === "sk" ? "Kompletná právna dokumentácia" : "Complete legal documentation" },
              ].map((item, i) => (
                <div key={i} className="rounded-xl p-4" style={{ background: "rgba(13,27,53,0.7)", border: "1px solid rgba(201,168,76,0.2)" }}>
                  <p className="text-2xl mb-2">{item.icon}</p>
                  <p className="text-white font-semibold text-sm mb-1">{item.title}</p>
                  <p className="text-white/40 text-xs leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured */}
      {displayFeatured.length > 0 && (
        <section className="px-4 sm:px-6 py-10" style={{ background: "#0a0f1e" }}>
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-[#c9a84c] text-xl">⭐</span>
              <h2 className="text-xl font-bold text-white tracking-wide">
                {lang === "sk" ? "Odporúčané" : lang === "en" ? "Featured" : lang === "de" ? "Ausgewählt" : lang === "fr" ? "En vedette" : "Featured"}
              </h2>
              <div className="h-px flex-1 bg-[#c9a84c]/20" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {displayFeatured.map(property => (
                <PropertyCard key={property.id} property={property} getCountryName={getCountryName} getTypeName={getTypeName} tr={tr} lang={lang} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All properties */}
      <section id="properties" className="px-4 sm:px-6 py-10" style={{ background: "#080d1a" }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-white tracking-wide">{tr("availableOffers")}</h2>
              <div className="h-px w-16 bg-[#c9a84c]/30" />
            </div>
            <span className="text-white/40 text-sm">{filtered.length} {tr("properties")}</span>
          </div>
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-white/30 text-lg">{tr("noProperties")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filtered.map(property => (
                <PropertyCard key={property.id} property={property} getCountryName={getCountryName} getTypeName={getTypeName} tr={tr} lang={lang} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Motto */}
      <section className="px-4 sm:px-6 py-12 md:py-16" style={{ background: "#0a0f1e" }}>
        <div className="max-w-3xl mx-auto">
          <div className="rounded-xl p-6 sm:p-10 text-center gold-glow" style={{ border: "1px solid rgba(201,168,76,0.4)", background: "rgba(13,27,53,0.6)" }}>
            <p className="text-[#c9a84c] text-xs uppercase tracking-[0.3em] mb-4">NAŠE MOTTO</p>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#c9a84c] mb-3">
              <em>{lang === "sk" ? "Svet je väčší, než si myslíte." : lang === "en" ? "The world is bigger than you think." : lang === "de" ? "Die Welt ist größer als Sie denken." : lang === "fr" ? "Le monde est plus grand que vous ne le pensez." : lang === "it" ? "Il mondo è più grande di quanto pensi." : lang === "ru" ? "Мир больше, чем вы думаете." : lang === "pl" ? "Świat jest większy niż myślisz." : "Svet je väčší, než si myslíte."}</em>
            </h3>
            <p className="text-xl text-white/60">
              <em>{lang === "sk" ? "Vaše možnosti tiež." : lang === "en" ? "So are your possibilities." : "Vaše možnosti tiež."}</em>
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 sm:px-6 py-10" style={{ background: "#080d1a", borderTop: "1px solid rgba(201,168,76,0.15)" }}>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-white text-lg font-semibold mb-4">{tr("bookConsultation")}</p>
          <a href="https://calendly.com/nehnutelnostivzahranici/30min" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#c9a84c] hover:bg-[#b8973b] text-black font-bold px-10 py-3.5 rounded text-base transition-all shadow-lg shadow-[#c9a84c]/20">
            📅 {tr("bookConsultation")}
          </a>
        </div>
      </section>

      {/* Mobile WhatsApp */}
      <a href="https://wa.me/421951094706" target="_blank" rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 md:hidden flex items-center gap-2 bg-[#25D366] text-white font-semibold px-4 py-3 rounded-full shadow-2xl">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        WhatsApp
      </a>

      {/* Footer */}
      <footer id="contact" style={{ background: "#080d1a", borderTop: "1px solid rgba(201,168,76,0.2)" }} className="px-4 sm:px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
            <Logo className="h-9" />
            <div className="flex flex-col sm:flex-row items-center gap-6 text-white/50 text-sm">
              <a href="tel:+421951094706" className="flex items-center gap-2 hover:text-[#c9a84c] transition-colors">
                <span className="text-[#c9a84c]">📞</span> +421 951 094 706
              </a>
              <a href="mailto:info@nehnutelnostivzahranici.sk" className="flex items-center gap-2 hover:text-[#c9a84c] transition-colors">
                <span className="text-[#c9a84c]">✉️</span> info@nehnutelnostivzahranici.sk
              </a>
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(201,168,76,0.1)" }} className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-white/30 text-xs">© 2026 Nehnuteľnosti v zahraničí. {tr("rights")}</p>
            <div className="flex items-center gap-4">
              <Link to={createPageUrl("PublicFAQ")} className="text-[#c9a84c]/60 hover:text-[#c9a84c] text-xs transition-colors">FAQ</Link>
              <Link to={createPageUrl("PublicGDPR")} className="text-[#c9a84c]/60 hover:text-[#c9a84c] text-xs transition-colors">{tr("privacy")}</Link>
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