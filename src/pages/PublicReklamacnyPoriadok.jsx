import React from "react";
import { Link } from "react-router-dom";
import { PublicLanguageProvider, usePublicLang } from "@/components/PublicLanguageContext";
import PublicLangSwitcher from "@/components/PublicLangSwitcher";
import Logo from "@/components/Logo";
import { createPageUrl } from "@/utils";
import { useDayNight } from "@/hooks/useDayNight";
import ThemeToggle from "@/components/public/ThemeToggle";

function PageInner() {
  const { tr } = usePublicLang();
  const { isDark } = useDayNight();
  return (
    <div data-theme={isDark ? "dark" : "light"} className="min-h-screen font-body" style={{ background: "var(--bg-page)" }}>
      {/* Nav */}
      <nav style={{ background: "#080d1a" }} className="px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <Link to="/">
          <Logo className="h-9" />
        </Link>
        <div className="flex items-center gap-6">
          <ThemeToggle />
          <PublicLangSwitcher />
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Reklamačný poriadok</h1>
        <p className="text-sm text-gray-500 mb-10">NVZ s. r. o. — účinnosť od 5.6.2025</p>

        <div className="bg-gray-50 rounded-xl p-6 mb-8 text-sm text-gray-700 leading-relaxed">
          <p className="font-semibold mb-2">Prevádzkovateľ:</p>
          <p><strong>NVZ s. r. o.</strong></p>
          <p>Palárikova 2311/6, 052 01 Spišská Nová Ves</p>
          <p>IČO: 57013659 | DIČ: 2122535294</p>
          <p>Konateľ: Mgr. Dávid Kokavec</p>
          <p>E-mail: <a href="mailto:nehnutelnostivzahranici@gmail.com" className="text-[#c9a84c]">nehnutelnostivzahranici@gmail.com</a></p>
        </div>

        <div className="prose prose-gray max-w-none text-sm leading-7 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3">1. Pôsobnosť reklamačného poriadku</h2>
            <p>Reklamačný poriadok sa vzťahuje výlučne na Klienta – spotrebiteľa, t. j. fyzickú osobu, ktorá v súvislosti so spotrebiteľskou zmluvou nekoná v rámci svojej podnikateľskej činnosti.</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3">2. Uplatnenie reklamácie</h2>
            <p>Klient – spotrebiteľ má právo uplatňovať nároky z vád služby formou reklamácie. Je povinný tak urobiť bezodkladne po zistení vady, inak jeho právo zaniká.</p>
            <p className="mt-2">Reklamáciu možno uplatniť:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>písomne na adresu sídla: Palárikova 2311/6, 052 01 Spišská Nová Ves</li>
              <li>e-mailom: <a href="mailto:nehnutelnostivzahranici@gmail.com" className="text-[#c9a84c]">nehnutelnostivzahranici@gmail.com</a></li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3">3. Obsah reklamácie</h2>
            <p>V reklamácii je potrebné uviesť:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>meno a priezvisko, kontaktné údaje</li>
              <li>označenie zmluvného vzťahu a reklamovanej služby</li>
              <li>popis vady a odôvodnenie reklamácie</li>
              <li>uplatňovaný nárok (podľa § 621 Občianskeho zákonníka)</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3">4. Vybavenie reklamácie</h2>
            <p>Poskytovateľ vybaví reklamáciu bezodkladne po doručení. Písomné potvrdenie o podaní reklamácie a lehote na vybavenie (max. 30 dní) bude zaslané Klientovi. V prípade neuznania reklamácia bude písomne odmietnutá s uvedením dôvodov.</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3">5. Alternatívne riešenie sporov</h2>
            <p>Ak Poskytovateľ zamietne žiadosť o nápravu alebo neodpovie do 30 dní, Klient – spotrebiteľ má právo podať návrh na alternatívne riešenie sporu:</p>
            <p className="mt-2"><strong>Slovenská obchodná inšpekcia</strong><br />
            Bajkalská 21/A, p. p. 29, 827 99 Bratislava<br />
            <a href="https://www.soi.sk" target="_blank" rel="noopener noreferrer" className="text-[#c9a84c]">www.soi.sk</a></p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link to="/" className="text-[#c9a84c] hover:underline text-sm">← {tr("backToHome")}</Link>
        </div>
      </div>

      <footer style={{ background: "#080d1a" }} className="px-6 py-8 text-center">
        <p className="text-white/30 text-xs">© 2026 Nehnuteľnosti v zahraničí. {tr("rights")}</p>
      </footer>
    </div>
  );
}

export default function PublicReklamacnyPoriadok() {
  return (
    <PublicLanguageProvider>
      <PageInner />
    </PublicLanguageProvider>
  );
}