import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, TrendingUp, Award, Euro, FileSignature, Eye, CalendarCheck, CheckCircle2 } from "lucide-react";

const STAGES = [
  { key: "viewing", label: "Obhliadka", icon: Eye, color: "from-orange-400 to-orange-500", bg: "bg-orange-50", text: "text-orange-600", ring: "ring-orange-200" },
  { key: "reserved", label: "Rezervácia", icon: CalendarCheck, color: "from-amber-400 to-amber-500", bg: "bg-amber-50", text: "text-amber-600", ring: "ring-amber-200" },
  { key: "closed", label: "Podpis zmluvy", icon: FileSignature, color: "from-emerald-400 to-emerald-500", bg: "bg-emerald-50", text: "text-emerald-600", ring: "ring-emerald-200" },
  { key: "commission_paid", label: "Provízia vyplatená", icon: Euro, color: "from-green-500 to-green-600", bg: "bg-green-50", text: "text-green-600", ring: "ring-green-200" },
];

export default function SalesSuccessOverview({ clients, commissions }) {
  const viewingCount = clients.filter(c => c.status === "viewing").length;
  const reservedCount = clients.filter(c => c.status === "reserved").length;
  const closedCount = clients.filter(c => c.status === "closed").length;
  const paidCommissions = commissions.filter(c => c.status === "paid");
  const paidCount = paidCommissions.length;
  const totalCommission = paidCommissions.reduce((sum, c) => sum + (c.commission_amount || 0), 0);

  const counts = [viewingCount, reservedCount, closedCount, paidCount];
  const maxCount = Math.max(...counts, 1);

  // Conversion rates between stages
  const conv1 = viewingCount > 0 ? (reservedCount / viewingCount) * 100 : 0;
  const conv2 = reservedCount > 0 ? (closedCount / reservedCount) * 100 : 0;
  const conv3 = closedCount > 0 ? (paidCount / closedCount) * 100 : 0;
  const overallConv = viewingCount > 0 ? (closedCount / viewingCount) * 100 : 0;

  const convRates = [null, conv1, conv2, conv3];

  return (
    <div className="space-y-6">
      {/* Summary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                <Eye className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Obhliadky</p>
                <p className="text-xl font-bold text-[#0a1628]">{viewingCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <CalendarCheck className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Rezervácie</p>
                <p className="text-xl font-bold text-[#0a1628]">{reservedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <FileSignature className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Podpísané zmluvy</p>
                <p className="text-xl font-bold text-[#0a1628]">{closedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Euro className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Vyplatené provízie</p>
                <p className="text-xl font-bold text-[#c9a84c]">€{totalCommission.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Visual Funnel */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold text-[#0a1628] flex items-center gap-2">
              <Award className="w-4 h-4 text-[#c9a84c]" />
              Funnel úspešnosti predaja
            </CardTitle>
            <div className="text-right">
              <p className="text-xs text-gray-400">Celková konverzia (obhliadka → zmluva)</p>
              <p className="text-lg font-bold text-[#c9a84c]">{overallConv.toFixed(1)}%</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {STAGES.map((stage, idx) => {
            const count = counts[idx];
            const widthPct = (count / maxCount) * 100;
            const conv = convRates[idx];
            const dropOff = conv !== null && idx > 0 && counts[idx - 1] > 0
              ? counts[idx - 1] - count
              : 0;

            return (
              <div key={stage.key}>
                {conv !== null && (
                  <div className="flex items-center justify-center gap-2 py-1">
                    <div className="flex items-center gap-1 text-xs font-semibold text-gray-500">
                      {conv >= 50 ? <TrendingUp className="w-3 h-3 text-green-500" /> : <TrendingDown className="w-3 h-3 text-red-400" />}
                      <span className={conv >= 50 ? "text-green-600" : "text-red-500"}>{conv.toFixed(1)}%</span>
                    </div>
                    {dropOff > 0 && (
                      <span className="text-xs text-gray-400">−{dropOff} klientov</span>
                    )}
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <div className="w-36 flex-shrink-0 flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-lg ${stage.bg} flex items-center justify-center ring-1 ${stage.ring}`}>
                      <stage.icon className={`w-4 h-4 ${stage.text}`} />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{stage.label}</span>
                  </div>
                  <div className="flex-1 flex items-center gap-2">
                    <div className="flex-1 h-9 bg-gray-100 rounded-lg overflow-hidden relative">
                      <div
                        className={`h-full bg-gradient-to-r ${stage.color} rounded-lg transition-all duration-700 flex items-center justify-end pr-3`}
                        style={{ width: `${Math.max(widthPct, count > 0 ? 10 : 0)}%` }}
                      >
                        <span className="text-sm font-bold text-white">{count}</span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 w-20 text-right flex-shrink-0">
                      {idx === 0 ? "vstup" : `${(count / (counts[0] || 1) * 100).toFixed(0)}% z obhliadok`}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Success highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-green-50">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <p className="text-sm font-semibold text-emerald-700">Úspešne uzavreté</p>
            </div>
            <p className="text-3xl font-bold text-emerald-700">{closedCount}</p>
            <p className="text-xs text-emerald-600 mt-1">z {viewingCount} obhliadok</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-gradient-to-br from-amber-50 to-orange-50">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-2">
              <CalendarCheck className="w-5 h-5 text-amber-600" />
              <p className="text-sm font-semibold text-amber-700">V rezervácii</p>
            </div>
            <p className="text-3xl font-bold text-amber-700">{reservedCount}</p>
            <p className="text-xs text-amber-600 mt-1">čakajú na podpis</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-2">
              <Euro className="w-5 h-5 text-green-600" />
              <p className="text-sm font-semibold text-green-700">Vyplatené provízie</p>
            </div>
            <p className="text-3xl font-bold text-green-700">€{totalCommission.toLocaleString()}</p>
            <p className="text-xs text-green-600 mt-1">{paidCount} vyplatených z {commissions.length} celkom</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}