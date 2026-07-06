import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "@/components/LanguageContext";
import { base44 } from "@/api/base44Client";
import { Building2, Users, DollarSign, CalendarClock, UserPlus, TrendingUp, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import OfferGenerator from "@/components/offers/OfferGenerator";
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
import MonthlySalesChart from "../components/dashboard/MonthlySalesChart";
import AgentPerformanceChart from "../components/dashboard/AgentPerformanceChart";

export default function Dashboard() {
  const { t } = useTranslation();
  const [offerOpen, setOfferOpen] = useState(false);
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
      {/* Offer generator banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-gradient-to-r from-[#0a1628] to-[#132039] rounded-2xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#c9a84c]/20 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-6 h-6 text-[#c9a84c]" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">Generátor profesionálnej ponuky</h3>
            <p className="text-white/60 text-sm">Vytvorte a odošlite personalizovanú ponuku pre klienta z existujúcich dát o nehnuteľnosti</p>
          </div>
        </div>
        <Button onClick={() => setOfferOpen(true)} className="bg-[#c9a84c] hover:bg-[#b8973f] text-[#0a1628] font-semibold">
          <Sparkles className="w-4 h-4 mr-2" />
          Vytvoriť ponuku
        </Button>
      </div>

      <OfferGenerator open={offerOpen} onClose={() => setOfferOpen(false)} />

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
          <MonthlySalesChart commissions={commissions} />
          <SalesFunnel clients={clients} />
          <AgentPerformanceChart clients={clients} commissions={commissions} />
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