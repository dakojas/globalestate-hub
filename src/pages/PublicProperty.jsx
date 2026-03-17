import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Bed, Bath, Maximize, Check, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { toast } from "sonner";
import { PublicLanguageProvider, usePublicLang } from "@/components/PublicLanguageContext";
import PublicLangSwitcher from "@/components/PublicLangSwitcher";
import Logo from "@/components/Logo";

function PublicPropertyInner() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  const ref = urlParams.get("ref");
  const { tr, lang } = usePublicLang();

  const [formData, setFormData] = useState({ full_name: "", email: "", phone: "", budget_min: "", budget_max: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [gdprAccepted, setGdprAccepted] = useState(false);
  const [translatedDesc, setTranslatedDesc] = useState(null);
  const [translatedFeatures, setTranslatedFeatures] = useState(null);
  const [translating, setTranslating] = useState(false);

  const { data: property } = useQuery({
    queryKey: ["public-property", id],
    queryFn: () => base44.entities.Property.filter({ id }),
    select: d => d[0],
    enabled: !!id,
  });

  // Auto-translate when switching to EN and no pre-saved translation
  useEffect(() => {
    if (lang !== "en" || !property) return;
    if (property.description_en) {
      setTranslatedDesc(property.description_en);
      return;
    }
    if (translatedDesc || translating) return;

    const textsToTranslate = [];
    if (property.description) textsToTranslate.push(`DESCRIPTION:\n${property.description}`);
    if (property.features?.length) textsToTranslate.push(`FEATURES (comma separated):\n${property.features.join(", ")}`);

    if (!textsToTranslate.length) return;

    setTranslating(true);
    base44.integrations.Core.InvokeLLM({
      prompt: `Translate the following Slovak real estate content to English. Return ONLY a JSON object with keys "description" (string) and "features" (array of strings). Keep it natural and professional.\n\n${textsToTranslate.join("\n\n")}`,
      response_json_schema: {
        type: "object",
        properties: {
          description: { type: "string" },
          features: { type: "array", items: { type: "string" } }
        }
      }
    }).then(result => {
      if (result.description) setTranslatedDesc(result.description);
      if (result.features?.length) setTranslatedFeatures(result.features);
    }).finally(() => setTranslating(false));
  }, [lang, property]);

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
      });
      toast.success(lang === "sk" ? "Ďakujeme! Čoskoro vás budeme kontaktovať." : "Thank you! We will contact you shortly.");
      setFormData({ full_name: "", email: "", phone: "", budget_min: "", budget_max: "", notes: "" });
      setGdprAccepted(false);
    } catch (error) {
      toast.error(lang === "sk" ? "Chyba pri odoslaní." : "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!property) {
    return (
      <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
        <p className="text-white/60">{lang === "sk" ? "Načítavam..." : "Loading..."}</p>
      </div>
    );
  }

  const displayDescription = lang === "en" ? (property.description_en || translatedDesc || property.description) : property.description;
  const displayFeatures = lang === "en" ? (translatedFeatures || property.features) : property.features;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#132039] to-[#1a2844]">
      {/* Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to={createPageUrl("PublicHome")} className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
            {tr("backToOffers")}
          </Link>
          <div className="flex items-center gap-4">
            <Logo className="h-10 hidden sm:flex" />
            <PublicLangSwitcher />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl overflow-hidden bg-gray-900 aspect-video">
              {property.images?.[0] ? (
                <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center"><MapPin className="w-20 h-20 text-white/20" /></div>
              )}
            </div>

            {property.images?.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {property.images.slice(1, 5).map((img, i) => (
                  <div key={i} className="w-32 h-24 rounded-lg overflow-hidden bg-gray-900 flex-shrink-0">
                    <img src={img} alt="" className="w-full h-full object-cover" />
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

                {translating && lang === "en" && (
                  <div className="flex items-center gap-2 text-white/50 text-sm mb-4">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Translating content...
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
          </div>

          {/* Contact Form */}
          <div>
            <Card className="bg-white/5 backdrop-blur-lg border-white/10 sticky top-24">
              <CardContent className="p-6">
                <div className="mb-6">
                  <p className="text-3xl font-bold text-[#c9a84c] mb-1">€{property.price?.toLocaleString()}</p>
                  {property.available_units && (
                    <p className="text-sm text-white/60">{tr("available_units")}: {property.available_units}</p>
                  )}
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