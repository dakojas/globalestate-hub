import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, DollarSign, TrendingUp, Clock, CheckCircle2, Loader2, Pencil } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

const statusColors = {
  pending: "bg-amber-50 text-amber-700",
  invoiced: "bg-blue-50 text-blue-700",
  paid: "bg-emerald-50 text-emerald-700",
};

export default function Commissions() {
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingCommission, setEditingCommission] = useState(null);
  const [editValues, setEditValues] = useState({ commission_amount: "", commission_rate: "", sale_price: "" });
  const queryClient = useQueryClient();

  const { data: currentUser } = useQuery({
    queryKey: ["current-user"],
    queryFn: () => base44.auth.me(),
  });
  const isAdmin = currentUser?.role === "admin";

  const { data: commissions = [], isLoading } = useQuery({
    queryKey: ["commissions"],
    queryFn: () => base44.entities.Commission.list("-deal_date", 200),
  });

  const { data: properties = [] } = useQuery({
    queryKey: ["properties"],
    queryFn: () => base44.entities.Property.list("-created_date", 200),
  });

  const { data: clients = [] } = useQuery({
    queryKey: ["clients"],
    queryFn: () => base44.entities.Client.list("-created_date", 200),
  });

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: () => base44.entities.User.list(),
  });

  const [form, setForm] = useState({
    property_id: "", client_id: "", sale_price: "", commission_rate: "",
    commission_amount: "", status: "pending", deal_date: new Date().toISOString().slice(0, 10),
    property_title: "", client_name: "", agent_email: "", notes: "",
    referrer_share: 0, company_share: 100, country: "", commission_type: "percentage",
  });

  const countries = [...new Set(properties.map(p => p.country).filter(Boolean))].sort();
  const filteredProperties = form.country
    ? properties.filter(p => p.country === form.country)
    : properties;

  const handleCountryChange = (country) => {
    setForm(f => ({ ...f, country, property_id: "", property_title: "", commission_rate: "" }));
  };

  const totalEarned = commissions.filter(c => c.status === "paid").reduce((s, c) => s + (c.commission_amount || 0), 0);
  const totalPending = commissions.filter(c => c.status !== "paid").reduce((s, c) => s + (c.commission_amount || 0), 0);
  const dealCount = commissions.length;

  const handlePropertyChange = (id) => {
    const prop = properties.find(p => p.id === id);
    setForm(f => ({
      ...f, property_id: id,
      property_title: prop?.title || "",
      commission_rate: prop?.commission_rate || prop?.company_commission || f.commission_rate,
    }));
  };

  const handleClientChange = (id) => {
    const cl = clients.find(c => c.id === id);
    const prop = properties.find(p => p.id === form.property_id);
    
    // Calculate referrer/company split
    let referrerShare = 0;
    let companyShare = 100;
    
    if (cl?.lead_source === "referrer" && prop?.referrer_commission) {
      referrerShare = prop.referrer_commission;
      companyShare = 100 - referrerShare;
    }
    
    setForm(f => ({ 
      ...f, 
      client_id: id, 
      client_name: cl?.full_name || "",
      agent_email: cl?.assigned_agent || cl?.claimed_by || "",
      referrer_share: referrerShare,
      company_share: companyShare,
    }));
  };

  const calcCommission = () => {
    if (form.commission_type === "absolute") {
      return Number(form.commission_amount) || 0;
    }
    const price = Number(form.sale_price) || 0;
    const rate = Number(form.commission_rate) || 0;
    return Math.round(price * rate / 100);
  };

  const calcReferrerAmount = () => {
    const total = calcCommission();
    const share = Number(form.referrer_share) || 0;
    return Math.round(total * share / 100);
  };

  const calcCompanyAmount = () => {
    return calcCommission() - calcReferrerAmount();
  };

  const handleSubmit = async () => {
    setSaving(true);
    await base44.entities.Commission.create({
      ...form,
      sale_price: Number(form.sale_price),
      commission_rate: Number(form.commission_rate),
      commission_amount: calcCommission(),
    });
    toast.success("Commission recorded");
    setSaving(false);
    setShowForm(false);
    setForm({ property_id: "", client_id: "", sale_price: "", commission_rate: "", commission_amount: "", status: "pending", deal_date: new Date().toISOString().slice(0, 10), property_title: "", client_name: "", notes: "" });
    queryClient.invalidateQueries({ queryKey: ["commissions"] });
  };

  const handleEditSave = async () => {
    setSaving(true);
    await base44.entities.Commission.update(editingCommission.id, {
      commission_amount: Number(editValues.commission_amount),
      commission_rate: Number(editValues.commission_rate),
      sale_price: Number(editValues.sale_price),
    });
    toast.success("Provízia aktualizovaná");
    setSaving(false);
    setEditingCommission(null);
    queryClient.invalidateQueries({ queryKey: ["commissions"] });
  };

  const updateStatus = async (id, status) => {
    await base44.entities.Commission.update(id, { status, ...(status === "paid" ? { payment_date: new Date().toISOString().slice(0, 10) } : {}) });
    toast.success("Status updated");
    queryClient.invalidateQueries({ queryKey: ["commissions"] });
  };

  return (
    <div className="space-y-6">
      {/* Stats – visible to all */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center"><DollarSign className="w-6 h-6 text-emerald-600" /></div>
              <div><p className="text-xs text-gray-400 uppercase tracking-wider">Earned</p><p className="text-2xl font-bold text-[#0a1628]">€{totalEarned.toLocaleString()}</p></div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center"><Clock className="w-6 h-6 text-amber-600" /></div>
              <div><p className="text-xs text-gray-400 uppercase tracking-wider">Pending</p><p className="text-2xl font-bold text-[#0a1628]">€{totalPending.toLocaleString()}</p></div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center"><TrendingUp className="w-6 h-6 text-blue-600" /></div>
              <div><p className="text-xs text-gray-400 uppercase tracking-wider">Total Deals</p><p className="text-2xl font-bold text-[#0a1628]">{dealCount}</p></div>
            </CardContent>
          </Card>
        </div>

      <div className="flex justify-end">
        {isAdmin && (
          <Button onClick={() => setShowForm(true)} className="bg-[#0a1628] hover:bg-[#132039]">
            <Plus className="w-4 h-4 mr-2" /> Record Commission
          </Button>
        )}
      </div>

      {/* Table */}
      {isLoading ? (
        <Skeleton className="h-64 rounded-2xl" />
      ) : (
        <Card className="border-0 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Property</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Sale Price</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Commission</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                  </TableRow>
              </TableHeader>
              <TableBody>
                {commissions.length === 0 ? (
                  <TableRow><TableCell colSpan={7} className="text-center text-gray-400 py-8">No commissions yet</TableCell></TableRow>
                ) : commissions.map(c => (
                  <TableRow key={c.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium text-sm">{c.property_title || "—"}</TableCell>
                    <TableCell className="text-sm">{c.client_name || "—"}</TableCell>
                    <TableCell className="text-sm">€{c.sale_price?.toLocaleString()}</TableCell>
                    <TableCell className="text-sm">{c.commission_rate}%</TableCell>
                    <TableCell className="font-semibold text-sm text-[#c9a84c]">€{c.commission_amount?.toLocaleString()}</TableCell>
                    <TableCell className="text-sm text-gray-500">{c.deal_date ? format(new Date(c.deal_date), "MMM d, yyyy") : "—"}</TableCell>
                    <TableCell>
                      <button onClick={() => { setEditingCommission(c); setEditValues({ commission_amount: c.commission_amount || "", commission_rate: c.commission_rate || "", sale_price: c.sale_price || "" }); }} className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-[#0a1628]">
                        <Pencil className="w-4 h-4" />
                      </button>
                    </TableCell>
                    <TableCell>
                     <Select value={c.status} onValueChange={v => updateStatus(c.id, v)}>
                        <SelectTrigger className="w-28 h-8"><Badge className={`${statusColors[c.status]} text-xs`}>{c.status}</Badge></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="invoiced">Invoiced</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Record Commission</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label>Krajina</Label>
              <Select value={form.country} onValueChange={handleCountryChange}>
                <SelectTrigger><SelectValue placeholder="Vybrať krajinu" /></SelectTrigger>
                <SelectContent>
                  {countries.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Projekt / Nehnuteľnosť</Label>
              <Select value={form.property_id} onValueChange={handlePropertyChange} disabled={!form.country}>
                <SelectTrigger><SelectValue placeholder={form.country ? "Vybrať projekt" : "Najprv vybrať krajinu"} /></SelectTrigger>
                <SelectContent>
                  {filteredProperties.map(p => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.title}{p.project_name ? ` — ${p.project_name}` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Client</Label>
              <Select value={form.client_id} onValueChange={handleClientChange}>
                <SelectTrigger><SelectValue placeholder="Select client" /></SelectTrigger>
                <SelectContent>{clients.map(c => <SelectItem key={c.id} value={c.id}>{c.full_name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Sale Price (€)</Label>
              <Input type="number" value={form.sale_price} onChange={e => setForm(f => ({ ...f, sale_price: e.target.value }))} />
            </div>
            <div>
              <Label>Typ provízie</Label>
              <Select value={form.commission_type} onValueChange={v => setForm(f => ({ ...f, commission_type: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentuálna (%)</SelectItem>
                  <SelectItem value="absolute">Absolútna hodnota (€)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {form.commission_type === "percentage" ? (
              <div>
                <Label>Sadzba provízie (%)</Label>
                <Input type="number" step="0.1" value={form.commission_rate} onChange={e => setForm(f => ({ ...f, commission_rate: e.target.value }))} />
              </div>
            ) : (
              <div>
                <Label>Výška provízie (€)</Label>
                <Input type="number" value={form.commission_amount} onChange={e => setForm(f => ({ ...f, commission_amount: e.target.value }))} />
              </div>
            )}
            {form.sale_price && (form.commission_rate || form.commission_amount) && (
              <div className="space-y-3">
                <div className="bg-[#c9a84c]/10 rounded-xl p-4">
                  <p className="text-xs text-gray-500 text-center mb-1">Celková provízia</p>
                  <p className="text-2xl font-bold text-[#c9a84c] text-center">€{calcCommission().toLocaleString()}</p>
                </div>
                {form.referrer_share > 0 && (
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-purple-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">Referrer ({form.referrer_share}%)</p>
                      <p className="font-bold text-purple-700">€{calcReferrerAmount().toLocaleString()}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">Firma ({form.company_share}%)</p>
                      <p className="font-bold text-green-700">€{calcCompanyAmount().toLocaleString()}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
            <div><Label>Deal Date</Label><Input type="date" value={form.deal_date} onChange={e => setForm(f => ({ ...f, deal_date: e.target.value }))} /></div>
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button onClick={handleSubmit} disabled={saving || !form.sale_price || (form.commission_type === "percentage" ? !form.commission_rate : !form.commission_amount)} className="bg-[#0a1628] hover:bg-[#132039]">
                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}