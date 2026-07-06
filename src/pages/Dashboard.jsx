import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "@/components/LanguageContext";
import { useAuth } from "@/lib/AuthContext";
import { base44 } from "@/api/base44Client";
import { Building2, Users, DollarSign, CalendarClock, UserPlus, TrendingUp, Sparkles, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
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
import ClientStatusChart from "../components/dashboard/ClientStatusChart";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Dobré ráno";
  if (h < 18) return "Dobré popoludnie";
  return "Dobrý večer";
}

export default function Dashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
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

  const availableProperties = properties.filter(p => p.status === "available").length;
  const activeClients = clients.filter(c => ["active", "negotiating"].includes(c.status)).length;
  const newLeads = clients.filter(c => c.status === "new_lead" || c.status === "unclaimed").length;
  const referrerLeads = clients.filter(c => c.lead_source === "referrer").length;
  const closedDeals = clients.filter(c => c.status === "closed").length;

  if (loadingProps || loadingClients) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-28 rounded-3xl" />
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-32 rounded-2xl" />)}
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
      {/* Hero welcome banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0a1628] via-[#132039] to-[#0a1628] p-6 lg:p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#c9a84c]/10 rounded-full blur-3xl -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-[#c9a84c]/5 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          <div>
            <p className="text-[#c9a84c] text-sm font-medium mb-1">
              {new Date().toLocaleDateString("sk-SK", { weekday: "long", day: "numeric", month: "long" })}
            </p>
            <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
              {getGreeting()}, {user?.full_name?.split(" ")[0] || "tím"} 👋
            </h1>
            <p className="text-white/50 text-sm mt-2 max-w-lg">
              Máte <span className="text-[#c9a84c] font-semibold">{newLeads} nových leadov</span> a <span className="text-white font-semibold">{reminders.length} pripomienok</span> na dnes.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <Button
              onClick={() => setOfferOpen(true)}
              className="bg-[#c9a84c] hover:bg-[#b8973f] text-[#0a1628] font-semibold rounded-xl h-11 px-5"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Vytvoriť ponuku
            </Button>
            <Link to={createPageUrl("Leads")}>
              <Button variant="outline" className="bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white rounded-xl h-11 px-5 w-full sm:w-auto">
                Zobraziť leady
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <OfferGenerator open={offerOpen} onClose={() => setOfferOpen(false)} />

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard title={t('newLeads')} value={newLeads} subtitle={t('waiting')} icon={UserPlus} color="blue" />
        <StatCard title={t('totalClients')} value={clients.length} subtitle={`${activeClients} ${t('activeCount')}`} icon={Users} color="purple" />
        <StatCard title={t('properties')} value={properties.length} subtitle={`${availableProperties} ${t('availableCount')}`} icon={Building2} color="gold" />
        <StatCard title={t('referrerLeads')} value={referrerLeads} subtitle={t('fromPartners')} icon={TrendingUp} color="green" />
        <StatCard title={t('closedDeals')} value={closedDeals} subtitle={t('successful')} icon={DollarSign} color="emerald" />
        <StatCard title={t('reminders')} value={reminders.length} subtitle={t('pending')} icon={CalendarClock} color="red" />
      </div>

      {/* Stale leads alert */}
      <StaleLeads clients={clients} interactions={interactions} />

      {/* Section: Analýza & Trendy */}
      <div>
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-1 h-5 bg-[#c9a84c] rounded-full" />
          <h3 className="text-sm font-bold text-[#0a1628] uppercase tracking-wider">Analýza &amp; Trendy</h3>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <LeadsTrend clients={clients} />
            <MonthlySalesChart commissions={commissions} />
          </div>
          <div className="space-y-6">
            <PipelineValue clients={clients} commissions={commissions} />
            <ClientStatusChart clients={clients} />
            <SalesFunnel clients={clients} />
          </div>
        </div>
      </div>

      {/* Section: Tím & Výkonnosť */}
      <div>
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-1 h-5 bg-[#c9a84c] rounded-full" />
          <h3 className="text-sm font-bold text-[#0a1628] uppercase tracking-wider">Tím &amp; Výkonnosť</h3>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <AgentPerformanceChart clients={clients} commissions={commissions} />
            <RecentActivity interactions={interactions} clients={clients} />
          </div>
          <div className="space-y-6">
            <AgentLeaderboard clients={clients} commissions={commissions} />
            <LeadSourceChart clients={clients} />
          </div>
        </div>
      </div>

      {/* Section: Akcie & Pripomienky */}
      <div>
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-1 h-5 bg-[#c9a84c] rounded-full" />
          <h3 className="text-sm font-bold text-[#0a1628] uppercase tracking-wider">Akcie &amp; Pripomienky</h3>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <UpcomingReminders reminders={reminders} />
          <ClientMatches clients={clients} properties={properties} />
          <CountryBreakdown properties={properties} />
        </div>
      </div>
    </div>
  );
}