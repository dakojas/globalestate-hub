import React, { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Pencil, MessageSquare, Phone, Mail, Eye, FileText, Clock, User, Gift } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format } from "date-fns";
import { toast } from "sonner";
import ClientForm from "../components/clients/ClientForm";
import InteractionForm from "../components/clients/InteractionForm";
import { useTranslation } from "@/components/LanguageContext";

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

const interactionIcons = {
  call: Phone, email: Mail, viewing: Eye,
  meeting: FileText, whatsapp: MessageSquare, note: FileText,
};

export default function ClientDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [showInteraction, setShowInteraction] = useState(false);
  const { t } = useTranslation();

  const { data: user } = useQuery({
    queryKey: ["current-user"],
    queryFn: () => base44.auth.me(),
  });

  const { data: client, isLoading } = useQuery({
    queryKey: ["client", id],
    queryFn: () => base44.entities.Client.filter({ id }),
    select: d => d[0],
    enabled: !!id,
  });

  const { data: interactions = [] } = useQuery({
    queryKey: ["interactions", id],
    queryFn: () => base44.entities.Interaction.filter({ client_id: id }, "-date", 50),
    enabled: !!id,
  });

  const { data: properties = [] } = useQuery({
    queryKey: ["properties"],
    queryFn: () => base44.entities.Property.list("-created_date", 200),
  });

  const { data: users = [] } = useQuery({
    queryKey: ["team-users"],
    queryFn: () => base44.entities.User.list(),
  });

  const updateStatusMutation = useMutation({
    mutationFn: async (newStatus) => {
      await base44.entities.Client.update(id, { status: newStatus });
    },
    onSuccess: () => {
      toast.success("Status aktualizovaný");
      queryClient.invalidateQueries({ queryKey: ["client", id] });
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });

  const userMap = {};
  users.forEach(u => { userMap[u.email] = u.full_name || u.email; });

  const refresh = () => {
    setEditing(false);
    setShowInteraction(false);
    queryClient.invalidateQueries({ queryKey: ["client", id] });
    queryClient.invalidateQueries({ queryKey: ["interactions", id] });
  };

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-48 rounded-2xl" /><Skeleton className="h-64 rounded-2xl" /></div>;
  if (!client) return <div className="text-center py-20 text-gray-400">Client not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link to={createPageUrl("Clients")} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900">
          <ArrowLeft className="w-4 h-4" /> Back to Clients
        </Link>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowInteraction(true)}><MessageSquare className="w-4 h-4 mr-1" /> Log Interaction</Button>
          <Button variant="outline" size="sm" onClick={() => setEditing(true)}><Pencil className="w-4 h-4 mr-1" /> Edit</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-[#0a1628]/5 flex items-center justify-center">
                <span className="text-2xl font-bold text-[#0a1628]">{client.full_name?.charAt(0)}</span>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-[#0a1628]">{client.full_name}</h2>
                <Select value={client.status} onValueChange={(v) => updateStatusMutation.mutate(v)}>
                  <SelectTrigger className="w-full mt-2 h-8">
                    <Badge className={`${statusColors[client.status]} text-white text-xs`}>
                      {t(client.status)}
                    </Badge>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new_lead">Nový lead</SelectItem>
                    <SelectItem value="unclaimed">Neprevzatý</SelectItem>
                    <SelectItem value="claimed">Prevzatý</SelectItem>
                    <SelectItem value="contacted">Kontaktovaný</SelectItem>
                    <SelectItem value="qualified">Kvalifikovaný</SelectItem>
                    <SelectItem value="offers_sent">Ponuky odoslané</SelectItem>
                    <SelectItem value="viewing">Obhliadka</SelectItem>
                    <SelectItem value="reserved">Rezervácia</SelectItem>
                    <SelectItem value="closed">Uzavretý</SelectItem>
                    <SelectItem value="lost">Stratený</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Lead Info */}
            {client.lead_source && (
              <div className="mb-4 p-3 rounded-lg bg-gray-50">
                <div className="flex items-center gap-2 mb-2">
                  {client.lead_source === "referrer" && <Gift className="w-4 h-4 text-purple-600" />}
                  <p className="text-xs font-semibold text-gray-700">
                    Zdroj: {client.lead_source === "referrer" ? "🎁 Referrer" : client.lead_source}
                  </p>
                </div>
                {client.referrer_code && (
                  <p className="text-xs text-gray-500">Kód: {client.referrer_code}</p>
                )}
                {client.claimed_by && (
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t">
                    <User className="w-3 h-3 text-gray-400" />
                    <p className="text-xs text-gray-600">
                      Prevzal: {userMap[client.claimed_by] || client.claimed_by}
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-3 text-sm">
              {client.email && <p className="flex items-center gap-2 text-gray-600"><Mail className="w-4 h-4 text-gray-400" />{client.email}</p>}
              {client.phone && <p className="flex items-center gap-2 text-gray-600"><Phone className="w-4 h-4 text-gray-400" />{client.phone}</p>}
              {client.nationality && <p className="text-gray-500">Nationality: {client.nationality}</p>}
              {(client.budget_min || client.budget_max) && (
                <p className="text-gray-500">Rozpočet: €{(client.budget_min || 0).toLocaleString()} – €{(client.budget_max || 0).toLocaleString()}</p>
              )}
            </div>
            {client.preferred_countries?.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Preferred Countries</p>
                <div className="flex flex-wrap gap-1">{client.preferred_countries.map(c => <Badge key={c} variant="outline" className="text-xs">{c}</Badge>)}</div>
              </div>
            )}
            {client.notes && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Notes</p>
                <p className="text-sm text-gray-600">{client.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Interaction History ({interactions.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {interactions.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">No interactions yet</p>
              ) : (
                <div className="space-y-3">
                  {interactions.map(int => {
                    const Icon = interactionIcons[int.type] || FileText;
                    return (
                      <div key={int.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                        <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-4 h-4 text-gray-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-[10px]">{int.type}</Badge>
                            <span className="text-xs text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" />{int.date ? format(new Date(int.date), "MMM d, yyyy h:mm a") : "—"}</span>
                          </div>
                          <p className="text-sm text-gray-700">{int.summary}</p>
                          {int.outcome && <p className="text-xs text-gray-500 mt-1">→ {int.outcome}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {editing && <ClientForm client={client} open={editing} onClose={() => setEditing(false)} onSaved={refresh} />}
      {showInteraction && <InteractionForm clientId={id} properties={properties} open={showInteraction} onClose={() => setShowInteraction(false)} onSaved={refresh} />}
    </div>
  );
}