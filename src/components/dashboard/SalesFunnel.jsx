import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Filter } from "lucide-react";

const STAGES = [
  { key: "new_lead", label: "Nové leady", color: "bg-blue-500" },
  { key: "contacted", label: "Kontaktované", color: "bg-indigo-500" },
  { key: "qualified", label: "Kvalifikované", color: "bg-violet-500" },
  { key: "offers_sent", label: "Ponuky zaslané", color: "bg-amber-500" },
  { key: "viewing", label: "Obhliadky", color: "bg-orange-500" },
  { key: "reserved", label: "Rezervované", color: "bg-emerald-500" },
  { key: "closed", label: "Uzavreté", color: "bg-green-600" },
];

export default function SalesFunnel({ clients }) {
  const counts = STAGES.map(s => ({
    ...s,
    count: clients.filter(c => c.status === s.key).length,
  }));

  const maxCount = Math.max(...counts.map(c => c.count), 1);
  const totalLeads = clients.length || 1;
  const closedCount = counts[counts.length - 1].count;
  const overallConversion = Math.round((closedCount / totalLeads) * 100);

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-[#0a1628] flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#c9a84c]" />
            Sales Funnel
          </CardTitle>
          <div className="text-right">
            <p className="text-xs text-gray-400">Celková konverzia</p>
            <p className="text-lg font-bold text-[#c9a84c]">{overallConversion}%</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {counts.map((stage, idx) => {
          const widthPct = (stage.count / maxCount) * 100;
          const prevCount = idx > 0 ? counts[idx - 1].count : 0;
          const convRate = prevCount > 0 ? Math.round((stage.count / prevCount) * 100) : null;

          return (
            <div key={stage.key} className="flex items-center gap-3">
              <div className="w-28 flex-shrink-0">
                <span className="text-xs font-medium text-gray-600">{stage.label}</span>
              </div>
              <div className="flex-1 flex items-center gap-2">
                <div className="flex-1 h-7 bg-gray-100 rounded-lg overflow-hidden relative">
                  <div
                    className={`h-full ${stage.color} rounded-lg transition-all duration-500 flex items-center justify-end pr-2`}
                    style={{ width: `${Math.max(widthPct, stage.count > 0 ? 8 : 0)}%` }}
                  >
                    <span className="text-xs font-bold text-white">{stage.count}</span>
                  </div>
                </div>
                {convRate !== null && idx > 0 && (
                  <span className={`text-xs font-semibold flex-shrink-0 w-10 text-right ${convRate < 30 ? "text-red-500" : "text-gray-400"}`}>
                    {convRate}%
                  </span>
                )}
              </div>
            </div>
          );
        })}
        {totalLeads === 1 && (
          <p className="text-sm text-gray-400 text-center py-4">Zatiaľ žiadne leady</p>
        )}
      </CardContent>
    </Card>
  );
}