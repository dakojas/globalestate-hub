import React, { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus, Search, Phone, Mail, MapPin, Euro, Clock, User } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { toast } from "sonner";
import { useTranslation } from "@/components/LanguageContext";
import { formatDistanceToNow } from "date-fns";
import { sk, enUS } from "date-fns/locale";

const statusColors = {
  new_lead: "bg-blue-500",
  unclaimed: "bg-yellow-500",
  claimed: "bg-purple-500",
  contacted: "bg-indigo-500",
  qualified: "bg-green-500",
  offers_sent: "bg-teal-500",
  viewing: "bg-orange-500",
  reserved: "bg-pink-500",
  closed: "bg-emerald-600",
  lost: "bg-gray-400",
};

const sourceColors = {
  direct_app: "bg-blue-50 text-blue-700",
  facebook: "bg-blue-50 text-blue-700",
  instagram: "bg-pink-50 text-pink-700",
  referrer: "bg-purple-50 text-purple-700",
  real_estate_agency: "bg-teal-50 text-teal-700",
  website: "bg-green-50 text-green-700",
  social_media: "bg-pink-50 text-pink-700",
  portal: "bg-amber-50 text-amber-700",
  other: "bg-gray-50 text-gray-600",
};

const sourceLabels = {
  direct_app: "Direct App",
  facebook: "📘 Facebook",
  instagram: "📸 Instagram",
  referrer: "🤝 Tiper",
  real_estate_agency: "🏠 Realitná kancelária",
  website: "🌐 Web",
  social_media: "Social Media",
  portal: "Portal",
  walk_in: "Walk-in",
  whatsapp: "WhatsApp",
  other: "Iné",
};

