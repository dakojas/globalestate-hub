import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Search, Building2, Phone, Mail, Globe, Edit2, Loader2 } from "lucide-react";
import { toast } from "sonner";

function AgencyForm({ agency, open, onClose, onSaved }) {
  const [form, setForm] = useState(agency || {
    name: "", contact_person: "", email: "", phone: "",
    city: "", country: "", website: "", commission_rate: "",
    status: "active", notes: ""
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    if (!form.name) return toast.error("Zadajte názov kancelárie");
    setSaving(true);
    const data = { ...form, commission_rate: Number(form.commission_rate) || undefined };
    if (agency?.id) {
      await base44.entities.RealEstateAgency.update(agency.id, data);
    } else {
      await base44.entities.RealEstateAgency.create(data);
    }
    toast.success(agency?.id ? "Kancelária aktualizovaná" : "Kancelária pridaná");
    setSaving(false);
    onSaved();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{agency?.id ? "Upraviť kanceláriu" : "Nová realitná kancelária"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div>
            <Label>Názov kancelárie *</Label>
            <Input value={form.name} onChange={e => handleChange("name", e.target.value)} placeholder="Realitná kancelária XY" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Kontaktná osoba</Label>
              <Input value={form.contact_person} onChange={e => handleChange("contact_person", e.target.value)} placeholder="Meno" />
            </div>
            <div>
              <Label>Telefón</Label>
              <Input value={form.phone} onChange={e => handleChange("phone", e.target.value)} placeholder="+421..." />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Email</Label>
              <Input type="email" value={form.email} onChange={e => handleChange("email", e.target.value)} placeholder="info@..." />
            </div>
            <div>
              <Label>Web</Label>
              <Input value={form.website} onChange={e => handleChange("website", e.target.value)} placeholder="https://..." />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Mesto</Label>
              <Input value={form.city} onChange={e => handleChange("city", e.target.value)} placeholder="Bratislava" />
            </div>
            <div>
              <Label>Krajina</Label>
              <Input value={form.country} onChange={e => handleChange("country", e.target.value)} placeholder="Slovensko" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Dohodnutá provízia (%)</Label>
              <Input type="number" value={form.commission_rate} onChange={e => handleChange("commission_rate", e.target.value)} placeholder="0" />
            </div>
            <div>
              <Label>Status</Label>
              <Select value={form.status} onValueChange={v => handleChange("status", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Aktívna</SelectItem>
                  <SelectItem value="inactive">Neaktívna</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Podmienky spolupráce / poznámky</Label>
            <Textarea
              value={form.notes}
              onChange={e => handleChange("notes", e.target.value)}
              rows={4}
              placeholder="Popis dohodnutých podmienok, provízií, spôsobu spolupráce..."
            />
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t">
            <Button variant="outline" onClick={onClose}>Zrušiť</Button>
            <Button onClick={handleSubmit} disabled={saving || !form.name} className="bg-[#0a1628] hover:bg-[#132039]">
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {agency?.id ? "Uložiť" : "Pridať kanceláriu"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function RealEstateAgencies() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");

  const { data: agencies = [], isLoading } = useQuery({
    queryKey: ["real-estate-agencies"],
    queryFn: () => base44.entities.RealEstateAgency.list("-created_date", 200),
  });

  const filtered = agencies.filter(a =>
    !search ||
    a.name?.toLowerCase().includes(search.toLowerCase()) ||
    a.city?.toLowerCase().includes(search.toLowerCase()) ||
    a.contact_person?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSaved = () => {
    setShowForm(false);
    setEditing(null);
    queryClient.invalidateQueries({ queryKey: ["real-estate-agencies"] });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#0a1628]">Realitné kancelárie</h2>
          <p className="text-gray-500 text-sm mt-1">Partneri – realitné kancelárie prinášajúce klientov</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-[#0a1628] hover:bg-[#132039]">
          <Plus className="w-4 h-4 mr-2" /> Pridať kanceláriu
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs text-gray-500 uppercase mb-1">Celkom</p>
            <p className="text-2xl font-bold text-[#0a1628]">{agencies.length}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs text-gray-500 uppercase mb-1">Aktívne</p>
            <p className="text-2xl font-bold text-green-600">{agencies.filter(a => a.status === "active").length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Hľadať kanceláriu..." className="pl-10" />
      </div>

      {/* List */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="h-48 bg-gray-100 rounded-2xl animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Žiadne realitné kancelárie</p>
          <Button onClick={() => setShowForm(true)} className="mt-4 bg-[#0a1628] hover:bg-[#132039]">
            <Plus className="w-4 h-4 mr-2" /> Pridať prvú kanceláriu
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(agency => (
            <Card key={agency.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-teal-600" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{agency.name}</CardTitle>
                      {agency.city && <p className="text-xs text-gray-500">{agency.city}{agency.country ? `, ${agency.country}` : ""}</p>}
                    </div>
                  </div>
                  <Badge variant={agency.status === "active" ? "default" : "secondary"} className="text-xs">
                    {agency.status === "active" ? "Aktívna" : "Neaktívna"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {agency.contact_person && (
                  <p className="text-sm text-gray-700 font-medium">{agency.contact_person}</p>
                )}
                <div className="space-y-1.5 text-sm text-gray-500">
                  {agency.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5" /><span>{agency.phone}</span>
                    </div>
                  )}
                  {agency.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5" /><span className="truncate">{agency.email}</span>
                    </div>
                  )}
                  {agency.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="w-3.5 h-3.5" />
                      <a href={agency.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate">
                        {agency.website.replace(/^https?:\/\//, "")}
                      </a>
                    </div>
                  )}
                </div>
                {agency.commission_rate ? (
                  <p className="text-sm"><span className="text-gray-500">Provízia:</span> <span className="font-semibold text-[#c9a84c]">{agency.commission_rate}%</span></p>
                ) : null}
                {agency.notes && (
                  <div className="pt-2 border-t">
                    <p className="text-xs text-gray-500 mb-1">Podmienky spolupráce:</p>
                    <p className="text-xs text-gray-600 line-clamp-3 whitespace-pre-wrap">{agency.notes}</p>
                  </div>
                )}
                <div className="pt-2">
                  <Button size="sm" variant="outline" onClick={() => setEditing(agency)} className="w-full">
                    <Edit2 className="w-3.5 h-3.5 mr-1.5" /> Upraviť
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {(showForm || editing) && (
        <AgencyForm
          agency={editing}
          open={true}
          onClose={() => { setShowForm(false); setEditing(null); }}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}