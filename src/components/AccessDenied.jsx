import React, { useState } from "react";
import PartnerRequestForm from "./PartnerRequestForm";
import { Globe } from "lucide-react";

const T = {
  sk: { denied: "Prístup zamietnutý", desc: "Na túto sekciu nemáte oprávnenie. Ak chcete spolupracovať s Globeya, môžete požiadať o partnerský prístup.", cta: "Požiadať o registráciu ako partner" },
  en: { denied: "Access denied", desc: "You don't have permission for this section. If you'd like to collaborate with Globeya, you can request partner access.", cta: "Request partner registration" },
};

export default function AccessDenied() {
  const [lang, setLang] = useState(() => navigator.language?.startsWith("sk") ? "sk" : "en");
  const [showForm, setShowForm] = useState(false);
  const t = T[lang];

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#0a1628] gap-6 px-4 py-8 overflow-y-auto">
      <button onClick={() => setLang(lang === "sk" ? "en" : "sk")}
        className="absolute top-4 right-4 text-white/40 hover:text-white/70 flex items-center gap-1 text-sm">
        <Globe className="w-4 h-4" />
        {lang === "sk" ? "EN" : "SK"}
      </button>
      <div className="text-center">
        <p className="text-white/80 text-lg font-semibold">{t.denied}</p>
        <p className="text-white/40 text-sm mt-2 max-w-sm">{t.desc}</p>
      </div>
      {!showForm ? (
        <button onClick={() => setShowForm(true)} className="text-[#c9a84c] text-sm hover:underline">
          {t.cta}
        </button>
      ) : (
        <PartnerRequestForm />
      )}
    </div>
  );
}