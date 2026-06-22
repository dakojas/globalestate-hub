import React, { useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from "recharts";
import { BarChart3 } from "lucide-react";
import { format, parseISO, isSameMonth, subMonths, startOfMonth } from "date-fns";

export default function MonthlySalesChart({ commissions }) {
  const data = useMemo(() => {
    const now = new Date();
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const m = subMonths(startOfMonth(now), i);
      const monthCommissions = commissions.filter(c => {
        if (!c.deal_date) return false;
        return isSameMonth(parseISO(c.deal_date), m);
      });
      const total = monthCommissions.reduce((sum, c) => sum + (c.commission_amount || 0), 0);
      const salesTotal = monthCommissions.reduce((sum, c) => sum + (c.sale_price || 0), 0);
      months.push({
        month: format(m, "MMM yyyy"),
        provízia: Math.round(total),
        predaj: Math.round(salesTotal),
        deals: monthCommissions.length,
      });
    }
    return months;
  }, [commissions]);

  const totalProvizia = data.reduce((s, d) => s + d.provízia, 0);
  const totalDeals = data.reduce((s, d) => s + d.deals, 0);
  const fmt = (v) => v >= 1000000 ? `€${(v / 1000000).toFixed(1)}M` : v >= 1000 ? `€${(v / 1000).toFixed(0)}k` : `€${v}`;

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-[#0a1628] flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#c9a84c]" />
            Predaje &amp; provízie za mesiac
          </CardTitle>
          <div className="text-right">
            <p className="text-xs text-gray-400">Posledných 6 mesiacov</p>
            <p className="text-sm font-bold text-[#c9a84c]">{fmt(totalProvizia)} · {totalDeals} dealov</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => fmt(v)}
            />
            <Tooltip
              contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", fontSize: 12 }}
              formatter={(value, name) => [fmt(value), name]}
            />
            <Bar dataKey="provízia" radius={[6, 6, 0, 0]} maxBarSize={48}>
              {data.map((entry, idx) => (
                <Cell key={idx} fill={entry.provízia > 0 ? "#c9a84c" : "#e5e7eb"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-[#c9a84c]" />
            <span className="text-gray-500">Provízie</span>
          </div>
          <span className="text-gray-400">·</span>
          <span className="text-gray-500">Počet dealov zobrazený v tooltipu</span>
        </div>
      </CardContent>
    </Card>
  );
}