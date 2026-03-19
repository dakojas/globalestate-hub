import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Check, Eye, FileText, Phone, CreditCard, MoreHorizontal, Clock } from "lucide-react";
import { format, isPast, isToday, isTomorrow, isThisWeek } from "date-fns";
import { toast } from "sonner";
import ReminderForm from "../components/calendar/ReminderForm";
import { useTranslation } from "@/components/LanguageContext";

const typeIcons = { viewing: Eye, contract_renewal: FileText, follow_up: Phone, payment: CreditCard, other: MoreHorizontal };
const typeColors = {
  viewing: "bg-emerald-50 text-emerald-700",
  contract_renewal: "bg-purple-50 text-purple-700",
  follow_up: "bg-blue-50 text-blue-700",
  payment: "bg-amber-50 text-amber-700",
  other: "bg-gray-50 text-gray-600",
};
const priorityColors = {
  high: "bg-red-50 text-red-700 border-red-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  low: "bg-blue-50 text-blue-700 border-blue-200",
};

export default function Calendar() {
  const { t, language } = useTranslation();
  const [showForm, setShowForm] = useState(false);
  const [tab, setTab] = useState("upcoming");
  const queryClient = useQueryClient();

  const { data: reminders = [], isLoading } = useQuery({
    queryKey: ["all-reminders"],
    queryFn: () => base44.entities.Reminder.list("-due_date", 200),
  });

  const { data: clients = [] } = useQuery({ queryKey: ["clients"], queryFn: () => base44.entities.Client.list("-created_date", 200) });
  const { data: properties = [] } = useQuery({ queryKey: ["properties"], queryFn: () => base44.entities.Property.list("-created_date", 200) });

  const clientMap = {};
  clients.forEach(c => { clientMap[c.id] = c.full_name; });
  const propertyMap = {};
  properties.forEach(p => { propertyMap[p.id] = p.title; });

  const markCompleted = async (r) => {
    await base44.entities.Reminder.update(r.id, { status: "completed" });
    toast.success(language === 'sk' ? 'Označené ako hotové' : 'Marked as completed');
    queryClient.invalidateQueries({ queryKey: ["all-reminders"] });
  };

  const filtered = reminders.filter(r => {
    if (tab === "upcoming") return r.status === "pending";
    if (tab === "overdue") return r.status === "pending" && isPast(new Date(r.due_date));
    if (tab === "completed") return r.status === "completed";
    return true;
  }).sort((a, b) => new Date(a.due_date) - new Date(b.due_date));

  const getDateLabel = (dateStr) => {
    const d = new Date(dateStr);
    if (isToday(d)) return t('today');
    if (isTomorrow(d)) return t('tomorrow');
    if (isPast(d)) return t('overdueLabel');
    if (isThisWeek(d)) return format(d, "EEEE");
    return format(d, "MMM d, yyyy");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="upcoming">{t('upcoming')} ({reminders.filter(r => r.status === "pending").length})</TabsTrigger>
            <TabsTrigger value="overdue">{t('overdue')} ({reminders.filter(r => r.status === "pending" && isPast(new Date(r.due_date))).length})</TabsTrigger>
            <TabsTrigger value="completed">{t('completed')}</TabsTrigger>
            <TabsTrigger value="all">{t('all')}</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button onClick={() => setShowForm(true)} className="bg-[#0a1628] hover:bg-[#132039]">
          <Plus className="w-4 h-4 mr-2" /> {t('newReminder')}
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1,2,3,4].map(i => <Skeleton key={i} className="h-20 rounded-xl" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20"><p className="text-gray-400 text-lg">{t('noRemindersFound')}</p></div>
      ) : (
        <div className="space-y-3">
          {filtered.map(r => {
            const Icon = typeIcons[r.type] || MoreHorizontal;
            const isOverdue = r.status === "pending" && isPast(new Date(r.due_date));
            return (
              <Card key={r.id} className={`border-0 shadow-sm ${isOverdue ? "ring-1 ring-red-200" : ""}`}>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${typeColors[r.type] || typeColors.other}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className={`font-semibold text-sm ${r.status === "completed" ? "line-through text-gray-400" : "text-[#0a1628]"}`}>{r.title}</h4>
                      <Badge variant="outline" className={`text-[10px] ${priorityColors[r.priority] || priorityColors.medium}`}>{t(`priority_${r.priority}`) || r.priority}</Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                      <span className={`flex items-center gap-1 ${isOverdue ? "text-red-500 font-semibold" : ""}`}>
                        <Clock className="w-3 h-3" />{getDateLabel(r.due_date)} • {format(new Date(r.due_date), "h:mm a")}
                      </span>
                      {clientMap[r.client_id] && <span>• {clientMap[r.client_id]}</span>}
                      {propertyMap[r.property_id] && <span>• {propertyMap[r.property_id]}</span>}
                    </div>
                    {r.description && <p className="text-xs text-gray-500 mt-1">{r.description}</p>}
                  </div>
                  {r.status === "pending" && (
                    <Button variant="outline" size="sm" onClick={() => markCompleted(r)} className="flex-shrink-0">
                      <Check className="w-4 h-4 mr-1" /> {t('done')}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {showForm && (
        <ReminderForm
          clients={clients}
          properties={properties}
          open={showForm}
          onClose={() => setShowForm(false)}
          onSaved={() => { setShowForm(false); queryClient.invalidateQueries({ queryKey: ["all-reminders"] }); queryClient.invalidateQueries({ queryKey: ["reminders"] }); }}
        />
      )}
    </div>
  );
}