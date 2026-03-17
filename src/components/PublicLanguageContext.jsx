import React, { createContext, useContext, useState } from "react";

const t = {
  sk: {
    // Nav
    offers: "Ponuky",
    contact: "Kontakt",
    backToOffers: "Späť na ponuky",
    // Hero
    heroTitle: "Luxusné nehnuteľnosti",
    heroTitleHighlight: "v zahraničí",
    heroSubtitle: "Investujte do prémiových projektov v top destináciách sveta",
    // Filters
    allCountries: "Všetky krajiny",
    allTypes: "Všetky typy",
    minPrice: "Min. cena (€)",
    maxPrice: "Max. cena (€)",
    apartment: "Apartmán",
    villa: "Vila",
    penthouse: "Penthouse",
    studio: "Štúdio",
    townhouse: "Townhouse",
    // Listings
    availableOffers: "Dostupné ponuky",
    properties: "nehnuteľností",
    noProperties: "Nenašli sa žiadne nehnuteľnosti",
    detail: "Detail",
    // Property detail
    bedrooms: "Spálne",
    bathrooms: "Kúpeľne",
    description: "Popis",
    amenities: "Vybavenie",
    available_units: "Dostupných jednotiek",
    interested: "Mám záujem",
    nameSurname: "Meno a priezvisko *",
    email: "Email *",
    phone: "Telefón *",
    minBudget: "Min. rozpočet (€)",
    maxBudget: "Max. rozpočet (€)",
    message: "Vaša správa",
    gdpr: 'Prečítal/a som si a súhlasím s ',
    gdprLink: "podmienkami ochrany osobných údajov (GDPR)",
    gdprEnd: ". Súhlasím so spracovaním mojich osobných údajov za účelom odpovede na môj dopyt. *",
    send: "Odoslať dopyt",
    sending: "Odosielam...",
    // Footer
    rights: "Všetky práva vyhradené.",
    privacy: "Ochrana osobných údajov (GDPR)",
  },
  en: {
    // Nav
    offers: "Listings",
    contact: "Contact",
    backToOffers: "Back to listings",
    // Hero
    heroTitle: "Luxury properties",
    heroTitleHighlight: "abroad",
    heroSubtitle: "Invest in premium projects in the world's top destinations",
    // Filters
    allCountries: "All countries",
    allTypes: "All types",
    minPrice: "Min. price (€)",
    maxPrice: "Max. price (€)",
    apartment: "Apartment",
    villa: "Villa",
    penthouse: "Penthouse",
    studio: "Studio",
    townhouse: "Townhouse",
    // Listings
    availableOffers: "Available listings",
    properties: "properties",
    noProperties: "No properties found",
    detail: "View",
    // Property detail
    bedrooms: "Bedrooms",
    bathrooms: "Bathrooms",
    description: "Description",
    amenities: "Amenities",
    available_units: "Available units",
    interested: "I'm interested",
    nameSurname: "Full name *",
    email: "Email *",
    phone: "Phone *",
    minBudget: "Min. budget (€)",
    maxBudget: "Max. budget (€)",
    message: "Your message",
    gdpr: "I have read and agree to the ",
    gdprLink: "personal data protection policy (GDPR)",
    gdprEnd: ". I consent to the processing of my personal data for the purpose of responding to my inquiry. *",
    send: "Send inquiry",
    sending: "Sending...",
    // Footer
    rights: "All rights reserved.",
    privacy: "Privacy Policy (GDPR)",
  },
};

const PublicLanguageContext = createContext();

export function PublicLanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem("pub_lang") || "sk");

  const changeLang = (l) => {
    localStorage.setItem("pub_lang", l);
    setLang(l);
  };

  const tr = (key) => t[lang]?.[key] || key;

  return (
    <PublicLanguageContext.Provider value={{ lang, changeLang, tr }}>
      {children}
    </PublicLanguageContext.Provider>
  );
}

export function usePublicLang() {
  return useContext(PublicLanguageContext);
}