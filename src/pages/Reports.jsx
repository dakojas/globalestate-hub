import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingUp, Users, DollarSign, Target, Award } from "lucide-react";
import { useTranslation } from "@/components/LanguageContext";
import SalesSuccessOverview from "@/components/dashboard/SalesSuccessOverview";

export default function Reports() {
  const { t } = useTranslation();
  const [period, setPeriod] = useState("all");

  const { data: clients = [] } = useQuery({
    queryKey: ["clients"],
    queryFn: () => base44.entities.Client.list("-created_date", 1000),
  });

  const { data: commissions = [] } = useQuery({
    queryKey: ["commissions"],
    queryFn: () => base44.entities.Commission.list("-deal_date", 1000),
  });

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: () => base44.entities.User.list(),
  });

  // Lead analytics by source
  const leadsBySource = {};
  clients.forEach(c => {
    const source = c.lead_source || "other";
    if (!leadsBySource[source]) {
      leadsBySource[source] = { total: 0, closed: 0, lost: 0 };
    }
    leadsBySource[source].total++;
    if (c.status === "closed") leadsBySource[source].closed++;
    if (c.status === "lost") leadsBySource[source].lost++;
  });

  // Lead analytics by country
  const leadsByCountry = {};
  clients.forEach(c => {
    c.preferred_countries?.forEach(country => {
      if (!leadsByCountry[country]) {
        leadsByCountry[country] = { total: 0, closed: 0 };
      }
      leadsByCountry[country].total++;
      if (c.status === "closed") leadsByCountry[country].closed++;
    });
  });

  // Team performance
  const teamPerformance = {};
  users.filter(u => u.role === "assistant" || u.role === "admin").forEach(u => {
    teamPerformance[u.email] = {
      name: u.full_name || u.email,
      leads: clients.filter(c => c.claimed_by === u.email || c.assigned_agent === u.email).length,
      closed: clients.filter(c => (c.claimed_by === u.email || c.assigned_agent === u.email) && c.status === "closed").length,
      revenue: commissions.filter(c => c.agent_email === u.email).reduce((sum, c) => sum + (c.commission_amount || 0), 0),
    };
  });

  // Referrer performance
  const referrerPerformance = {};
  users.filter(u => u.role === "referrer").forEach(u => {
    const refLeads = clients.filter(c => c.referrer_code === u.referrer_code);
    referrerPerformance[u.email] = {
      name: u.full_name || u.email,
      code: u.referrer_code,
      leads: refLeads.length,
      closed: refLeads.filter(c => c.status === "closed").length,
      revenue: commissions.filter(c => {
        const client = clients.find(cl => cl.id === c.client_id);
        return client?.referrer_code === u.referrer_code;
      }).reduce((sum, c) => sum + (c.commission_amount || 0) * (u.commission_rate || 0) / 100, 0),
    };
  });

  const totalRevenue = commissions.reduce((sum, c) => sum + (c.commission_amount || 0), 0);
  const avgDealSize = commissions.length > 0 ? totalRevenue / commissions.length : 0;
  const conversionRate = clients.length > 0 ? (clients.filter(c => c.status === "closed").length / clients.length * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#0a1628]">{t('reporting')}</h2>
        <p className="text-gray-500 text-sm mt-1">{t('performanceOverview')}</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">{t('totalRevenue')}</p>
                <p className="text-xl font-bold">€{totalRevenue.toLocaleString()}</p>
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
                <p className="text-xs text-gray-500">{t('avgDealSize')}</p>
                <p className="text-xl font-bold">€{Math.round(avgDealSize).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Target className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">{t('conversionRate')}</p>
                <p className="text-xl font-bold">{conversionRate.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Award className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">{t('totalDeals')}</p>
                <p className="text-xl font-bold">{commissions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="success" className="space-y-6">
        <TabsList>
          <TabsTrigger value="success">Úspešnosť predaja</TabsTrigger>
          <TabsTrigger value="sources">{t('leadSources')}</TabsTrigger>
          <TabsTrigger value="countries">{t('countries')}</TabsTrigger>
          <TabsTrigger value="team">{t('teamPerformance')}</TabsTrigger>
          <TabsTrigger value="referrers">{t('referrerPerformance')}</TabsTrigger>
        </TabsList>

        <TabsContent value="success">
          <SalesSuccessOverview clients={clients} commissions={commissions} />
        </TabsContent>

        <TabsContent value="sources">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">{t('leadsBySource')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('source')}</TableHead>
                    <TableHead>{t('totalLeads')}</TableHead>
                    <TableHead>{t('closedTable')}</TableHead>
                    <TableHead>{t('lostTable')}</TableHead>
                    <TableHead>{t('conversionRateCol')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(leadsBySource).map(([source, data]) => (
                    <TableRow key={source}>
                      <TableCell className="font-medium">{source}</TableCell>
                      <TableCell>{data.total}</TableCell>
                      <TableCell className="text-green-600">{data.closed}</TableCell>
                      <TableCell className="text-red-600">{data.lost}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {data.total > 0 ? ((data.closed / data.total) * 100).toFixed(1) : 0}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="countries">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">{t('leadsByCountry')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('country')}</TableHead>
                    <TableHead>{t('totalLeads')}</TableHead>
                    <TableHead>{t('closedTable')}</TableHead>
                    <TableHead>{t('conversionRateCol')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(leadsByCountry)
                    .sort((a, b) => b[1].total - a[1].total)
                    .map(([country, data]) => (
                      <TableRow key={country}>
                        <TableCell className="font-medium">{country}</TableCell>
                        <TableCell>{data.total}</TableCell>
                        <TableCell className="text-green-600">{data.closed}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {data.total > 0 ? ((data.closed / data.total) * 100).toFixed(1) : 0}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">{t('teamPerformanceTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('name')}</TableHead>
                    <TableHead>{t('assignedLeads')}</TableHead>
                    <TableHead>{t('closedDealsTable')}</TableHead>
                    <TableHead>{t('conversionRateCol')}</TableHead>
                    <TableHead>{t('revenue')}</TableHead>
                    <TableHead>Pridelené leady</TableHead>
                    <TableHead>Uzavreté dealy</TableHead>
                    <TableHead>Konverzia</TableHead>
                    <TableHead>Provízie</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.values(teamPerformance)
                    .sort((a, b) => b.closed - a.closed)
                    .map((member) => (
                      <TableRow key={member.name}>
                        <TableCell className="font-medium">{member.name}</TableCell>
                        <TableCell>{member.leads}</TableCell>
                        <TableCell className="text-green-600">{member.closed}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {member.leads > 0 ? ((member.closed / member.leads) * 100).toFixed(1) : 0}%
                          </Badge>
                        </TableCell>
                        <TableCell className="font-semibold text-[#c9a84c]">
                          €{member.revenue.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="referrers">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">{t('referrerPerformanceTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('referrerCol')}</TableHead>
                    <TableHead>{t('code')}</TableHead>
                    <TableHead>{t('totalLeads')}</TableHead>
                    <TableHead>{t('closedTable')}</TableHead>
                    <TableHead>{t('conversionRateCol')}</TableHead>
                    <TableHead>{t('revenue')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.values(referrerPerformance)
                    .sort((a, b) => b.revenue - a.revenue)
                    .map((ref) => (
                      <TableRow key={ref.code}>
                        <TableCell className="font-medium">{ref.name}</TableCell>
                        <TableCell className="font-mono text-xs">{ref.code}</TableCell>
                        <TableCell>{ref.leads}</TableCell>
                        <TableCell className="text-green-600">{ref.closed}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {ref.leads > 0 ? ((ref.closed / ref.leads) * 100).toFixed(1) : 0}%
                          </Badge>
                        </TableCell>
                        <TableCell className="font-semibold text-purple-600">
                          €{Math.round(ref.revenue).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}