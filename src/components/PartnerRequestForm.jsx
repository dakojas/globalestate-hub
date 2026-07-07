import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function PartnerRequestForm() {
  const [form, setForm] = useState({ full_name: "", organization_name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    base44.auth.me().then(u => {
      setForm(prev => ({ ...prev, email: u?.email || "", full_name: u?.full_name || "" }));
    }).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.full_name || !form.message) return;
    setSubmitting(true);
    try {
      await base44.entities.PartnerRequest.create(form);
      setSubmitted(true);
    } catch {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center max-w-md">
        <CheckCircle2 className="w-12 h-12 text-[#c9a84c] mx-auto mb-3" />
        <p className="text-white/80 font-medium">Vaša žiadosť bola odoslaná</p>
        <p className="text-white/40 text-sm mt-1">Ozveme sa vám po preskúmaní žiadosti.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
      <div className="text-center">
        <p className="text-[#c9a84c] text-sm font-medium">Požiadajte o partnerský prístup</p>
      </div>
      <div>
        <Label className="text-white/70 text-sm">Meno a priezvisko *</Label>
        <Input value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })}
          className="bg-white/10 border-white/10 text-white mt-1" required />
      </div>
      <div>
        <Label className="text-white/70 text-sm">Názov organizácie</Label>
        <Input value={form.organization_name} onChange={e => setForm({ ...form, organization_name: e.target.value })}
          className="bg-white/10 border-white/10 text-white mt-1" />
      </div>
      <div>
        <Label className="text-white/70 text-sm">Email</Label>
        <Input value={form.email} disabled className="bg-white/5 border-white/10 text-white/50 mt-1" />
      </div>
      <div>
        <Label className="text-white/70 text-sm">Prečo chcete byť partner Globeya? *</Label>
        <Textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
          className="bg-white/10 border-white/10 text-white mt-1 min-h-[100px]" required />
      </div>
      <Button type="submit" disabled={submitting} className="w-full bg-[#c9a84c] hover:bg-[#b8963f] text-black">
        {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
        {submitting ? "Odosielam..." : "Odoslať žiadosť"}
      </Button>
    </form>
  );
}