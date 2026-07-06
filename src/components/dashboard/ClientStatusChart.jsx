import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const STATUS_CONFIG = [
  { key: "new_lead", label: "Nový lead", color: "#3b82f6" },
  { key: "unclaimed", label: "Nepriradený", color: "#60a5fa" },
  { key: "claimed", label: "Priradený", color: "#818cf8" },
  { key: "contacted", label: "Kontaktovaný", color: "#a78bfa" },
  { key: "qualified", label: "Kvalifikovaný", color: "#c084fc" },
  { key: "offers_sent", label: "Ponuka odoslaná", color: "#f59e0b" },
  { key: "viewing", label: "Prehliadka", color: "#f97316" },
  { key: "reserved", label: "Rezervovaný", color: "#14b8a6" },
  { key: "closed", label: "Uzavretý", color: "#10b981" },
  { key: "lost", label: "Stratený", color: "#ef4444" },
];

export default function ClientStatusChart({ clients }) {
  const data = STATUS_CONFIG.map(s => ({
    name: s.label,
    value: clients.filter(c => c.status === s.key).length,
    color: s.color,
  })).filter(d => d.value > 0);

  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h4 className="text-sm font-bold text-[#0a1628] mb-1">Klienti podľa stavu</h4>
      <p className="text-xs text-gray-400 mb-4">Rozdelenie v predajnom procese ({total} celkom)</p>
      {total === 0 ? (
        <div className="h-[260px] flex items-center justify-center text-gray-300 text-sm">Žiadni klienti</div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={90}
              paddingAngle={2}
            >
              {data.map((entry, idx) => (
                <Cell key={idx} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [`${value} klientov`, ""]}
              contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }}
            />
            <Legend
              layout="vertical"
              align="right"
              verticalAlign="middle"
              iconType="circle"
              wrapperStyle={{ fontSize: 11, lineHeight: "18px" }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}