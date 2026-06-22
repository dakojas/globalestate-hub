import React, { useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip, CartesianGrid } from "recharts";
import { TrendingUp } from "lucide-react";
import { format, subDays, startOfDay, isSameDay, parseISO } from "date-fns";

export default function LeadsTrend({ clients }) {
  const data = useMemo(() => {
    const today = startOfDay(new Date());
    const days = [];
    for (let i = 29; i >= 0; i--) {
      const day = subDays(today, i);
      const count = clients.filter(c => {
        if (!c.created_date) return false;
        return isSameDay(parseISO(c.created_date), day);
      }).length;
      days.push({ date: format(day, "MMM d"), leads: count });
    }
    return days;
  }, [clients]);

  const totalThisMonth = data.reduce((sum, d) => sum + d.leads, 0);
  const last7 = data.slice(-7).reduce((sum, d) => sum + d.leads, 0);
  const prev7 = data.slice(-14, -7).reduce((sum, d) => sum + d.leads, 0);
  const trend = prev7 > 0 ? Math.round(((last7 - prev7) / prev7) * 100) : (last7 > 0 ? 100 : 0);

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-[#0a1628] flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#c9a84c]" />
            Trend leadov (30 dní)
          </CardTitle>
          <div className="text-right">
            <p className="text-xs text-gray-400">Posledných 7 dní</p>
            <p className={`text-sm font-bold ${trend >= 0 ? "text-emerald-600" : "text-red-500"}`}>
              {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}% · {last7} leadov
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="leadGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#c9a84c" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#c9a84c" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: "#9ca3af" }}
              interval={4}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", fontSize: 12 }}
              labelStyle={{ fontWeight: 600 }}
            />
            <Area
              type="monotone"
              dataKey="leads"
              stroke="#c9a84c"
              strokeWidth={2}
              fill="url(#leadGradient)"
              name="Leady"
            />
          </AreaChart>
        </ResponsiveContainer>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-400">Spolu za 30 dní</span>
          <span className="text-sm font-bold text-[#0a1628]">{totalThisMonth} leadov</span>
        </div>
      </CardContent>
    </Card>
  );
}