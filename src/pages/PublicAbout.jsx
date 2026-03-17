import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Logo from "@/components/Logo";
import { createPageUrl } from "@/utils";
import { PublicLanguageProvider, usePublicLang } from "@/components/PublicLanguageContext";
import PublicLangSwitcher from "@/components/PublicLangSwitcher";

const brandStory = {
  sk: {
    hero: {
      title: "Začali sme ako malý slovenský sen.",
      subtitle: "Stali sme sa bránou do celého sveta.",
      meta: "BRATISLAVA • DUBAJ • SVET • 2024–"
    },
    chapter1: {
      label: "KAPITOLA I – ZAČIATOK",
      title: "Jeden nápad. Jedna stránka. Jeden sen.",
      content: "Bolo to jednoduché: Slováci chceli nehnuteľnosti v zahraničí, ale nikde kde začať. Jazyk bol cudzi. Trh neznámy. Právne prostredie neprehľadné. A nikto im nehovoril v ich jazyku, s ich dôverou, z ich sveta.\n\nTak vznikla stránka Nehnuteľnosti v zahraničí — nie ako veľká korporácia, ale ako odpoveď na konkrétnu potrebu konkrétnych ľudí. Lokálny portál s jasným poslaním: pribiližiť vzdialený svet na dosah ruky."
    },
    chapter2: {
      label: "KAPITOLA II – RAST",
      title: "Klienti nás vzali so sebou.",
      content: "Nikto nás nemusel presvedčiť o tom, že svet je malý. Naši klienti nám to ukázali.\n\nPrvá kúpa v Egypte. Potom Dubaj. Potom Bali. Každý spokojný klient otvoriť nové dvere — do novej krajiny, k novému developerovi, k novej komunite ľudí, ktorí chcú investovať mimo hranic.\n\nTím rástol. Portfólio rástlo. Ale závázok zostal rovnaký: každý klient dostane rovnakú starostlivosť ako ten prvý.",
      timeline: [
        { label: "Vznik", desc: "Slovenský portál ide online. Prvé projekty, prví klienti, prvé sny splnené na cudzej pôde." },
        { label: "Expanzia", desc: "Egypt, Dubaj, Albánsko, Turecko. Tím rastie. Makléri v Dubaji. Partneri na mieste. Klient nekupuje naslepo." },
        { label: "Dnes", desc: "16 krajín. Stovky spokojných klientov. Globálna sieť. Lokálna duša. Každý projekt overený. Každý klient vitaný." },
        { label: "Zajtra", desc: "Rast bez kompromisov. Viac krajín. Viac príbehov. Jeden závázok — byť pre každého klienta ako sme boli pre toho prvého." }
      ]
    },
    chapter3: {
      label: "KAPITOLA III – DNES",
      title: "Globálni. Ale stále vaši.",
      content: "Dnes pôsobíme v 16 krajinách. Náš tím hovorí viacerými jazykmi, pozná lokálne trhy, pozná developerov osobne. Ale jedno sa nezmenilo.\n\nKeď ná zavoláte, neodpovedá vám call centrum. Odpovie vám človek, ktorý pozná vás, váš rozpočet a váš sen. Tak to bolo od začiatku. Tak to zostane.\n\nNie sme globálna korporácia s lokálnou pobočkou. Sme lokálna firma s globálnym dosahom. To je rozdiel, ktorý cítite pri každom jednání."
    },
    motto: {
      title: "Svet je väčší, než si myslíte.",
      subtitle: "Vaše možnosti tiež.",
      closing: "My sme tu preto, aby ste ich objavili."
    }
  },
  en: {
    hero: {
      title: "We started as a small Slovak dream.",
      subtitle: "We became a gateway to the whole world.",
      meta: "BRATISLAVA • DUBAI • WORLD • 2024–"
    },
    chapter1: {
      label: "CHAPTER I – BEGINNING",
      title: "One idea. One page. One dream.",
      content: "It was simple: Slovaks wanted property abroad, but didn't know where to start. The language was foreign. The market unknown. The legal landscape impenetrable. And nobody spoke to them in their language, with their trust, from their world.\n\nSo Nehnuteľnosti v zahraničí was born — not as a big corporation, but as an answer to a specific need of specific people. A local portal with a clear mission: to bring the distant world within reach."
    },
    chapter2: {
      label: "CHAPTER II – GROWTH",
      title: "Clients took us with them.",
      content: "Nobody had to convince us that the world is small. Our clients showed us.\n\nFirst purchase in Egypt. Then Dubai. Then Bali. Every satisfied client opened new doors — to new countries, to new developers, to new communities of people who want to invest beyond borders.\n\nThe team grew. The portfolio grew. But the commitment stayed the same: every client gets the same care as the first one.",
      timeline: [
        { label: "Beginning", desc: "Slovak portal goes online. First projects, first clients, first dreams fulfilled on foreign soil." },
        { label: "Expansion", desc: "Egypt, Dubai, Albania, Turkey. Team grows. Brokers in Dubai. Partners on the ground. Client doesn't buy blind." },
        { label: "Today", desc: "16 countries. Hundreds of satisfied clients. Global network. Local soul. Every project verified. Every client welcomed." },
        { label: "Tomorrow", desc: "Growth without compromise. More countries. More stories. One commitment — to be for every client what we were for the first one." }
      ]
    },
    chapter3: {
      label: "CHAPTER III – TODAY",
      title: "Global. But still yours.",
      content: "Today we operate in 16 countries. Our team speaks multiple languages, knows local markets, knows developers personally. But one thing hasn't changed.\n\nWhen you call us, a call center doesn't answer. A person answers who knows you, your budget, and your dream. That's how it was from the beginning. That's how it will stay.\n\nWe are not a global corporation with a local office. We are a local company with global reach. That is the difference you feel in every conversation."
    },
    motto: {
      title: "The world is bigger than you think.",
      subtitle: "So are your possibilities.",
      closing: "We're here to help you discover them."
    }
  }
};

