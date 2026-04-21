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

// Approximate position on a simplified world map (% from left, % from top)
// within a ~2:1 aspect ratio container
const COUNTRY_POS = {
  Spain:              { left: "16%", top: "28%" },
  Italy:              { left: "22%", top: "27%" },
  Albania:            { left: "24%", top: "28%" },
  Croatia:            { left: "22%", top: "25%" },
  Hungary:            { left: "24%", top: "22%" },
  Bulgaria:           { left: "26%", top: "26%" },
  Georgia:            { left: "31%", top: "24%" },
  Turkey:             { left: "29%", top: "27%" },
  Egypt:              { left: "28%", top: "35%" },
  UAE:                { left: "36%", top: "37%" },
  Oman:               { left: "38%", top: "40%" },
  Mauritius:          { left: "35%", top: "62%" },
  "Dominican Republic": { left: "6%", top: "38%" },
  Bali:               { left: "68%", top: "56%" },
  Thailand:           { left: "63%", top: "44%" },
};

// Simple world SVG map paths (very simplified continents)
const WorldSVG = () => (
  <svg
    viewBox="0 0 1000 500"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full"
    style={{ display: "block" }}
  >
    {/* Ocean background */}
    <rect width="1000" height="500" fill="#0d1f3c" />

    {/* Grid lines */}
    {[100,200,300,400,500,600,700,800,900].map(x => (
      <line key={x} x1={x} y1="0" x2={x} y2="500" stroke="#1a2d4a" strokeWidth="0.5" />
    ))}
    {[100,200,300,400].map(y => (
      <line key={y} x1="0" y1={y} x2="1000" y2={y} stroke="#1a2d4a" strokeWidth="0.5" />
    ))}

    {/* North America */}
    <path d="M 30 60 L 180 60 L 200 80 L 210 120 L 190 160 L 170 200 L 140 240 L 110 280 L 80 300 L 50 290 L 30 260 L 20 200 L 25 140 Z" fill="#1e3a5f" stroke="#2a4a6f" strokeWidth="1" />
    {/* Central America */}
    <path d="M 110 280 L 140 300 L 130 330 L 115 340 L 100 320 Z" fill="#1e3a5f" stroke="#2a4a6f" strokeWidth="1" />
    {/* Caribbean */}
    <ellipse cx="165" cy="290" rx="15" ry="8" fill="#1e3a5f" />
    <ellipse cx="180" cy="295" rx="8" ry="5" fill="#1e3a5f" />

    {/* South America */}
    <path d="M 130 340 L 170 330 L 200 360 L 220 410 L 210 460 L 180 480 L 150 470 L 130 440 L 115 390 Z" fill="#1e3a5f" stroke="#2a4a6f" strokeWidth="1" />

    {/* Europe */}
    <path d="M 420 60 L 500 55 L 530 70 L 520 100 L 490 120 L 460 130 L 440 120 L 415 110 L 410 85 Z" fill="#1e3a5f" stroke="#2a4a6f" strokeWidth="1" />
    {/* Iberian */}
    <path d="M 420 110 L 440 120 L 445 145 L 425 150 L 410 135 Z" fill="#1e3a5f" stroke="#2a4a6f" strokeWidth="1" />
    {/* Italy boot */}
    <path d="M 480 115 L 495 125 L 500 155 L 490 175 L 480 165 L 475 140 Z" fill="#1e3a5f" stroke="#2a4a6f" strokeWidth="1" />
    {/* Balkans */}
    <path d="M 510 110 L 540 115 L 545 140 L 530 155 L 510 145 L 505 125 Z" fill="#1e3a5f" stroke="#2a4a6f" strokeWidth="1" />

    {/* Africa */}
    <path d="M 430 160 L 530 160 L 560 200 L 570 260 L 560 330 L 530 390 L 500 420 L 470 410 L 445 360 L 430 290 L 420 220 Z" fill="#1e3a5f" stroke="#2a4a6f" strokeWidth="1" />

    {/* Middle East */}
    <path d="M 545 135 L 610 130 L 640 160 L 630 200 L 590 210 L 555 190 L 545 165 Z" fill="#1e3a5f" stroke="#2a4a6f" strokeWidth="1" />
    {/* Arabian Peninsula */}
    <path d="M 580 200 L 650 195 L 665 240 L 640 270 L 600 265 L 580 240 Z" fill="#1e3a5f" stroke="#2a4a6f" strokeWidth="1" />

    {/* Russia / Central Asia */}
    <path d="M 530 30 L 820 30 L 830 80 L 790 100 L 720 95 L 660 110 L 600 100 L 555 90 L 535 70 Z" fill="#1e3a5f" stroke="#2a4a6f" strokeWidth="1" />

    {/* South Asia */}
    <path d="M 640 160 L 720 155 L 740 190 L 720 230 L 690 250 L 660 240 L 640 200 Z" fill="#1e3a5f" stroke="#2a4a6f" strokeWidth="1" />
    {/* India */}
    <path d="M 670 240 L 700 245 L 710 290 L 690 310 L 668 295 L 660 265 Z" fill="#1e3a5f" stroke="#2a4a6f" strokeWidth="1" />

    {/* Southeast Asia */}
    <path d="M 740 180 L 810 175 L 825 210 L 800 230 L 760 225 L 740 210 Z" fill="#1e3a5f" stroke="#2a4a6f" strokeWidth="1" />
    {/* Thailand/Malay peninsula */}
    <path d="M 760 225 L 780 230 L 775 280 L 762 295 L 752 275 Z" fill="#1e3a5f" stroke="#2a4a6f" strokeWidth="1" />

    {/* Bali/Indonesia */}
    <ellipse cx="810" cy="310" rx="30" ry="12" fill="#1e3a5f" stroke="#2a4a6f" strokeWidth="1" />
    <ellipse cx="850" cy="315" rx="20" ry="10" fill="#1e3a5f" stroke="#2a4a6f" strokeWidth="1" />

    {/* Australia */}
    <path d="M 780 340 L 870 335 L 900 370 L 890 420 L 850 440 L 800 430 L 775 400 L 772 365 Z" fill="#1e3a5f" stroke="#2a4a6f" strokeWidth="1" />

    {/* East Asia */}
    <path d="M 810 80 L 890 70 L 910 110 L 880 140 L 840 145 L 810 120 Z" fill="#1e3a5f" stroke="#2a4a6f" strokeWidth="1" />

    {/* Japan */}
    <path d="M 910 95 L 930 88 L 940 110 L 925 125 L 910 115 Z" fill="#1e3a5f" stroke="#2a4a6f" strokeWidth="1" />

    {/* Mauritius (island) */}
    <ellipse cx="570" cy="370" rx="8" ry="6" fill="#1e3a5f" stroke="#2a4a6f" strokeWidth="1" />

    {/* Equator line */}
    <line x1="0" y1="250" x2="1000" y2="250" stroke="#c9a84c" strokeWidth="0.5" strokeDasharray="8,8" opacity="0.3" />
  </svg>
);

