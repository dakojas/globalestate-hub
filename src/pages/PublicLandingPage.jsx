import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, CheckCircle2, MapPin, Bed, Maximize, MessageCircle } from "lucide-react";

const COUNTRY_FLAGS = {
  Albania: "🇦🇱", Bali: "🇮🇩", Hungary: "🇭🇺", Bulgaria: "🇧🇬", Croatia: "🇭🇷",
  "Dominican Republic": "🇩🇴", Egypt: "🇪🇬", Georgia: "🇬🇪",
  Mauritius: "🇲🇺", Oman: "🇴🇲", UAE: "🇦🇪", Spain: "🇪🇸",
  Italy: "🇮🇹", Thailand: "🇹🇭", Turkey: "🇹🇷"
};

export default function PublicLandingPage() {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [properties, setProperties] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", message: "" });

  useEffect(() => {
    (async () => {
      try {
        const results = await base44.entities.LandingPage.filter({ slug, is_active: true });
        if (results.length === 0) { setNotFound(true); setLoading(false); return; }
        const lp = results[0];
        setPage(lp);
        setLoading(false);
        if (lp.property_ids?.length) {
          const allProps = await base44.entities.Property.list("-created_date", 200);
          setProperties(allProps.filter(p => lp.property_ids.includes(p.id)));
        }
      } catch (e) {
        setNotFound(true);
        setLoading(false);
      }
    })();
  }, [slug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.full_name) return;
    setSubmitting(true);
    try {
      await base44.entities.LandingPageLead.create({
        landing_page_id: page.id,
        landing_page_title: page.title,
        full_name: form.full_name,
        email: form.email,
        phone: form.phone,
        message: form.message,
      });
      setSubmitted(true);
    } catch (err) {
      setSubmitted(true);
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a1628]">
        <Loader2 className="w-8 h-8 text-[#c9a84c] animate-spin" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a1628] text-white gap-4 px-6 text-center">
        <p className="text-2xl font-bold text-[#c9a84c]">Ponuka nie je dostupná</p>
        <p className="text-white/50 text-sm">Táto ponuka bola deaktivovaná alebo neexistuje.</p>
        <a href="/" className="text-[#c9a84c] underline text-sm">Návrat na úvodnú stránku</a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a1628] text-white">
      {/* Hero */}
      {(page.hero_image || page.headline) && (
        <div className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
          {page.hero_image && (
            <div className="absolute inset-0">
              <img src={page.hero_image} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628]/70 via-[#0a1628]/60 to-[#0a1628]" />
            </div>
          )}
          <div className="relative z-10 text-center px-6 py-20 max-w-3xl">
            {page.headline && <h1 className="text-3xl sm:text-5xl font-bold text-[#c9a84c] mb-4 font-heading">{page.headline}</h1>}
            {page.subheadline && <p className="text-lg text-white/70">{page.subheadline}</p>}
            {page.show_lead_form && (
              <a href="#lead-form" className="inline-block mt-8 bg-[#c9a84c] hover:bg-[#a88950] text-[#0a1628] font-bold px-8 py-3 rounded-full transition-colors">
                {page.lead_form_title || "Mám záujem"}
              </a>
            )}
          </div>
        </div>
      )}

      {/* Body Content */}
      {page.body_content && (
        <div className="max-w-3xl mx-auto px-6 py-12">
          <div
            className="prose prose-invert prose-lg max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&_a]:text-[#c9a84c]"
            dangerouslySetInnerHTML={{ __html: page.body_content }}
          />
        </div>
      )}

      {/* Properties */}
      {properties.length > 0 && (
        <div className="max-w-6xl mx-auto px-6 py-12">
          <h2 className="text-2xl font-bold text-[#c9a84c] mb-6 text-center font-heading">Vybrané nehnuteľnosti</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map(p => (
              <div key={p.id} className="bg-[#16223a] rounded-2xl overflow-hidden border border-white/10 hover:border-[#c9a84c]/30 transition-colors">
                <div className="aspect-[4/3] bg-[#0e1a2e]">
                  {p.images?.[0] && <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />}
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-white">{p.title}</h3>
                  <p className="text-sm text-white/60 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {COUNTRY_FLAGS[p.country]} {p.city}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-white/50">
                    {p.bedrooms > 0 && <span className="flex items-center gap-1"><Bed className="w-3 h-3" /> {p.bedrooms}</span>}
                    {p.area_sqm > 0 && <span className="flex items-center gap-1"><Maximize className="w-3 h-3" /> {p.area_sqm} m²</span>}
                  </div>
                  <p className="text-lg font-bold text-[#c9a84c]">€{(p.price || 0).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lead Form */}
      {page.show_lead_form && (
        <div id="lead-form" className="max-w-xl mx-auto px-6 py-16 scroll-mt-0">
          {submitted ? (
            <div className="text-center bg-[#16223a] rounded-2xl p-8 border border-[#c9a84c]/30">
              <CheckCircle2 className="w-16 h-16 text-[#c9a84c] mx-auto mb-4" />
              <p className="text-xl font-bold text-white">{page.thank_you_message || "Ďakujeme! Ozveme sa vám čo najskôr."}</p>
            </div>
          ) : (
            <div className="bg-[#16223a] rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-[#c9a84c] mb-6 text-center font-heading">{page.lead_form_title || "Mám záujem"}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label className="text-white/70">Meno a priezvisko *</Label>
                  <Input value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} required className="bg-white/10 border-white/10 text-white placeholder:text-white/30" placeholder="Ján Novák" />
                </div>
                <div>
                  <Label className="text-white/70">Email</Label>
                  <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="bg-white/10 border-white/10 text-white placeholder:text-white/30" placeholder="jan@example.com" />
                </div>
                <div>
                  <Label className="text-white/70">Telefón</Label>
                  <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="bg-white/10 border-white/10 text-white placeholder:text-white/30" placeholder="+421 900 000 000" />
                </div>
                <div>
                  <Label className="text-white/70">Správa</Label>
                  <Textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} rows={3} className="bg-white/10 border-white/10 text-white placeholder:text-white/30" placeholder="Mám záujem o viac informácií..." />
                </div>
                <Button type="submit" disabled={submitting} className="w-full bg-[#c9a84c] hover:bg-[#a88950] text-[#0a1628] font-bold">
                  {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {page.lead_button_text || "Odoslať"}
                </Button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* WhatsApp floating button */}
      {page.whatsapp_number && (
        <a
          href={`https://wa.me/${page.whatsapp_number.replace(/[^0-9]/g, "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
        >
          <MessageCircle className="w-7 h-7 text-white" />
        </a>
      )}

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 text-center">
        <p className="text-white/30 text-xs">© {new Date().getFullYear()} GLOBEYA — Nehnuteľnosti v zahraničí</p>
      </footer>
    </div>
  );
}