function PublicAboutInner() {
  const { lang } = usePublicLang();
  const story = brandStory[lang] || brandStory.en;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#132039] to-[#1a2844]">
      {/* Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to={createPageUrl("PublicHome")} className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <Logo className="h-9 ml-2" />
          </Link>
          <PublicLangSwitcher />
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-16 space-y-16">
        {/* Hero */}
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-10 border border-white/10">
          <p className="text-[#c9a84c] text-xs uppercase tracking-widest mb-6">{story.hero.meta}</p>
          <h1 className="text-5xl font-bold text-white mb-4">
            <em>{story.hero.title}</em>
          </h1>
          <p className="text-2xl text-white/70">
            <em>{story.hero.subtitle}</em>
          </p>
        </div>

        {/* Chapter 1 */}
        <div className="bg-white rounded-2xl p-10">
          <p className="text-[#c9a84c] text-xs uppercase tracking-widest font-semibold mb-4">{story.chapter1.label}</p>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">{story.chapter1.title}</h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{story.chapter1.content}</p>
        </div>

        {/* Chapter 2 */}
        <div className="bg-white rounded-2xl p-10">
          <p className="text-[#c9a84c] text-xs uppercase tracking-widest font-semibold mb-4">{story.chapter2.label}</p>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">{story.chapter2.title}</h2>
          <p className="text-gray-700 leading-relaxed mb-8">{story.chapter2.content}</p>
          
          <div className="space-y-4">
            {story.chapter2.timeline.map((item, i) => (
              <div key={i} className="flex gap-4">
                <div>
                  <p className="text-xl font-semibold text-[#c9a84c]">{item.label}</p>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chapter 3 */}
        <div className="bg-white rounded-2xl p-10">
          <p className="text-[#c9a84c] text-xs uppercase tracking-widest font-semibold mb-4">{story.chapter3.label}</p>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">{story.chapter3.title}</h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{story.chapter3.content}</p>
        </div>

        {/* Motto */}
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-10 border border-white/10 text-center">
          <p className="text-[#c9a84c] text-xs uppercase tracking-widest mb-6">NAŠE MOTTO</p>
          <h3 className="text-4xl font-bold text-white mb-3">
            <em>{story.motto.title}</em>
          </h3>
          <p className="text-2xl text-white/70 mb-6">
            <em>{story.motto.subtitle}</em>
          </p>
          <p className="text-white/60 italic">{story.motto.closing}</p>
        </div>
      </div>
    </div>
  );
}

export default function PublicAbout() {
  return (
    <PublicLanguageProvider>
      <PublicAboutInner />
    </PublicLanguageProvider>
  );
}