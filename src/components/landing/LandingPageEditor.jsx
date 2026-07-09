import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Save, Loader2, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import ReactQuill from "react-quill";

function slugify(text) {
  return (text || "").toString().toLowerCase()
    .replace(/[äá]/g, "a").replace(/[ěé]/g, "e").replace(/[íý]/g, "i")
    .replace(/[óôö]/g, "o").replace(/[úüů]/g, "u").replace(/[ž]/g, "z")
    .replace(/[š]/g, "s").replace(/[č]/g, "c").replace(/[ř]/g, "r")
    .replace(/[ď]/g, "d").replace(/[ť]/g, "t").replace(/[ň]/g, "n")
    .replace(/[ľĺ]/g, "l")
    .replace(/[^a-z0-9\s-]/g, "").trim()
    .replace(/\s+/g, "-").replace(/-+/g, "-");
}

export default function LandingPageEditor({ page, onBack }) {
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [slugEdited, setSlugEdited] = useState(!!page?.slug);

  const [form, setForm] = useState({
    title: page?.title || "",
    slug: page?.slug || "",
    headline: page?.headline || "",
    subheadline: page?.subheadline || "",
    hero_image: page?.hero_image || "",
    body_content: page?.body_content || "",
    property_ids: page?.property_ids || [],
    show_lead_form: page?.show_lead_form ?? true,
    lead_form_title: page?.lead_form_title || "Mám záujem",
    lead_button_text: page?.lead_button_text || "Odoslať",
    thank_you_message: page?.thank_you_message || "Ďakujeme! Ozveme sa vám čo najskôr.",
    whatsapp_number: page?.whatsapp_number || "",
    is_active: page?.is_active ?? true,
  });

  const { data: properties = [] } = useQuery({
    queryKey: ["properties"],
    queryFn: () => base44.entities.Property.list("-created_date", 200),
  });

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleTitleChange = (val) => {
    update("title", val);
    if (!slugEdited) update("slug", slugify(val));
  };

  const toggleProperty = (id) => {
    setForm(prev => {
      const ids = prev.property_ids || [];
      return { ...prev, property_ids: ids.includes(id) ? ids.filter(x => x !== id) : [...ids, id] };
    });
  };

  const handleSave = async () => {
    if (!form.title || !form.slug) { toast.error("Názov a URL slug sú povinné"); return; }
    setSaving(true);
    try {
      const data = { ...form, slug: slugify(form.slug) };
      if (page?.id) {
        await base44.entities.LandingPage.update(page.id, data);
      } else {
        await base44.entities.LandingPage.create(data);
      }
      queryClient.invalidateQueries({ queryKey: ["landing-pages"] });
      toast.success("Landing page uložená");
      onBack();
    } catch (e) {
      toast.error("Chyba pri ukladaní: " + e.message);
    }
    setSaving(false);
  };

  const copyLink = () => {
    const url = `${window.location.origin}/ponuka/${slugify(form.slug)}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-1.5 text-gray-500 hover:text-[#0a1628] text-sm">
          <ArrowLeft className="w-4 h-4" /> Späť na zoznam
        </button>
        <div className="flex gap-2">
          {form.slug && (
            <Button variant="outline" size="sm" onClick={copyLink}>
              {copied ? <Check className="w-4 h-4 mr-2 text-green-600" /> : <Copy className="w-4 h-4 mr-2" />}
              {copied ? "Skopírované" : "Kopírovať link"}
            </Button>
          )}
          <Button onClick={handleSave} disabled={saving} className="bg-[#0a1628] hover:bg-[#132039]">
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Uložiť
          </Button>
        </div>
      </div>

      {/* Základné informácie */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h3 className="font-bold text-[#0a1628]">Základné informácie</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>Názov (interný)</Label>
            <Input value={form.title} onChange={e => handleTitleChange(e.target.value)} placeholder="Napr. Ponuka pre p. Novák" />
          </div>
          <div>
            <Label>URL slug</Label>
            <Input value={form.slug} onChange={e => { update("slug", e.target.value); setSlugEdited(true); }} placeholder="ponuka-novak" />
            {form.slug && <p className="text-xs text-gray-400 mt-1">/ponuka/{slugify(form.slug)}</p>}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Switch checked={form.is_active} onCheckedChange={v => update("is_active", v)} id="active" />
          <Label htmlFor="active" className="cursor-pointer">Aktívna (viditeľná pre klientov)</Label>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h3 className="font-bold text-[#0a1628]">Hlavička (Hero)</h3>
        <div>
          <Label>Nadpis</Label>
          <Input value={form.headline} onChange={e => update("headline", e.target.value)} placeholder="Napr. Váš vysnívaný dom pri mori" />
        </div>
        <div>
          <Label>Podnadpis</Label>
          <Input value={form.subheadline} onChange={e => update("subheadline", e.target.value)} placeholder="Krátky popis ponuky" />
        </div>
        <div>
          <Label>Obrázok pozadia (URL)</Label>
          <Input value={form.hero_image} onChange={e => update("hero_image", e.target.value)} placeholder="https://..." />
          {form.hero_image && <img src={form.hero_image} alt="Náhľad" className="mt-2 h-32 w-full object-cover rounded-lg" />}
        </div>
      </div>

      {/* Obsah */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h3 className="font-bold text-[#0a1628]">Obsah ponuky</h3>
        <ReactQuill
          theme="snow"
          value={form.body_content}
          onChange={val => update("body_content", val)}
          modules={{ toolbar: [["bold", "italic", "underline"], [{ list: "bullet" }, { list: "ordered" }], ["link"], ["clean"]] }}
          className="min-h-[200px]"
        />
      </div>

      {/* Nehnuteľnosti */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h3 className="font-bold text-[#0a1628]">Nehnuteľnosti v ponuke</h3>
        <p className="text-sm text-gray-500">Vyberte nehnuteľnosti, ktoré sa zobrazia na stránke</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-h-80 overflow-y-auto">
          {properties.map(p => {
            const selected = form.property_ids?.includes(p.id);
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => toggleProperty(p.id)}
                className={`relative rounded-lg overflow-hidden border-2 transition-all ${selected ? "border-[#c9a84c] ring-2 ring-[#c9a84c]/30" : "border-gray-100"}`}
              >
                <div className="aspect-square bg-gray-100">
                  {p.images?.[0] ? <img src={p.images[0]} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-100" />}
                </div>
                <p className="text-xs font-medium text-[#0a1628] truncate p-1.5">{p.title}</p>
                {selected && (
                  <div className="absolute top-1 right-1 w-5 h-5 bg-[#c9a84c] rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Formulár */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-[#0a1628]">Formulár pre leads</h3>
          <Switch checked={form.show_lead_form} onCheckedChange={v => update("show_lead_form", v)} id="leadform" />
        </div>
        {form.show_lead_form && (
          <div className="space-y-4">
            <div>
              <Label>Nadpis formulára</Label>
              <Input value={form.lead_form_title} onChange={e => update("lead_form_title", e.target.value)} />
            </div>
            <div>
              <Label>Text tlačidla</Label>
              <Input value={form.lead_button_text} onChange={e => update("lead_button_text", e.target.value)} />
            </div>
            <div>
              <Label>Ďakovná správa po odoslaní</Label>
              <Input value={form.thank_you_message} onChange={e => update("thank_you_message", e.target.value)} />
            </div>
          </div>
        )}
      </div>

      {/* WhatsApp */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h3 className="font-bold text-[#0a1628]">WhatsApp kontakt</h3>
        <div>
          <Label>Telefónne číslo (medzinárodný formát)</Label>
          <Input value={form.whatsapp_number} onChange={e => update("whatsapp_number", e.target.value)} placeholder="+421 900 000 000" />
          <p className="text-xs text-gray-400 mt-1">Ak je vyplnené, zobrazí sa plávajúce WhatsApp tlačidlo</p>
        </div>
      </div>
    </div>
  );
}