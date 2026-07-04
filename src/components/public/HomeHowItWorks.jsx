import React from "react";
import { usePublicLang } from "@/components/PublicLanguageContext";

const STEPS = {
  sk: [
    { num: "01", title: "Konzultácia", desc: "Zistíme váš cieľ — dovolenkový domov, investícia, alebo oboje. Nezáväzne a zdarma." },
    { num: "02", title: "Výber & obhliadka", desc: "Pripravíme výber na mieru a zorganizujeme obhliadku na mieste alebo online." },
    { num: "03", title: "Kúpa & právny servis", desc: "Zmluvy, prevody aj platby prebehnú bezpečne — všetko vám vysvetlíme v slovenčine." },
    { num: "04", title: "Zariadenie & správa", desc: "Apartmán zariadime na kľúč a postaráme sa oň, aj keď ste tisíce kilometrov ďaleko." },
  ],
  en: [
    { num: "01", title: "Consultation", desc: "We define your goal — vacation home, investment, or both. Free and no obligation." },
    { num: "02", title: "Selection & Viewing", desc: "We prepare a tailored selection and organize a viewing on-site or online." },
    { num: "03", title: "Purchase & Legal", desc: "Contracts, transfers, and payments handled safely — all explained in your language." },
    { num: "04", title: "Furnishing & Management", desc: "We furnish your apartment turnkey and take care of it, even when you're thousands of kilometers away." },
  ],
};

export default function HomeHowItWorks() {
  const { lang } = usePublicLang();
  const steps = STEPS[lang] || STEPS.en;
  const title = lang === "sk" ? "Od prvého hovoru po odovzdanie kľúčov" : "From first call to key handover";
  const label = lang === "sk" ? "Ako to funguje" : "How it works";

  return (
    <section id="how-it-works" className="px-4 sm:px-6 py-16 md:py-24" style={{ background: "#0a121d" }}>
      <div className="max-w-6xl mx-auto">
        <p className="text-[#c5a065] text-xs uppercase tracking-[0.3em] font-semibold mb-3 text-center">{label}</p>
        <h2 className="font-heading text-3xl md:text-4xl font-semibold text-white text-center mb-12">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="relative">
              <p className="font-heading text-[#c5a065] text-sm mb-2">{lang === "sk" ? `Krok ${step.num}` : `Step ${step.num}`}</p>
              <h3 className="text-white font-semibold text-lg mb-2">{step.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}