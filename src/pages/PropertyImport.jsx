import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Loader2, CheckCircle2, AlertCircle, Globe } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export default function PropertyImport() {
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState("https://nehnutelnostivzahranici.sk");
  const [results, setResults] = useState(null);
  const queryClient = useQueryClient();

  const handleImport = async () => {
    setLoading(true);
    setResults(null);

    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Navštív stránku ${url} a extrahuj všetky nehnuteľnosti, ktoré tam nájdeš.

Pre každú nehnuteľnosť zisti:
- Presný názov projektu/nehnuteľnosti
- Krajina (použi z tejto ponuky: Albania, Bali, Hungary, Bulgaria, Dominican Republic, Egypt, Georgia, Mauritius, Oman, UAE, Spain, Italy, Thailand, Turkey)
- Mesto alebo lokalita
- Typ nehnuteľnosti - apartment, villa, penthouse, studio, townhouse, land alebo commercial
- Cena v EUR - ak je v inej mene, preveď na EUR (napr. 1 USD = 0.92 EUR, 1 GBP = 1.17 EUR)
- Počet spální/izieb
- Plocha v m²
- Detailný popis nehnuteľnosti
- URL adresy všetkých fotografií nehnuteľnosti (nie len hlavnej, ale všetkých dostupných obrázkov)

DÔLEŽITÉ pre obrázky:
- Použi plné URL adresy obrázkov (začínajúce http:// alebo https://)
- Skontroluj či sú obrázky funkčné a skutočné fotografie nehnuteľností
- Extrahuj všetky dostupné obrázky z galérie nehnuteľnosti

Vráť zoznam v JSON formáte.`,
        add_context_from_internet: true,
        model: "gemini_3_pro",
        response_json_schema: {
          type: "object",
          properties: {
            properties: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  country: { type: "string" },
                  city: { type: "string" },
                  property_type: { type: "string" },
                  price: { type: "number" },
                  bedrooms: { type: "number" },
                  area_sqm: { type: "number" },
                  description: { type: "string" },
                  images: { 
                    type: "array",
                    items: { type: "string" }
                  }
                }
              }
            }
          }
        }
      });

      const properties = response.properties || [];
      
      if (properties.length === 0) {
        toast.error("Nenašli sa žiadne nehnuteľnosti");
        setResults({ success: 0, failed: 0, total: 0 });
        setLoading(false);
        return;
      }

      // Import properties
      let success = 0;
      let failed = 0;

      for (const prop of properties) {
        try {
          await base44.entities.Property.create({
            title: prop.title,
            country: prop.country,
            city: prop.city,
            property_type: prop.property_type || "apartment",
            price: prop.price,
            bedrooms: prop.bedrooms || 0,
            area_sqm: prop.area_sqm || 0,
            description: prop.description || "",
            images: prop.images || [],
            status: "available",
            is_public: true,
            currency: "EUR",
          });
          success++;
        } catch (err) {
          console.error("Failed to import property:", err);
          failed++;
        }
      }

      setResults({ success, failed, total: properties.length });
      toast.success(`Importované: ${success} z ${properties.length} nehnuteľností`);
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    } catch (error) {
      console.error("Import failed:", error);
      toast.error("Chyba pri importe: " + error.message);
      setResults({ success: 0, failed: 0, total: 0, error: error.message });
    }

    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#0a1628]">Import nehnuteľností</h2>
        <p className="text-gray-500 text-sm mt-1">Automatický import z nehnutelnostivzahranici.sk</p>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Webový scraper
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>URL stránky</Label>
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://nehnutelnostivzahranici.sk"
              disabled={loading}
            />
            <p className="text-xs text-gray-400 mt-1">
              Zadajte URL stránky s nehnuteľnosťami (hlavná stránka alebo kategória)
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">ℹ️ Ako to funguje?</h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• AI prejde stránku a automaticky vyhľadá nehnuteľnosti</li>
              <li>• Extrahuje všetky informácie vrátane všetkých fotografií z galérie</li>
              <li>• Používa pokročilý model pre presnejšie výsledky</li>
              <li>• Importované nehnuteľnosti sú automaticky zverejnené na verejnej stránke</li>
              <li>• Po importe skontrolujte a upravte údaje podľa potreby</li>
            </ul>
          </div>

          <Button
            onClick={handleImport}
            disabled={loading || !url}
            className="w-full bg-[#0a1628] hover:bg-[#132039]"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Importujem nehnuteľnosti...
              </>
            ) : (
              <>
                <Download className="w-5 h-5 mr-2" />
                Spustiť import
              </>
            )}
          </Button>

          {results && (
            <div className="mt-6 p-4 rounded-lg bg-gray-50 border">
              <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                {results.success > 0 ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600" />
                )}
                Výsledky importu
              </h4>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-white rounded-lg p-3">
                  <p className="text-2xl font-bold text-green-600">{results.success}</p>
                  <p className="text-xs text-gray-500">Úspešné</p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <p className="text-2xl font-bold text-red-600">{results.failed}</p>
                  <p className="text-xs text-gray-500">Zlyhané</p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <p className="text-2xl font-bold text-blue-600">{results.total}</p>
                  <p className="text-xs text-gray-500">Celkom</p>
                </div>
              </div>
              {results.error && (
                <p className="text-xs text-red-600 mt-3 p-2 bg-red-50 rounded">
                  Chyba: {results.error}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm bg-amber-50">
        <CardContent className="p-4">
          <h4 className="text-sm font-semibold text-amber-900 mb-2">⚠️ Upozornenie</h4>
          <p className="text-xs text-amber-700">
            Import používa AI na extrahovanie údajov, preto odporúčame po importe skontrolovať správnosť údajov.
            Importované nehnuteľnosti sú automaticky zverejnené na verejnej stránke - môžete ich upraviť
            alebo skryť v sekcii Properties.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}