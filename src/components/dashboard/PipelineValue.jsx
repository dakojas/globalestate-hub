import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Wallet } from "lucide-react";

const ACTIVE_STAGES = ["contacted", "qualified", "offers_sent", "viewing", "reserved"];

export default function PipelineValue({ clients, commissions }) {
  const pipelineClients = clients.filter(c => ACTIVE_STAGES.includes(c.status));

  const pipelineValue = pipelineClients.reduce((sum, c) => {
    const val = c.budget_max || c.budget_min || 0;
    return sum + val;
  }, 0);

  const wonCommissions = commissions
    .filter(c => c.status === "paid" || c.status === "invoiced")
    .reduce((sum, c) => sum + (c.commission_amount || 0), 0);

  const pendingCommissions = commissions
    .filter(c => c.status === "pending")
    .reduce((sum, c) => sum + (c.commission_amount || 0), 0);

  const avgBudget = pipelineClients.length > 0
    ? Math.round(pipelineValue / pipelineClients.length)
    : 0;

  const stats = [
    { label: "Pipeline hodnota", value: pipelineValue, color: "text-[#c9a84c]", suffix: "" },
    { label: "Vyplatené provízie", value: wonCommissions, color: "text-emerald-600", suffix: "" },
    { label: "Čakajúce provízie", value: pendingCommissions, color: "text-amber-600", suffix: "" },
  ];

  const fmt = (v) => v >= 1000000 ? `€${(v / 1000000).toFixed(1)}M` : v >= 1000 ? `€${(v / 1000).toFixed(0)}k` : `€${v}`;

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-[#0a1628] flex items-center gap-2">
          <Wallet className="w-4 h-4 text-[#c9a84c]" />
          Pipeline &amp; Provízie
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          {stats.map(s => (
            <div key={s.label} className="text-center p-3 rounded-xl bg-gray-50">
              <p className={`text-xl font-bold ${s.color}`}>{fmt(s.value)}</p>
              <p className="text-[10px] text-gray-400 mt-1 leading-tight">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-400">Aktívne leady v pipeline</p>
            <p className="text-sm font-semibold text-[#0a1628]">{pipelineClients.length} klientov</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Priemerný budget</p>
            <p className="text-sm font-semibold text-[#0a1628]">{fmt(avgBudget)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}