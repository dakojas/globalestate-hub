import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  sk: {
    // Navigation
    dashboard: "Dashboard",
    leads: "Leady",
    properties: "Nehnuteľnosti",
    clients: "Klienti",
    calendar: "Kalendár",
    commissions: "Provízie",
    referrers: "Tiperi",
    reports: "Reporty",
    map: "Mapa",
    publicSite: "Verejný web",
    
    // Common
    search: "Hľadať",
    add: "Pridať",
    edit: "Upraviť",
    delete: "Vymazať",
    save: "Uložiť",
    cancel: "Zrušiť",
    close: "Zavrieť",
    back: "Späť",
    loading: "Načítavam...",
    
    // Properties
    addProperty: "Pridať nehnuteľnosť",
    propertyTitle: "Názov",
    description: "Popis",
    country: "Krajina",
    city: "Mesto",
    price: "Cena",
    status: "Status",
    available: "Dostupné",
    reserved: "Rezervované",
    sold: "Predané",
    offMarket: "Mimo trhu",
    propertyType: "Typ",
    bedrooms: "Spálne",
    bathrooms: "Kúpeľne",
    area: "Plocha",
    features: "Vlastnosti",
    sendBrochure: "Poslať brožúru",
    propertiesFound: "nehnuteľností nájdených",
    allStatus: "Všetky statusy",
    noPropertiesFound: "Nenašli sa žiadne nehnuteľnosti",
    
    // Clients
    addClient: "Pridať klienta",
    clientName: "Meno",
    email: "Email",
    phone: "Telefón",
    lead: "Lead",
    active: "Aktívny",
    negotiating: "Rokuje",
    closed: "Uzavretý",
    inactive: "Neaktívny",
    logInteraction: "Zaznamenať interakciu",
    clients: "klienti",
    
    // Calendar
    newReminder: "Nová pripomienka",
    upcoming: "Nadchádzajúce",
    overdue: "Po termíne",
    completed: "Dokončené",
    all: "Všetky",
    noRemindersFound: "Nenašli sa žiadne pripomienky",
    
    // Commissions
    newCommission: "Nová provízia",
    salePrice: "Predajná cena",
    commissionRate: "Sadzba provízie",
    totalCommission: "Celková provízia",
    pending: "Čaká",
    invoiced: "Fakturované",
    paid: "Zaplatené",
    
    // Stats
    totalProperties: "Celkový počet nehnuteľností",
    activeClients: "Aktívni klienti",
    totalRevenue: "Celkový príjem",
    pendingTasks: "Úlohy na dokončenie",
    
    // Lead statuses
    new_lead: "Nový lead",
    unclaimed: "Neprevzatý",
    claimed: "Prevzatý",
    contacted: "Kontaktovaný",
    qualified: "Kvalifikovaný",
    offers_sent: "Ponuky odoslané",
    viewing: "Obhliadka",
    reserved: "Rezervácia",
    lost: "Stratený",
  },
  en: {
    // Navigation
    dashboard: "Dashboard",
    leads: "Leads",
    properties: "Properties",
    clients: "Clients",
    calendar: "Calendar",
    commissions: "Commissions",
    referrers: "Referrers",
    reports: "Reports",
    map: "Map",
    publicSite: "Public Site",
    
    // Common
    search: "Search",
    add: "Add",
    edit: "Edit",
    delete: "Delete",
    save: "Save",
    cancel: "Cancel",
    close: "Close",
    back: "Back",
    loading: "Loading...",
    
    // Properties
    addProperty: "Add Property",
    propertyTitle: "Title",
    description: "Description",
    country: "Country",
    city: "City",
    price: "Price",
    status: "Status",
    available: "Available",
    reserved: "Reserved",
    sold: "Sold",
    offMarket: "Off Market",
    propertyType: "Type",
    bedrooms: "Bedrooms",
    bathrooms: "Bathrooms",
    area: "Area",
    features: "Features",
    sendBrochure: "Send Brochure",
    propertiesFound: "properties found",
    allStatus: "All Status",
    noPropertiesFound: "No properties found",
    
    // Clients
    addClient: "Add Client",
    clientName: "Name",
    email: "Email",
    phone: "Phone",
    lead: "Lead",
    active: "Active",
    negotiating: "Negotiating",
    closed: "Closed",
    inactive: "Inactive",
    logInteraction: "Log Interaction",
    clients: "clients",
    
    // Calendar
    newReminder: "New Reminder",
    upcoming: "Upcoming",
    overdue: "Overdue",
    completed: "Completed",
    all: "All",
    noRemindersFound: "No reminders found",
    
    // Commissions
    newCommission: "New Commission",
    salePrice: "Sale Price",
    commissionRate: "Commission Rate",
    totalCommission: "Total Commission",
    pending: "Pending",
    invoiced: "Invoiced",
    paid: "Paid",
    
    // Stats
    totalProperties: "Total Properties",
    activeClients: "Active Clients",
    totalRevenue: "Total Revenue",
    pendingTasks: "Pending Tasks",
    
    // Lead statuses
    new_lead: "New Lead",
    unclaimed: "Unclaimed",
    claimed: "Claimed",
    contacted: "Contacted",
    qualified: "Qualified",
    offers_sent: "Offers Sent",
    viewing: "Viewing",
    reserved: "Reserved",
    lost: "Lost",
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'sk';
  });

  const changeLanguage = (lang) => {
    localStorage.setItem('language', lang);
    setLanguage(lang);
  };

  const t = (key) => {
    return translations[language]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ t, language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within LanguageProvider');
  }
  return context;
};