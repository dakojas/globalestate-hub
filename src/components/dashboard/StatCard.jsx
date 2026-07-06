import React from "react";
import { Card } from "@/components/ui/card";

export default function StatCard({ title, value, subtitle, icon: Icon, color = "gold", trend }) {
  const colorMap = {
    gold: { iconBg: "bg-gradient-to-br from-[#c9a84c] to-[#b8973f]", iconColor: "text-white", accent: "text-[#c9a84c]", glow: "from-[#c9a84c]/5" },
    blue: { iconBg: "bg-gradient-to-br from-blue-500 to-blue-600", iconColor: "text-white", accent: "text-blue-600", glow: "from-blue-500/5" },
    green: { iconBg: "bg-gradient-to-br from-emerald-500 to-emerald-600", iconColor: "text-white", accent: "text-emerald-600", glow: "from-emerald-500/5" },
    emerald: { iconBg: "bg-gradient-to-br from-emerald-500 to-teal-600", iconColor: "text-white", accent: "text-emerald-600", glow: "from-emerald-500/5" },
    red: { iconBg: "bg-gradient-to-br from-red-500 to-rose-600", iconColor: "text-white", accent: "text-red-500", glow: "from-red-500/5" },
    purple: { iconBg: "bg-gradient-to-br from-purple-500 to-violet-600", iconColor: "text-white", accent: "text-purple-600", glow: "from-purple-500/5" },
  };

  const c = colorMap[color] || colorMap.gold;

  return (
    <Card className={`relative p-5 bg-white border-0 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group bg-gradient-to-br ${c.glow} to-transparent`}>
      <div className="flex items-start justify-between relative z-10">
        <div className="flex-1">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{title}</p>
          <p className="text-3xl font-bold text-[#0a1628] mt-2 tracking-tight">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1">
              <span className={`w-1 h-1 rounded-full ${c.iconBg}`} />
              {subtitle}
            </p>
          )}
        </div>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${c.iconBg} shadow-md group-hover:scale-110 transition-transform duration-300`}>
          <Icon className={`w-5 h-5 ${c.iconColor}`} />
        </div>
      </div>
    </Card>
  );
}