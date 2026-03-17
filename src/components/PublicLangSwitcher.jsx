import React from "react";
import { usePublicLang } from "./PublicLanguageContext";

export default function PublicLangSwitcher() {
  const { lang, changeLang } = usePublicLang();
  const languages = [
    { code: "sk", flag: "🇸🇰", label: "SK" },
    { code: "en", flag: "🇬🇧", label: "EN" },
    { code: "de", flag: "🇩🇪", label: "DE" },
    { code: "fr", flag: "🇫🇷", label: "FR" },
    { code: "it", flag: "🇮🇹", label: "IT" },
    { code: "ru", flag: "🇷🇺", label: "RU" },
    { code: "pl", flag: "🇵🇱", label: "PL" },
    { code: "hu", flag: "🇭🇺", label: "HU" },
  ];

  return (
    <div className="flex items-center gap-1 bg-white/10 rounded-full p-1 flex-wrap justify-center">
      {languages.map(l => (
        <button
          key={l.code}
          onClick={() => changeLang(l.code)}
          className={`px-2 py-1 rounded-full text-xs font-medium transition-all ${lang === l.code ? "bg-[#c9a84c] text-white" : "text-white/60 hover:text-white"}`}
          title={l.label}
        >
          {l.flag} {l.label}
        </button>
      ))}
    </div>
  );
}