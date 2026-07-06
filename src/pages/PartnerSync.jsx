import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Globe, Plus, Trash2, RefreshCw, Loader2, CheckCircle2,
  AlertCircle, Clock, Zap, Settings
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";

const COUNTRIES = [
  "Albania", "Bali", "Hungary", "Bulgaria", "Croatia", "Dominican Republic",
  "Egypt", "Georgia", "Mauritius", "Oman", "UAE", "Spain", "Italy", "Thailand", "Turkey"
];

export default function PartnerSync() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingPartner, setEditingPartner] = useState(null);
  const [scanningIds, setScanningIds] = useState(new Set());
  const [scanResults, setScanResults] = useState({});

  const { data: partners = [], isLoading } = useQuery({
    queryKey: ["partnerSources"],
    queryFn: () => base44.entities.PartnerSource.list(),
  });

  const handleScanNow = async (partner) => {
    setScanningIds(prev => new Set(prev).add(partner.id));
    setScanResults(prev => ({ ...prev, [partner.id]: null }));
    try {
      const response = await base44.functions.invoke("syncPartnerProperties", {
        partner_id: partner.id
      });
      const result = response.data?.results?.[0] || {};
      setScanResults(prev => ({ ...prev, [partner.id]: result }));
      if (result.error) {
        toast.error(`Chyba pri skenovaní: ${result.error}`);
      } else {
        toast.success(`Sken dokončený: ${result.new || 0} nových nehnuteľností`);
      }
      queryClient.invalidateQueries({ queryKey: ["partnerSources"] });
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    } catch (err) {
      toast.error("Chyba pri skenovaní: " + (err.message || "neznáma chyba"));
    } finally {
      setScanningIds(prev => {
        const next = new Set(prev);
        next.delete(partner.id);
        return next;
      });
    }
  };

  const handleDelete = async (partner) => {
    if (!confirm(`Naozaj zmazať ${partner.name}?`)) return;
    try {
      await base44.entities.PartnerSource.delete(partner.id);
      toast.success("Zdroj zmazaný");
      queryClient.invalidateQueries({ queryKey: ["partnerSources"] });
    } catch (err) {
      toast.error("Chyba pri mazaní");
    }
  };

  const handleToggleActive = async (partner) => {
    try {
      await base44.entities.PartnerSource.update(partner.id, {
        is_active: !partner.is_active
      });
      queryClient.invalidateQueries({ queryKey: ["partnerSources"] });
    } catch (err) {
      toast.error("Chyba pri prepínaní");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#0a1628]">Skenovanie nehnuteľností</h2>
          <p className="text-gray-500 text-sm mt-1">
            Automatické skenovanie partnerských webstránok a import nehnuteľností
          </p>
        </div>
        <Button onClick={() => { setEditingPartner(null); setShowForm(true); }}
          className="bg-[#0a1628] hover:bg-[#132039]">
          <Plus className="w-4 h-4 mr-2" />
          Pridať zdroj
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#0a1628]" />
        </div>
      ) : partners.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="py-20 text-center">
            <Globe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-4">Žiadne partnerské zdroje</p>
            <Button onClick={() => setShowForm(true)} className="bg-[#0a1628]">
              <Plus className="w-4 h-4 mr-2" /> Pridať prvý zdroj
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {partners.map(partner => {
            const isScanning = scanningIds.has(partner.id);
            const result = scanResults[partner.id];
            return (
              <Card key={partner.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Globe className="w-4 h-4 text-[#c9a84c] flex-shrink-0" />
                        <span className="truncate">{partner.name}</span>
                      </CardTitle>
                      <a href={partner.website_url} target="_blank" rel="noopener noreferrer"
                        className="text-xs text-blue-500 hover:underline truncate block mt-1">
                        {partner.website_url}
                      </a>
                    </div>
                    <Badge variant={partner.is_active ? "default" : "secondary"} className="text-xs flex-shrink-0">
                      {partner.is_active ? "Aktívny" : "Pozastavený"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Settings row */}
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-xs text-gray-500">Frekvencia:</span>
                      <span className="font-semibold text-xs">{partner.frequency_days || 7}d</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-xs text-gray-500">Auto-zverejnenie:</span>
                      <span className="font-semibold text-xs">{partner.auto_publish ? "Áno" : "Nie"}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-xs text-gray-500">Krajina:</span>
                      <span className="font-semibold text-xs truncate">{partner.default_country || "—"}</span>
                    </div>
                  </div>

                  {/* Last sync info */}
                  {partner.last_synced && (
                    <div className="bg-gray-50 rounded-lg p-3 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Posledný sken:</span>
                        <span className="font-medium">
                          {new Date(partner.last_synced).toLocaleString("sk-SK", {
                            day: "2-digit", month: "2-digit", year: "numeric",
                            hour: "2-digit", minute: "2-digit"
                          })}
                        </span>
                      </div>
                      {partner.last_result && (
                        <p className="text-xs text-gray-600">{partner.last_result}</p>
                      )}
                      {partner.last_sync_total != null && (
                        <div className="flex gap-3 pt-1">
                          <span className="text-xs text-green-600 font-medium">Nové: {partner.last_sync_new ?? 0}</span>
                          <span className="text-xs text-blue-600 font-medium">Celkom: {partner.last_sync_total}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Scan result (from this session) */}
                  {result && (
                    <div className={`rounded-lg p-3 text-xs ${
                      result.error ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
                    }`}>
                      {result.error ? (
                        <span className="flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4" /> Chyba: {result.error}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" />
                          Nájdených: {result.found} | Nových: {result.new} | Preskočených: {result.skipped}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-1">
                    <Button
                      size="sm"
                      onClick={() => handleScanNow(partner)}
                      disabled={isScanning}
                      className="flex-1 bg-[#c9a84c] hover:bg-[#b8963f] text-white"
                    >
                      {isScanning ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                          Skenujem...
                        </>
                      ) : (
                        <>
                          <Zap className="w-3.5 h-3.5 mr-1.5" />
                          Skenovať teraz
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleActive(partner)}
                      title={partner.is_active ? "Pozastaviť" : "Aktivovať"}
                    >
                      {partner.is_active ? <Clock className="w-3.5 h-3.5" /> : <RefreshCw className="w-3.5 h-3.5" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => { setEditingPartner(partner); setShowForm(true); }}
                    >
                      <Settings className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(partner)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {showForm && (
        <PartnerSourceForm
          partner={editingPartner}
          onClose={() => { setShowForm(false); setEditingPartner(null); }}
          onSaved={() => {
            setShowForm(false);
            setEditingPartner(null);
            queryClient.invalidateQueries({ queryKey: ["partnerSources"] });
          }}
        />
      )}
    </div>
  );
}

function PartnerSourceForm({ partner, onClose, onSaved }) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: partner?.name || "",
    website_url: partner?.website_url || "",
    frequency_days: partner?.frequency_days || 7,
    auto_publish: partner?.auto_publish ?? false,
    default_country: partner?.default_country || "Turkey",
    is_active: partner?.is_active ?? true,
  });

  const handleSave = async () => {
    if (!form.name || !form.website_url) {
      toast.error("Názov a URL sú povinné");
      return;
    }
    setSaving(true);
    try {
      if (partner) {
        await base44.entities.PartnerSource.update(partner.id, form);
        toast.success("Zdroj aktualizovaný");
      } else {
        await base44.entities.PartnerSource.create(form);
        toast.success("Zdroj pridaný");
      }
      onSaved();
    } catch (err) {
      toast.error("Chyba pri ukladaní: " + (err.message || ""));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{partner ? "Upraviť zdroj" : "Pridať partnerský zdroj"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <Label>Názov partnera / vývojára *</Label>
            <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="Napr. Kale Tazar" />
          </div>
          <div>
            <Label>URL stránky s nehnuteľnosťami *</Label>
            <Input value={form.website_url} onChange={e => setForm({ ...form, website_url: e.target.value })}
              placeholder="https://example.com/properties" />
            <p className="text-xs text-gray-400 mt-1">
              URL stránky, kde sa nachádzajú ponuky nehnuteľností
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Frekvencia skenovania (dni)</Label>
              <Input type="number" min={1} value={form.frequency_days}
                onChange={e => setForm({ ...form, frequency_days: parseInt(e.target.value) || 7 })} />
            </div>
            <div>
              <Label>Predvolená krajina</Label>
              <select
                value={form.default_country}
                onChange={e => setForm({ ...form, default_country: e.target.value })}
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="auto_publish" checked={form.auto_publish}
              onChange={e => setForm({ ...form, auto_publish: e.target.checked })}
              className="w-4 h-4" />
            <Label htmlFor="auto_publish" className="cursor-pointer">
              Automaticky zverejniť importované nehnuteľnosti
            </Label>
          </div>
          {!form.auto_publish && (
            <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
              Nezverejnené nehnuteľnosti budú čakať na schválenie v sekcii Properties.
            </p>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>Zrušiť</Button>
          <Button onClick={handleSave} disabled={saving}
            className="bg-[#0a1628] hover:bg-[#132039]">
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            {partner ? "Uložiť zmeny" : "Pridať zdroj"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}