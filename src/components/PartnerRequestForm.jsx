import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2, Globe } from "lucide-react";

const T = {
  sk: {
    title: "Požiadajte o partnerský prístup",
    fullName: "Meno a priezvisko *",
    orgName: "Názov organizácie",
    email: "Email",
    message: "Prečo chcete byť partner Globeya? *",
    submit: "Odoslať žiadosť",
    sending: "Odosielam...",
    success: "Vaša žiadosť bola odoslaná",
    successSub: "Ozveme sa vám po preskúmaní žiadosti.",
  },
  en: {
    title: "Request partner access",
    fullName: "Full name *",
    orgName: "Organization name",
    email: "Email",
    message: "Why do you want to become a Globeya partner? *",
    submit: "Submit request",
    sending: "Sending...",
    success: "Your request has been submitted",
    successSub: "We will get back to you after reviewing your application.",
  },
};

export default function PartnerRequestForm() {
  const [lang, setLang] = useState(() => navigator.language?.startsWith("sk") ? "sk" : "en");
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

  const t = T[lang];

  if (submitted) {
    return (
      <div className="text-center max-w-md">
        <CheckCircle2 className="w-12 h-12 text-[#c9a84c] mx-auto mb-3" />
        <p className="text-white/80 font-medium">{t.success}</p>
        <p className="text-white/40 text-sm mt-1">{t.successSub}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[#c9a84c] text-sm font-medium">{t.title}</p>
        <button type="button" onClick={() => setLang(lang === "sk" ? "en" : "sk")}
          className="text-white/40 hover:text-white/70 flex items-center gap-1 text-xs">
          <Globe className="w-3.5 h-3.5" />
          {lang === "sk" ? "EN" : "SK"}
        </button>
      </div>
      <div>
        <Label className="text-white/70 text-sm">{t.fullName}</Label>
        <Input value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })}
          className="bg-white/10 border-white/10 text-white mt-1" required />
      </div>
      <div>
        <Label className="text-white/70 text-sm">{t.orgName}</Label>
        <Input value={form.organization_name} onChange={e => setForm({ ...form, organization_name: e.target.value })}
          className="bg-white/10 border-white/10 text-white mt-1" />
      </div>
      <div>
        <Label className="text-white/70 text-sm">{t.email}</Label>
        <Input value={form.email} disabled className="bg-white/5 border-white/10 text-white/50 mt-1" />
      </div>
      <div>
        <Label className="text-white/70 text-sm">{t.message}</Label>
        <Textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
          className="bg-white/10 border-white/10 text-white mt-1 min-h-[100px]" required />
      </div>
      <Button type="submit" disabled={submitting} className="w-full bg-[#c9a84c] hover:bg-[#b8963f] text-black">
        {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
        {submitting ? t.sending : t.submit}
      </Button>
    </form>
  );
}