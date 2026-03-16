import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, X, Plus } from "lucide-react";
import { toast } from "sonner";

const COUNTRIES = ["Albania", "Bali", "Hungary", "Bulgaria", "Dominican Republic", "Egypt", "Georgia", "Mauritius", "Oman", "UAE", "Spain", "Italy", "Thailand", "Turkey"];
const STATUSES = ["lead", "active", "negotiating", "closed", "inactive"];
const SOURCES = ["website", "referral", "social_media", "portal", "walk_in", "whatsapp", "other"];
const TYPES = ["apartment", "villa", "penthouse", "studio", "townhouse", "land", "commercial"];

export default function ClientForm({ client, open, onClose, onSaved }) {
  const [form, setForm] = useState(client || {
    full_name: "", email: "", phone: "", nationality: "",
    status: "lead", source: "website", budget_min: "", budget_max: "",
    preferred_countries: [], preferred_property_types: [], assigned_agent: "", notes: ""
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const toggleArrayItem = (field, value) => {
    const arr = form[field] || [];
    handleChange(field, arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value]);
  };

  const handleSubmit = async () => {
    setSaving(true);
    const data = { ...form, budget_min: Number(form.budget_min) || undefined, budget_max: Number(form.budget_max) || undefined };
    if (client?.id) {
      await base44.entities.Client.update(client.id, data);
    } else {
      await base44.entities.Client.create(data);
    }
    toast.success(client?.id ? "Client updated" : "Client added");
    setSaving(false);
    onSaved();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{client?.id ? "Edit Client" : "New Client"}</DialogTitle></DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2"><Label>Full Name *</Label><Input value={form.full_name} onChange={e => handleChange("full_name", e.target.value)} /></div>
            <div><Label>Email</Label><Input type="email" value={form.email} onChange={e => handleChange("email", e.target.value)} /></div>
            <div><Label>Phone</Label><Input value={form.phone} onChange={e => handleChange("phone", e.target.value)} /></div>
            <div><Label>Nationality</Label><Input value={form.nationality} onChange={e => handleChange("nationality", e.target.value)} /></div>
            <div>
              <Label>Status</Label>
              <Select value={form.status} onValueChange={v => handleChange("status", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{STATUSES.map(s => <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Source</Label>
              <Select value={form.source} onValueChange={v => handleChange("source", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{SOURCES.map(s => <SelectItem key={s} value={s}>{s.replace("_"," ")}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Budget Min (€)</Label><Input type="number" value={form.budget_min} onChange={e => handleChange("budget_min", e.target.value)} /></div>
            <div><Label>Budget Max (€)</Label><Input type="number" value={form.budget_max} onChange={e => handleChange("budget_max", e.target.value)} /></div>
          </div>

          <div>
            <Label>Preferred Countries</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {COUNTRIES.map(c => (
                <button key={c} onClick={() => toggleArrayItem("preferred_countries", c)} className={`px-3 py-1 text-xs rounded-full border transition-colors ${(form.preferred_countries || []).includes(c) ? "bg-[#0a1628] text-white border-[#0a1628]" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label>Preferred Property Types</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {TYPES.map(t => (
                <button key={t} onClick={() => toggleArrayItem("preferred_property_types", t)} className={`px-3 py-1 text-xs rounded-full border transition-colors ${(form.preferred_property_types || []).includes(t) ? "bg-[#c9a84c] text-white border-[#c9a84c]" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div><Label>Notes</Label><Textarea value={form.notes} onChange={e => handleChange("notes", e.target.value)} rows={3} /></div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={saving || !form.full_name} className="bg-[#0a1628] hover:bg-[#132039]">
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {client?.id ? "Update" : "Add"} Client
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}