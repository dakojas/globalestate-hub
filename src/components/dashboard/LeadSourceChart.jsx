import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const sourceColors = {
  direct_app: { bg: "bg-blue-500", label: "Direct App" },
  referrer: { bg: "bg-purple-500", label: "Referrer" },
  website: { bg: "bg-green-500", label: "Website" },
  social_media: { bg: "bg-pink-500", label: "Social Media" },
  portal: { bg: "bg-amber-500", label: "Portal" },
  walk_in: { bg: "bg-teal-500", label: "Walk-in" },
  whatsapp: { bg: "bg-emerald-500", label: "WhatsApp" },
  other: { bg: "bg-gray-400", label: "Other" },
};

export default function LeadSourceChart({ clients }) {
  const sources = {};
  
  clients.forEach(c => {
    const source = c.lead_source || "other";
    sources[source] = (sources[source] || 0) + 1;
  });

  const total = clients.length || 1;
  const sortedSources = Object.entries(sources).sort((a, b) => b[1] - a[1]);

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">Lead Sources</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {sortedSources.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">No leads yet</p>
        ) : (
          sortedSources.map(([source, count]) => {
            const percentage = Math.round((count / total) * 100);
            const config = sourceColors[source] || sourceColors.other;
            
            return (
              <div key={source}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${config.bg}`} />
                    <span className="text-sm text-gray-700">{config.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">{count}</span>
                    <Badge variant="outline" className="text-xs">{percentage}%</Badge>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-full ${config.bg} transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}