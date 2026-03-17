import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Upload, X, Plus, Loader2, FileText, Languages } from "lucide-react";
import { toast } from "sonner";

const COUNTRIES = ["Albania", "Bali", "Hungary", "Bulgaria", "Dominican Republic", "Egypt", "Georgia", "Mauritius", "Oman", "UAE", "Spain", "Italy", "Thailand", "Turkey"];
const TYPES = ["apartment", "villa", "penthouse", "studio", "townhouse", "land", "commercial"];
const STATUSES = ["available", "reserved", "sold", "off_market"];
const CURRENCIES = ["EUR", "USD", "GBP", "AED", "THB", "EGP", "IDR"];

export default function PropertyForm({ property, open, onClose, onSaved }) {
  const [form, setForm] = useState(property || {
    title: "", description: "", country: "", city: "", address: "",
    property_type: "apartment", status: "available", price: "", currency: "EUR",
    area_sqm: "", bedrooms: "", bathrooms: "", images: [], features: [],
    latitude: "", longitude: "", project_name: "", portal_links: [],
    commission_rate: "", notes: "", assigned_agent: "", brochure_url: ""
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [newFeature, setNewFeature] = useState("");
  const [newPortal, setNewPortal] = useState({ portal_name: "", url: "" });
  const [translating, setTranslating] = useState(false);

  const handleAiTranslate = async () => {
    if (!form.description) return toast.error("Najprv zadajte popis nehnuteľnosti");
    setTranslating(true);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Translate the following Slovak real estate property description to English. Keep it professional and natural. Only return the translated text, nothing else.\n\n${form.description}`,
    });
    handleChange("description_en", result);
    toast.success("Preložené do angličtiny ✓");
    setTranslating(false);
  };

  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    try {
      const urls = [];
      for (const file of files) {
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        urls.push(file_url);
      }
      setForm(prev => ({ ...prev, images: [...(prev.images || []), ...urls] }));
      toast.success(`${urls.length} obrázok(ov) nahratý`);
    } catch (err) {
      toast.error("Nahrávanie zlyhalo, skúste znova");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeImage = (idx) => {
    handleChange("images", form.images.filter((_, i) => i !== idx));
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      handleChange("features", [...(form.features || []), newFeature.trim()]);
      setNewFeature("");
    }
  };

  const addPortalLink = () => {
    if (newPortal.portal_name && newPortal.url) {
      handleChange("portal_links", [...(form.portal_links || []), { ...newPortal }]);
      setNewPortal({ portal_name: "", url: "" });
    }
  };

  const handleSubmit = async () => {
    setSaving(true);
    const data = {
      ...form,
      price: Number(form.price) || 0,
      area_sqm: Number(form.area_sqm) || undefined,
      bedrooms: Number(form.bedrooms) || undefined,
      bathrooms: Number(form.bathrooms) || undefined,
      latitude: Number(form.latitude) || undefined,
      longitude: Number(form.longitude) || undefined,
      commission_rate: Number(form.commission_rate) || undefined,
    };
    if (property?.id) {
      await base44.entities.Property.update(property.id, data);
    } else {
      await base44.entities.Property.create(data);
    }
    toast.success(property?.id ? "Property updated" : "Property created");
    setSaving(false);
    onSaved();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{property?.id ? "Edit Property" : "New Property"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 mt-4">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label>Title *</Label>
              <Input value={form.title} onChange={e => handleChange("title", e.target.value)} placeholder="Property title" />
            </div>
            <div>
              <Label>Country *</Label>
              <Select value={form.country} onValueChange={v => handleChange("country", v)}>
                <SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>City</Label>
              <Input value={form.city} onChange={e => handleChange("city", e.target.value)} placeholder="City or area" />
            </div>
            <div>
              <Label>Type</Label>
              <Select value={form.property_type} onValueChange={v => handleChange("property_type", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TYPES.map(t => <SelectItem key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Status</Label>
              <Select value={form.status} onValueChange={v => handleChange("status", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STATUSES.map(s => <SelectItem key={s} value={s}>{s.replace("_"," ")}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Price *</Label>
              <Input type="number" value={form.price} onChange={e => handleChange("price", e.target.value)} placeholder="0" />
            </div>
            <div>
              <Label>Currency</Label>
              <Select value={form.currency} onValueChange={v => handleChange("currency", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Area (m²)</Label>
              <Input type="number" value={form.area_sqm} onChange={e => handleChange("area_sqm", e.target.value)} />
            </div>
            <div>
              <Label>Bedrooms</Label>
              <Input type="number" value={form.bedrooms} onChange={e => handleChange("bedrooms", e.target.value)} />
            </div>
            <div>
              <Label>Bathrooms</Label>
              <Input type="number" value={form.bathrooms} onChange={e => handleChange("bathrooms", e.target.value)} />
            </div>
            <div>
              <Label>Project Name</Label>
              <Input value={form.project_name} onChange={e => handleChange("project_name", e.target.value)} placeholder="Development name" />
            </div>
            <div>
              <Label>Fáza projektu</Label>
              <Select value={form.construction_phase || ""} onValueChange={v => handleChange("construction_phase", v)}>
                <SelectTrigger><SelectValue placeholder="Vyberte fázu" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="off_plan">🏗 Off Plan</SelectItem>
                  <SelectItem value="vo_vystavbe">🔨 Vo výstavbe</SelectItem>
                  <SelectItem value="dokoncene">✅ Dokončené</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Commission Rate (%)</Label>
              <Input type="number" value={form.commission_rate} onChange={e => handleChange("commission_rate", e.target.value)} />
            </div>
            <div>
              <Label>Latitude</Label>
              <Input type="number" step="any" value={form.latitude} onChange={e => handleChange("latitude", e.target.value)} />
            </div>
            <div>
              <Label>Longitude</Label>
              <Input type="number" step="any" value={form.longitude} onChange={e => handleChange("longitude", e.target.value)} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <Label>Popis (SK)</Label>
            </div>
            <Textarea value={form.description} onChange={e => handleChange("description", e.target.value)} rows={4} placeholder="Popis nehnuteľnosti po slovensky..." />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <Label>Popis (EN)</Label>
              <Button type="button" variant="outline" size="sm" onClick={handleAiTranslate} disabled={translating} className="h-7 text-xs gap-1">
                {translating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Languages className="w-3 h-3" />}
                {translating ? "Prekladám..." : "AI preložiť SK→EN"}
              </Button>
            </div>
            <Textarea value={form.description_en || ""} onChange={e => handleChange("description_en", e.target.value)} rows={4} placeholder="English description (auto or manual)..." />
          </div>

          <div>
            <Label>Address</Label>
            <Input value={form.address} onChange={e => handleChange("address", e.target.value)} placeholder="Full address" />
          </div>

          {/* Images */}
          <div>
            <Label>Images</Label>
            <div className="flex flex-wrap gap-3 mt-2">
              {(form.images || []).map((url, i) => (
                <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden group">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-black/60 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              ))}
              <label className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-[#c9a84c] transition-colors">
                {uploading ? <Loader2 className="w-5 h-5 animate-spin text-gray-400" /> : <Upload className="w-5 h-5 text-gray-400" />}
                <span className="text-[10px] text-gray-400 mt-1">Upload</span>
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
              </label>
            </div>
          </div>

          {/* Features */}
          <div>
            <Label>Features</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {(form.features || []).map((f, i) => (
                <span key={i} className="bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-full flex items-center gap-1">
                  {f}
                  <button onClick={() => handleChange("features", form.features.filter((_, j) => j !== i))}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              <Input value={newFeature} onChange={e => setNewFeature(e.target.value)} placeholder="e.g. Sea view, Pool" onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addFeature())} />
              <Button type="button" variant="outline" size="sm" onClick={addFeature}><Plus className="w-4 h-4" /></Button>
            </div>
          </div>

          {/* Brochure PDF */}
          <div>
            <Label>Brožúra (PDF)</Label>
            <div className="mt-2">
              {form.brochure_url ? (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
                  <FileText className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <a href={form.brochure_url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline truncate flex-1">
                    Zobraziť brožúru
                  </a>
                  <button onClick={() => handleChange("brochure_url", "")} className="text-gray-400 hover:text-red-500">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex items-center gap-3 p-3 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-[#c9a84c] transition-colors">
                  {uploadingPdf ? <Loader2 className="w-5 h-5 animate-spin text-gray-400" /> : <FileText className="w-5 h-5 text-gray-400" />}
                  <span className="text-sm text-gray-500">{uploadingPdf ? "Nahrávam PDF..." : "Nahrať PDF brožúru"}</span>
                  <input
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    disabled={uploadingPdf}
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      setUploadingPdf(true);
                      try {
                        const { file_url } = await base44.integrations.Core.UploadFile({ file });
                        handleChange("brochure_url", file_url);
                        toast.success("PDF brožúra nahratá");
                      } catch {
                        toast.error("Nahrávanie zlyhalo");
                      } finally {
                        setUploadingPdf(false);
                        e.target.value = "";
                      }
                    }}
                  />
                </label>
              )}
            </div>
          </div>

          {/* Portal Links */}
          <div>
            <Label>Portal Links</Label>
            <div className="space-y-2 mt-2">
              {(form.portal_links || []).map((pl, i) => (
                <div key={i} className="flex items-center gap-2 text-sm bg-gray-50 p-2 rounded-lg">
                  <span className="font-medium">{pl.portal_name}</span>
                  <a href={pl.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 truncate text-xs">{pl.url}</a>
                  <button onClick={() => handleChange("portal_links", form.portal_links.filter((_, j) => j !== i))} className="ml-auto">
                    <X className="w-3 h-3 text-gray-400" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              <Input value={newPortal.portal_name} onChange={e => setNewPortal(p => ({ ...p, portal_name: e.target.value }))} placeholder="Portal name" className="w-36" />
              <Input value={newPortal.url} onChange={e => setNewPortal(p => ({ ...p, url: e.target.value }))} placeholder="URL" className="flex-1" />
              <Button type="button" variant="outline" size="sm" onClick={addPortalLink}><Plus className="w-4 h-4" /></Button>
            </div>
          </div>

          <div>
            <Label>Notes</Label>
            <Textarea value={form.notes} onChange={e => handleChange("notes", e.target.value)} rows={2} />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={saving || uploading || !form.title || !form.country || !form.price} className="bg-[#0a1628] hover:bg-[#132039]">
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {property?.id ? "Update" : "Create"} Property
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}