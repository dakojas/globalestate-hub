import React from "react";

const COUNTRY_FLAGS = {
  Albania: "🇦🇱",
  Bali: "🇮🇩",
  Hungary: "🇭🇺",
  Bulgaria: "🇧🇬",
  Croatia: "🇭🇷",
  "Dominican Republic": "🇩🇴",
  Egypt: "🇪🇬",
  Georgia: "🇬🇪",
  Mauritius: "🇲🇺",
  Oman: "🇴🇲",
  UAE: "🇦🇪",
  Spain: "🇪🇸",
  Italy: "🇮🇹",
  Thailand: "🇹🇭",
  Turkey: "🇹🇷",
};

const REGIONS = [
  {
    key: "europe",
    labels: { sk: "🌍 Európa", en: "🌍 Europe", de: "🌍 Europa", fr: "🌍 Europe", it: "🌍 Europa", ru: "🌍 Европа", pl: "🌍 Europa", hu: "🌍 Európa" },
    countries: ["Spain", "Italy", "Croatia", "Albania", "Hungary", "Bulgaria", "Turkey"],
  },
  {
    key: "mideast",
    labels: { sk: "🌏 Stredný východ & Afrika", en: "🌏 Middle East & Africa", de: "🌏 Naher Osten & Afrika", fr: "🌏 Moyen-Orient & Afrique", it: "🌏 Medio Oriente & Africa", ru: "🌏 Ближний Восток & Африка", pl: "🌏 Bliski Wschód & Afryka", hu: "🌏 Közel-Kelet & Afrika" },
    countries: ["UAE", "Oman", "Egypt", "Georgia", "Mauritius"],
  },
  {
    key: "asia",
    labels: { sk: "🌏 Ázia & Karibik", en: "🌏 Asia & Caribbean", de: "🌏 Asien & Karibik", fr: "🌏 Asie & Caraïbes", it: "🌏 Asia & Caraibi", ru: "🌏 Азия & Карибы", pl: "🌏 Azja & Karaiby", hu: "🌏 Ázsia & Karib" },
    countries: ["Thailand", "Bali", "Dominican Republic"],
  },
];

export default function CountryMap({ propertiesByCountry = {}, selectedCountry, onSelectCountry, getCountryName, lang = "sk" }) {
  return (
    <div className="w-full h-full flex flex-col gap-4 p-4 overflow-auto">
      {REGIONS.map(region => (
        <div key={region.key}>
          <p className="text-white/40 text-xs uppercase tracking-widest mb-2 font-semibold">{region.labels[lang] || region.labels.en}</p>
          <div className="flex flex-wrap gap-2">
            {region.countries.map(country => {
              const count = propertiesByCountry[country] || 0;
              const isSelected = selectedCountry === country;
              return (
                <button
                  key={country}
                  onClick={() => onSelectCountry(country)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold
                    transition-all duration-200 hover:scale-105 border
                    ${isSelected
                      ? "bg-[#c9a84c] text-white border-[#c9a84c] shadow-lg shadow-[#c9a84c]/30 scale-105"
                      : "bg-white/5 text-white/80 border-white/10 hover:bg-white/10 hover:border-[#c9a84c]/40"
                    }
                  `}
                >
                  <span className="text-lg leading-none">{COUNTRY_FLAGS[country]}</span>
                  <span>{getCountryName ? getCountryName(country) : country}</span>
                  {count > 0 && (
                    <span className={`text-xs font-black px-1.5 py-0.5 rounded-full leading-none ${isSelected ? "bg-[#0a1628] text-white" : "bg-[#c9a84c] text-white"}`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}