export default function CountryMap({ propertiesByCountry = {}, selectedCountry, onSelectCountry }) {
  const countries = Object.keys(COUNTRY_POS);

  return (
    <div className="relative w-full h-full bg-[#0d1f3c] rounded-xl overflow-hidden">
      {/* SVG Map background */}
      <div className="absolute inset-0">
        <WorldSVG />
      </div>

      {/* Country pins */}
      {countries.map(country => {
        const count = propertiesByCountry[country] || 0;
        const isSelected = selectedCountry === country;
        const pos = COUNTRY_POS[country];

        return (
          <button
            key={country}
            onClick={() => onSelectCountry(country)}
            style={{ position: "absolute", left: pos.left, top: pos.top, transform: "translate(-50%, -50%)" }}
            className={`
              flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold
              whitespace-nowrap shadow-lg transition-all duration-200 hover:scale-110 z-10
              ${isSelected
                ? "bg-[#c9a84c] text-white border-2 border-white scale-110"
                : "bg-[#0a1628]/90 text-white border border-[#c9a84c]/60 hover:border-[#c9a84c]"
              }
            `}
          >
            <span>{COUNTRY_FLAGS[country]}</span>
            <span>{country}</span>
            {count > 0 && (
              <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-black leading-none ${isSelected ? "bg-[#0a1628] text-white" : "bg-[#c9a84c] text-white"}`}>
                {count}
              </span>
            )}
          </button>
        );
      })}

      {/* Subtle overlay gradient */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, transparent 40%, rgba(10,22,40,0.4) 100%)" }} />
    </div>
  );
}