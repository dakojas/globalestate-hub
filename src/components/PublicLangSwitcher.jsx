import React, { useState, useRef, useEffect } from "react";
import { usePublicLang } from "./PublicLanguageContext";
import { ChevronDown } from "lucide-react";

const languages = [
  { code: "sk", flag: "🇸🇰", label: "Slovenčina" },
  { code: "en", flag: "🇬🇧", label: "English" },
  { code: "de", flag: "🇩🇪", label: "Deutsch" },
  { code: "fr", flag: "🇫🇷", label: "Français" },
  { code: "it", flag: "🇮🇹", label: "Italiano" },
  { code: "ru", flag: "🇷🇺", label: "Русский" },
  { code: "pl", flag: "🇵🇱", label: "Polski" },
  { code: "hu", flag: "🇭🇺", label: "Magyar" },
];

export default function PublicLangSwitcher() {
  const { lang, changeLang } = usePublicLang();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const current = languages.find(l => l.code === lang) || languages[0];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-full text-sm font-medium transition-all"
        type="button"
      >
        <span>{current.flag}</span>
        <span className="hidden sm:inline">{current.label}</span>
        <span className="sm:hidden">{current.code.toUpperCase()}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-44 bg-[#0a121d] border border-white/20 rounded-xl shadow-2xl overflow-hidden z-[200]">
          {languages.map(l => (
            <button
              key={l.code}
              onClick={() => { changeLang(l.code); setOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left
                ${lang === l.code
                  ? "bg-[#c5a065]/20 text-[#c5a065] font-semibold"
                  : "text-white/80 hover:bg-white/10"
                }`}
              type="button"
            >
              <span className="text-base">{l.flag}</span>
              <span>{l.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}