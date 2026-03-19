import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, User, Mail, Phone, MoreVertical, MessageSquare, Pencil, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useNavigate } from "react-router-dom";
import ClientForm from "../components/clients/ClientForm";
import { useTranslation } from "@/components/LanguageContext";
import InteractionForm from "../components/clients/InteractionForm";

const statusColors = {
  lead: "bg-blue-50 text-blue-700",
  active: "bg-emerald-50 text-emerald-700",
  negotiating: "bg-amber-50 text-amber-700",
  closed: "bg-purple-50 text-purple-700",
  inactive: "bg-gray-100 text-gray-600",
};

export default function Clients() {
  const { t } = useTranslation();
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [interactionClient, setInteractionClient] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: clients = [], isLoading } = useQuery({
    queryKey: ["clients"],
    queryFn: () => base44.entities.Client.list("-created_date", 200),
  });

  const { data: properties = [] } = useQuery({
    queryKey: ["properties"],
    queryFn: () => base44.entities.Property.list("-created_date", 200),
  });

  const filtered = clients.filter(c => {
    const matchSearch = !search || c.full_name?.toLowerCase().includes(search.toLowerCase()) || c.email?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleDelete = async (client) => {
    if (!confirm(`${t('deleteClientConfirm')} ${client.full_name}?`)) return;
    await base44.entities.Client.delete(client.id);
    toast.success(t('clientDeleted'));
    queryClient.invalidateQueries({ queryKey: ["clients"] });
  };

  const refresh = () => {
    setShowForm(false);
    setEditingClient(null);
    setInteractionClient(null);
    queryClient.invalidateQueries({ queryKey: ["clients"] });
    queryClient.invalidateQueries({ queryKey: ["interactions"] });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <p className="text-sm text-gray-500">{filtered.length} {t('clients')}</p>
        <Button onClick={() => setShowForm(true)} className="bg-[#0a1628] hover:bg-[#132039]">
          <Plus className="w-4 h-4 mr-2" /> {t('addClient')}
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder={t('searchClients')} className="pl-10" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('allStatuses')}</SelectItem>
            {Object.keys(statusColors).map(s => <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-48 rounded-2xl" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20"><p className="text-gray-400 text-lg">{t('noClientsFound')}</p></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(client => (
            <Card key={client.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#0a1628]/5 flex items-center justify-center">
                      <span className="font-semibold text-[#0a1628] text-sm">{client.full_name?.charAt(0)?.toUpperCase()}</span>
                    </div>
                    <div>
                      <Link to={createPageUrl(`ClientDetail?id=${client.id}`)} className="font-semibold text-[#0a1628] text-sm hover:underline">{client.full_name}</Link>
                      <Badge className={`${statusColors[client.status]} text-xs ml-2`}>{t(client.status) || client.status}</Badge>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="w-4 h-4" /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setInteractionClient(client)}><MessageSquare className="w-4 h-4 mr-2" />{t('logInteraction')}</DropdownMenuItem>
                       <DropdownMenuItem onClick={() => setEditingClient(client)}><Pencil className="w-4 h-4 mr-2" />{t('edit')}</DropdownMenuItem>
                       <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(client)}><Trash2 className="w-4 h-4 mr-2" />{t('delete')}</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="space-y-1.5 text-xs text-gray-500">
                  {client.email && <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" />{client.email}</p>}
                  {client.phone && <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" />{client.phone}</p>}
                </div>
                {(client.budget_min || client.budget_max) && (
                  <p className="text-xs text-gray-400 mt-3">{t('budget')}: €{(client.budget_min || 0).toLocaleString()} – €{(client.budget_max || 0).toLocaleString()}</p>
                )}
                {client.preferred_countries?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {client.preferred_countries.slice(0, 3).map(c => <Badge key={c} variant="outline" className="text-[10px]">{c}</Badge>)}
                    {client.preferred_countries.length > 3 && <Badge variant="outline" className="text-[10px]">+{client.preferred_countries.length - 3}</Badge>}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {(showForm || editingClient) && (
        <ClientForm client={editingClient} open={true} onClose={() => { setShowForm(false); setEditingClient(null); }} onSaved={refresh} />
      )}
      {interactionClient && (
        <InteractionForm
          clientId={interactionClient.id}
          properties={properties}
          open={true}
          onClose={() => setInteractionClient(null)}
          onSaved={() => {
            setInteractionClient(null);
            navigate(createPageUrl(`ClientDetail?id=${interactionClient.id}`));
          }}
        />
      )}
    </div>
  );
}