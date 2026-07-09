import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Star, Search, X, Loader2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const COUNTRY_FLAGS = {
  Albania: "🇦🇱", Bali: "🇮🇩", Hungary: "🇭🇺", Bulgaria: "🇧🇬", Croatia: "🇭🇷",
  "Dominican Republic": "🇩🇴", Egypt: "🇪🇬", Georgia: "🇬🇪",
  Mauritius: "🇲🇺", Oman: "🇴🇲", UAE: "🇦🇪", Spain: "🇪🇸",
  Italy: "🇮🇹", Thailand: "🇹🇭", Turkey: "🇹🇷"
};

export default function FeaturedManager() {
  const queryClient = useQueryClient();
  const [showPicker, setShowPicker] = useState(false);
  const [search, setSearch] = useState("");
  const [togglingId, setTogglingId] = useState(null);

  const { data: properties = [], isLoading } = useQuery({
    queryKey: ["properties"],
    queryFn: () => base44.entities.Property.list("-created_date", 200),
  });

  const featured = properties.filter(p => p.is_featured);
  const available = properties.filter(p => !p.is_featured && p.status === "available");
  const filteredAvailable = available.filter(p =>
    !search || p.title?.toLowerCase().includes(search.toLowerCase()) || p.city?.toLowerCase().includes(search.toLowerCase()) || p.country?.toLowerCase().includes(search.toLowerCase())
  );

  const toggleFeatured = async (propertyId, makeFeatured) => {
    setTogglingId(propertyId);
    try {
      await base44.entities.Property.update(propertyId, { is_featured: makeFeatured });
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      queryClient.invalidateQueries({ queryKey: ["public-properties"] });
      toast.success(makeFeatured ? "Pridané do odporúčaných" : "Odstránené z odporúčaných");
    } catch (e) {
      toast.error("Chyba pri úprave");
    }
    setTogglingId(null);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-[#0a1628] to-[#132039]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#c9a84c]/20 flex items-center justify-center">
            <Star className="w-5 h-5 text-[#c9a84c]" fill="currentColor" />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">Odporúčané nehnuteľnosti</h3>
            <p className="text-white/50 text-xs">{featured.length} projektov sa zobrazuje na úvodnej stránke</p>
          </div>
        </div>
        <Button onClick={() => setShowPicker(!showPicker)} className="bg-[#c9a84c] hover:bg-[#a88950] text-[#0a0a0a]">
          {showPicker ? <><X className="w-4 h-4 mr-2" /> Zavrieť</> : <><Plus className="w-4 h-4 mr-2" /> Pridať</>}
        </Button>
      </div>

      {/* Featured list */}
      <div className="p-4">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[1,2,3].map(i => <Skeleton key={i} className="h-20 rounded-lg" />)}
          </div>
        ) : featured.length === 0 ? (
          <div className="text-center py-8">
            <Star className="w-10 h-10 text-gray-200 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">Žiadne odporúčané nehnuteľnosti</p>
            <p className="text-gray-300 text-xs mt-1">Kliknite na "Pridať" pre výber projektov</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {featured.map(p => (
              <div key={p.id} className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg group">
                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                  {p.images?.[0] ? (
                    <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl">{COUNTRY_FLAGS[p.country] || "🏠"}</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#0a1628] truncate">{p.title}</p>
                  <p className="text-xs text-gray-500 truncate">{COUNTRY_FLAGS[p.country]} {p.city} · €{(p.price||0).toLocaleString()}</p>
                </div>
                <button
                  onClick={() => toggleFeatured(p.id, false)}
                  disabled={togglingId === p.id}
                  className="p-2 rounded-lg hover:bg-red-100 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                  title="Odstrániť z odporúčaných"
                >
                  {togglingId === p.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Picker */}
      {showPicker && (
        <div className="border-t border-gray-100 p-4 bg-gray-50">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Hľadať nehnuteľnosti na pridanie..." className="pl-10 bg-white" />
          </div>
          <div className="max-h-80 overflow-y-auto space-y-2">
            {filteredAvailable.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-6">Žiadne dostupné nehnuteľnosti na pridanie</p>
            ) : filteredAvailable.map(p => (
              <div key={p.id} className="flex items-center gap-3 p-2.5 bg-white border border-gray-100 rounded-lg hover:border-[#c9a84c]/40 transition-colors">
                <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                  {p.images?.[0] ? (
                    <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-lg">{COUNTRY_FLAGS[p.country] || "🏠"}</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#0a1628] truncate">{p.title}</p>
                  <p className="text-xs text-gray-500 truncate">{COUNTRY_FLAGS[p.country]} {p.city} · €{(p.price||0).toLocaleString()}</p>
                </div>
                <Button
                  size="sm"
                  onClick={() => toggleFeatured(p.id, true)}
                  disabled={togglingId === p.id}
                  className="bg-[#c9a84c] hover:bg-[#a88950] text-[#0a0a0a] flex-shrink-0"
                >
                  {togglingId === p.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Plus className="w-4 h-4 mr-1" /> Pridať</>}
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}