export default function Leads() {
  const { t, language } = useTranslation();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [tab, setTab] = useState("all");
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ["current-user"],
    queryFn: () => base44.auth.me(),
  });

  const { data: leads = [], isLoading } = useQuery({
    queryKey: ["leads"],
    queryFn: () => base44.entities.Client.list("-created_date", 500),
  });

  const { data: users = [] } = useQuery({
    queryKey: ["team-users"],
    queryFn: () => base44.entities.User.list(),
  });

  const claimMutation = useMutation({
    mutationFn: async (leadId) => {
      await base44.entities.Client.update(leadId, {
        status: "claimed",
        claimed_by: user.email,
        claimed_at: new Date().toISOString(),
        assigned_agent: user.email,
      });
    },
    onSuccess: () => {
      toast.success(t('claimSuccess'));
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });

  const userMap = {};
  users.forEach(u => { userMap[u.email] = u.full_name || u.email; });

  const filtered = leads.filter(l => {
    const matchSearch = !search || 
      l.full_name?.toLowerCase().includes(search.toLowerCase()) || 
      l.email?.toLowerCase().includes(search.toLowerCase()) ||
      l.phone?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || l.status === statusFilter;
    const matchSource = sourceFilter === "all" || l.lead_source === sourceFilter;
    
    let matchTab = true;
    if (tab === "new") matchTab = l.status === "new_lead" || l.status === "unclaimed";
    if (tab === "my") matchTab = l.claimed_by === user?.email || l.assigned_agent === user?.email;
    if (tab === "unclaimed") matchTab = !l.claimed_by && l.status !== "closed" && l.status !== "lost";
    
    return matchSearch && matchStatus && matchSource && matchTab;
  });

  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === "new_lead" || l.status === "unclaimed").length,
    claimed: leads.filter(l => l.claimed_by).length,
    myLeads: leads.filter(l => l.claimed_by === user?.email || l.assigned_agent === user?.email).length,
    referrer: leads.filter(l => l.lead_source === "referrer").length,
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs text-gray-500 uppercase mb-1">{t('total')}</p>
            <p className="text-2xl font-bold text-[#0a1628]">{stats.total}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs text-gray-500 uppercase mb-1">{t('newLeadsCount')}</p>
            <p className="text-2xl font-bold text-blue-600">{stats.new}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs text-gray-500 uppercase mb-1">{t('myLeads')}</p>
            <p className="text-2xl font-bold text-purple-600">{stats.myLeads}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs text-gray-500 uppercase mb-1">{t('claimedCount')}</p>
            <p className="text-2xl font-bold text-green-600">{stats.claimed}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs text-gray-500 uppercase mb-1">{t('fromReferrers')}</p>
            <p className="text-2xl font-bold text-[#c9a84c]">{stats.referrer}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="all">{t('allLeadsTab')} ({filtered.length})</TabsTrigger>
          <TabsTrigger value="new">{t('newLeadsTab')} ({stats.new})</TabsTrigger>
          <TabsTrigger value="unclaimed">{t('unclaimedTab')}</TabsTrigger>
          <TabsTrigger value="my">{t('myLeadsTab')} ({stats.myLeads})</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            placeholder={t('searchLeads')} 
            className="pl-10" 
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('allStatuses')}</SelectItem>
            <SelectItem value="new_lead">{t('new_lead')}</SelectItem>
            <SelectItem value="unclaimed">{t('unclaimed')}</SelectItem>
            <SelectItem value="claimed">{t('claimed')}</SelectItem>
            <SelectItem value="contacted">{t('contacted')}</SelectItem>
            <SelectItem value="qualified">{t('qualified')}</SelectItem>
            <SelectItem value="offers_sent">{t('offers_sent')}</SelectItem>
            <SelectItem value="viewing">{t('viewing')}</SelectItem>
            <SelectItem value="reserved">{t('reserved')}</SelectItem>
            <SelectItem value="closed">{t('closed')}</SelectItem>
            <SelectItem value="lost">{t('lost')}</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sourceFilter} onValueChange={setSourceFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Zdroj" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('allSources')}</SelectItem>
            <SelectItem value="direct_app">Direct App</SelectItem>
            <SelectItem value="facebook">📘 Facebook</SelectItem>
            <SelectItem value="instagram">📸 Instagram</SelectItem>
            <SelectItem value="referrer">🤝 Tiper</SelectItem>
            <SelectItem value="real_estate_agency">🏠 Realitná kancelária</SelectItem>
            <SelectItem value="website">🌐 Web</SelectItem>
            <SelectItem value="social_media">Social Media</SelectItem>
            <SelectItem value="other">Iné</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Leads List */}
      <div className="space-y-3">
        {filtered.map(lead => {
          const canClaim = !lead.claimed_by && user?.role !== "referrer";
          const isMine = lead.claimed_by === user?.email || lead.assigned_agent === user?.email;
          const timeAgo = lead.created_date ? 
            formatDistanceToNow(new Date(lead.created_date), { 
              addSuffix: true, 
              locale: language === 'sk' ? sk : enUS 
            }) : '';

          return (
            <Card key={lead.id} className={`border-0 shadow-sm hover:shadow-md transition-shadow ${isMine ? 'ring-1 ring-purple-200' : ''}`}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <Link 
                        to={createPageUrl(`ClientDetail?id=${lead.id}`)}
                        className="font-semibold text-[#0a1628] hover:underline"
                      >
                        {lead.full_name}
                      </Link>
                      <Badge className={`${statusColors[lead.status]} text-white text-xs`}>
                        {t(lead.status)}
                      </Badge>
                      {lead.lead_source && (
                        <Badge variant="outline" className={`${sourceColors[lead.lead_source] || "bg-gray-50 text-gray-600"} text-xs`}>
                          {sourceLabels[lead.lead_source] || lead.lead_source}
                        </Badge>
                      )}
                      {isMine && <Badge variant="outline" className="text-xs">{t('myLead')}</Badge>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-600">
                      {lead.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="truncate">{lead.email}</span>
                        </div>
                      )}
                      {lead.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span>{lead.phone}</span>
                        </div>
                      )}
                      {lead.preferred_countries?.length > 0 && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span>{lead.preferred_countries.join(", ")}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                      {(lead.budget_min || lead.budget_max) && (
                        <span className="flex items-center gap-1">
                          <Euro className="w-3 h-3" />
                          {lead.budget_min?.toLocaleString() || "0"} - {lead.budget_max?.toLocaleString() || "∞"}
                        </span>
                      )}
                      {timeAgo && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {timeAgo}
                        </span>
                      )}
                      {lead.claimed_by && (
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {userMap[lead.claimed_by] || lead.claimed_by}
                        </span>
                      )}
                      {lead.referrer_code && (
                        <span className="text-purple-600 font-medium">
                          Ref: {lead.referrer_code}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    {canClaim && (
                      <Button 
                        size="sm" 
                        onClick={() => claimMutation.mutate(lead.id)}
                        disabled={claimMutation.isPending}
                        className="bg-[#c9a84c] hover:bg-[#b8973b] text-white"
                      >
                        <UserPlus className="w-4 h-4 mr-1" />
                        {t('claimLead')}
                      </Button>
                    )}
                    <Link to={createPageUrl(`ClientDetail?id=${lead.id}`)}>
                      <Button size="sm" variant="outline" className="w-full">
                       {t('detail')}
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg">{t('noLeadsFound')}</p>
        </div>
      )}
    </div>
  );
}