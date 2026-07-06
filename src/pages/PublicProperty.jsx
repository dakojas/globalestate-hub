import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Bed, Bath, Maximize, Check, Loader2, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useDayNight } from "@/hooks/useDayNight";
import ThemeToggle from "@/components/public/ThemeToggle";
import { Link, useParams } from "react-router-dom";
import { createPageUrl } from "@/utils";

function slugify(text) {
  return (text || "")
    .toLowerCase()
    .replace(/[áàäâ]/g, "a").replace(/[éèëê]/g, "e").replace(/[íìïî]/g, "i")
    .replace(/[óòöôõ]/g, "o").replace(/[úùüû]/g, "u").replace(/[ýÿ]/g, "y")
    .replace(/[čć]/g, "c").replace(/š/g, "s").replace(/ž/g, "z").replace(/ň/g, "n")
    .replace(/ľĺ/g, "l").replace(/ř/g, "r").replace(/ď/g, "d").replace(/ť/g, "t")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
import { toast } from "sonner";
import { PublicLanguageProvider, usePublicLang } from "@/components/PublicLanguageContext";
import PublicLangSwitcher from "@/components/PublicLangSwitcher";
import Logo from "@/components/Logo";
import BuyingProcessTimeline from "@/components/public/BuyingProcessTimeline";
import Seo from "@/components/Seo";

function PublicPropertyInner() {
  const { slug } = useParams();
  const urlParams = new URLSearchParams(window.location.search);
  const idFromQuery = urlParams.get("id");
  const ref = urlParams.get("ref");
  const { tr, lang } = usePublicLang();
  const { isDark } = useDayNight();

  const [formData, setFormData] = useState({ full_name: "", email: "", phone: "", budget_min: "", budget_max: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [gdprAccepted, setGdprAccepted] = useState(false);
  const [translatedDesc, setTranslatedDesc] = useState(null);
  const [translatedFeatures, setTranslatedFeatures] = useState(null);
  const [translating, setTranslating] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(null);

  // Support both /nehnutelnost/:slug and legacy ?id= URLs
  const idFromSlug = slug ? slug.slice(-6) : null;

  const { data: allProps } = useQuery({
    queryKey: ["public-property-slug", slug, idFromQuery],
    queryFn: () => base44.entities.Property.filter({ is_public: true }, "-created_date", 200),
    enabled: !!(slug || idFromQuery),
  });

  const property = allProps?.find(p => {
    if (idFromQuery) return p.id === idFromQuery;
    const pSlug = p.slug || slugify(p.title) + "-" + p.id.slice(-6);
    return pSlug === slug || p.id.slice(-6) === idFromSlug;
  });

  const id = property?.id;

  // Build JSON-LD structured data for the property
  const propertyJsonLd = property ? {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": property.title,
    "description": property.description?.slice(0, 500) || "",
    "image": property.images?.slice(0, 5) || [],
    "url": window.location.href,
    "category": "Real Estate",
    "offers": {
      "@type": "Offer",
      "price": property.price,
      "priceCurrency": property.currency || "EUR",
      "availability": property.status === "available" ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "url": window.location.href
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": property.city || "",
      "addressCountry": property.country || ""
    }
  } : null;

  const seoTitle = property ? `${property.title} — ${property.city}, ${property.country} | GLOBEYA` : "Nehnuteľnosti v zahraničí | GLOBEYA";
  const seoDesc = property ? (property.description?.slice(0, 160) || `${property.title} v ${property.city}, ${property.country} za €${property.price?.toLocaleString()}.`) : "Nehnuteľnosti pri mori od Egypta po Bali — s kompletným servisom v slovenčine.";
  const seoImage = property?.images?.[0] || "";
  const seoCanonical = property ? `https://nvz.info/nehnutelnost/${slug}` : "https://nvz.info";

  // Auto-translate to selected language
  useEffect(() => {
    if (!property) return;

    // No need to translate to SK (original language)
    if (lang === "sk") {
      setTranslatedDesc(null);
      setTranslatedFeatures(null);
      return;
    }

    // Check if we already have translation cached
    const cacheKey = `trans_${id}_${lang}`;
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      const cached_data = JSON.parse(cached);
      setTranslatedDesc(cached_data.description);
      setTranslatedFeatures(cached_data.features);
      return;
    }

    // Reset and translate
    setTranslatedDesc(null);
    setTranslatedFeatures(null);
    setTranslating(true);
    const langMap = { en: "English", de: "German", fr: "French", it: "Italian", ru: "Russian", pl: "Polish", hu: "Hungarian" };
    const targetLang = langMap[lang] || "English";

    base44.integrations.Core.InvokeLLM({
      prompt: `Translate the following Slovak real estate content to ${targetLang}. Return ONLY a JSON object with keys "description" (string) and "features" (array of strings). Keep it natural and professional.\n\nDESCRIPTION:\n${property.description}\n\nFEATURES:\n${property.features?.join(", ") || ""}`,
      response_json_schema: {
        type: "object",
        properties: {
          description: { type: "string" },
          features: { type: "array", items: { type: "string" } }
        }
      }
    }).then(result => {
      setTranslatedDesc(result.description);
      setTranslatedFeatures(result.features);
      sessionStorage.setItem(cacheKey, JSON.stringify(result));
    }).finally(() => setTranslating(false));
  }, [lang, property?.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await base44.entities.Client.create({
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        budget_min: Number(formData.budget_min) || undefined,
        budget_max: Number(formData.budget_max) || undefined,
        preferred_countries: property?.country ? [property.country] : [],
        lead_source: ref ? "referrer" : "website",
        referrer_code: ref || undefined,
        status: "new_lead",
        notes: formData.notes,
        interested_property_id: property?.id || undefined,
        interested_property_title: property?.title || undefined,
        interested_property_country: property?.country || undefined,
        interested_property_price: property?.price || undefined,
        interested_property_image: property?.images?.[0] || undefined,
      });
      const messages = {
        sk: "Ďakujeme! Čoskoro vás budeme kontaktovať.",
        en: "Thank you! We will contact you shortly.",
        fr: "Merci! Nous vous contacterons bientôt.",
        it: "Grazie! Vi contatteremo presto.",
        de: "Danke! Wir werden Sie bald kontaktieren.",
        ru: "Спасибо! Мы свяжемся с вами вскоре.",
        pl: "Dziękuję! Skontaktujemy się z Tobą wkrótce.",
        hu: "Köszönöm! Hamarosan felvesszük a kapcsolatot."
      };
      toast.success(messages[lang] || messages.sk);
      setFormData({ full_name: "", email: "", phone: "", budget_min: "", budget_max: "", notes: "" });
      setGdprAccepted(false);
    } catch (error) {
      const errorMessages = {
        sk: "Chyba pri odoslaní.",
        en: "Submission failed. Please try again.",
        fr: "Erreur lors de l'envoi.",
        it: "Errore nell'invio.",
        de: "Fehler beim Absenden.",
        ru: "Ошибка при отправке.",
        pl: "Błąd przy wysyłaniu.",
        hu: "Hiba az elküldéskor."
      };
      toast.error(errorMessages[lang] || errorMessages.sk);
    } finally {
      setSubmitting(false);
    }
  };

  if (!property) {
    const loadingTexts = {
      sk: "Načítavam...",
      en: "Loading...",
      fr: "Chargement...",
      it: "Caricamento...",
      de: "Wird geladen...",
      ru: "Загрузка...",
      pl: "Ładowanie...",
      hu: "Betöltés..."
    };
    return (
      <div data-theme={isDark ? "dark" : "light"} className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-page)" }}>
        <p className="text-white/60">{loadingTexts[lang] || loadingTexts.sk}</p>
      </div>
    );
  }

  const displayDescription = lang === "sk" ? property.description : (translatedDesc || property.description);
  const displayFeatures = lang === "sk" ? property.features : (translatedFeatures || property.features);

  return (
    <div data-theme={isDark ? "dark" : "light"} className="min-h-screen font-body" style={{ background: "var(--bg-page)" }}>
      <Seo
        title={seoTitle}
        description={seoDesc}
        image={seoImage}
        canonical={seoCanonical}
        type="product"
        jsonLd={propertyJsonLd}
      />
      {/* Lightbox */}
      {lightboxIdx !== null && property?.images?.length > 0 && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center" onClick={() => setLightboxIdx(null)}>
          <button onClick={() => setLightboxIdx(null)} className="absolute top-4 right-4 text-white/70 hover:text-white"><X className="w-8 h-8" /></button>
          <button onClick={e => { e.stopPropagation(); setLightboxIdx((lightboxIdx - 1 + property.images.length) % property.images.length); }} className="absolute left-4 text-white/70 hover:text-white"><ChevronLeft className="w-10 h-10" /></button>
          <img src={property.images[lightboxIdx]} alt="" className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg" onClick={e => e.stopPropagation()} />
          <button onClick={e => { e.stopPropagation(); setLightboxIdx((lightboxIdx + 1) % property.images.length); }} className="absolute right-4 text-white/70 hover:text-white"><ChevronRight className="w-10 h-10" /></button>
          <p className="absolute bottom-4 text-white/50 text-sm">{lightboxIdx + 1} / {property.images.length}</p>
        </div>
      )}
      {/* Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to={createPageUrl("PublicHome")} className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
            {tr("backToOffers")}
          </Link>
          <div className="flex items-center gap-4">
            <Logo className="h-10 hidden sm:flex" />
            <a
              href="https://wa.me/421951094706"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 bg-[#25D366] hover:bg-[#1eb956] text-white text-xs font-semibold px-3 py-1.5 rounded-full transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp
            </a>
            <ThemeToggle />
            <PublicLangSwitcher />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl overflow-hidden bg-gray-900 aspect-video cursor-pointer" onClick={() => setLightboxIdx(0)}>
              {property.images?.[0] ? (
                <img src={property.images[0]} alt={`${property.title} — ${property.city}, ${property.country}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" loading="eager" />
              ) : (
                <div className="w-full h-full flex items-center justify-center"><MapPin className="w-20 h-20 text-white/20" /></div>
              )}
            </div>

            {property.images?.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {property.images.slice(1).map((img, i) => (
                  <div key={i} className="w-32 h-24 rounded-lg overflow-hidden bg-gray-900 flex-shrink-0 cursor-pointer" onClick={() => setLightboxIdx(i + 1)}>
                    <img src={img} alt={`${property.title} — foto ${i + 2}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" loading="lazy" />
                  </div>
                ))}
              </div>
            )}

            <Card className="bg-white/5 backdrop-blur-lg border-white/10">
              <CardContent className="p-6">
                <Badge className="bg-[#c9a84c] text-white mb-4">{property.country}</Badge>
                <h1 className="text-3xl font-bold text-white mb-3">{property.title}</h1>
                <p className="text-white/60 flex items-center gap-2 mb-6"><MapPin className="w-5 h-5" />{property.city}</p>

                <div className="grid grid-cols-3 gap-6 mb-6 pb-6 border-b border-white/10">
                  {property.bedrooms && (
                    <div><Bed className="w-6 h-6 text-[#c9a84c] mb-2" /><p className="text-2xl font-bold text-white">{property.bedrooms}</p><p className="text-sm text-white/60">{tr("bedrooms")}</p></div>
                  )}
                  {property.bathrooms && (
                    <div><Bath className="w-6 h-6 text-[#c9a84c] mb-2" /><p className="text-2xl font-bold text-white">{property.bathrooms}</p><p className="text-sm text-white/60">{tr("bathrooms")}</p></div>
                  )}
                  {property.area_sqm && (
                    <div><Maximize className="w-6 h-6 text-[#c9a84c] mb-2" /><p className="text-2xl font-bold text-white">{property.area_sqm}</p><p className="text-sm text-white/60">m²</p></div>
                  )}
                </div>

                {translating && lang !== "sk" && (
                  <div className="flex items-center gap-2 text-white/50 text-sm mb-4">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {tr("translatingListing")}
                  </div>
                )}
                {displayDescription && (
                  <>
                    <h3 className="text-xl font-semibold text-white mb-3">{tr("description")}</h3>
                    <p className="text-white/70 leading-relaxed whitespace-pre-wrap">{displayDescription}</p>
                  </>
                )}
              </CardContent>
            </Card>

            {property.features?.length > 0 && (
              <Card className="bg-white/5 backdrop-blur-lg border-white/10">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">{tr("amenities")}</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {(displayFeatures || property.features).map((f, i) => (
                      <div key={i} className="flex items-center gap-2 text-white/70"><Check className="w-4 h-4 text-[#c9a84c]" /><span>{f}</span></div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <BuyingProcessTimeline lang={lang} />
          </div>

          {/* Contact Form */}
          <div>
            <Card className="bg-white/5 backdrop-blur-lg border-white/10 sticky top-24">
              <CardContent className="p-6">
                <div className="mb-6">
                  <p className="text-3xl font-bold text-[#c9a84c] mb-1">€{property.price?.toLocaleString()}</p>
                  {property.available_units && (
                    <p className="text-sm text-white/60">{lang === "sk" ? "Voľné jednotky na predaj" : lang === "en" ? "Units available for sale" : lang === "de" ? "Verfügbare Einheiten" : lang === "fr" ? "Unités disponibles" : lang === "it" ? "Unità disponibili" : lang === "ru" ? "Доступные единицы" : lang === "pl" ? "Dostępne jednostki" : "Voľné jednotky na predaj"}: {property.available_units}</p>
                  )}
                </div>

                <a
                  href="https://calendly.com/nehnutelnostivzahranici/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-[#c9a84c] hover:bg-[#b8973b] text-white font-semibold py-3 px-4 rounded-lg mb-3 transition-all"
                >
                  📅 {tr("bookConsultation")}
                </a>
                <a
                  href="https://wa.me/421951094706"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1eb956] text-white font-semibold py-3 px-4 rounded-lg mb-5 transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  WhatsApp
                </a>
                <div className="relative mb-5">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
                  <div className="relative flex justify-center"><span className="bg-transparent px-2 text-white/30 text-xs">{lang === "sk" ? "alebo" : "or"}</span></div>
                </div>
                <h3 className="text-lg font-semibold text-white mb-4">{tr("interested")}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input placeholder={tr("nameSurname")} value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} required className="bg-white/10 border-white/20 text-white placeholder:text-white/50" />
                  <Input type="email" placeholder={tr("email")} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required className="bg-white/10 border-white/20 text-white placeholder:text-white/50" />
                  <Input type="tel" placeholder={tr("phone")} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required className="bg-white/10 border-white/20 text-white placeholder:text-white/50" />
                  <div className="grid grid-cols-2 gap-3">
                    <Input type="number" placeholder={tr("minBudget")} value={formData.budget_min} onChange={e => setFormData({...formData, budget_min: e.target.value})} className="bg-white/10 border-white/20 text-white placeholder:text-white/50" />
                    <Input type="number" placeholder={tr("maxBudget")} value={formData.budget_max} onChange={e => setFormData({...formData, budget_max: e.target.value})} className="bg-white/10 border-white/20 text-white placeholder:text-white/50" />
                  </div>
                  <Textarea placeholder={tr("message")} value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="bg-white/10 border-white/20 text-white placeholder:text-white/50 min-h-24" />
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                    <input type="checkbox" id="gdpr" checked={gdprAccepted} onChange={e => setGdprAccepted(e.target.checked)} className="mt-0.5 w-4 h-4 accent-[#c9a84c] flex-shrink-0 cursor-pointer" required />
                    <label htmlFor="gdpr" className="text-xs text-white/60 leading-relaxed cursor-pointer">
                      {tr("gdpr")}
                      <a href="https://www.nehnutelnostivzahranici.sk/ochrana-sukromia/" target="_blank" rel="noopener noreferrer" className="text-[#c9a84c] hover:underline">{tr("gdprLink")}</a>
                      {tr("gdprEnd")}
                    </label>
                  </div>
                  <Button type="submit" disabled={submitting || !gdprAccepted} className="w-full bg-[#c9a84c] hover:bg-[#b8973b] text-white disabled:opacity-50 disabled:cursor-not-allowed">
                    {submitting ? tr("sending") : tr("send")}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PublicProperty() {
  return (
    <PublicLanguageProvider>
      <PublicPropertyInner />
    </PublicLanguageProvider>
  );
}