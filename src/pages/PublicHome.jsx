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

const COUNTRY_NAMES = {
  sk: { Albania: "Albánsko", Bali: "Bali", Hungary: "Maďarsko", Bulgaria: "Bulharsko", "Dominican Republic": "Dominikánska republika", Egypt: "Egypt", Georgia: "Gruzínsko", Mauritius: "Maurícius", Oman: "Omán", UAE: "SAE (Dubaj)", Spain: "Španielsko", Italy: "Taliansko", Thailand: "Thajsko", Turkey: "Turecko" },
  de: { Albania: "Albanien", Hungary: "Ungarn", Bulgaria: "Bulgarien", "Dominican Republic": "Dominikanische Republik", Georgia: "Georgien", Mauritius: "Mauritius", UAE: "VAE (Dubai)", Spain: "Spanien", Italy: "Italien", Thailand: "Thailand", Turkey: "Türkei" },
  ru: { Albania: "Албания", Hungary: "Венгрия", Bulgaria: "Болгария", "Dominican Republic": "Доминиканская Республика", Egypt: "Египет", Georgia: "Грузия", Mauritius: "Маврикий", UAE: "ОАЭ (Дубай)", Spain: "Испания", Italy: "Италия", Thailand: "Таиланд", Turkey: "Турция" },
  pl: { Albania: "Albania", Hungary: "Węgry", Bulgaria: "Bułgaria", "Dominican Republic": "Dominikana", Egypt: "Egipt", Georgia: "Gruzja", UAE: "ZEA (Dubaj)", Spain: "Hiszpania", Italy: "Włochy", Thailand: "Tajlandia", Turkey: "Turcja" },
  hu: { Albania: "Albánia", Hungary: "Magyarország", Bulgaria: "Bulgária", Egypt: "Egyiptom", Georgia: "Grúzia", UAE: "EAE (Dubai)", Spain: "Spanyolország", Italy: "Olaszország", Thailand: "Thaiföld", Turkey: "Törökország" },
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

  const pickFromCountry = (country, count) =>
    properties.filter(p => p.status === "available" && p.country === country)
      .sort((a, b) => new Date(b.created_date) - new Date(a.created_date))
      .slice(0, count);

  const displayFeatured = [
    ...pickFromCountry("Egypt", 2),
    ...pickFromCountry("Georgia", 2),
    ...pickFromCountry("Albania", 2),
    ...pickFromCountry("Thailand", 1),
  ];

  const getTypeName = (type) => (PROPERTY_TYPE_LABELS[lang]?.[type] || PROPERTY_TYPE_LABELS.en[type] || type);

  const getCountryName = (country) => {
    if (!country) return country;
    return COUNTRY_NAMES[lang]?.[country] || country;
  };

  const getDateLabel = () => {
    const labels = {
      sk: "Pridané:",
      en: "Added:",
      fr: "Ajouté:",
      it: "Aggiunto:",
      de: "Hinzugefügt:",
      ru: "Добавлено:",
      pl: "Dodane:",
      hu: "Hozzáadva:"
    };
    return labels[lang] || "Added:";
  };

  const getFeaturedLabel = () => {
    const labels = {
      sk: "Odporúčané",
      en: "Featured",
      fr: "En vedette",
      it: "In evidenza",
      de: "Ausgewählt",
      ru: "Рекомендуемое",
      pl: "Wyróżnione",
      hu: "Kiemelt"
    };
    return labels[lang] || "Featured";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#132039] to-[#1a2844]">
      {/* Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Logo className="h-10" />
          <nav className="flex items-center gap-6">
            <Link to={createPageUrl("PublicAbout")} className="text-white/70 hover:text-[#c9a84c] transition-colors text-sm hidden sm:block">{tr("aboutUs")}</Link>
            <a href="#properties" className="text-white/70 hover:text-[#c9a84c] transition-colors text-sm hidden sm:block">{tr("offers")}</a>
            <a href="#contact" className="text-white/70 hover:text-[#c9a84c] transition-colors text-sm hidden sm:block">{tr("contact")}</a>
            <Link to={createPageUrl("PublicSubmit")} className="hidden sm:block">
              <Button size="sm" className="bg-[#c9a84c] hover:bg-[#b8973b] text-white text-xs">{tr("listProperty")}</Button>
            </Link>
            <a
              href="https://wa.me/421951094706"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 bg-[#25D366] hover:bg-[#1eb956] text-white text-xs font-semibold px-3 py-1.5 rounded-full transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp
            </a>
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
          <a
            href="https://calendly.com/nehnutelnostivzahranici/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#c9a84c] hover:bg-[#b8973b] text-white font-semibold px-8 py-3 rounded-full shadow-lg transition-all mb-12 text-base"
          >
            📅 {tr("bookConsultation")}
          </a>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20 max-w-4xl mx-auto">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <Select value={filters.country} onValueChange={v => setFilters({...filters, country: v})}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder={tr("allCountries")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{tr("allCountries")}</SelectItem>
                    {COUNTRIES.map(c => <SelectItem key={c} value={c}>{getCountryName(c)}</SelectItem>)}
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
                    {Object.keys(PROPERTY_TYPE_LABELS.en).map(type => (
                      <SelectItem key={type} value={type}>{getTypeName(type)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filters.constructionPhase} onValueChange={v => setFilters({...filters, constructionPhase: v})}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder={lang === "sk" ? "Fáza projektu" : lang === "en" ? "Phase" : lang === "fr" ? "Phase" : lang === "it" ? "Fase" : "Phase"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{lang === "sk" ? "Všetky fázy" : lang === "en" ? "All phases" : lang === "fr" ? "Toutes les phases" : lang === "it" ? "Tutte le fasi" : "All phases"}</SelectItem>
                    <SelectItem value="vo_vystavbe">🏗 {lang === "sk" ? "Vo výstavbe / Off Plan" : lang === "en" ? "Off Plan" : lang === "fr" ? "En construction / Off Plan" : lang === "it" ? "In costruzione / Off Plan" : "Off Plan"}</SelectItem>
                    <SelectItem value="dokoncene">✅ {lang === "sk" ? "Dokončené" : lang === "en" ? "Completed" : lang === "fr" ? "Achevé" : lang === "it" ? "Completato" : "Completed"}</SelectItem>
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
          <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-lg" style={{ minHeight: 180 }}>
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
            {lang === "sk" && (
              <>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4"><em>Začali sme ako malý slovenský sen.</em></h2>
                <p className="text-xl text-white/70 max-w-2xl mx-auto"><em>Stali sme sa bránou do celého sveta.</em></p>
              </>
            )}
            {lang === "en" && (
              <>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4"><em>We started as a small Slovak dream.</em></h2>
                <p className="text-xl text-white/70 max-w-2xl mx-auto"><em>We became a gateway to the whole world.</em></p>
              </>
            )}
            {lang === "fr" && (
              <>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4"><em>Nous avons commencé comme un petit rêve slovaque.</em></h2>
                <p className="text-xl text-white/70 max-w-2xl mx-auto"><em>Nous sommes devenus une porte vers le monde entier.</em></p>
              </>
            )}
            {lang === "it" && (
              <>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4"><em>Abbiamo iniziato come un piccolo sogno slovacco.</em></h2>
                <p className="text-xl text-white/70 max-w-2xl mx-auto"><em>Siamo diventati un portale verso il mondo intero.</em></p>
              </>
            )}
            {lang === "de" && (
              <>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4"><em>Wir begannen als ein kleiner slowakischer Traum.</em></h2>
                <p className="text-xl text-white/70 max-w-2xl mx-auto"><em>Wir wurden ein Tor zur ganzen Welt.</em></p>
              </>
            )}
            {lang === "pl" && (
              <>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4"><em>Zaczęliśmy jako mały słowacki sen.</em></h2>
                <p className="text-xl text-white/70 max-w-2xl mx-auto"><em>Staliśmy się bramą do całego świata.</em></p>
              </>
            )}
            {lang === "ru" && (
              <>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4"><em>Мы начали как маленькая словацкая мечта.</em></h2>
                <p className="text-xl text-white/70 max-w-2xl mx-auto"><em>Мы стали воротами в весь мир.</em></p>
              </>
            )}
            {lang === "hu" && (
              <>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4"><em>Egy kis szlovák álomként kezdtünk.</em></h2>
                <p className="text-xl text-white/70 max-w-2xl mx-auto"><em>Az egész világ kapujává váltunk.</em></p>
              </>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-xl p-8">
              {lang === "sk" && (
                <>
                  <p className="text-[#c9a84c] text-xs uppercase tracking-widest font-semibold mb-4">KAPITOLA I – ZAČIATOK</p>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Jeden nápad. Jeden sen.</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">Bolo to jednoduché: Slováci chceli nehnuteľnosti v zahraničí. Jazyk bol cudzi, trh neznámy. Tak vznikla stránka Nehnuteľnosti v zahraničí — nie ako veľká korporacia, ale ako odpoveď na konkrétnu potrebu konkrétnych ľudí.</p>
                </>
              )}
              {lang === "en" && (
                <>
                  <p className="text-[#c9a84c] text-xs uppercase tracking-widest font-semibold mb-4">CHAPTER I – BEGINNING</p>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">One idea. One dream.</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">It was simple: Slovaks wanted property abroad, but didn't know where to start. The language was foreign. The market unknown. So Nehnuteľnosti v zahraničí was born — not as a big corporation, but as an answer to a specific need of specific people.</p>
                </>
              )}
              {lang === "fr" && (
                <>
                  <p className="text-[#c9a84c] text-xs uppercase tracking-widest font-semibold mb-4">CHAPITRE I – DÉBUT</p>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Une idée. Un rêve.</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">C'était simple : les Slovaques voulaient des propriétés à l'étranger. La langue était étrangère, le marché inconnu. Ainsi est née la page Nehnuteľnosti v zahraničí — non comme une grande corporation, mais comme une réponse à un besoin spécifique.</p>
                </>
              )}
              {lang === "it" && (
                <>
                  <p className="text-[#c9a84c] text-xs uppercase tracking-widest font-semibold mb-4">CAPITOLO I – INIZIO</p>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Un'idea. Un sogno.</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">Era semplice: gli slovacchi volevano proprietà all'estero, ma non sapevano da dove iniziare. La lingua era straniera. Il mercato sconosciuto. Così è nata la pagina Nehnuteľnosti v zahraničí — non come una grande corporation, ma come una risposta a un bisogno specifico.</p>
                </>
              )}
              {lang === "de" && (
                <>
                  <p className="text-[#c9a84c] text-xs uppercase tracking-widest font-semibold mb-4">KAPITEL I – BEGINN</p>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Eine Idee. Ein Traum.</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">Es war einfach: Slowaken wollten Immobilien im Ausland. Die Sprache war fremd, der Markt unbekannt. So entstand Nehnuteľnosti v zahraničí — nicht als großes Unternehmen, sondern als Antwort auf ein spezifisches Bedürfnis.</p>
                </>
              )}
              {lang === "pl" && (
                <>
                  <p className="text-[#c9a84c] text-xs uppercase tracking-widest font-semibold mb-4">ROZDZIAŁ I – POCZĄTEK</p>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Jeden pomysł. Jeden sen.</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">To było proste: Słowacy chcieli nieruchomości za granicą, ale nie wiedzieli, od czego zacząć. Język był obcy, rynek nieznany. Tak powstała strona Nehnuteľnosti v zahraničí — nie jako duża korporacja, ale jako odpowiedź na konkretną potrzebę.</p>
                </>
              )}
            </div>
            <div className="bg-white rounded-xl p-8">
              {lang === "sk" && (
                <>
                  <p className="text-[#c9a84c] text-xs uppercase tracking-widest font-semibold mb-4">KAPITOLA II – RAST</p>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Klienti nás vzali so sebou.</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">Prvá kúpa v Egypte. Potom Dubaj. Potom Bali. Každý spokojný klient otvoril nové dvere — do novej krajiny, k novému developerovi. Tím rástol, portfólio rástlo, ale záväzok zostal rovnaký.</p>
                </>
              )}
              {lang === "en" && (
                <>
                  <p className="text-[#c9a84c] text-xs uppercase tracking-widest font-semibold mb-4">CHAPTER II – GROWTH</p>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Clients took us with them.</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">First purchase in Egypt. Then Dubai. Then Bali. Every satisfied client opened new doors — to new countries, to new developers. The team grew. The portfolio grew. But the commitment stayed the same.</p>
                </>
              )}
              {lang === "fr" && (
                <>
                  <p className="text-[#c9a84c] text-xs uppercase tracking-widest font-semibold mb-4">CHAPITRE II – CROISSANCE</p>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Les clients nous ont emmenés.</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">Premier achat en Égypte. Puis Dubaï. Puis Bali. Chaque client satisfait a ouvert de nouvelles portes — vers de nouveaux pays, vers de nouveaux promoteurs. L'équipe a grandi. Le portefeuille a grandi. Mais l'engagement est resté le même.</p>
                </>
              )}
              {lang === "it" && (
                <>
                  <p className="text-[#c9a84c] text-xs uppercase tracking-widest font-semibold mb-4">CAPITOLO II – CRESCITA</p>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">I clienti ci hanno portato.</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">Primo acquisto in Egitto. Poi Dubai. Poi Bali. Ogni cliente soddisfatto ha aperto nuove porte — verso nuovi paesi, verso nuovi sviluppatori. Il team è cresciuto. Il portafoglio è cresciuto. Ma l'impegno è rimasto lo stesso.</p>
                </>
              )}
              {lang === "de" && (
                <>
                  <p className="text-[#c9a84c] text-xs uppercase tracking-widest font-semibold mb-4">KAPITEL II – WACHSTUM</p>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Kunden nahmen uns mit.</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">Erster Kauf in Ägypten. Dann Dubai. Dann Bali. Jeder zufriedene Kunde öffnete neue Türen — zu neuen Ländern, zu neuen Entwicklern. Das Team wuchs. Das Portfolio wuchs. Aber die Verpflichtung blieb gleich.</p>
                </>
              )}
              {lang === "pl" && (
                <>
                  <p className="text-[#c9a84c] text-xs uppercase tracking-widest font-semibold mb-4">ROZDZIAŁ II – WZROST</p>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Klienci zabrali nas ze sobą.</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">Pierwszy zakup w Egipcie. Potem Dubaj. Potem Bali. Każdy zadowolony klient otworzył nowe drzwi — do nowych krajów, do nowych deweloperów. Zespół rósł. Portfolio rosło. Ale zaangażowanie pozostało takie samo.</p>
                </>
              )}
            </div>
          </div>

          <div className="text-center">
            <Link to={createPageUrl("PublicAbout")} className="inline-block text-[#c9a84c] hover:text-[#b8973b] transition-colors font-semibold text-sm uppercase tracking-widest">
              {lang === "sk" ? "Čítaj celý príbeh →" : lang === "en" ? "Read full story →" : lang === "fr" ? "Lire l'histoire complète →" : lang === "it" ? "Leggi la storia completa →" : lang === "de" ? "Vollständige Geschichte lesen →" : lang === "pl" ? "Przeczytaj pełną historię →" : "Čítaj celý príbeh →"}
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      {displayFeatured.length > 0 && (
        <section className="py-16 px-6 bg-white/5 backdrop-blur-lg border-t border-b border-white/10">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <span className="text-[#c9a84c] text-3xl">⭐</span>
              <h2 className="text-3xl font-bold text-white">{getFeaturedLabel()}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayFeatured.map(property => (
                <Link key={property.id} to={createPageUrl(`PublicProperty?id=${property.id}`)} className="group">
                  <Card className="bg-white/5 backdrop-blur-lg border-[#c9a84c]/50 hover:border-[#c9a84c] transition-all overflow-hidden">
                    <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 relative overflow-hidden">
                      {property.images?.[0] ? (
                        <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><Home className="w-16 h-16 text-white/20" /></div>
                      )}
                      <div className="absolute top-3 left-3"><span className="bg-[#c9a84c] text-white text-xs font-bold px-3 py-1 rounded-full">⭐ TOP</span></div>
                      <div className="absolute top-3 right-3 flex flex-col gap-1 items-end">
                        <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur">{getCountryName(property.country)}</span>
                        {property.construction_phase && (
                          <span className={`text-white text-xs font-semibold px-2 py-0.5 rounded-full ${
                            property.construction_phase === "vo_vystavbe" ? "bg-orange-500" : "bg-emerald-600"
                          }`}>
                            {property.construction_phase === "vo_vystavbe"
                              ? (lang === "sk" ? "Vo výstavbe" : lang === "en" ? "Off Plan" : lang === "fr" ? "En construction" : lang === "it" ? "In costruzione" : "Off Plan")
                              : (lang === "sk" ? "Dokončené" : lang === "en" ? "Completed" : lang === "fr" ? "Achevé" : lang === "it" ? "Completato" : "Completed")}
                          </span>
                        )}
                      </div>
                    </div>
                    <CardContent className="p-5">
                      <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{property.title}</h3>
                      <p className="text-white/60 text-sm mb-1 flex items-center gap-1"><MapPin className="w-4 h-4" />{property.city}</p>
                      <p className="text-white/50 text-xs mb-3">{getDateLabel()} {new Date(property.created_date).toLocaleDateString(lang === "sk" ? "sk-SK" : "en-US")}</p>
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
          </div>
        </section>
      )}

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
                      <span className="bg-[#c9a84c] text-white text-xs font-bold px-3 py-1 rounded-full">{getCountryName(property.country)}</span>
                      {property.construction_phase && (
                        <span className={`text-white text-xs font-semibold px-2 py-0.5 rounded-full ${
                          property.construction_phase === "vo_vystavbe" ? "bg-orange-500" : "bg-emerald-600"
                        }`}>
                          {property.construction_phase === "vo_vystavbe"
                            ? (lang === "sk" ? "Vo výstavbe" : lang === "en" ? "Off Plan" : lang === "fr" ? "En construction" : lang === "it" ? "In costruzione" : "Off Plan")
                            : (lang === "sk" ? "Dokončené" : lang === "en" ? "Completed" : lang === "fr" ? "Achevé" : lang === "it" ? "Completato" : "Completed")}
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

      {/* Motto */}
      <section className="py-16 px-6 bg-gradient-to-br from-gray-900 to-black">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[#c9a84c] text-xs uppercase tracking-widest mb-6">NAŠE MOTTO</p>
          <h3 className="text-4xl md:text-5xl font-bold text-white mb-4">
            <em>{lang === "sk" ? "Svet je väčší, než si myslíte." : lang === "en" ? "The world is bigger than you think." : lang === "fr" ? "Le monde est plus grand que vous ne le pensez." : lang === "it" ? "Il mondo è più grande di quanto pensi." : lang === "de" ? "Die Welt ist größer als Sie denken." : lang === "ru" ? "Мир больше, чем вы думаете." : lang === "pl" ? "Świat jest większy niż myślisz." : lang === "hu" ? "A világ nagyobb, mint gondolod." : "Svet je väčší, než si myslíte."}</em>
          </h3>
          <p className="text-2xl text-white/70 mb-4">
            <em>{lang === "sk" ? "Vaše možnosti tiež." : lang === "en" ? "So are your possibilities." : lang === "fr" ? "Vos possibilités aussi." : lang === "it" ? "Lo sono anche le tue possibilità." : lang === "de" ? "Ihre Möglichkeiten auch." : lang === "ru" ? "Ваши возможности тоже." : lang === "pl" ? "Twoje możliwości też." : lang === "hu" ? "A lehetőségeid is." : "Vaše možnosti tiež."}</em>
          </p>
          <p className="text-white/50 italic">{lang === "sk" ? "My sme tu preto, aby ste ich objavili." : lang === "en" ? "We're here to help you discover them." : lang === "fr" ? "Nous sommes là pour vous aider à les découvrir." : lang === "it" ? "Siamo qui per aiutarti a scoprirle." : lang === "de" ? "Wir sind hier, um Ihnen zu helfen, sie zu entdecken." : "My sme tu preto, aby ste ich objavili."}</p>
        </div>
      </section>

      {/* Consultation CTA */}
      <section className="py-12 px-6 bg-[#c9a84c]/10 border-t border-[#c9a84c]/20">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-white text-xl font-semibold mb-4">{tr("bookConsultation")}</p>
          <a
            href="https://calendly.com/nehnutelnostivzahranici/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#c9a84c] hover:bg-[#b8973b] text-white font-bold px-10 py-4 rounded-full shadow-xl transition-all text-lg"
          >
            📅 {tr("bookConsultation")}
          </a>
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
            <div className="flex items-center gap-4">
              <Link to={createPageUrl("PublicFAQ")} className="text-[#c9a84c] text-sm hover:underline">
                FAQ
              </Link>
              <a href="https://www.nehnutelnostivzahranici.sk/ochrana-sukromia/" target="_blank" rel="noopener noreferrer" className="text-[#c9a84c] text-sm hover:underline">
                {tr("privacy")}
              </a>
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