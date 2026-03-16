import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Pencil, MessageSquare, Phone, Mail, Eye, FileText, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format } from "date-fns";
import ClientForm from "../components/clients/ClientForm";
import InteractionForm from "../components/clients/InteractionForm";

const statusColors = {
  lead: "bg-blue-50 text-blue-700",
  active: "bg-emerald-50 text-emerald-700",
  negotiating: "bg-amber-50 text-amber-700",
  closed: "bg-purple-50 text-purple-700",
  inactive: "bg-gray-100 text-gray-600",
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
              <div>
                <h2 className="text-xl font-bold text-[#0a1628]">{client.full_name}</h2>
                <Badge className={`${statusColors[client.status]} mt-1`}>{client.status}</Badge>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              {client.email && <p className="flex items-center gap-2 text-gray-600"><Mail className="w-4 h-4 text-gray-400" />{client.email}</p>}
              {client.phone && <p className="flex items-center gap-2 text-gray-600"><Phone className="w-4 h-4 text-gray-400" />{client.phone}</p>}
              {client.nationality && <p className="text-gray-500">Nationality: {client.nationality}</p>}
              {client.source && <p className="text-gray-500">Source: {client.source?.replace("_"," ")}</p>}
              {(client.budget_min || client.budget_max) && (
                <p className="text-gray-500">Budget: €{(client.budget_min || 0).toLocaleString()} – €{(client.budget_max || 0).toLocaleString()}</p>
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