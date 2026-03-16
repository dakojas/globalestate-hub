import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Sparkles, ChevronDown, ChevronUp, Building2 } from "lucide-react";

function matchScore(client, property) {
  let score = 0;
  if (client.preferred_countries?.includes(property.country)) score += 3;
  if (client.preferred_property_types?.includes(property.property_type)) score += 2;
  if (client.budget_min && property.price >= client.budget_min) score += 1;
  if (client.budget_max && property.price <= client.budget_max) score += 1;
  return score;
}

function getMatchedProperties(client, properties) {
  return properties
    .filter(p => p.status === "available")
    .map(p => ({ ...p, score: matchScore(client, p) }))
    .filter(p => p.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

export default function ClientMatches({ clients, properties }) {
  const [expandedClient, setExpandedClient] = useState(null);

  const activeClients = clients.filter(c =>
    ["active", "negotiating", "lead", "new_lead", "claimed", "contacted", "qualified"].includes(c.status) &&
    (c.preferred_countries?.length > 0 || c.preferred_property_types?.length > 0 || c.budget_max)
  );

  if (activeClients.length === 0) return null;

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#c9a84c]" />
          Odporúčané nehnuteľnosti pre klientov
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {activeClients.slice(0, 6).map(client => {
          const matches = getMatchedProperties(client, properties);
          const isExpanded = expandedClient === client.id;

          return (
            <div key={client.id} className="border rounded-xl overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors text-left"
                onClick={() => setExpandedClient(isExpanded ? null : client.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#0a1628]/10 flex items-center justify-center text-sm font-semibold text-[#0a1628]">
                    {client.full_name?.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{client.full_name}</p>
                    <p className="text-xs text-gray-400">
                      {matches.length > 0 ? `${matches.length} zhôd` : "Žiadne zhody"}
                      {client.budget_max ? ` · max €${client.budget_max?.toLocaleString()}` : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {matches.length > 0 && (
                    <Badge className="bg-green-100 text-green-700 border-0 text-xs">{matches.length} match</Badge>
                  )}
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </div>
              </button>

              {isExpanded && (
                <div className="border-t bg-gray-50 p-3 space-y-2">
                  {matches.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-2">Žiadne dostupné nehnuteľnosti nezodpovedajú preferenciám</p>
                  ) : matches.map(prop => (
                    <Link
                      key={prop.id}
                      to={`/PropertyDetail?id=${prop.id}`}
                      className="flex items-center gap-3 p-2 bg-white rounded-lg hover:shadow-sm transition-shadow border"
                    >
                      {prop.images?.[0] ? (
                        <img src={prop.images[0]} alt={prop.title} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                          <Building2 className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{prop.title}</p>
                        <p className="text-xs text-gray-500">{prop.country} · €{prop.price?.toLocaleString()}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge className="bg-[#c9a84c]/10 text-[#c9a84c] border-0 text-xs">{prop.score}★</Badge>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}