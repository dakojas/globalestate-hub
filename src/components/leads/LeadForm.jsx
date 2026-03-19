import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const SOURCES = [
  { value: "website", label: "🌐 Web", color: "bg-green-50 border-green-200" },
  { value: "facebook", label: "📘 Facebook", color: "bg-blue-50 border-blue-200" },
  { value: "instagram", label: "📸 Instagram", color: "bg-pink-50 border-pink-200" },
  { value: "referrer", label: "🤝 Tiper", color: "bg-purple-50 border-purple-200" },
  { value: "partner", label: "🏢 Partner", color: "bg-amber-50 border-amber-200" },
  { value: "real_estate_agency", label: "🏠 Realitná kancelária", color: "bg-teal-50 border-teal-200" },
];

export default function LeadForm({ open, onClose, onSaved }) {
  const [form, setForm] = useState({
    full_name: "", email: "", phone: "", lead_source: "", notes: "",
    budget_min: "", budget_max: "",
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    if (!form.full_name) return toast.error("Zadajte meno klienta");
    setSaving(true);
    await base44.entities.Client.create({
      ...form,
      status: "new_lead",
      budget_min: Number(form.budget_min) || undefined,
      budget_max: Number(form.budget_max) || undefined,
    });
    toast.success("Lead vytvorený");
    setSaving(false);
    onSaved();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nový lead</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div>
            <Label>Meno a priezvisko *</Label>
            <Input value={form.full_name} onChange={e => handleChange("full_name", e.target.value)} placeholder="Ján Novák" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Email</Label>
              <Input type="email" value={form.email} onChange={e => handleChange("email", e.target.value)} placeholder="jan@email.sk" />
            </div>
            <div>
              <Label>Telefón</Label>
              <Input type="tel" value={form.phone} onChange={e => handleChange("phone", e.target.value)} placeholder="+421..." />
            </div>
          </div>

          <div>
            <Label className="mb-2 block">Odkiaľ prišiel lead *</Label>
            <div className="grid grid-cols-2 gap-2">
              {SOURCES.map(s => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => handleChange("lead_source", s.value)}
                  className={`px-3 py-2.5 rounded-lg border-2 text-sm font-medium text-left transition-all ${
                    form.lead_source === s.value
                      ? `${s.color} border-current scale-[1.02] shadow-sm`
                      : "bg-gray-50 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Budget min (€)</Label>
              <Input type="number" value={form.budget_min} onChange={e => handleChange("budget_min", e.target.value)} placeholder="0" />
            </div>
            <div>
              <Label>Budget max (€)</Label>
              <Input type="number" value={form.budget_max} onChange={e => handleChange("budget_max", e.target.value)} placeholder="0" />
            </div>
          </div>

          <div>
            <Label>Poznámka</Label>
            <Textarea value={form.notes} onChange={e => handleChange("notes", e.target.value)} rows={3} placeholder="Záujem o..." />
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t">
            <Button variant="outline" onClick={onClose}>Zrušiť</Button>
            <Button onClick={handleSubmit} disabled={saving || !form.full_name || !form.lead_source} className="bg-[#0a1628] hover:bg-[#132039]">
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Vytvoriť lead
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}