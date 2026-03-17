import React from "react";
import { usePublicLang } from "./PublicLanguageContext";

export default function PublicLangSwitcher() {
  const { lang, changeLang } = usePublicLang();
  return (
    <div className="flex items-center gap-1 bg-white/10 rounded-full p-1">
      <button
        onClick={() => changeLang("sk")}
        className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${lang === "sk" ? "bg-[#c9a84c] text-white" : "text-white/60 hover:text-white"}`}
      >
        🇸🇰 SK
      </button>
      <button
        onClick={() => changeLang("en")}
        className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${lang === "en" ? "bg-[#c9a84c] text-white" : "text-white/60 hover:text-white"}`}
      >
        🇬🇧 EN
      </button>
    </div>
  );
}