import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Bed, Bath, Maximize, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { toast } from "sonner";

export default function PublicProperty() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  const ref = urlParams.get("ref"); // referrer code

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    budget_min: "",
    budget_max: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const { data: property } = useQuery({
    queryKey: ["public-property", id],
    queryFn: () => base44.entities.Property.filter({ id }),
    select: d => d[0],
    enabled: !!id,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Create client lead
      const clientData = {
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        budget_min: Number(formData.budget_min) || undefined,
        budget_max: Number(formData.budget_max) || undefined,
        preferred_countries: property?.country ? [property.country] : [],
        lead_source: ref ? "referrer" : "direct_app",
        referrer_code: ref || undefined,
        status: "new_lead",
        notes: formData.notes,
      };

      await base44.entities.Client.create(clientData);

      // Create interaction
      await base44.entities.Interaction.create({
        client_id: "temp", // Will be linked properly in production
        type: "note",
        summary: `Lead z verejného webu - záujem o ${property?.title}`,
        property_id: property?.id,
      });

      toast.success("Ďakujeme! Čoskoro vás budeme kontaktovať.");
      setFormData({ full_name: "", email: "", phone: "", budget_min: "", budget_max: "", notes: "" });
    } catch (error) {
      toast.error("Chyba pri odoslaní. Skúste to prosím znova.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!property) {
    return (
      <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
        <p className="text-white/60">Načítavam...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#132039] to-[#1a2844]">
      {/* Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to={createPageUrl("PublicHome")} className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Späť na ponuky
          </Link>
          <img 
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b801924dae038161790d9a/9193a9184_nehnutelnosti_logo-07.jpg" 
            alt="Logo" 
            className="h-10 w-auto object-contain"
          />
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="rounded-2xl overflow-hidden bg-gray-900 aspect-video">
              {property.images?.[0] ? (
                <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <MapPin className="w-20 h-20 text-white/20" />
                </div>
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

            {/* Details */}
            <Card className="bg-white/5 backdrop-blur-lg border-white/10">
              <CardContent className="p-6">
                <Badge className="bg-[#c9a84c] text-white mb-4">{property.country}</Badge>
                <h1 className="text-3xl font-bold text-white mb-3">{property.title}</h1>
                <p className="text-white/60 flex items-center gap-2 mb-6">
                  <MapPin className="w-5 h-5" />
                  {property.city}
                </p>

                <div className="grid grid-cols-3 gap-6 mb-6 pb-6 border-b border-white/10">
                  {property.bedrooms && (
                    <div>
                      <Bed className="w-6 h-6 text-[#c9a84c] mb-2" />
                      <p className="text-2xl font-bold text-white">{property.bedrooms}</p>
                      <p className="text-sm text-white/60">Spálne</p>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div>
                      <Bath className="w-6 h-6 text-[#c9a84c] mb-2" />
                      <p className="text-2xl font-bold text-white">{property.bathrooms}</p>
                      <p className="text-sm text-white/60">Kúpeľne</p>
                    </div>
                  )}
                  {property.area_sqm && (
                    <div>
                      <Maximize className="w-6 h-6 text-[#c9a84c] mb-2" />
                      <p className="text-2xl font-bold text-white">{property.area_sqm}</p>
                      <p className="text-sm text-white/60">m²</p>
                    </div>
                  )}
                </div>

                {property.description && (
                  <>
                    <h3 className="text-xl font-semibold text-white mb-3">Popis</h3>
                    <p className="text-white/70 leading-relaxed whitespace-pre-wrap">{property.description}</p>
                  </>
                )}
              </CardContent>
            </Card>

            {property.features?.length > 0 && (
              <Card className="bg-white/5 backdrop-blur-lg border-white/10">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Vybavenie</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {property.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 text-white/70">
                        <Check className="w-4 h-4 text-[#c9a84c]" />
                        <span>{f}</span>
                      </div>
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
                  <p className="text-3xl font-bold text-[#c9a84c] mb-1">
                    €{property.price?.toLocaleString()}
                  </p>
                  {property.available_units && (
                    <p className="text-sm text-white/60">Dostupných: {property.available_units} jednotiek</p>
                  )}
                </div>

                <h3 className="text-lg font-semibold text-white mb-4">Mám záujem</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    placeholder="Meno a priezvisko *"
                    value={formData.full_name}
                    onChange={e => setFormData({...formData, full_name: e.target.value})}
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                  <Input
                    type="email"
                    placeholder="Email *"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                  <Input
                    type="tel"
                    placeholder="Telefón *"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      type="number"
                      placeholder="Min. rozpočet (€)"
                      value={formData.budget_min}
                      onChange={e => setFormData({...formData, budget_min: e.target.value})}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    />
                    <Input
                      type="number"
                      placeholder="Max. rozpočet (€)"
                      value={formData.budget_max}
                      onChange={e => setFormData({...formData, budget_max: e.target.value})}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    />
                  </div>
                  <Textarea
                    placeholder="Vaša správa"
                    value={formData.notes}
                    onChange={e => setFormData({...formData, notes: e.target.value})}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 min-h-24"
                  />
                  <Button type="submit" disabled={submitting} className="w-full bg-[#c9a84c] hover:bg-[#b8973b] text-white">
                    {submitting ? "Odeسielam..." : "Odoslať dopyt"}
                  </Button>
                  <p className="text-xs text-white/40 text-center">
                    Odoslaním súhlasíte so spracovaním osobných údajov
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}