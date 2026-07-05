import React from "react";
import { usePublicLang } from "@/components/PublicLanguageContext";

const TEAM_IMAGES = [
  "https://www.nehnutelnostivzahranici.sk/wp-content/uploads/2024/05/PHOTO-2025-02-17-12-09-56.jpg",
  "https://www.nehnutelnostivzahranici.sk/wp-content/uploads/2024/05/monika.png",
  "https://www.nehnutelnostivzahranici.sk/wp-content/uploads/2024/05/9622a8bd-bf71-4c92-bec9-b01c00441d50.jpg",
  "https://www.nehnutelnostivzahranici.sk/wp-content/uploads/2024/05/laco.png",
  "https://www.nehnutelnostivzahranici.sk/wp-content/uploads/2025/02/WhatsApp-Image-2025-02-26-at-12.33.19.jpeg",
];

const TEAM = {
  sk: {
    label: "TÍM",
    title: "Spoznajte náš tím",
    subtitle: "Tím je tvorený aj ďalšími skvelými ľuďmi, ktorí nám pomáhajú v mnohých oblastiach.",
    members: [
      { name: "Dávid", role: "Zakladateľ projektu" },
      { name: "Monika", role: "Realitná maklérka v Dubaji" },
      { name: "Alenka", role: "Realitná maklérka" },
      { name: "Ladislav", role: "Zariaďovanie apartmánov" },
      { name: "Alexandra", role: "Realitná maklérka" },
    ],
  },
  en: {
    label: "TEAM",
    title: "Meet our team",
    subtitle: "Our team is made up of other great people who help us in many areas.",
    members: [
      { name: "Dávid", role: "Project founder" },
      { name: "Monika", role: "Real estate agent in Dubai" },
      { name: "Alenka", role: "Real estate agent" },
      { name: "Ladislav", role: "Apartment furnishing" },
      { name: "Alexandra", role: "Real estate agent" },
    ],
  },
  de: {
    label: "TEAM",
    title: "Lernen Sie unser Team kennen",
    subtitle: "Unser Team besteht auch aus weiteren großartigen Menschen, die uns in vielen Bereichen unterstützen.",
    members: [
      { name: "Dávid", role: "Projektgründer" },
      { name: "Monika", role: "Immobilienmaklerin in Dubai" },
      { name: "Alenka", role: "Immobilienmaklerin" },
      { name: "Ladislav", role: "Wohnungseinrichtung" },
      { name: "Alexandra", role: "Immobilienmaklerin" },
    ],
  },
  fr: {
    label: "ÉQUIPE",
    title: "Rencontrez notre équipe",
    subtitle: "Notre équipe est également composée d'autres personnes formidables qui nous aident dans de nombreux domaines.",
    members: [
      { name: "Dávid", role: "Fondateur du projet" },
      { name: "Monika", role: "Agent immobilier à Dubaï" },
      { name: "Alenka", role: "Agent immobilier" },
      { name: "Ladislav", role: "Ameublement d'appartements" },
      { name: "Alexandra", role: "Agent immobilier" },
    ],
  },
  it: {
    label: "TEAM",
    title: "Incontra il nostro team",
    subtitle: "Il nostro team è composto anche da altre persone fantastiche che ci aiutano in molte aree.",
    members: [
      { name: "Dávid", role: "Fondatore del progetto" },
      { name: "Monika", role: "Agente immobiliare a Dubai" },
      { name: "Alenka", role: "Agente immobiliare" },
      { name: "Ladislav", role: "Arredamento appartamenti" },
      { name: "Alexandra", role: "Agente immobiliare" },
    ],
  },
  ru: {
    label: "КОМАНДА",
    title: "Познакомьтесь с нашей командой",
    subtitle: "Наша команда также состоит из других замечательных людей, которые помогают нам во многих областях.",
    members: [
      { name: "Dávid", role: "Основатель проекта" },
      { name: "Monika", role: "Агент по недвижимости в Дубае" },
      { name: "Alenka", role: "Агент по недвижимости" },
      { name: "Ladislav", role: "Меблировка квартир" },
      { name: "Alexandra", role: "Агент по недвижимости" },
    ],
  },
  pl: {
    label: "ZESPÓŁ",
    title: "Poznaj nasz zespół",
    subtitle: "Nasz zespół tworzą również inni wspaniali ludzie, którzy pomagają nam w wielu obszarach.",
    members: [
      { name: "Dávid", role: "Założyciel projektu" },
      { name: "Monika", role: "Agent nieruchomości w Dubaju" },
      { name: "Alenka", role: "Agent nieruchomości" },
      { name: "Ladislav", role: "Urządzanie apartamentów" },
      { name: "Alexandra", role: "Agent nieruchomości" },
    ],
  },
  hu: {
    label: "CSAPAT",
    title: "Ismerje meg csapatunkat",
    subtitle: "Csapatunkat más kiváló emberek is alkotják, akik sok területen segítenek nekünk.",
    members: [
      { name: "Dávid", role: "Projektalapító" },
      { name: "Monika", role: "Ingatlanügynök Dubaiban" },
      { name: "Alenka", role: "Ingatlanügynök" },
      { name: "Ladislav", role: "Lakásberendezés" },
      { name: "Alexandra", role: "Ingatlanügynök" },
    ],
  },
};

export default function TeamSection() {
  const { lang } = usePublicLang();
  const t = TEAM[lang] || TEAM.en;

  return (
    <section className="px-4 sm:px-6 py-12 md:py-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-[#c5a065] text-xs uppercase tracking-widest font-semibold mb-2">{t.label}</p>
          <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-white mb-3">{t.title}</h2>
          <p className="text-white/55 text-sm max-w-2xl mx-auto">{t.subtitle}</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {t.members.map((member, i) => (
            <div key={i} className="text-center group">
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden mx-auto mb-4 ring-2 ring-[#c5a065]/30 group-hover:ring-[#c5a065]/70 transition-all duration-300 bg-[#16223a]">
                <img
                  src={TEAM_IMAGES[i]}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <p className="font-heading text-lg font-semibold text-white">{member.name}</p>
              <p className="text-[#c5a065]/80 text-xs mt-1">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}