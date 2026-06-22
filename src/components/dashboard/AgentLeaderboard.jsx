import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Trophy } from "lucide-react";

export default function AgentLeaderboard({ clients, commissions }) {
  const agentStats = {};

  clients.forEach(c => {
    const agent = c.assigned_agent || c.claimed_by;
    if (!agent) return;
    if (!agentStats[agent]) agentStats[agent] = { email: agent, leads: 0, closed: 0, active: 0 };
    agentStats[agent].leads++;
    if (c.status === "closed") agentStats[agent].closed++;
    if (["contacted", "qualified", "offers_sent", "viewing", "reserved"].includes(c.status)) {
      agentStats[agent].active++;
    }
  });

  commissions.forEach(c => {
    const agent = c.agent_email;
    if (!agent) return;
    if (!agentStats[agent]) agentStats[agent] = { email: agent, leads: 0, closed: 0, active: 0 };
    agentStats[agent].commission = (agentStats[agent].commission || 0) + (c.commission_amount || 0);
  });

  const ranked = Object.values(agentStats)
    .map(a => ({
      ...a,
      name: a.email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
      conversion: a.leads > 0 ? Math.round((a.closed / a.leads) * 100) : 0,
    }))
    .sort((a, b) => b.closed - a.closed || (b.commission || 0) - (a.commission || 0))
    .slice(0, 6);

  if (ranked.length === 0) {
    return (
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-[#0a1628] flex items-center gap-2">
            <Trophy className="w-4 h-4 text-[#c9a84c]" />
            Leaderboard agentov
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-400 text-center py-6">Zatiaľ žiadne pridelené leady</p>
        </CardContent>
      </Card>
    );
  }

  const medalColors = ["text-[#c9a84c]", "text-gray-400", "text-amber-600"];

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-[#0a1628] flex items-center gap-2">
          <Trophy className="w-4 h-4 text-[#c9a84c]" />
          Leaderboard agentov
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {ranked.map((agent, idx) => (
          <div key={agent.email} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${idx < 3 ? "bg-[#c9a84c]/10" : "bg-gray-100"}`}>
              <span className={medalColors[idx] || "text-gray-500"}>{idx + 1}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{agent.name}</p>
              <p className="text-xs text-gray-400">
                {agent.leads} leadov · {agent.active} aktívne · {agent.conversion}% konverzia
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-sm font-bold text-[#0a1628]">{agent.closed}</p>
              <p className="text-[10px] text-gray-400">uzavreté</p>
            </div>
            {agent.commission > 0 && (
              <div className="text-right flex-shrink-0 pl-2 border-l border-gray-100">
                <p className="text-sm font-bold text-emerald-600">€{(agent.commission / 1000).toFixed(1)}k</p>
                <p className="text-[10px] text-gray-400">provízia</p>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}