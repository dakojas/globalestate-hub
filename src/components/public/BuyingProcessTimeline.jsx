import React from "react";
import { Search, FileCheck, PenTool, KeyRound, Handshake } from "lucide-react";

const steps = [
  { icon: Search, key: "step1" },
  { icon: FileCheck, key: "step2" },
  { icon: PenTool, key: "step3" },
  { icon: KeyRound, key: "step4" },
  { icon: Handshake, key: "step5" },
];

const translations = {
  sk: {
    title: "Ako prebieha nákup",
    subtitle: "Jednoduchý 5-krokový proces — od prvej obhliadky až po odovzdanie kľúčov",
    step1: { title: "Výber a obhliadka", desc: "Vyberiete nehnuteľnosť a rezervujete si online alebo osobnú obhliadku." },
    step2: { title: "Právny servis", desc: "Overíme vlastnícke práva a pripravíme všetky potrebné dokumenty." },
    step3: { title: "Podpis zmluvy", desc: "Podpíšete kúpnu zmluvu a založíte zálohu na rezervovaný objekt." },
    step4: { title: "Platba a prevod", desc: "Uhradíte kúpnu cenu a zabezpečíme prevod vlastníctva na katastri." },
    step5: { title: "Odovzdanie kľúčov", desc: "Prijmete kľúče a nehnuteľnosť je oficiálne vaša." },
  },
  en: {
    title: "How the purchase works",
    subtitle: "A simple 5-step process — from first viewing to handover of keys",
    step1: { title: "Selection & Viewing", desc: "Choose a property and book an online or in-person viewing." },
    step2: { title: "Legal Service", desc: "We verify ownership rights and prepare all necessary documents." },
    step3: { title: "Contract Signing", desc: "Sign the purchase agreement and place a deposit to reserve." },
    step4: { title: "Payment & Transfer", desc: "Pay the purchase price and we handle the title transfer at the registry." },
    step5: { title: "Key Handover", desc: "Receive your keys — the property is officially yours." },
  },
  de: {
    title: "Wie der Kauf abläuft",
    subtitle: "Ein einfacher 5-Schritt-Prozess — von der ersten Besichtigung bis zur Schlüsselübergabe",
    step1: { title: "Auswahl & Besichtigung", desc: "Wählen Sie eine Immobilie und buchen Sie eine Online- oder Vor-Ort-Besichtigung." },
    step2: { title: "Rechtsservice", desc: "Wir prüfen die Eigentumsrechte und bereiten alle Dokumente vor." },
    step3: { title: "Vertragsunterschrift", desc: "Unterzeichnen Sie den Kaufvertrag und leisten Sie eine Anzahlung." },
    step4: { title: "Zahlung & Übertragung", desc: "Sie zahlen den Kaufpreis, wir übernehmen die Grundbuchübertragung." },
    step5: { title: "Schlüsselübergabe", desc: "Empfangen Sie die Schlüssel — die Immobilie gehört Ihnen." },
  },
  fr: {
    title: "Comment se déroule l'achat",
    subtitle: "Un processus simple en 5 étapes — de la première visite à la remise des clés",
    step1: { title: "Sélection & Visite", desc: "Choisissez un bien et réservez une visite en ligne ou sur place." },
    step2: { title: "Service Juridique", desc: "Nous vérifions les droits de propriété et préparons les documents." },
    step3: { title: "Signature du Contrat", desc: "Signez le contrat d'achat et versez un dépôt de réservation." },
    step4: { title: "Paiement & Transfert", desc: "Payez le prix d'achat, nous gérons le transfert de propriété." },
    step5: { title: "Remise des Clés", desc: "Recevez vos clés — le bien est officiellement à vous." },
  },
  it: {
    title: "Come funziona l'acquisto",
    subtitle: "Un semplice processo in 5 passaggi — dalla prima visita alla consegna delle chiavi",
    step1: { title: "Selezione & Visita", desc: "Scegli una proprietà e prenota una visita online o di persona." },
    step2: { title: "Servizio Legale", desc: "Verifichiamo i diritti di proprietà e prepariamo i documenti." },
    step3: { title: "Firma del Contratto", desc: "Firma il contratto di acquisto e versa un deposito." },
    step4: { title: "Pagamento & Trasferimento", desc: "Paga il prezzo d'acquisto, gestiamo il trasferimento di proprietà." },
    step5: { title: "Consegna delle Chiavi", desc: "Ricevi le chiavi — la proprietà è ufficialmente tua." },
  },
  ru: {
    title: "Как проходит покупка",
    subtitle: "Простой процесс из 5 шагов — от первого просмотра до передачи ключей",
    step1: { title: "Выбор и просмотр", desc: "Выберите недвижимость и забронируйте онлайн или личный просмотр." },
    step2: { title: "Юридическое обслуживание", desc: "Проверяем права собственности и готовим все документы." },
    step3: { title: "Подписание договора", desc: "Подпишите договор купли-продажи и внесите залог." },
    step4: { title: "Оплата и передача", desc: "Оплатите покупку, мы оформим передачу права собственности." },
    step5: { title: "Передача ключей", desc: "Получите ключи — недвижимость официально ваша." },
  },
  pl: {
    title: "Jak przebiega zakup",
    subtitle: "Prosty proces 5-krokowy — od pierwszego oglądania do przekazania kluczy",
    step1: { title: "Wybór i oglądanie", desc: "Wybierz nieruchomość i zarezerwuj oglądanie online lub osobiście." },
    step2: { title: "Obsługa prawna", desc: "Weryfikujemy prawa własności i przygotowujemy dokumenty." },
    step3: { title: "Podpisanie umowy", desc: "Podpisz umowę kupna i wpłać depozyt rezerwacyjny." },
    step4: { title: "Płatność i przeniesienie", desc: "Zapłać cenę kupna, zajmiemy się przeniesieniem własności." },
    step5: { title: "Przekazanie kluczy", desc: "Odbierz klucze — nieruchomość jest oficjalnie Twoja." },
  },
  hu: {
    title: "Hogyan zajlik a vásárlás",
    subtitle: "Egyszerű 5 lépéses folyamat — az első megtekintéstől a kulcsátadásig",
    step1: { title: "Kiválasztás & Megtekintés", desc: "Válasszon ingatlant és foglaljon online vagy személyes megtekintést." },
    step2: { title: "Jogi szolgáltatás", desc: "Ellenőrizzük a tulajdonjogokat és előkészítjük a dokumentumokat." },
    step3: { title: "Szerződés aláírása", desc: "Írja alá az adásvételi szerződést és fizessen foglalót." },
    step4: { title: "Fizetés & Átruházás", desc: "Fizesse meg a vételárat, mi intézzük a tulajdon átruházását." },
    step5: { title: "Kulcsátadás", desc: "Vegye át a kulcsokat — az ingatlan hivatalosan az Öné." },
  },
};

