import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { UserPlus, Mail, Shield, User, Loader2, Users } from "lucide-react";
import { toast } from "sonner";

const ROLES = [
  { value: "admin", label: "Admin", desc: "Plný prístup ku všetkému", color: "bg-red-100 text-red-700" },
  { value: "assistant", label: "Agent", desc: "Prístup k nehnuteľnostiam a klientom", color: "bg-blue-100 text-blue-700" },
  { value: "tiper", label: "Tiper", desc: "Prístup len k sekcii Tiper", color: "bg-purple-100 text-purple-700" },
  { value: "partner", label: "Partner", desc: "Prístup len k sekcii Partner", color: "bg-amber-100 text-amber-700" },
];

export default function Team() {
  const [inviteOpen, setInviteOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");
  const [inviting, setInviting] = useState(false);
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["team-users"],
    queryFn: () => base44.entities.User.list("-created_date", 100),
  });

  const handleInvite = async () => {
    if (!email) return;
    setInviting(true);
    await base44.users.inviteUser(email, role);
    toast.success(`Pozvánka odoslaná na ${email}`);
    setEmail("");
    setRole("user");
    setInviting(false);
    setInviteOpen(false);
    queryClient.invalidateQueries({ queryKey: ["team-users"] });
  };

  const handleRoleChange = async (userId, newRole) => {
    await base44.entities.User.update(userId, { role: newRole });
    toast.success("Rola aktualizovaná");
    queryClient.invalidateQueries({ queryKey: ["team-users"] });
  };

  const getRoleInfo = (role) => ROLES.find(r => r.value === role) || { label: role, color: "bg-gray-100 text-gray-600" };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#0a1628]">Tím</h2>
          <p className="text-sm text-gray-500 mt-1">Spravujte členov tímu a ich prístupy</p>
        </div>
        <Button onClick={() => setInviteOpen(true)} className="bg-[#0a1628] hover:bg-[#132039]">
          <UserPlus className="w-4 h-4 mr-2" /> Pozvať člena
        </Button>
      </div>

      {/* Role info cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {ROLES.map(r => (
          <Card key={r.value} className="border-0 shadow-sm">
            <CardContent className="p-4 flex items-start gap-3">
              <div className={`p-2 rounded-lg ${r.color.replace("text-", "bg-").replace("700", "100").replace("100 ", "100 ")}`}>
                {r.value === "admin" ? <Shield className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>
              <div>
                <p className="font-semibold text-sm text-[#0a1628]">{r.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{r.desc}</p>
                <Badge className={`${r.color} border-0 text-xs mt-1`}>
                  {users.filter(u => u.role === r.value).length} členov
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Members list */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="w-4 h-4" /> Členovia tímu ({users.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-16 rounded-xl" />)}</div>
          ) : users.length === 0 ? (
            <p className="text-center text-gray-400 py-8">Žiadni členovia tímu</p>
          ) : (
            <div className="space-y-2">
              {users.map(user => {
                const roleInfo = getRoleInfo(user.role);
                return (
                  <div key={user.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors border">
                    <div className="w-10 h-10 rounded-full bg-[#0a1628]/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-[#0a1628] font-semibold text-sm">
                        {user.full_name?.charAt(0) || user.email?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900">{user.full_name || "—"}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Mail className="w-3 h-3" />{user.email}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Select value={user.role || "user"} onValueChange={(v) => handleRoleChange(user.id, v)}>
                        <SelectTrigger className="w-32 h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ROLES.map(r => (
                            <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Badge className={`${roleInfo.color} border-0 text-xs hidden sm:flex`}>{roleInfo.label}</Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Invite dialog */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-[#c9a84c]" /> Pozvať nového člena
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <Label>Email adresa *</Label>
              <Input
                type="email"
                placeholder="meno@firma.sk"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Rola</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ROLES.map(r => (
                    <SelectItem key={r.value} value={r.value}>
                      <div>
                        <span className="font-medium">{r.label}</span>
                        <span className="text-gray-400 ml-2 text-xs">{r.desc}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-xs text-blue-700">
              Používateľ dostane e-mail s pozvánkou a môže sa prihlásiť do systému.
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setInviteOpen(false)}>Zrušiť</Button>
              <Button onClick={handleInvite} disabled={inviting || !email} className="bg-[#0a1628] hover:bg-[#132039]">
                {inviting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Mail className="w-4 h-4 mr-2" />}
                Odoslať pozvánku
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}