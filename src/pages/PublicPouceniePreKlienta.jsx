import React from "react";
import { Link } from "react-router-dom";
import { PublicLanguageProvider, usePublicLang } from "@/components/PublicLanguageContext";
import PublicLangSwitcher from "@/components/PublicLangSwitcher";
import Logo from "@/components/Logo";
import { createPageUrl } from "@/utils";

function PageInner() {
  const { tr } = usePublicLang();
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav style={{ background: "#080d1a" }} className="px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <Link to="/">
          <Logo className="h-9" />
        </Link>
        <div className="flex items-center gap-6">
          <PublicLangSwitcher />
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Poučenie pre klienta</h1>
        <p className="text-sm text-gray-500 mb-10">Podľa zákona č. 136/2010 Z. z. a zákona č. 108/2024 Z. z.</p>

        <div className="bg-gray-50 rounded-xl p-6 mb-8 text-sm text-gray-700 leading-relaxed">
          <p className="font-semibold mb-3">Poskytovateľ služieb:</p>
          <table className="text-sm w-full">
            <tbody className="space-y-1">
              {[
                ["Obchodné meno:", "NVZ s. r. o."],
                ["Sídlo:", "Palárikova 2311/6, 052 01 Spišská Nová Ves"],
                ["IČO:", "57013659"],
                ["DIČ:", "2122535294"],
                ["Konateľ:", "Mgr. Dávid Kokavec"],
                ["E-mail:", "nehnutelnostivzahranici@gmail.com"],
                ["Telefón:", "+421 951 094 706"],
              ].map(([label, val]) => (
                <tr key={label}>
                  <td className="font-medium text-gray-600 pr-4 py-0.5 whitespace-nowrap">{label}</td>
                  <td className="text-gray-800">{val}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="prose prose-gray max-w-none text-sm leading-7 space-y-8">
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3">1. Popis služby a odmena</h2>
            <p>Poskytovateľ je sprostredkovateľom predaja, kúpy a/alebo prenájmu nehnuteľností na Slovensku a v zahraničí. Poskytuje tiež služby zariaďovania a správy nehnuteľností.</p>
            <p className="mt-2">Odmena sa určuje dohodou v Zmluve podľa rozsahu poskytnutých služieb. Splatnosť odmeny sa určuje individuálne v Zmluve. Platba prebieha bezhotovostne na účet: <strong>IBAN: SK11 8330 0000 0022 0321 0947</strong> (Fio banka).</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3">2. Všeobecné podmienky</h2>
            <p>Poskytovateľ vyvíja činnosť smerujúcu k tomu, aby mal Klient príležitosť kúpiť, predať alebo prenajať nehnuteľnosť od tretej osoby. Neručí za splnenie záväzkov tretích osôb ani za uzatvorenie zmluvy s treťou osobou.</p>
            <p className="mt-2">Zodpovednosť za vady služby: pre spotrebiteľov platí záručná doba <strong>24 mesiacov</strong> od poskytnutia služby. Reklamačný postup je upravený v <Link to="/PublicReklamacnyPoriadok" className="text-[#c9a84c]">Reklamačnom poriadku</Link>.</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3">3. Právo na odstúpenie od zmluvy</h2>
            <p>Pri zmluvách uzatvorených na diaľku alebo mimo prevádzkových priestorov má Klient – spotrebiteľ právo odstúpiť od zmluvy bez uvedenia dôvodu do <strong>14 dní</strong> od jej uzatvorenia.</p>
            <p className="mt-2">Ak Klient požiada o začatie poskytovania služby pred uplynutím tejto lehoty a Poskytovateľ splní celú objednávku, právo na odstúpenie zaniká.</p>
            <p className="mt-2">Odstúpenie sa zasiela na adresu sídla alebo e-mailom: <a href="mailto:nehnutelnostivzahranici@gmail.com" className="text-[#c9a84c]">nehnutelnostivzahranici@gmail.com</a></p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3">4. Ochrana osobných údajov</h2>
            <p>Osobné údaje Klienta sú spracúvané v súlade s nariadením GDPR a zákonom č. 18/2018 Z. z. Klient má právo na prístup, opravu, vymazanie, prenosnosť a námietku voči spracúvaniu osobných údajov. Dozorným orgánom je <strong>Úrad na ochranu osobných údajov SR</strong>.</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3">5. Alternatívne riešenie sporov</h2>
            <p>V prípade sporu môže Klient – spotrebiteľ podať návrh na alternatívne riešenie sporu na Slovenskú obchodnú inšpekciu: <a href="https://www.soi.sk" target="_blank" rel="noopener noreferrer" className="text-[#c9a84c]">www.soi.sk</a></p>
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

export default function PublicPouceniePreKlienta() {
  return (
    <PublicLanguageProvider>
      <PageInner />
    </PublicLanguageProvider>
  );
}