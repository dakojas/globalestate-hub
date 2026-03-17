import React, { useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const COUNTRY_COORDS = {
  Albania: [41.15, 20.17],
  Bali: [-8.35, 115.09],
  Hungary: [47.16, 19.5],
  Bulgaria: [42.73, 25.48],
  "Dominican Republic": [18.74, -70.16],
  Egypt: [26.82, 30.8],
  Georgia: [42.32, 43.36],
  Mauritius: [-20.28, 57.55],
  Oman: [21.51, 55.92],
  UAE: [23.42, 53.85],
  Spain: [40.46, -3.74],
  Italy: [41.87, 12.56],
  Thailand: [15.87, 100.99],
  Turkey: [38.96, 35.24],
};

export default function CountryMap({ propertiesByCountry, selectedCountry, onSelectCountry }) {
  return (
    <MapContainer
      center={[20, 30]}
      zoom={2}
      minZoom={2}
      maxZoom={6}
      style={{ height: "100%", width: "100%", background: "#0d1f3c" }}
      zoomControl={false}
      attributionControl={false}
      scrollWheelZoom={false}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution=""
      />
      {Object.entries(propertiesByCountry).map(([country, count]) => {
        const coords = COUNTRY_COORDS[country];
        if (!coords) return null;
        const isSelected = selectedCountry === country;
        return (
          <CircleMarker
            key={country}
            center={coords}
            radius={isSelected ? 18 : 12}
            pathOptions={{
              fillColor: isSelected ? "#c9a84c" : "#4a90d9",
              fillOpacity: isSelected ? 1 : 0.85,
              color: isSelected ? "#fff" : "#c9a84c",
              weight: isSelected ? 3 : 1.5,
            }}
            eventHandlers={{ click: () => onSelectCountry(isSelected ? "all" : country) }}
          >
            <Tooltip permanent direction="top" offset={[0, -10]}
              className="leaflet-country-tooltip"
            >
              <span style={{ fontWeight: 700, fontSize: 11, color: isSelected ? "#c9a84c" : "#fff" }}>
                {country} ({count})
              </span>
            </Tooltip>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}