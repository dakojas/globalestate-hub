import React from "react";
import { MapPin, Bed, Bath, Maximize, Mail, Phone, CheckCircle2, TrendingUp, Building2, Calendar } from "lucide-react";

const formatPrice = (price, currency = "EUR") => {
  const symbols = { EUR: "€", USD: "$", GBP: "£", AED: "AED ", THB: "฿", EGP: "E£ ", IDR: "Rp " };
  const sym = symbols[currency] || "€";
  return `${sym}${price?.toLocaleString() || 0}`;
};

const propertyTypeLabels = {
  studio: "Štúdio", "1_bedroom": "1 izba", "2_bedroom": "2 izby",
  penthouse: "Penthouse", vila: "Vila",
};

const constructionLabels = {
  vo_vystavbe: "Vo výstavbe (Off Plan)", dokoncene: "Dokončené",
};

export default function OfferPreview({ property, client, agent, message }) {
  const images = property?.images || [];
  const mainImage = images[0];
  const pricePerSqm = property?.area_sqm ? (property.price / property.area_sqm).toFixed(0) : null;

  return (
    <div className="bg-white w-full max-w-3xl mx-auto" style={{ fontFamily: 'Georgia, serif' }}>
      {/* Header */}
      <div className="bg-[#0a1628] text-white px-10 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xs tracking-[0.3em] uppercase text-[#c9a84c] mb-1">Exkluzívna ponuka</h1>
            <p className="text-sm text-gray-400">{new Date().toLocaleDateString("sk-SK", { day: "numeric", month: "long", year: "numeric" })}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-white">Nehnuteľnosti v zahraničí</p>
            <p className="text-xs text-gray-400">info@nvz.sk</p>
          </div>
        </div>
        <h2 className="text-3xl font-light mb-1">{property?.title}</h2>
        <p className="text-sm text-gray-300 flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          {property?.city}, {property?.country}
        </p>
      </div>

      {/* Main Image */}
      {mainImage && (
        <div className="relative h-80 bg-gray-100">
          <img src={mainImage} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-8">
            <p className="text-white text-4xl font-light">{formatPrice(property?.price, property?.currency)}</p>
          </div>
        </div>
      )}

      <div className="px-10 py-8">
        {/* Client greeting */}
        {client && (
          <div className="mb-8 p-4 bg-[#c9a84c]/10 border-l-4 border-[#c9a84c] rounded-r-lg">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Vážený/á {client.full_name},</span>
            </p>
            <p className="text-sm text-gray-600 mt-1 leading-relaxed">
              s potešením Vám predkladáme našu exkluzívnu ponuku nehnuteľnosti, ktorá sme pre Vás vybrali na základe Vašich preferencií.
            </p>
          </div>
        )}

        {/* Key stats */}
        <div className="flex justify-center gap-10 mb-8 pb-8 border-b border-gray-200">
          {property?.bedrooms != null && (
            <div className="text-center">
              <Bed className="w-6 h-6 text-[#c9a84c] mx-auto mb-2" />
              <p className="text-2xl font-light text-[#0a1628]">{property.bedrooms}</p>
              <p className="text-xs text-gray-400 uppercase tracking-wider">Izby</p>
            </div>
          )}
          {property?.bathrooms != null && (
            <div className="text-center">
              <Bath className="w-6 h-6 text-[#c9a84c] mx-auto mb-2" />
              <p className="text-2xl font-light text-[#0a1628]">{property.bathrooms}</p>
              <p className="text-xs text-gray-400 uppercase tracking-wider">Kúpeľne</p>
            </div>
          )}
          {property?.area_sqm != null && (
            <div className="text-center">
              <Maximize className="w-6 h-6 text-[#c9a84c] mx-auto mb-2" />
              <p className="text-2xl font-light text-[#0a1628]">{property.area_sqm}</p>
              <p className="text-xs text-gray-400 uppercase tracking-wider">m²</p>
            </div>
          )}
          {pricePerSqm && (
            <div className="text-center">
              <TrendingUp className="w-6 h-6 text-[#c9a84c] mx-auto mb-2" />
              <p className="text-2xl font-light text-[#0a1628]">{formatPrice(pricePerSqm, property?.currency)}</p>
              <p className="text-xs text-gray-400 uppercase tracking-wider">/m²</p>
            </div>
          )}
        </div>

        {/* Property overview */}
        <div className="mb-8">
          <h3 className="text-lg font-light text-[#0a1628] mb-4 uppercase tracking-wide">Parametre nehnuteľnosti</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#c9a84c]" />
              <span className="text-gray-500">Typ:</span>
              <span className="text-gray-800 font-medium">{propertyTypeLabels[property?.property_type] || property?.property_type}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#c9a84c]" />
              <span className="text-gray-500">Výstavba:</span>
              <span className="text-gray-800 font-medium">{constructionLabels[property?.construction_phase] || "—"}</span>
            </div>
            {property?.project_name && (
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#c9a84c]" />
                <span className="text-gray-500">Projekt:</span>
                <span className="text-gray-800 font-medium">{property.project_name}</span>
              </div>
            )}
            {property?.developer && (
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#c9a84c]" />
                <span className="text-gray-500">Developer:</span>
                <span className="text-gray-800 font-medium">{property.developer}</span>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="mb-8">
          <h3 className="text-lg font-light text-[#0a1628] mb-4 uppercase tracking-wide">Popis nehnuteľnosti</h3>
          <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{property?.description || property?.description_en}</p>
        </div>

        {/* Features */}
        {property?.features?.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-light text-[#0a1628] mb-4 uppercase tracking-wide">Výbava a výhody</h3>
            <div className="grid grid-cols-2 gap-2">
              {property.features.map((f, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#c9a84c] flex-shrink-0" />
                  <span className="text-sm text-gray-600">{f}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Gallery */}
        {images.length > 1 && (
          <div className="mb-8">
            <h3 className="text-lg font-light text-[#0a1628] mb-4 uppercase tracking-wide">Galéria</h3>
            <div className="grid grid-cols-3 gap-3">
              {images.slice(1, 7).map((img, i) => (
                <div key={i} className="aspect-square bg-gray-100 rounded overflow-hidden">
                  <img src={img} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Personalized message */}
        {message && (
          <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-lg font-light text-[#0a1628] mb-3 uppercase tracking-wide">Osobný odkaz</h3>
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{message}</p>
          </div>
        )}

        {/* Buying process */}
        <div className="mb-8">
          <h3 className="text-lg font-light text-[#0a1628] mb-4 uppercase tracking-wide">Proces kúpy</h3>
          <div className="space-y-3">
            {[
              { step: "1", title: "Rezervácia nehnuteľnosti", desc: "Podpísanie rezervačnej zmluvy a úhrada rezervačného poplatku" },
              { step: "2", title: "Príprava zmluvy", desc: "Kontrola a príprava kúpnej zmluvy s našim právnym oddelením" },
              { step: "3", title: "Platba a prevod", desc: "Úhrada kúpnej ceny a oficiálny prevod vlastníctva" },
              { step: "4", title: "Odovzdanie kľúčov", desc: "Prevzatie nehnuteľnosti a prípadné zariadenie" },
            ].map((s) => (
              <div key={s.step} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#c9a84c] text-white flex items-center justify-center font-semibold text-sm flex-shrink-0">
                  {s.step}
                </div>
                <div>
                  <p className="text-sm font-medium text-[#0a1628]">{s.title}</p>
                  <p className="text-xs text-gray-500">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[#0a1628] text-white px-10 py-8">
        <h3 className="text-xs tracking-[0.3em] uppercase text-[#c9a84c] mb-3">Kontaktujte nás</h3>
        {agent && (
          <p className="text-sm text-white mb-1">Váš osobný konzultant: <span className="font-semibold">{agent.full_name}</span></p>
        )}
        <p className="text-sm text-gray-300 mb-2">Nehnuteľnosti v zahraničí</p>
        <p className="text-sm text-gray-400 flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-1"><Mail className="w-3 h-3" />info@nvz.sk</span>
          <span className="flex items-center gap-1"><Phone className="w-3 h-3" />+421 XXX XXX XXX</span>
        </p>
      </div>
    </div>
  );
}