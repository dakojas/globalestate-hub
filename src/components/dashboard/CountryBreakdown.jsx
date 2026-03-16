import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const countryFlags = {
  "Albania": "🇦🇱", "Bali": "🇮🇩", "Hungary": "🇭🇺", "Bulgaria": "🇧🇬",
  "Dominican Republic": "🇩🇴", "Egypt": "🇪🇬", "Georgia": "🇬🇪", "Mauritius": "🇲🇺",
  "Oman": "🇴🇲", "UAE": "🇦🇪", "Spain": "🇪🇸", "Italy": "🇮🇹",
  "Thailand": "🇹🇭", "Turkey": "🇹🇷"
};

export default function CountryBreakdown({ properties }) {
  const counts = {};
  properties.forEach(p => {
    counts[p.country] = (counts[p.country] || 0) + 1;
  });

  const sorted = Object.entries(counts).sort(([,a], [,b]) => b - a);
  const max = sorted.length > 0 ? sorted[0][1] : 1;

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-[#0a1628]">Properties by Country</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {sorted.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-6">No properties yet</p>
        )}
        {sorted.map(([country, count]) => (
          <div key={country} className="flex items-center gap-3">
            <span className="text-xl w-8 text-center">{countryFlags[country] || "🏳️"}</span>
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">{country}</span>
                <span className="text-sm font-semibold text-[#0a1628]">{count}</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#c9a84c] to-[#e8d5a0] rounded-full transition-all duration-500"
                  style={{ width: `${(count / max) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}