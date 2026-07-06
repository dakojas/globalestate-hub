import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe, Plus, RefreshCw, Trash2, Pencil, Bot, CheckCircle2, Clock } from "lucide-react";
import { toast } from "react-hot-toast";

const COUNTRIES = ["Albania", "Bali", "Hungary", "Bulgaria", "Croatia", "Dominican Republic", "Egypt", "Georgia", "Mauritius", "Oman", "UAE", "Spain", "Italy", "Thailand", "Turkey"];

export default function PartnerSync() {
  const qc = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [syncing, setSyncing] = useState(null);
  const [form, setForm] = useState({ name: "", website_url: "", frequency_days: 7, default_country: "Turkey", auto_publish: false });

  const { data: partners = [], isLoading } = useQuery({
    queryKey: ["partner-sources"],
    queryFn: () => base44.entities.PartnerSource.list("-created_date", 50),
  });

  const openNew = () => {
    setEditing(null);
    setForm({ name: "", website_url: "", frequency_days: 7, default_country: "Turkey", auto_publish: false });
    setDialogOpen(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setForm({
      name: p.name || "",
      website_url: p.website_url || "",
      frequency_days: p.frequency_days || 7,
      default_country: p.default_country || "Turkey",
      auto_publish: p.auto_publish || false,
    });
    setDialogOpen(true);
  };

  const save = async () => {
    if (!form.name || !form.website_url) {
      toast.error("Vyplňte názov a URL");
      return;
    }
    try {
      if (editing) {
        await base44.entities.PartnerSource.update(editing.id, form);
        toast.success("Partner aktualizovaný");
      } else {
        await base44.entities.PartnerSource.create({ ...form, is_active: true });
        toast.success("Partner pridaný");
      }
      setDialogOpen(false);
      qc.invalidateQueries({ queryKey: ["partner-sources"] });
    } catch (e) {
      toast.error("Chyba pri ukladaní");
    }
  };

  const toggleActive = async (p) => {
    await base44.entities.PartnerSource.update(p.id, { is_active: !p.is_active });
    qc.invalidateQueries({ queryKey: ["partner-sources"] });
  };

  const toggleAutoPublish = async (p) => {
    await base44.entities.PartnerSource.update(p.id, { auto_publish: !p.auto_publish });
    qc.invalidateQueries({ queryKey: ["partner-sources"] });
  };

  const remove = async (p) => {
    if (!confirm(`Naozaj zmazať partnera "${p.name}"?`)) return;
    await base44.entities.PartnerSource.delete(p.id);
    qc.invalidateQueries({ queryKey: ["partner-sources"] });
    toast.success("Partner zmazaný");
  };

  const syncNow = async (p) => {
    setSyncing(p.id);
    try {
      const res = await base44.functions.invoke("syncPartnerProperties", { partner_id: p.id });
      const r = res.data?.results?.[0];
      if (r?.error) {
        toast.error(`${p.name}: ${r.error}`);
      } else if (r?.skipped === 'not due yet') {
        toast(`${p.name}: zatiaľ nesynchronizovaný (manuálne spustené)`);
      } else {
        toast.success(`${p.name}: ${r?.new || 0} nových, ${r?.skipped || 0} preskočených`);
      }
      qc.invalidateQueries({ queryKey: ["partner-sources"] });
      qc.invalidateQueries({ queryKey: ["properties"] });
    } catch (e) {
      toast.error("Synchronizácia zlyhala");
    }
    setSyncing(null);
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-[#c9a84c]/15 flex items-center justify-center">
            <Bot className="w-5 h-5 text-[#c9a84c]" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">AI synchronizácia partnerov</h3>
            <p className="text-xs text-gray-500">Automatický import projektov zo stránok partnerov</p>
          </div>
        </div>
        <Button size="sm" onClick={openNew} className="bg-[#c9a84c] hover:bg-[#b8973f] text-[#0a1628]">
          <Plus className="w-4 h-4 mr-1" /> Partner
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-gray-400 text-sm">Načítavam...</div>
      ) : partners.length === 0 ? (
        <div className="text-center py-8">
          <Globe className="w-10 h-10 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-400 text-sm">Zatiaľ žiadny partner. Pridajte URL stránky s projektmi.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {partners.map(p => (
            <div key={p.id} className="border border-gray-100 rounded-xl p-3.5 hover:border-gray-200 transition-colors">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900 text-sm truncate">{p.name}</p>
                    {p.is_active ? (
                      <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Aktívny
                      </span>
                    ) : (
                      <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">Pozastavený</span>
                    )}
                  </div>
                  <a href={p.website_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline truncate block max-w-full">
                    {p.website_url}
                  </a>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => syncNow(p)} disabled={syncing === p.id}
                    className="p-1.5 rounded-lg text-[#c9a84c] hover:bg-[#c9a84c]/10 disabled:opacity-50" title="Synchronizovať teraz">
                    <RefreshCw className={`w-4 h-4 ${syncing === p.id ? 'animate-spin' : ''}`} />
                  </button>
                  <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100" title="Upraviť">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => remove(p)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-50" title="Zmazať">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Cada {p.frequency_days || 7} dní
                </span>
                {p.last_synced && (
                  <span>Posledná sync: {new Date(p.last_synced).toLocaleDateString('sk-SK', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                )}
                {p.last_sync_new > 0 && (
                  <span className="text-green-600 font-medium">+{p.last_sync_new} nových</span>
                )}
              </div>

              {p.last_result && (
                <p className="text-xs text-gray-400 mt-1.5 italic">{p.last_result}</p>
              )}

              <div className="flex items-center gap-5 mt-2.5 pt-2.5 border-t border-gray-50">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Switch checked={p.is_active || false} onCheckedChange={() => toggleActive(p)} />
                  <span className="text-xs text-gray-600">Aktívny</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Switch checked={p.auto_publish || false} onCheckedChange={() => toggleAutoPublish(p)} />
                  <span className="text-xs text-gray-600">Auto-publikovať</span>
                </label>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Upraviť partnera" : "Pridať partnera"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Názov partnera / developera</label>
              <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Napr. Kaleta Zadar" />
            </div>
            <div>
              <label className="text-xs text-gray-600 mb-1 block">URL stránky s projektmi</label>
              <Input value={form.website_url} onChange={e => setForm({ ...form, website_url: e.target.value })} placeholder="https://partner.sk/projekty" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-600 mb-1 block">Frekvencia (dni)</label>
                <Input type="number" min={1} value={form.frequency_days} onChange={e => setForm({ ...form, frequency_days: Number(e.target.value) })} />
              </div>
              <div>
                <label className="text-xs text-gray-600 mb-1 block">Predvolená krajina</label>
                <Select value={form.default_country} onValueChange={v => setForm({ ...form, default_country: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <Switch checked={form.auto_publish} onCheckedChange={v => setForm({ ...form, auto_publish: v })} />
              <span className="text-sm text-gray-700">Auto-publikovať importované nehnuteľnosti (inak čaká na schválenie)</span>
            </label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Zrušiť</Button>
            <Button onClick={save} className="bg-[#c9a84c] hover:bg-[#b8973f] text-[#0a1628]">{editing ? "Uložiť" : "Pridať"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}