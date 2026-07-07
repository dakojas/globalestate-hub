import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, X, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const COUNTRIES = ["Albania", "Bali", "Hungary", "Bulgaria", "Croatia", "Dominican Republic", "Egypt", "Georgia", "Mauritius", "Oman", "UAE", "Spain", "Italy", "Thailand", "Turkey"];
const TYPES = [
  { value: "studio", label: "Studio" },
  { value: "1_bedroom", label: "1 bedroom" },
  { value: "2_bedroom", label: "2 bedroom" },
  { value: "penthouse", label: "Penthouse" },
  { value: "vila", label: "Vila" },
];
const CURRENCIES = ["EUR", "USD", "GBP", "AED", "THB", "EGP", "IDR"];

export default function PartnerSubmit() {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    title: "", country: "", city: "", price: "", currency: "EUR",
    property_type: "studio", description: "", images: [],
    bedrooms: "", bathrooms: "", area_sqm: "", project_name: ""
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    try {
      const uploaded = [];
      for (const file of files) {
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        uploaded.push(file_url);
      }
      handleChange("images", [...form.images, ...uploaded]);
    } catch {
      toast.error("Chyba pri nahrávaní obrázkov");
    }
    setUploading(false);
  };

  const removeImage = (idx) => {
    handleChange("images", form.images.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.country || !form.price) {
      toast.error("Vyplňte všetky povinné polia");
      return;
    }
    setSaving(true);
    try {
      await base44.entities.Property.create({
        title: form.title,
        country: form.country,
        city: form.city,
        price: Number(form.price),
        currency: form.currency,
        property_type: form.property_type,
        description: form.description,
        images: form.images,
        bedrooms: form.bedrooms ? Number(form.bedrooms) : undefined,
        bathrooms: form.bathrooms ? Number(form.bathrooms) : undefined,
        area_sqm: form.area_sqm ? Number(form.area_sqm) : undefined,
        project_name: form.project_name,
        owner_submitted: true,
        approval_status: "pending_review",
        is_public: false,
        owner_name: user?.full_name || "",
        owner_email: user?.email || "",
      });
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      setSubmitted(true);
      toast.success("Projekt odoslaný na schválenie");
    } catch {
      toast.error("Chyba pri odosielaní");
    }
    setSaving(false);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <CheckCircle2 className="w-12 h-12 text-emerald-600" />
        <p className="text-lg font-semibold text-[#0a1628]">Projekt odoslaný na schválenie</p>
        <p className="text-gray-500 text-sm">Po preskúmaní ho zverejníme na našej stránke.</p>
        <Button variant="outline" onClick={() => {
          setSubmitted(false);
          setForm({ title: "", country: "", city: "", price: "", currency: "EUR", property_type: "studio", description: "", images: [], bedrooms: "", bathrooms: "", area_sqm: "", project_name: "" });
        }}>
          Pridať ďalší projekt
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-[#0a1628] mb-1">Pridať projekt</h1>
      <p className="text-gray-500 text-sm mb-6">Vyplňte detaily — po schválení ho zverejníme na našej stránke</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Label className="text-gray-700">Názov projektu *</Label>
          <Input value={form.title} onChange={e => handleChange("title", e.target.value)}
            className="mt-1" placeholder="Napr. Luxusný apartmán v Dubaji" required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-gray-700">Krajina *</Label>
            <Select value={form.country} onValueChange={v => handleChange("country", v)}>
              <SelectTrigger className="mt-1"><SelectValue placeholder="Vyberte krajinu" /></SelectTrigger>
              <SelectContent>{COUNTRIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-gray-700">Mesto / oblasť</Label>
            <Input value={form.city} onChange={e => handleChange("city", e.target.value)} className="mt-1" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-gray-700">Cena *</Label>
            <Input type="number" value={form.price} onChange={e => handleChange("price", e.target.value)}
              className="mt-1" placeholder="0" required />
          </div>
          <div>
            <Label className="text-gray-700">Mena</Label>
            <Select value={form.currency} onValueChange={v => handleChange("currency", v)}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>{CURRENCIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label className="text-gray-700">Typ</Label>
            <Select value={form.property_type} onValueChange={v => handleChange("property_type", v)}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>{TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-gray-700">Spálne</Label>
            <Input type="number" value={form.bedrooms} onChange={e => handleChange("bedrooms", e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label className="text-gray-700">Kúpeľne</Label>
            <Input type="number" value={form.bathrooms} onChange={e => handleChange("bathrooms", e.target.value)} className="mt-1" />
          </div>
        </div>

        <div>
          <Label className="text-gray-700">Rozloha (m²)</Label>
          <Input type="number" value={form.area_sqm} onChange={e => handleChange("area_sqm", e.target.value)} className="mt-1" />
        </div>

        <div>
          <Label className="text-gray-700">Popis</Label>
          <Textarea value={form.description} onChange={e => handleChange("description", e.target.value)}
            className="mt-1 min-h-[120px]" placeholder="Popíšte projekt..." />
        </div>

        <div>
          <Label className="text-gray-700">Fotografie</Label>
          <div className="mt-1 border-2 border-dashed border-gray-200 rounded-lg p-4">
            <input type="file" multiple accept="image/*" onChange={handleUpload} className="hidden" id="partner-image-upload" />
            <label htmlFor="partner-image-upload" className="flex flex-col items-center gap-2 cursor-pointer text-gray-500">
              {uploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6" />}
              <span className="text-sm">Kliknite alebo presuňte fotografie</span>
            </label>
          </div>
          {form.images.length > 0 && (
            <div className="grid grid-cols-4 gap-2 mt-3">
              {form.images.map((url, idx) => (
                <div key={idx} className="relative group">
                  <img src={url} alt="" className="w-full h-20 object-cover rounded-lg" />
                  <button type="button" onClick={() => removeImage(idx)}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <Button type="submit" disabled={saving} className="bg-[#c9a84c] hover:bg-[#b8963f] text-black">
          {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
          {saving ? "Odosielam..." : "Odoslať na schválenie"}
        </Button>
      </form>
    </div>
  );
}