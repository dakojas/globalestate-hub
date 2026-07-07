import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Mail, Building2, User } from "lucide-react";
import { toast } from "sonner";
import moment from "moment";

const STATUS_MAP = {
  pending: { label: "Čaká", variant: "secondary" },
  approved: { label: "Schválená", variant: "default" },
  rejected: { label: "Zamietnutá", variant: "destructive" },
};

export default function PartnerRequests() {
  const queryClient = useQueryClient();
  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["partnerRequests"],
    queryFn: () => base44.entities.PartnerRequest.list("-created_date", 100),
  });

  const updateStatus = async (id, status) => {
    await base44.entities.PartnerRequest.update(id, { status });
    queryClient.invalidateQueries({ queryKey: ["partnerRequests"] });
    toast.success(status === "approved" ? "Žiadosť schválená" : "Žiadosť zamietnutá");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0a1628]">Žiadosti o partnerstvo</h1>
        <p className="text-gray-500 text-sm mt-1">Schvaľujte alebo zamietajte žiadosti o partnerský prístup</p>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p>Zatiaľ žiadne žiadosti</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {requests.map((req) => {
            const status = STATUS_MAP[req.status] || STATUS_MAP.pending;
            return (
              <div key={req.id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-[#0a1628] flex items-center gap-1.5">
                        <User className="w-4 h-4 text-gray-400" />
                        {req.full_name}
                      </span>
                      {req.organization_name && (
                        <span className="text-gray-500 text-sm flex items-center gap-1">
                          <Building2 className="w-4 h-4" />
                          {req.organization_name}
                        </span>
                      )}
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </div>
                    {req.email && (
                      <a href={`mailto:${req.email}`} className="text-sm text-gray-500 flex items-center gap-1.5 hover:text-[#c9a84c]">
                        <Mail className="w-4 h-4" />
                        {req.email}
                      </a>
                    )}
                    {req.message && (
                      <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 mt-2">{req.message}</p>
                    )}
                    <p className="text-xs text-gray-400">{moment(req.created_date).format("DD.MM.YYYY HH:mm")}</p>
                  </div>
                  {req.status === "pending" && (
                    <div className="flex flex-col gap-2">
                      <Button size="sm" onClick={() => updateStatus(req.id, "approved")} className="bg-emerald-600 hover:bg-emerald-700">
                        <Check className="w-4 h-4 mr-1" /> Schváliť
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => updateStatus(req.id, "rejected")}>
                        <X className="w-4 h-4 mr-1" /> Zamietnuť
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}