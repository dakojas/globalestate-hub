import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { AlertTriangle, Clock } from "lucide-react";
import { differenceInDays, parseISO } from "date-fns";

const STALE_STAGES = ["new_lead", "unclaimed", "claimed"];

export default function StaleLeads({ clients, interactions }) {
  const interactionDates = {};
  interactions.forEach(i => {
    if (i.client_id && i.date) {
      const existing = interactionDates[i.client_id];
      if (!existing || new Date(i.date) > new Date(existing)) {
        interactionDates[i.client_id] = i.date;
      }
    }
  });

  const stale = clients
    .filter(c => STALE_STAGES.includes(c.status))
    .map(c => {
      const refDate = interactionDates[c.id] || c.created_date;
      const days = refDate ? differenceInDays(new Date(), parseISO(refDate)) : 0;
      return { ...c, daysStale: days };
    })
    .filter(c => c.daysStale >= 3)
    .sort((a, b) => b.daysStale - a.daysStale)
    .slice(0, 6);

  if (stale.length === 0) return null;

  return (
    <Card className="border-0 shadow-sm border-l-4 border-l-red-400">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-[#0a1628] flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            Leady čakajúce na akciu
          </CardTitle>
          <Badge className="bg-red-50 text-red-600 border-0">{stale.length}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {stale.map(c => (
          <Link
            key={c.id}
            to={`/ClientDetail?id=${c.id}`}
            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-red-50 transition-colors group"
          >
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
              <Clock className="w-4 h-4 text-red-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate group-hover:text-red-600">{c.full_name}</p>
              <p className="text-xs text-gray-400">
                {c.assigned_agent || "Nepridelený"} · {c.lead_source || "—"}
              </p>
            </div>
            <Badge variant="outline" className={`text-xs flex-shrink-0 ${c.daysStale >= 7 ? "bg-red-50 text-red-600 border-red-200" : "bg-amber-50 text-amber-600 border-amber-200"}`}>
              {c.daysStale} dní
            </Badge>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}