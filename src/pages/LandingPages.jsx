import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Copy, Check, Pencil, Trash2, Users, ArrowLeft, Megaphone } from "lucide-react";
import { toast } from "sonner";
import LandingPageEditor from "@/components/landing/LandingPageEditor";

export default function LandingPages() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [viewingLeads, setViewingLeads] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const { data: pages = [], isLoading } = useQuery({
    queryKey: ["landing-pages"],
    queryFn: () => base44.entities.LandingPage.list("-created_date", 100),
  });

  const { data: leads = [] } = useQuery({
    queryKey: ["landing-leads"],
    queryFn: () => base44.entities.LandingPageLead.list("-created_date", 500),
  });

  if (editing) {
    return <LandingPageEditor page={editing === "new" ? null : editing} onBack={() => setEditing(null)} />;
  }

  if (viewingLeads) {
    const pageLeads = leads.filter(l => l.landing_page_id === viewingLeads.id);
    return (
      <div className="space-y-6">
        <button onClick={() => setViewingLeads(null)} className="flex items-center gap-1.5 text-gray-500 hover:text-[#0a1628] text-sm">
          <ArrowLeft className="w-4 h-4" /> Späť na zoznam
        </button>
        <div>
          <h2 className="text-2xl font-bold text-[#0a1628]">Leads — {viewingLeads.title}</h2>
          <p className="text-gray-500 text-sm">{pageLeads.length} leadov</p>
        </div>
        {pageLeads.length === 0 ? (
          <div className="text-center py-20 text-gray-400">Zatiaľ žiadne leads</div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-3 font-semibold text-gray-600">Meno</th>
                  <th className="text-left p-3 font-semibold text-gray-600">Email</th>
                  <th className="text-left p-3 font-semibold text-gray-600">Telefón</th>
                  <th className="text-left p-3 font-semibold text-gray-600">Správa</th>
                  <th className="text-left p-3 font-semibold text-gray-600">Dátum</th>
                </tr>
              </thead>
              <tbody>
                {pageLeads.map(l => (
                  <tr key={l.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="p-3 font-medium text-[#0a1628] whitespace-nowrap">{l.full_name}</td>
                    <td className="p-3 text-gray-600 whitespace-nowrap">{l.email || "—"}</td>
                    <td className="p-3 text-gray-600 whitespace-nowrap">{l.phone || "—"}</td>
                    <td className="p-3 text-gray-500 max-w-xs truncate">{l.message || "—"}</td>
                    <td className="p-3 text-gray-400 text-xs whitespace-nowrap">{new Date(l.created_date).toLocaleDateString("sk-SK")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  const copyLink = (page) => {
    navigator.clipboard.writeText(`${window.location.origin}/ponuka/${page.slug}`);
    setCopiedId(page.id);
    setTimeout(() => setCopiedId(null), 2000);
    toast.success("Link skopírovaný");
  };

  const handleDelete = async (id) => {
    if (!confirm("Naozaj vymazať túto landing page?")) return;
    await base44.entities.LandingPage.delete(id);
    queryClient.invalidateQueries({ queryKey: ["landing-pages"] });
    toast.success("Vymazané");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#0a1628]">Landing Pages</h2>
          <p className="text-gray-500 text-sm">Vytvárajte špeciálne ponuky pre klientov a zbierajte leads</p>
        </div>
        <Button onClick={() => setEditing("new")} className="bg-[#0a1628] hover:bg-[#132039]">
          <Plus className="w-4 h-4 mr-2" /> Nová landing page
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-40 rounded-2xl" />)}
        </div>
      ) : pages.length === 0 ? (
        <div className="text-center py-20">
          <Megaphone className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400">Zatiaľ žiadne landing pages</p>
          <Button onClick={() => setEditing("new")} className="mt-4 bg-[#0a1628] hover:bg-[#132039]">
            <Plus className="w-4 h-4 mr-2" /> Vytvoriť prvú
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {pages.map(page => {
            const leadCount = leads.filter(l => l.landing_page_id === page.id).length;
            return (
              <div key={page.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-[#0a1628] truncate">{page.title}</h3>
                    <p className="text-xs text-gray-400 truncate">/ponuka/{page.slug}</p>
                  </div>
                  <Badge variant={page.is_active ? "default" : "secondary"} className={page.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}>
                    {page.is_active ? "Aktívna" : "Neaktívna"}
                  </Badge>
                </div>
                {page.headline && <p className="text-sm text-gray-600 truncate">{page.headline}</p>}
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span>{page.property_ids?.length || 0} nehnuteľností</span>
                  <span>·</span>
                  <span>{page.show_lead_form ? "Formulár aktívny" : "Bez formulára"}</span>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t">
                  <Button size="sm" variant="outline" onClick={() => copyLink(page)} className="flex-1">
                    {copiedId === page.id ? <Check className="w-4 h-4 mr-1 text-green-600" /> : <Copy className="w-4 h-4 mr-1" />}
                    {copiedId === page.id ? "Skopírované" : "Link"}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setViewingLeads(page)}>
                    <Users className="w-4 h-4 mr-1" /> {leadCount}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setEditing(page)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(page.id)} className="text-red-500 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}