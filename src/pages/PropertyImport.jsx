import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
      const response = await base44.functions.invoke('syncPartnerProperties', { website_url: url });
      const data = response.data || response;
      const result = data.results?.[0] || {};

      const found = result.found || 0;
      const imported = result.new || 0;
      const skipped = result.skipped || 0;

      setResults({
        success: imported,
        failed: skipped + (found - imported - skipped),
        total: found,
        error: result.error
      });

      if (result.error) {
        toast.error("Chyba pri importe: " + result.error);
      } else {
        toast.success(`Importované: ${imported} z ${found} nehnuteľností`);
        queryClient.invalidateQueries({ queryKey: ["properties"] });
        queryClient.invalidateQueries({ queryKey: ["pending-properties"] });
      }
    } catch (error) {
      toast.error("Chyba pri importe: " + error.message);
      setResults({ success: 0, failed: 0, total: 0, error: error.message });
    }

    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#0a1628]">Import nehnuteľností</h2>
        <p className="text-gray-500 text-sm mt-1">AI scraper pre rýchly import z akejkoľvek webovej stránky</p>
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
              placeholder="https://example.com/nehnutelnosti"
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
              <li>• Pre každú navštívi aj detail stránku pre bohatší popis a viac fotiek</li>
              <li>• Obrázky sa stiahnu a uložia do vlastného úložiska</li>
              <li>• Importované nehnuteľnosti vyžadujú schválenie pred zverejnením</li>
              <li>• Duplikáty (rovnaký názov) sa automaticky preskočia</li>
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
                  <p className="text-xs text-gray-500">Preskočené</p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <p className="text-2xl font-bold text-blue-600">{results.total}</p>
                  <p className="text-xs text-gray-500">Celkom nájdených</p>
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
            Importované nehnuteľnosti vyžadujú schválenie pred zverejnením — môžete ich skontrolovať
            a schváliť v sekcii Nehnuteľnosti.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}