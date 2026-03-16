import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Phone, Mail, Eye, MessageSquare, FileText, Clock } from "lucide-react";
import { format } from "date-fns";

const iconMap = {
  call: Phone,
  email: Mail,
  viewing: Eye,
  meeting: FileText,
  whatsapp: MessageSquare,
  note: FileText,
};

const colorMap = {
  call: "bg-blue-50 text-blue-600",
  email: "bg-purple-50 text-purple-600",
  viewing: "bg-emerald-50 text-emerald-600",
  meeting: "bg-amber-50 text-amber-600",
  whatsapp: "bg-green-50 text-green-600",
  note: "bg-gray-50 text-gray-600",
};

export default function RecentActivity({ interactions, clients }) {
  const clientMap = {};
  clients.forEach(c => { clientMap[c.id] = c.full_name; });

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-[#0a1628]">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {interactions.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-6">No recent activity</p>
        )}
        {interactions.slice(0, 8).map((int) => {
          const Icon = iconMap[int.type] || FileText;
          const colors = colorMap[int.type] || "bg-gray-50 text-gray-600";
          return (
            <div key={int.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${colors}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{int.summary}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {clientMap[int.client_id] || "Unknown client"}
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-400 flex-shrink-0">
                <Clock className="w-3 h-3" />
                {int.date ? format(new Date(int.date), "MMM d") : "—"}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}