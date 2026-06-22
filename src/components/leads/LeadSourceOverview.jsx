import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Target, Percent } from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, Legend
} from "recharts";

export const SOURCE_META = {
  direct_app: { label: "Direct App", color: "#3b82f6", icon: "📱" },
  facebook: { label: "Facebook", color: "#1877f2", icon: "📘" },
  facebook_ads: { label: "Facebook Ads", color: "#0866ff", icon: "📢" },
  instagram: { label: "Instagram", color: "#e1306c", icon: "📸" },
  instagram_ads: { label: "Instagram Ads", color: "#c13584", icon: "📢" },
  google_ads: { label: "Google Ads", color: "#ea4335", icon: "🔍" },
  google_search: { label: "Google Search", color: "#34a853", icon: "🔎" },
  referrer: { label: "Tiper", color: "#a855f7", icon: "🤝" },
  real_estate_agency: { label: "Realitná kancelária", color: "#14b8a6", icon: "🏠" },
  website: { label: "Web", color: "#22c55e", icon: "🌐" },
  social_media: { label: "Social Media", color: "#ec4899", icon: "💬" },
  portal: { label: "Portal", color: "#f59e0b", icon: "📋" },
  walk_in: { label: "Walk-in", color: "#64748b", icon: "🚶" },
  whatsapp: { label: "WhatsApp", color: "#25d366", icon: "💬" },
  tiktok_ads: { label: "TikTok Ads", color: "#000000", icon: "🎵" },
  linkedin: { label: "LinkedIn", color: "#0a66c2", icon: "💼" },
  other: { label: "Iné", color: "#94a3b8", icon: "❓" },
};

const WON_STATUSES = ["qualified", "offers_sent", "viewing", "reserved", "closed"];

export default function LeadSourceOverview({ leads }) {
  const data = useMemo(() => {
    const bySource = {};
    leads.forEach(l => {
      const src = l.lead_source || "other";
      if (!bySource[src]) {
        bySource[src] = { source: src, total: 0, won: 0, lost: 0, active: 0 };
      }
      bySource[src].total++;
      if (WON_STATUSES.includes(l.status)) bySource[src].won++;
      else if (l.status === "lost") bySource[src].lost++;
      else bySource[src].active++;
    });

    const arr = Object.values(bySource)
      .map(s => ({
        ...s,
        label: SOURCE_META[s.source]?.label || s.source,
        color: SOURCE_META[s.source]?.color || "#94a3b8",
        conversion: s.total > 0 ? Math.round((s.won / s.total) * 100) : 0,
      }))
      .sort((a, b) => b.total - a.total);

    return arr;
  }, [leads]);

  const totalLeads = leads.length;
  const totalWon = leads.filter(l => WON_STATUSES.includes(l.status)).length;
  const overallConversion = totalLeads > 0 ? Math.round((totalWon / totalLeads) * 100) : 0;
  const topSource = data[0];

  const pieData = data.filter(d => d.total > 0).map(d => ({ name: d.label, value: d.total, color: d.color }));

  return (
    <div className="space-y-4">
      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <Users className="w-4 h-4" />
              <p className="text-xs uppercase">Spolu leadov</p>
            </div>
            <p className="text-2xl font-bold text-[#0a1628]">{totalLeads}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <Target className="w-4 h-4" />
              <p className="text-xs uppercase">Top zdroj</p>
            </div>
            <p className="text-lg font-bold text-[#0a1628] truncate">
              {topSource ? topSource.label : "-"}
            </p>
            {topSource && <p className="text-xs text-gray-400">{topSource.total} leadov</p>}
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <TrendingUp className="w-4 h-4" />
              <p className="text-xs uppercase">Konvertovaní</p>
            </div>
            <p className="text-2xl font-bold text-green-600">{totalWon}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <Percent className="w-4 h-4" />
              <p className="text-xs uppercase">Konverzný pomer</p>
            </div>
            <p className="text-2xl font-bold text-[#c9a84c]">{overallConversion}%</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Bar chart - leads by source */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Počet leadov podľa zdroja</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis type="category" dataKey="label" tick={{ fontSize: 11 }} width={120} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb" }}
                  formatter={(value, name, props) => {
                    const d = props.payload;
                    return [`${value} leadov (${d.conversion}% konv.)`, d.label];
                  }}
                />
                <Bar dataKey="total" radius={[0, 4, 4, 0]}>
                  {data.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie chart - distribution */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Rozloženie zdrojov</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={50}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                  style={{ fontSize: 10 }}
                >
                  {pieData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb" }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed table */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Detailný prehľad podľa zdroja</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="pb-2 font-medium">Zdroj</th>
                  <th className="pb-2 font-medium text-right">Leadov</th>
                  <th className="pb-2 font-medium text-right">Aktívni</th>
                  <th className="pb-2 font-medium text-right">Konvertovaní</th>
                  <th className="pb-2 font-medium text-right">Stratení</th>
                  <th className="pb-2 font-medium text-right">Konverzia</th>
                  <th className="pb-2 font-medium">Podiel</th>
                </tr>
              </thead>
              <tbody>
                {data.map(d => {
                  const share = totalLeads > 0 ? (d.total / totalLeads) * 100 : 0;
                  return (
                    <tr key={d.source} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="py-2.5">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full" style={{ background: d.color }} />
                          <span className="font-medium text-[#0a1628]">{d.label}</span>
                        </div>
                      </td>
                      <td className="py-2.5 text-right font-semibold">{d.total}</td>
                      <td className="py-2.5 text-right text-blue-600">{d.active}</td>
                      <td className="py-2.5 text-right text-green-600">{d.won}</td>
                      <td className="py-2.5 text-right text-gray-400">{d.lost}</td>
                      <td className="py-2.5 text-right">
                        <Badge className={d.conversion >= 20 ? "bg-green-100 text-green-700" : d.conversion >= 10 ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-600"}>
                          {d.conversion}%
                        </Badge>
                      </td>
                      <td className="py-2.5 w-32">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${share}%`, background: d.color }} />
                          </div>
                          <span className="text-xs text-gray-400 w-10">{share.toFixed(0)}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}