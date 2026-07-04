import React from "react";
import { usePublicLang } from "@/components/PublicLanguageContext";

const SERVICES = {
  sk: [
    { title: "Kúpa nehnuteľnosti", desc: "Preverení developeri, reálne ceny bez prirážok a sprievod celým procesom od rezervácie po zápis vlastníctva.", tag: "Základ" },
    { title: "Zariadenie na kľúč", desc: "Od postele po pohár. Váš apartmán pripravíme na bývanie alebo prenájom bez jediného vášho letu navyše.", tag: "Úspora času" },
    { title: "Správa & prenájom", desc: "Postaráme sa o nájomníkov, údržbu aj výnosy. Vy sledujete príjem, my riešime všetko ostatné.", tag: "Pasívny príjem" },
  ],
  en: [
    { title: "Property Purchase", desc: "Verified developers, real prices without markups, and guidance through the entire process from reservation to title registration.", tag: "Core" },
    { title: "Turnkey Furnishing", desc: "From bed to glass. We prepare your apartment for living or rental without a single extra flight.", tag: "Time Saver" },
    { title: "Management & Rental", desc: "We handle tenants, maintenance, and yields. You watch the income, we handle everything else.", tag: "Passive Income" },
  ],
};

export default function HomeServices() {
  const { lang } = usePublicLang();
  const services = SERVICES[lang] || SERVICES.en;
  const title = lang === "sk" ? "Všetko pod jednou strechou" : "Everything under one roof";
  const label = lang === "sk" ? "Služby" : "Services";

  return (
    <section id="services" className="px-4 sm:px-6 py-16 md:py-24" style={{ background: "#080f1a" }}>
      <div className="max-w-6xl mx-auto">
        <p className="text-[#c5a065] text-xs uppercase tracking-[0.3em] font-semibold mb-3 text-center">{label}</p>
        <h2 className="font-heading text-3xl md:text-4xl font-semibold text-white text-center mb-12">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <div key={i} className="rounded-2xl p-8 transition-all duration-300 hover:translate-y-[-4px]"
              style={{ background: "rgba(18,29,46,0.6)", border: "1px solid rgba(197,160,101,0.15)" }}>
              <span className="inline-block text-[#c5a065] text-xs font-semibold uppercase tracking-wider mb-4 px-3 py-1 rounded-full"
                style={{ background: "rgba(197,160,101,0.1)", border: "1px solid rgba(197,160,101,0.2)" }}>
                {s.tag}
              </span>
              <h3 className="text-white font-semibold text-xl mb-3">{s.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}