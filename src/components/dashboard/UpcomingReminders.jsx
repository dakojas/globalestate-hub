import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarClock, Eye, FileText, Phone, CreditCard, MoreHorizontal } from "lucide-react";
import { format, isToday, isTomorrow, isPast } from "date-fns";

const typeIcons = {
  viewing: Eye,
  contract_renewal: FileText,
  follow_up: Phone,
  payment: CreditCard,
  other: MoreHorizontal,
};

const priorityColors = {
  high: "bg-red-50 text-red-700 border-red-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  low: "bg-blue-50 text-blue-700 border-blue-200",
};

export default function UpcomingReminders({ reminders }) {
  const pending = reminders
    .filter(r => r.status === "pending")
    .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
    .slice(0, 6);

  const getDateLabel = (dateStr) => {
    const d = new Date(dateStr);
    if (isPast(d)) return "Overdue";
    if (isToday(d)) return "Today";
    if (isTomorrow(d)) return "Tomorrow";
    return format(d, "MMM d");
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-[#0a1628]">Upcoming Reminders</CardTitle>
          <CalendarClock className="w-4 h-4 text-gray-400" />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {pending.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-6">No upcoming reminders</p>
        )}
        {pending.map((r) => {
          const Icon = typeIcons[r.type] || MoreHorizontal;
          const dateLabel = getDateLabel(r.due_date);
          const isOverdue = isPast(new Date(r.due_date));
          return (
            <div key={r.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-[#0a1628]/5 flex items-center justify-center">
                <Icon className="w-4 h-4 text-[#0a1628]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{r.title}</p>
                <p className={`text-xs mt-0.5 ${isOverdue ? "text-red-500 font-semibold" : "text-gray-400"}`}>
                  {dateLabel}
                </p>
              </div>
              <Badge variant="outline" className={`text-xs ${priorityColors[r.priority] || priorityColors.medium}`}>
                {r.priority}
              </Badge>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}