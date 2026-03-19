import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Copy, UserPlus } from "lucide-react";
import { toast } from "sonner";
import ReferrerForm from "@/components/referrers/ReferrerForm";

export default function Partners() {
  const [showForm, setShowForm] = useState(false);
  const [editingPartner, setEditingPartner] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setCurrentUser).catch(() => {});
  }, []);

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: () => base44.entities.User.list(),
  });

  const isAdmin = currentUser?.role === "admin" || currentUser?.role === "assistant" || currentUser?.role === "user";
  const partners = isAdmin
    ? users.filter(u => u.role === "partner")
    : users.filter(u => u.email === currentUser?.email && u.role === "partner");

  const copyLink = (code) => {
    const link = `${window.location.origin}/PublicHome?ref=${code}`;
    navigator.clipboard.writeText(link);
    toast.success("Link skopírovaný");
  };

  const generateCode = () => Math.random().toString(36).substring(2, 10).toUpperCase();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#0a1628]">Partneri</h2>
          <p className="text-gray-500 text-sm mt-1">Správa partnerov</p>
        </div>
        {isAdmin && (
          <Button onClick={() => setShowForm(true)} className="bg-[#0a1628] hover:bg-[#132039]">
            <UserPlus className="w-4 h-4 mr-2" />
            Pridať partnera
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {partners.map(partner => (
          <Card key={partner.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">{partner.full_name}</CardTitle>
                  <p className="text-xs text-gray-500 mt-1">{partner.email}</p>
                </div>
                <Badge variant={partner.is_active ? "default" : "secondary"} className="text-xs">
                  {partner.is_active ? "Aktívny" : "Neaktívny"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500 text-xs">Provízia</p>
                  <p className="font-semibold text-[#c9a84c]">{partner.commission_rate || 0}%</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Telefón</p>
                  <p className="font-semibold">{partner.phone || "—"}</p>
                </div>
              </div>

              {partner.referrer_code && (
                <div className="pt-3 border-t">
                  <p className="text-xs text-gray-500 mb-2">Tracking kód</p>
                  <div className="flex items-center gap-2">
                    <Input
                      value={partner.referrer_code}
                      readOnly
                      className="text-xs h-8 font-mono bg-gray-50"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyLink(partner.referrer_code)}
                      className="h-8 px-2"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              )}

              {isAdmin && (
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingPartner(partner)}
                    className="flex-1"
                  >
                    Upraviť
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {partners.length === 0 && (
        <div className="text-center py-20">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Zatiaľ žiadni partneri</p>
          {isAdmin && (
            <Button onClick={() => setShowForm(true)} className="mt-4">
              Pridať prvého partnera
            </Button>
          )}
        </div>
      )}

      {(showForm || editingPartner) && (
        <ReferrerForm
          referrer={editingPartner}
          open={true}
          onClose={() => { setShowForm(false); setEditingPartner(null); }}
          onSaved={() => {
            setShowForm(false);
            setEditingPartner(null);
            queryClient.invalidateQueries({ queryKey: ["users"] });
          }}
          generateCode={generateCode}
          defaultRole="partner"
        />
      )}
    </div>
  );
}