export default function BuyingProcessTimeline({ lang = "sk" }) {
  const t = translations[lang] || translations.sk;

  return (
    <div className="rounded-2xl bg-white/[0.04] backdrop-blur-lg border border-[#c5a065]/15 p-6">
      <h3 className="text-xl font-semibold text-white mb-1">{t.title}</h3>
      <p className="text-sm text-white/50 mb-8">{t.subtitle}</p>

      <div className="relative">
        {/* Connecting line */}
        <div className="hidden md:block absolute top-7 left-0 right-0 h-0.5 bg-white/10" />
        <div className="hidden md:block absolute top-7 left-0 h-0.5 bg-gradient-to-r from-[#c5a065] to-[#e8d5a0]" style={{ width: "100%" }} />

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-2 relative">
          {steps.map((step, i) => (
            <div key={i} className="relative flex md:flex-col items-start md:items-center gap-4 md:gap-3 md:text-center">
              <div className="relative z-10 flex-shrink-0">
                <div className="w-14 h-14 rounded-full bg-[#0e1a2e] border-2 border-[#c5a065] flex items-center justify-center shadow-lg">
                  <step.icon className="w-6 h-6 text-[#c5a065]" />
                </div>
                <span className="hidden md:flex absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#c5a065] text-[#0e1a2e] text-xs font-bold items-center justify-center">
                  {i + 1}
                </span>
              </div>
              <div className="md:mt-2">
                <p className="font-semibold text-white text-sm mb-1">{t[step.key].title}</p>
                <p className="text-xs text-white/50 leading-relaxed">{t[step.key].desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}