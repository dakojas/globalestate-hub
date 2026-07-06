import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { usePublicLang } from "../PublicLanguageContext";

const TEXTS = {
  sk: { title: "Súbory cookie", text: "Používame cookies na zlepšenie vášho zážitku a analýzu návštevnosti. Môžete prijať všetky alebo len nevyhnutné.", accept: "Prijať všetky", reject: "Len nevyhnutné", privacy: "Ochrana súkromia" },
  en: { title: "Cookies", text: "We use cookies to improve your experience and analyze traffic. You can accept all or only essential ones.", accept: "Accept all", reject: "Essential only", privacy: "Privacy Policy" },
  de: { title: "Cookies", text: "Wir verwenden Cookies, um Ihre Erfahrung zu verbessern und den Datenverkehr zu analysieren. Sie können alle oder nur wesentliche akzeptieren.", accept: "Alle akzeptieren", reject: "Nur wesentliche", privacy: "Datenschutz" },
  fr: { title: "Cookies", text: "Nous utilisons des cookies pour améliorer votre expérience et analyser le trafic. Vous pouvez accepter tout ou seulement l'essentiel.", accept: "Tout accepter", reject: "Essentiel uniquement", privacy: "Confidentialité" },
  it: { title: "Cookie", text: "Utilizziamo i cookie per migliorare la tua esperienza e analizzare il traffico. Puoi accettarli tutti o solo quelli essenziali.", accept: "Accetta tutto", reject: "Solo essenziali", privacy: "Privacy" },
  ru: { title: "Файлы cookie", text: "Мы используем файлы cookie для улучшения вашего опыта и анализа трафика. Вы можете принять все или только основные.", accept: "Принять все", reject: "Только основные", privacy: "Конфиденциальность" },
  pl: { title: "Pliki cookie", text: "Używamy plików cookie, aby poprawić Twoje wrażenia i analizować ruch. Możesz zaakceptować wszystkie lub tylko niezbędne.", accept: "Akceptuj wszystkie", reject: "Tylko niezbędne", privacy: "Prywatność" },
  hu: { title: "Sütik", text: "Sütiket használunk a felhasználói élmény javítására és a forgalom elemzésére. Elfogadhatja az összeset vagy csak a szükségeseket.", accept: "Összes elfogadása", reject: "Csak szükséges", privacy: "Adatvédelem" },
};

export default function CookieConsent() {
  const { lang } = usePublicLang();
  const [visible, setVisible] = useState(false);
  const t = TEXTS[lang] || TEXTS.en;

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) setVisible(true);
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "all");
    setVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem("cookie-consent", "essential");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-md z-[9999] animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-[#0e1a2e] border border-[#c5a065]/30 rounded-2xl shadow-2xl p-5">
        <h4 className="text-[#c5a065] font-semibold text-sm mb-2">🍪 {t.title}</h4>
        <p className="text-white/65 text-xs leading-relaxed mb-4">{t.text}</p>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={handleAccept}
            className="bg-[#c5a065] hover:bg-[#a88950] text-black font-semibold text-xs px-4 py-2.5 rounded-lg transition-colors flex-1"
          >
            {t.accept}
          </button>
          <button
            onClick={handleReject}
            className="bg-white/10 hover:bg-white/20 text-white font-medium text-xs px-4 py-2.5 rounded-lg transition-colors flex-1"
          >
            {t.reject}
          </button>
        </div>
        <Link to={createPageUrl("PublicGDPR")} className="block text-center text-[#c5a065]/70 hover:text-[#c5a065] text-[11px] mt-3 transition-colors">
          {t.privacy}
        </Link>
      </div>
    </div>
  );
}