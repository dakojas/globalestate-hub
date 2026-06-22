import React, { useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from "recharts";
import { Award } from "lucide-react";

export default function AgentPerformanceChart({ clients, commissions }) {
  const data = useMemo(() => {
    const stats = {};

    clients.forEach(c => {
      const agent = c.assigned_agent || c.claimed_by;
      if (!agent) return;
      if (!stats[agent]) stats[agent] = { agent, leads: 0, closed: 0, active: 0 };
      stats[agent].leads++;
      if (c.status === "closed") stats[agent].closed++;
      if (["contacted", "qualified", "offers_sent", "viewing", "reserved"].includes(c.status)) {
        stats[agent].active++;
      }
    });

    commissions.forEach(c => {
      if (!c.agent_email) return;
      if (!stats[c.agent_email]) stats[c.agent_email] = { agent: c.agent_email, leads: 0, closed: 0, active: 0 };
      stats[c.agent_email].commission = (stats[c.agent_email].commission || 0) + (c.commission_amount || 0);
    });

    return Object.values(stats)
      .map(a => ({
        name: a.agent.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
        ...a,
        conversion: a.leads > 0 ? Math.round((a.closed / a.leads) * 100) : 0,
      }))
      .sort((a, b) => b.closed - a.closed)
      .slice(0, 8);
  }, [clients, commissions]);

  const maxClosed = Math.max(...data.map(d => d.closed), 1);

  if (data.length === 0) {
    return (
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-[#0a1628] flex items-center gap-2">
            <Award className="w-4 h-4 text-[#c9a84c]" />
            Úspešnosť maklérov
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-400 text-center py-6">Zatiaľ žiadne pridelené leady</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-[#0a1628] flex items-center gap-2">
          <Award className="w-4 h-4 text-[#c9a84c]" />
          Úspešnosť maklérov
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={Math.max(200, data.length * 44)}>
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
            <XAxis
              type="number"
              tick={{ fontSize: 10, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 11, fill: "#4b5563" }}
              axisLine={false}
              tickLine={false}
              width={90}
            />
            <Tooltip
              contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", fontSize: 12 }}
              formatter={(value, name) => {
                if (name === "Uzavreté") return [`${value} dealov`, name];
                if (name === "Konverzia") return [`${value}%`, name];
                return [value, name];
              }}
            />
            <Bar dataKey="closed" name="Uzavreté" radius={[0, 6, 6, 0]} maxBarSize={28}>
              {data.map((entry, idx) => (
                <Cell key={idx} fill={entry.closed > 0 ? "#c9a84c" : "#e5e7eb"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-gray-100">
          {data.slice(0, 3).map((d, i) => (
            <div key={d.agent} className="text-center">
              <p className="text-xs text-gray-400">{d.name.split(" ")[0]}</p>
              <p className="text-sm font-bold text-[#0a1628]">{d.closed} · {d.conversion}%</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}