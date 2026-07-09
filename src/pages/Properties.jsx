import React, { useState } from "react";
import PendingApprovals from "../components/properties/PendingApprovals";
import FeaturedManager from "../components/properties/FeaturedManager";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Trash2, Loader2, Star, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import PropertyCard from "../components/properties/PropertyCard";
import PropertyForm from "../components/properties/PropertyForm";

const COUNTRIES = ["Albania", "Bali", "Hungary", "Bulgaria", "Croatia", "Dominican Republic", "Egypt", "Georgia", "Mauritius", "Oman", "UAE", "Spain", "Italy", "Thailand", "Turkey"];

const COUNTRY_FLAGS = {
  Albania: "🇦🇱", Bali: "🇮🇩", Hungary: "🇭🇺", Bulgaria: "🇧🇬", Croatia: "🇭🇷",
  "Dominican Republic": "🇩🇴", Egypt: "🇪🇬", Georgia: "🇬🇪",
  Mauritius: "🇲🇺", Oman: "🇴🇲", UAE: "🇦🇪", Spain: "🇪🇸",
  Italy: "🇮🇹", Thailand: "🇹🇭", Turkey: "🇹🇷"
};

const COUNTRY_SK = {
  Albania: "Albánsko", Bali: "Bali", Hungary: "Maďarsko", Bulgaria: "Bulharsko", Croatia: "Chorvátsko",
  "Dominican Republic": "Dominikánska republika", Egypt: "Egypt", Georgia: "Gruzínsko",
  Mauritius: "Maurícius", Oman: "Omán", UAE: "SAE (Dubaj)", Spain: "Španielsko",
  Italy: "Taliansko", Thailand: "Thajsko", Turkey: "Turecko"
};

export default function Properties() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const { data: properties = [], isLoading } = useQuery({
    queryKey: ["properties"],
    queryFn: () => base44.entities.Property.list("-created_date", 200),
  });

  const countsByCountry = COUNTRIES.reduce((acc, c) => {
    acc[c] = properties.filter(p => p.country === c).length;
    return acc;
  }, {});

  const filtered = properties.filter(p => {
    const matchSearch = !search || p.title?.toLowerCase().includes(search.toLowerCase()) || p.city?.toLowerCase().includes(search.toLowerCase());
    const matchCountry = !selectedCountry || p.country === selectedCountry;
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchCountry && matchStatus;
  });

  const toggleFeatured = async (propertyId, currentFeatured) => {
    await base44.entities.Property.update(propertyId, { is_featured: !currentFeatured });
    queryClient.invalidateQueries({ queryKey: ["properties"] });
    toast.success(!currentFeatured ? "Nehnuteľnosť je odteraz featured" : "Featured status odstránený");
  };

  const toggleSelect = (id) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filtered.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(filtered.map(p => p.id)));
  };

  const handleBulkDelete = async () => {
    if (!selectedIds.size || !confirm(`Naozaj vymazať ${selectedIds.size} projektov?`)) return;
    setBulkDeleting(true);
    for (const id of selectedIds) {
      await base44.entities.Property.delete(id);
    }
    queryClient.invalidateQueries({ queryKey: ["properties"] });
    setSelectedIds(new Set());
    toast.success(`${selectedIds.size} projektov vymazaných`);
    setBulkDeleting(false);
  };

  // Country grid view
  if (!selectedCountry) {
    return (
      <div className="space-y-6">
        <PendingApprovals />
        <FeaturedManager />
        <div>
          <h2 className="text-2xl font-bold text-[#0a1628] mb-1">Nehnuteľnosti podľa krajín</h2>
          <p className="text-gray-500 text-sm">Vyberte krajinu pre zobrazenie ponúk</p>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[1,2,3,4,5,6,7,8].map(i => <Skeleton key={i} className="h-32 rounded-2xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {COUNTRIES.map(country => (
              <button
                key={country}
                onClick={() => { setSelectedCountry(country); setSearch(""); setStatusFilter("all"); setSelectedIds(new Set()); }}
                className="flex flex-col items-center justify-center gap-3 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#c9a84c]/40 transition-all group text-center"
              >
                <span className="text-4xl">{COUNTRY_FLAGS[country]}</span>
                <div>
                  <p className="font-semibold text-[#0a1628] text-sm group-hover:text-[#c9a84c] transition-colors">{COUNTRY_SK[country] || country}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{countsByCountry[country]} ponúk</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Country detail view
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => setSelectedCountry(null)} className="flex items-center gap-1.5 text-gray-500 hover:text-[#0a1628] transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" /> Všetky krajiny
          </button>
          <span className="text-gray-300">/</span>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{COUNTRY_FLAGS[selectedCountry]}</span>
            <h2 className="text-xl font-bold text-[#0a1628]">{COUNTRY_SK[selectedCountry] || selectedCountry}</h2>
          </div>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-[#0a1628] hover:bg-[#132039]">
          <Plus className="w-4 h-4 mr-2" /> Pridať nehnuteľnosť
        </Button>
      </div>

      {/* Bulk Actions Bar */}
      {selectedIds.size > 0 && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={selectedIds.size === filtered.length && filtered.length > 0}
              onChange={toggleSelectAll}
              className="w-4 h-4 accent-blue-600 cursor-pointer"
            />
            <span className="text-sm font-medium text-gray-700">
              Vybrané: {selectedIds.size} z {filtered.length}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => setSelectedIds(new Set())}>Zrušiť</Button>
            <Button size="sm" onClick={handleBulkDelete} disabled={bulkDeleting} className="bg-red-600 hover:bg-red-700 text-white">
              {bulkDeleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
              Vymazať vybratých ({selectedIds.size})
            </Button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Hľadať nehnuteľnosti..." className="pl-10" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Všetky statusy</SelectItem>
            <SelectItem value="available">Dostupné</SelectItem>
            <SelectItem value="reserved">Rezervované</SelectItem>
            <SelectItem value="sold">Predané</SelectItem>
            <SelectItem value="off_market">Off Market</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-72 rounded-2xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg">Žiadne nehnuteľnosti v {COUNTRY_SK[selectedCountry] || selectedCountry}</p>
          <Button onClick={() => setShowForm(true)} className="mt-4 bg-[#0a1628] hover:bg-[#132039]">
            <Plus className="w-4 h-4 mr-2" /> Pridať prvú nehnuteľnosť
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(p => (
            <div key={p.id} className="relative">
              <input
                type="checkbox"
                checked={selectedIds.has(p.id)}
                onChange={() => toggleSelect(p.id)}
                className="absolute top-4 left-4 w-5 h-5 accent-[#c9a84c] cursor-pointer z-10 rounded"
              />
              <button
                onClick={() => toggleFeatured(p.id, p.is_featured)}
                className={`absolute top-4 right-4 z-10 p-2 rounded-full transition-colors ${
                  p.is_featured ? "bg-[#c9a84c] text-white" : "bg-white/20 text-white/60 hover:text-white"
                }`}
                title="Toggle featured"
              >
                <Star className="w-5 h-5" fill={p.is_featured ? "currentColor" : "none"} />
              </button>
              <PropertyCard property={p} />
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <PropertyForm
          open={showForm}
          onClose={() => setShowForm(false)}
          defaultCountry={selectedCountry}
          onSaved={() => { setShowForm(false); queryClient.invalidateQueries({ queryKey: ["properties"] }); }}
        />
      )}
    </div>
  );
}