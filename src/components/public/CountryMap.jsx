import React from "react";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const COUNTRY_COORDS = {
  Albania: [41.15, 20.17],
  Bali: [-8.34, 115.09],
  Hungary: [47.16, 19.5],
  Bulgaria: [42.73, 25.48],
  Croatia: [45.1, 15.2],
  "Dominican Republic": [18.74, -70.16],
  Egypt: [26.82, 30.8],
  Georgia: [42.31, 43.36],
  Mauritius: [-20.34, 57.55],
  Oman: [21.51, 55.92],
  UAE: [23.42, 53.85],
  Spain: [40.46, -3.74],
  Italy: [41.87, 12.56],
  Thailand: [15.87, 100.99],
  Turkey: [38.96, 35.24],
};

const createCountryIcon = (country, count, isSelected) => {
  const bg = isSelected ? "#c9a84c" : "#0a1628";
  const border = isSelected ? "#fff" : "#c9a84c";
  const html = `
    <div style="
      background: ${bg};
      border: 2px solid ${border};
      border-radius: 20px;
      padding: 5px 10px;
      white-space: nowrap;
      box-shadow: 0 2px 8px rgba(0,0,0,0.4);
      display: flex;
      align-items: center;
      gap: 5px;
      cursor: pointer;
    ">
      <span style="color: white; font-weight: 700; font-size: 12px; line-height: 1;">${country}</span>
      ${count > 0 ? `<span style="
        background: ${isSelected ? "#0a1628" : "#c9a84c"};
        color: white;
        border-radius: 10px;
        padding: 1px 6px;
        font-size: 10px;
        font-weight: 800;
        line-height: 1.4;
      ">${count}</span>` : ""}
    </div>
  `;
  return L.divIcon({
    html,
    className: "",
    iconAnchor: [0, 0],
    popupAnchor: [0, 0],
  });
};

export default function CountryMap({ propertiesByCountry = {}, selectedCountry, onSelectCountry }) {
  const countries = Object.keys(COUNTRY_COORDS).filter(c => COUNTRY_COORDS[c]);

  return (
    <MapContainer
      center={[25, 30]}
      zoom={2}
      style={{ height: "100%", width: "100%" }}
      zoomControl={true}
      attributionControl={false}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      {countries.map(country => {
        const count = propertiesByCountry[country] || 0;
        const isSelected = selectedCountry === country;
        return (
          <Marker
            key={country}
            position={COUNTRY_COORDS[country]}
            icon={createCountryIcon(country, count, isSelected)}
            eventHandlers={{ click: () => onSelectCountry(country) }}
          />
        );
      })}
    </MapContainer>
  );
}