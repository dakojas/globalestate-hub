import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "@/components/LanguageContext";
import { base44 } from "@/api/base44Client";
import { Building2, Users, DollarSign, CalendarClock, UserPlus, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import StatCard from "../components/dashboard/StatCard";
import RecentActivity from "../components/dashboard/RecentActivity";
import CountryBreakdown from "../components/dashboard/CountryBreakdown";
import UpcomingReminders from "../components/dashboard/UpcomingReminders";
import LeadSourceChart from "../components/dashboard/LeadSourceChart";
import ClientMatches from "../components/dashboard/ClientMatches";
import SalesFunnel from "../components/dashboard/SalesFunnel";
import AgentLeaderboard from "../components/dashboard/AgentLeaderboard";
import LeadsTrend from "../components/dashboard/LeadsTrend";
import PipelineValue from "../components/dashboard/PipelineValue";
import StaleLeads from "../components/dashboard/StaleLeads";

export default function Dashboard() {
  const { t } = useTranslation();
  const { data: properties = [], isLoading: loadingProps } = useQuery({
    queryKey: ["properties"],
    queryFn: () => base44.entities.Property.list("-created_date", 100),
  });

  const { data: clients = [], isLoading: loadingClients } = useQuery({
    queryKey: ["clients"],
    queryFn: () => base44.entities.Client.list("-created_date", 100),
  });

  const { data: interactions = [] } = useQuery({
    queryKey: ["interactions"],
    queryFn: () => base44.entities.Interaction.list("-date", 20),
  });

  const { data: reminders = [] } = useQuery({
    queryKey: ["reminders"],
    queryFn: () => base44.entities.Reminder.filter({ status: "pending" }, "-due_date", 20),
  });

  const { data: commissions = [] } = useQuery({
    queryKey: ["commissions"],
    queryFn: () => base44.entities.Commission.list("-deal_date", 100),
  });

  const totalCommissions = commissions.reduce((sum, c) => sum + (c.commission_amount || 0), 0);
  const availableProperties = properties.filter(p => p.status === "available").length;
  const activeClients = clients.filter(c => ["active", "negotiating"].includes(c.status)).length;
  
  // New lead stats
  const newLeads = clients.filter(c => c.status === "new_lead" || c.status === "unclaimed").length;
  const referrerLeads = clients.filter(c => c.lead_source === "referrer").length;
  const closedDeals = clients.filter(c => c.status === "closed").length;

  if (loadingProps || loadingClients) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-32 rounded-2xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-96 rounded-2xl lg:col-span-2" />
          <Skeleton className="h-96 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <StatCard title={t('newLeads')} value={newLeads} subtitle={t('waiting')} icon={UserPlus} color="blue" />
        <StatCard title={t('totalClients')} value={clients.length} subtitle={`${activeClients} ${t('activeCount')}`} icon={Users} color="purple" />
        <StatCard title={t('properties')} value={properties.length} subtitle={`${availableProperties} ${t('availableCount')}`} icon={Building2} color="gold" />
        <StatCard title={t('referrerLeads')} value={referrerLeads} subtitle={t('fromPartners')} icon={TrendingUp} color="green" />
        <StatCard title={t('closedDeals')} value={closedDeals} subtitle={t('successful')} icon={DollarSign} color="emerald" />
        <StatCard title={t('reminders')} value={reminders.length} subtitle={t('pending')} icon={CalendarClock} color="red" />
      </div>

      {/* Stale leads alert */}
      <StaleLeads clients={clients} interactions={interactions} />

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <LeadsTrend clients={clients} />
          <SalesFunnel clients={clients} />
          <RecentActivity interactions={interactions} clients={clients} />
          <LeadSourceChart clients={clients} />
        </div>
        <div className="space-y-6">
          <PipelineValue clients={clients} commissions={commissions} />
          <AgentLeaderboard clients={clients} commissions={commissions} />
          <UpcomingReminders reminders={reminders} />
          <ClientMatches clients={clients} properties={properties} />
          <CountryBreakdown properties={properties} />
        </div>
      </div>
    </div>
  );
}