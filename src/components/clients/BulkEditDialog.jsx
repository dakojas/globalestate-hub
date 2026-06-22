import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useTranslation } from "@/components/LanguageContext";

const STATUSES = [
  "new_lead", "unclaimed", "claimed", "contacted", "qualified",
  "offers_sent", "viewing", "reserved", "closed", "lost"
];

export default function BulkEditDialog({ selectedIds, clients, open, onClose, onDone }) {
  const { t } = useTranslation();
  const [status, setStatus] = useState("");
  const [agent, setAgent] = useState("");
  const [saving, setSaving] = useState(false);

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: () => base44.entities.User.list(),
  });

  const agents = users.filter(u => u.role === "admin" || u.role === "assistant" || u.role === "agent");

  useEffect(() => {
    if (open) {
      setStatus("");
      setAgent("");
    }
  }, [open]);

  const handleSave = async () => {
    if (!status && !agent) {
      toast.error("Vyberte aspoň jednu zmenu");
      return;
    }
    setSaving(true);
    try {
      const updates = selectedIds.map(id => {
        const data = { id };
        if (status) data.status = status;
        if (agent) data.assigned_agent = agent;
        return data;
      });
      await base44.entities.Client.bulkUpdate(updates);
      const count = selectedIds.length;
      toast.success(`${count} ${count === 1 ? "klient upravený" : count < 5 ? "klienti upravení" : "klientov upravených"}`);
      onDone();
    } catch (e) {
      toast.error("Chyba pri hromadnej úprave");
    } finally {
      setSaving(false);
    }
  };

  const selectedCount = selectedIds.length;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Hromadná úprava ({selectedCount} {selectedCount === 1 ? "klient" : "klientov"})</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Zmeniť status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger><SelectValue placeholder="Ponechať aktuálny" /></SelectTrigger>
              <SelectContent>
                {STATUSES.map(s => <SelectItem key={s} value={s}>{t(s) || s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Priradiť makléra</Label>
            <Select value={agent} onValueChange={setAgent}>
              <SelectTrigger><SelectValue placeholder="Ponechať aktuálneho" /></SelectTrigger>
              <SelectContent>
                {agents.map(a => <SelectItem key={a.id} value={a.email}>{a.full_name || a.email}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <p className="text-xs text-gray-400">Prázdne polia ponechajú pôvodnú hodnotu u každého klienta.</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>{t('cancel')}</Button>
          <Button onClick={handleSave} disabled={saving || (!status && !agent)} className="bg-[#0a1628] hover:bg-[#132039]">
            {saving ? "Ukladám..." : `Upraviť ${selectedCount}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}