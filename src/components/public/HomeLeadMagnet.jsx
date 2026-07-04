import React, { useState } from "react";
import { usePublicLang } from "@/components/PublicLanguageContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function HomeLeadMagnet() {
  const { lang } = usePublicLang();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const t = {
    sk: { label: "Sprievodca zdarma", title: "Kde sa oplatí kúpiť nehnuteľnosť pri mori v roku 2026", sub: "Porovnanie cien, výnosov a rizík v našich 4 vlajkových destináciách. Pošleme vám ho na e-mail.", btn: "Poslať sprievodcu", success: "✓ Ďakujeme! Sprievodca je na ceste do vašej schránky.", note: "Žiadny spam. Iba sprievodca a občasné trhové novinky." },
    en: { label: "Free Guide", title: "Where to buy coastal property in 2026", sub: "Comparison of prices, yields, and risks in our 4 flagship destinations. We'll send it to your email.", btn: "Send guide", success: "✓ Thank you! The guide is on its way to your inbox.", note: "No spam. Just the guide and occasional market updates." },
  };
  const c = t[lang] || t.en;

  return (
    <section className="px-4 sm:px-6 py-16 md:py-24" style={{ background: "#080f1a" }}>
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-[#c5a065] text-xs uppercase tracking-[0.3em] font-semibold mb-3">{c.label}</p>
        <h2 className="font-heading text-2xl md:text-3xl font-semibold text-white mb-4">{c.title}</h2>
        <p className="text-white/50 text-sm mb-8">{c.sub}</p>
        {sent ? (
          <p className="text-[#c5a065] text-sm font-medium">{c.success}</p>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); if (email) setSent(true); }}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              className="bg-[#121d2e] border-[#c5a065]/30 text-white placeholder:text-white/30 h-11 flex-1" />
            <Button type="submit"
              className="bg-[#c5a065] hover:bg-[#a88950] text-black font-semibold px-6 h-11 whitespace-nowrap">
              {c.btn}
            </Button>
          </form>
        )}
        <p className="text-white/30 text-xs mt-4">{c.note}</p>
      </div>
    </section>
  );
}