import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, Loader2, Upload, X } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { toast } from "sonner";
import { PublicLanguageProvider, usePublicLang } from "@/components/PublicLanguageContext";
import PublicLangSwitcher from "@/components/PublicLangSwitcher";

const COUNTRIES = ["Albania","Bali","Hungary","Bulgaria","Dominican Republic","Egypt","Georgia","Mauritius","Oman","UAE","Spain","Italy","Thailand","Turkey","Other"];
const PROPERTY_TYPES = ["apartment","villa","penthouse","studio","townhouse","land","commercial"];

function PublicSubmitInner() {
  const { tr, lang } = usePublicLang();
  const [step, setStep] = useState("form"); // form | translating | success
  const [gdprAccepted, setGdprAccepted] = useState(false);
  const [form, setForm] = useState({
    owner_name: "", owner_email: "", owner_phone: "",
    title: "", description: "", country: "", city: "",
    price: "", property_type: "", area_sqm: "", bedrooms: "", bathrooms: "",
    construction_phase: "",
    original_language: "sk",
  });
  const [images, setImages] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    setUploadingImages(true);
    const urls = [];
    for (const file of files.slice(0, 10)) {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      urls.push(file_url);
    }
    setImages(prev => [...prev, ...urls]);
    setUploadingImages(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!gdprAccepted) return toast.error("Prosím potvrďte súhlas so spracovaním údajov.");
    if (!form.country || !form.title || !form.description || !form.price) {
      return toast.error("Vyplňte všetky povinné polia.");
    }

    setStep("translating");

    // AI translate title + description to SK and EN
    let title_sk = form.title, title_en = form.title;
    let description_sk = form.description, description_en = form.description;

    try {
      const translated = await base44.integrations.Core.InvokeLLM({
        prompt: `Translate the following real estate listing content into both Slovak (sk) and English (en). The original language is: ${form.original_language}.

Title: ${form.title}
Description: ${form.description}

Return a JSON with: title_sk, title_en, description_sk, description_en. Keep translations professional and natural for real estate context.`,
        response_json_schema: {
          type: "object",
          properties: {
            title_sk: { type: "string" },
            title_en: { type: "string" },
            description_sk: { type: "string" },
            description_en: { type: "string" },
          }
        }
      });
      title_sk = translated.title_sk || form.title;
      title_en = translated.title_en || form.title;
      description_sk = translated.description_sk || form.description;
      description_en = translated.description_en || form.description;
    } catch {
      // fallback: keep original
    }

    await base44.entities.Property.create({
      title: title_sk,
      description: description_sk,
      description_en,
      country: form.country,
      city: form.city,
      price: Number(form.price),
      property_type: form.property_type || undefined,
      area_sqm: form.area_sqm ? Number(form.area_sqm) : undefined,
      bedrooms: form.bedrooms ? Number(form.bedrooms) : undefined,
      bathrooms: form.bathrooms ? Number(form.bathrooms) : undefined,
      images,
      owner_submitted: true,
      owner_name: form.owner_name,
      owner_email: form.owner_email,
      owner_phone: form.owner_phone,
      original_language: form.original_language,
      construction_phase: form.construction_phase || undefined,
      approval_status: "pending_review",
      is_public: false,
      status: "available",
    });

    setStep("success");
  };

  if (step === "translating") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#132039] to-[#1a2844] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#c9a84c] animate-spin mx-auto mb-4" />
          <p className="text-white text-xl font-semibold mb-2">{tr("translatingListing")}</p>
          <p className="text-white/50">{tr("translatingListingSub")}</p>
        </div>
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#132039] to-[#1a2844] flex items-center justify-center px-6">
        <Card className="bg-white/5 backdrop-blur-lg border-white/10 max-w-md w-full">
          <CardContent className="p-10 text-center">
            <CheckCircle className="w-16 h-16 text-[#c9a84c] mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-3">{tr("submitSuccessTitle")}</h2>
            <p className="text-white/60 mb-8">{tr("submitSuccessText")}</p>
            <Link to={createPageUrl("PublicHome")}>
              <Button className="bg-[#c9a84c] hover:bg-[#b8973b] text-white w-full">{tr("backToHome")}</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#132039] to-[#1a2844]">
      {/* Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to={createPageUrl("PublicHome")} className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b801924dae038161790d9a/9193a9184_nehnutelnosti_logo-07.jpg" alt="Logo" className="h-9 w-auto object-contain ml-2" />
          </Link>
          <PublicLangSwitcher />
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-3">{tr("submitTitle")}</h1>
          <p className="text-white/60 text-lg">{tr("submitSubtitle")}</p>
          <div className="mt-4 inline-flex items-center gap-2 bg-[#c9a84c]/10 border border-[#c9a84c]/30 rounded-full px-4 py-2">
            <span className="text-[#c9a84c] text-sm font-medium">✦ {tr("submitBadge")}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Owner info */}
          <Card className="bg-white/5 backdrop-blur-lg border-white/10">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-white font-semibold text-lg">{tr("ownerInfo")}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input placeholder={tr("ownerName") + " *"} value={form.owner_name} onChange={e => setForm({...form, owner_name: e.target.value})} required className="bg-white/10 border-white/20 text-white placeholder:text-white/40" />
                <Input type="email" placeholder={tr("ownerEmail") + " *"} value={form.owner_email} onChange={e => setForm({...form, owner_email: e.target.value})} required className="bg-white/10 border-white/20 text-white placeholder:text-white/40" />
              </div>
              <Input type="tel" placeholder={tr("ownerPhone")} value={form.owner_phone} onChange={e => setForm({...form, owner_phone: e.target.value})} className="bg-white/10 border-white/20 text-white placeholder:text-white/40" />
            </CardContent>
          </Card>

          {/* Property info */}
          <Card className="bg-white/5 backdrop-blur-lg border-white/10">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold text-lg">{tr("propertyInfo")}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-white/50 text-xs">{tr("writingIn")}:</span>
                  <Select value={form.original_language} onValueChange={v => setForm({...form, original_language: v})}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white h-8 w-28 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sk">🇸🇰 Slovenčina</SelectItem>
                      <SelectItem value="en">🇬🇧 English</SelectItem>
                      <SelectItem value="cs">🇨🇿 Čeština</SelectItem>
                      <SelectItem value="de">🇩🇪 Deutsch</SelectItem>
                      <SelectItem value="pl">🇵🇱 Polski</SelectItem>
                      <SelectItem value="hu">🇭🇺 Magyar</SelectItem>
                      <SelectItem value="ru">🇷🇺 Русский</SelectItem>
                      <SelectItem value="ar">🇦🇪 العربية</SelectItem>
                      <SelectItem value="tr">🇹🇷 Türkçe</SelectItem>
                      <SelectItem value="other">🌐 Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Input placeholder={tr("propertyTitleLabel") + " *"} value={form.title} onChange={e => setForm({...form, title: e.target.value})} required className="bg-white/10 border-white/20 text-white placeholder:text-white/40" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select value={form.country} onValueChange={v => setForm({...form, country: v})}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder={tr("selectCountry") + " *"} />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Input placeholder={tr("cityLabel")} value={form.city} onChange={e => setForm({...form, city: e.target.value})} className="bg-white/10 border-white/20 text-white placeholder:text-white/40" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select value={form.property_type} onValueChange={v => setForm({...form, property_type: v})}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder={tr("typeLabel")} />
                  </SelectTrigger>
                  <SelectContent>
                    {PROPERTY_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Input type="number" placeholder={tr("priceLabel") + " (€) *"} value={form.price} onChange={e => setForm({...form, price: e.target.value})} required className="bg-white/10 border-white/20 text-white placeholder:text-white/40" />
                <Input type="number" placeholder="m²" value={form.area_sqm} onChange={e => setForm({...form, area_sqm: e.target.value})} className="bg-white/10 border-white/20 text-white placeholder:text-white/40" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input type="number" placeholder={tr("bedroomsLabel")} value={form.bedrooms} onChange={e => setForm({...form, bedrooms: e.target.value})} className="bg-white/10 border-white/20 text-white placeholder:text-white/40" />
                <Input type="number" placeholder={tr("bathroomsLabel")} value={form.bathrooms} onChange={e => setForm({...form, bathrooms: e.target.value})} className="bg-white/10 border-white/20 text-white placeholder:text-white/40" />
              </div>

              <div>
                <Select value={form.construction_phase} onValueChange={v => setForm({...form, construction_phase: v})}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder={lang === "sk" ? "Fáza projektu (voliteľné)" : "Construction phase (optional)"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="off_plan">🏗 Off Plan</SelectItem>
                    <SelectItem value="vo_vystavbe">🔨 {lang === "sk" ? "Vo výstavbe" : "Under construction"}</SelectItem>
                    <SelectItem value="dokoncene">✅ {lang === "sk" ? "Dokončené" : "Completed"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Textarea
                placeholder={tr("descriptionLabel") + " *"}
                value={form.description}
                onChange={e => setForm({...form, description: e.target.value})}
                required
                rows={6}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
              />
              <p className="text-white/40 text-xs">✦ {tr("autoTranslateNote")}</p>
            </CardContent>
          </Card>

          {/* Images */}
          <Card className="bg-white/5 backdrop-blur-lg border-white/10">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-white font-semibold text-lg">{tr("photosLabel")}</h3>
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/20 rounded-xl p-8 cursor-pointer hover:border-[#c9a84c]/50 transition-colors">
                {uploadingImages ? <Loader2 className="w-8 h-8 text-[#c9a84c] animate-spin mb-2" /> : <Upload className="w-8 h-8 text-white/40 mb-2" />}
                <span className="text-white/60 text-sm">{tr("uploadPhotos")}</span>
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
              </label>
              {images.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {images.map((url, i) => (
                    <div key={i} className="relative w-24 h-20 rounded-lg overflow-hidden bg-gray-900">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => setImages(images.filter((_, j) => j !== i))} className="absolute top-1 right-1 bg-black/70 rounded-full p-0.5 text-white hover:bg-red-600">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* GDPR + Submit */}
          <Card className="bg-white/5 backdrop-blur-lg border-white/10">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <input type="checkbox" id="gdpr-submit" checked={gdprAccepted} onChange={e => setGdprAccepted(e.target.checked)} className="mt-0.5 w-4 h-4 accent-[#c9a84c] flex-shrink-0 cursor-pointer" />
                <label htmlFor="gdpr-submit" className="text-xs text-white/60 leading-relaxed cursor-pointer">
                  {tr("gdpr")}
                  <a href="https://www.nehnutelnostivzahranici.sk/ochrana-sukromia/" target="_blank" rel="noopener noreferrer" className="text-[#c9a84c] hover:underline">{tr("gdprLink")}</a>
                  {tr("gdprEnd")}
                </label>
              </div>
              <Button type="submit" disabled={!gdprAccepted} className="w-full bg-[#c9a84c] hover:bg-[#b8973b] text-white text-base py-6 disabled:opacity-50">
                {tr("submitBtn")}
              </Button>
            </CardContent>
          </Card>
        </form>
      </div>

      <footer className="border-t border-white/10 py-8 px-6 text-center">
        <p className="text-white/40 text-sm">© 2026 Nehnuteľnosti v zahraničí</p>
      </footer>
    </div>
  );
}

export default function PublicSubmit() {
  return (
    <PublicLanguageProvider>
      <PublicSubmitInner />
    </PublicLanguageProvider>
  );
}