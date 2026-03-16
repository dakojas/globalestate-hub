import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";

export default function ReferrerForm({ referrer, open, onClose, onSaved, generateCode }) {
  const [formData, setFormData] = useState(referrer || {
    full_name: "",
    email: "",
    phone: "",
    role: "referrer",
    commission_rate: 20,
    referrer_code: generateCode(),
    is_active: true,
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (referrer) {
        await base44.entities.User.update(referrer.id, formData);
        toast.success("Tiper aktualizovaný");
      } else {
        // Note: In production, you'd use base44.users.inviteUser
        await base44.entities.User.create(formData);
        toast.success("Tiper pridaný");
      }
      onSaved();
    } catch (error) {
      toast.error("Chyba pri ukladaní");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{referrer ? "Upraviť tipera" : "Pridať tipera"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Meno *</Label>
            <Input
              value={formData.full_name}
              onChange={e => setFormData({...formData, full_name: e.target.value})}
              required
            />
          </div>
          <div>
            <Label>Email *</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              required
              disabled={!!referrer}
            />
          </div>
          <div>
            <Label>Telefón</Label>
            <Input
              value={formData.phone || ""}
              onChange={e => setFormData({...formData, phone: e.target.value})}
            />
          </div>
          <div>
            <Label>Provízia (%)</Label>
            <Input
              type="number"
              value={formData.commission_rate || ""}
              onChange={e => setFormData({...formData, commission_rate: Number(e.target.value)})}
              min="0"
              max="100"
            />
          </div>
          <div>
            <Label>Tracking kód</Label>
            <div className="flex gap-2">
              <Input
                value={formData.referrer_code || ""}
                onChange={e => setFormData({...formData, referrer_code: e.target.value})}
                className="font-mono"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => setFormData({...formData, referrer_code: generateCode()})}
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Label>Aktívny</Label>
            <Switch
              checked={formData.is_active}
              onCheckedChange={checked => setFormData({...formData, is_active: checked})}
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Zrušiť
            </Button>
            <Button type="submit" disabled={saving} className="flex-1 bg-[#0a1628]">
              {saving ? "Ukladám..." : "Uložiť"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}