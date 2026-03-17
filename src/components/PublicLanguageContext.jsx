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
    // Submit listing
    listProperty: "Inzerovať nehnuteľnosť",
    submitTitle: "Inzerujte svoju nehnuteľnosť",
    submitSubtitle: "Zadajte detaily vo svojom jazyku – automaticky preložíme do SK a EN",
    submitBadge: "Bezplatné zalistovanie, schvaľujeme do 48 hodín",
    ownerInfo: "Kontaktné údaje",
    ownerName: "Meno a priezvisko",
    ownerEmail: "Email",
    ownerPhone: "Telefón",
    propertyInfo: "Detaily nehnuteľnosti",
    writingIn: "Píšem v jazyku",
    propertyTitleLabel: "Názov nehnuteľnosti",
    selectCountry: "Vyberte krajinu",
    cityLabel: "Mesto / oblasť",
    typeLabel: "Typ nehnuteľnosti",
    priceLabel: "Cena",
    bedroomsLabel: "Spálne",
    bathroomsLabel: "Kúpeľne",
    descriptionLabel: "Popis nehnuteľnosti",
    autoTranslateNote: "Popis automaticky preložíme do SK aj EN",
    photosLabel: "Fotografie",
    uploadPhotos: "Kliknite alebo presuňte fotografie (max 10)",
    submitBtn: "Odoslať na schválenie",
    translatingListing: "Prekladáme váš inzerát...",
    translatingListingSub: "AI prekladá obsah do slovenčiny a angličtiny",
    submitSuccessTitle: "Ďakujeme za inzerát!",
    submitSuccessText: "Váš inzerát sme prijali a po schválení ho zverejníme. Budeme vás informovať emailom.",
    backToHome: "Späť na úvodnú stránku",
    // Map
    exploreMap: "Preskúmajte naše destinácie",
    exploreMapSub: "Kliknite na krajinu a zobrazte ponuky v danej lokalite",
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
    // Submit listing
    listProperty: "List a property",
    submitTitle: "List your property",
    submitSubtitle: "Enter details in your language – we'll automatically translate to SK and EN",
    submitBadge: "Free listing, approved within 48 hours",
    ownerInfo: "Contact details",
    ownerName: "Full name",
    ownerEmail: "Email",
    ownerPhone: "Phone",
    propertyInfo: "Property details",
    writingIn: "Writing in",
    propertyTitleLabel: "Property title",
    selectCountry: "Select country",
    cityLabel: "City / area",
    typeLabel: "Property type",
    priceLabel: "Price",
    bedroomsLabel: "Bedrooms",
    bathroomsLabel: "Bathrooms",
    descriptionLabel: "Property description",
    autoTranslateNote: "We will automatically translate the description to both SK and EN",
    photosLabel: "Photos",
    uploadPhotos: "Click or drag photos (max 10)",
    submitBtn: "Submit for approval",
    translatingListing: "Translating your listing...",
    translatingListingSub: "AI is translating content to Slovak and English",
    submitSuccessTitle: "Thank you for your listing!",
    submitSuccessText: "We have received your listing and will publish it after review. You will be notified by email.",
    backToHome: "Back to home",
    // Map
    exploreMap: "Explore our destinations",
    exploreMapSub: "Click a country pin to filter listings by location",
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