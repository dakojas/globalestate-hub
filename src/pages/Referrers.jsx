import React, { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, TrendingUp, DollarSign, Link as LinkIcon, Copy, UserPlus } from "lucide-react";
import { toast } from "sonner";
import ReferrerForm from "@/components/referrers/ReferrerForm";

export default function Referrers() {
  const [showForm, setShowForm] = useState(false);
  const [editingReferrer, setEditingReferrer] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setCurrentUser).catch(() => {});
  }, []);

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: () => base44.entities.User.list(),
  });

  const { data: leads = [] } = useQuery({
    queryKey: ["leads"],
    queryFn: () => base44.entities.Client.list("-created_date", 500),
  });

  const { data: commissions = [] } = useQuery({
    queryKey: ["commissions"],
    queryFn: () => base44.entities.Commission.list("-created_date", 500),
  });

  const isAdminOrAssistant = currentUser?.role === "admin" || currentUser?.role === "assistant";
  const allTipers = users.filter(u => u.role === "tiper");
  const referrers = isAdminOrAssistant
    ? allTipers
    : allTipers.filter(u => u.email === currentUser?.email);

  const copyLink = (code) => {
    const link = `${window.location.origin}/PublicHome?ref=${code}`;
    navigator.clipboard.writeText(link);
    toast.success("Link skopírovaný");
  };

  const generateCode = () => {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#0a1628]">Tiperi / Partneri</h2>
          <p className="text-gray-500 text-sm mt-1">Správa tiperov a ich provízií</p>
        </div>
        {isAdminOrAssistant && (
        <Button onClick={() => setShowForm(true)} className="bg-[#0a1628] hover:bg-[#132039]">
          <UserPlus className="w-4 h-4 mr-2" />
          Pridať tipera
        </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Aktívni tiperi</p>
                <p className="text-2xl font-bold text-[#0a1628]">{referrers.filter(r => r.is_active).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Leady od tiperov</p>
                <p className="text-2xl font-bold text-[#0a1628]">
                  {leads.filter(l => l.lead_source === "referrer").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Provízie tiperov</p>
                <p className="text-2xl font-bold text-[#0a1628]">
                  €{commissions.reduce((sum, c) => sum + (c.commission_amount * (c.referrer_share || 0) / 100), 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <LinkIcon className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Konverzia</p>
                <p className="text-2xl font-bold text-[#0a1628]">
                  {leads.filter(l => l.lead_source === "referrer").length > 0
                    ? Math.round((leads.filter(l => l.lead_source === "referrer" && l.status === "closed").length / 
                        leads.filter(l => l.lead_source === "referrer").length) * 100)
                    : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Referrers List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {referrers.map(referrer => {
          const referrerLeads = leads.filter(l => l.referrer_code === referrer.referrer_code);
          const closedDeals = referrerLeads.filter(l => l.status === "closed").length;

          return (
            <Card key={referrer.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{referrer.full_name}</CardTitle>
                    <p className="text-xs text-gray-500 mt-1">{referrer.email}</p>
                  </div>
                  <Badge variant={referrer.is_active ? "default" : "secondary"} className="text-xs">
                    {referrer.is_active ? "Aktívny" : "Neaktívny"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500 text-xs">Provízia</p>
                    <p className="font-semibold text-[#c9a84c]">{referrer.commission_rate || 0}%</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Leady</p>
                    <p className="font-semibold">{referrerLeads.length}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Uzavreté</p>
                    <p className="font-semibold text-green-600">{closedDeals}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Konverzia</p>
                    <p className="font-semibold">
                      {referrerLeads.length > 0 ? Math.round((closedDeals / referrerLeads.length) * 100) : 0}%
                    </p>
                  </div>
                </div>

                {referrer.referrer_code && (
                  <div className="pt-3 border-t">
                    <p className="text-xs text-gray-500 mb-2">Tracking kód</p>
                    <div className="flex items-center gap-2">
                      <Input 
                        value={referrer.referrer_code} 
                        readOnly 
                        className="text-xs h-8 font-mono bg-gray-50"
                      />
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => copyLink(referrer.referrer_code)}
                        className="h-8 px-2"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                )}

                {isAdminOrAssistant && <div className="flex gap-2 pt-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setEditingReferrer(referrer)}
                    className="flex-1"
                  >
                    Upraviť
                  </Button>
                </div>}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {referrers.length === 0 && (
        <div className="text-center py-20">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Zatiaľ žiadni tiperi</p>
          {isAdminOrAssistant && <Button onClick={() => setShowForm(true)} className="mt-4">
            Pridať prvého tipera
          </Button>
        </div>
      )}

      {(showForm || editingReferrer) && (
        <ReferrerForm
          referrer={editingReferrer}
          open={true}
          onClose={() => {
            setShowForm(false);
            setEditingReferrer(null);
          }}
          onSaved={() => {
            setShowForm(false);
            setEditingReferrer(null);
            queryClient.invalidateQueries({ queryKey: ["users"] });
          }}
          generateCode={generateCode}
        />
      )}
    </div>
  );
}