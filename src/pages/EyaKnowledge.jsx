import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Search, Plus, Edit2, Trash2, BookOpen, Sparkles, Loader2 } from "lucide-react";

const CATEGORIES = [
  { value: "buying_process", label: "Proces nákupu" },
  { value: "investments", label: "Investície a výnosy" },
  { value: "furnishing", label: "Zariadenie apartmánu" },
  { value: "rental_management", label: "Prenájom a správa" },
  { value: "about_us", label: "O nás a spolupráca" },
  { value: "country_specific", label: "Podľa krajiny" },
  { value: "general", label: "Všeobecné" },
];

const LANGUAGES = [
  { value: "all", label: "Všetky jazyky" },
  { value: "sk", label: "Slovenčina" },
  { value: "en", label: "English" },
  { value: "de", label: "Deutsch" },
  { value: "fr", label: "Français" },
  { value: "it", label: "Italiano" },
  { value: "ru", label: "Русский" },
  { value: "pl", label: "Polski" },
  { value: "hu", label: "Magyar" },
];

const CATEGORY_COLORS = {
  buying_process: "bg-blue-100 text-blue-700",
  investments: "bg-emerald-100 text-emerald-700",
  furnishing: "bg-purple-100 text-purple-700",
  rental_management: "bg-amber-100 text-amber-700",
  about_us: "bg-sky-100 text-sky-700",
  country_specific: "bg-rose-100 text-rose-700",
  general: "bg-gray-100 text-gray-700",
};

export default function EyaKnowledge() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterLang, setFilterLang] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    question: "",
    answer: "",
    category: "general",
    language: "all",
    keywords: [],
    is_active: true,
    sort_order: 0,
  });
  const [keywordInput, setKeywordInput] = useState("");

  const loadEntries = async () => {
    setLoading(true);
    try {
      const data = await base44.entities.EyaKnowledge.list("sort_order", 200);
      setEntries(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadEntries(); }, []);

  const filtered = entries.filter(e => {
    const matchSearch = !search ||
      e.question?.toLowerCase().includes(search.toLowerCase()) ||
      e.answer?.toLowerCase().includes(search.toLowerCase()) ||
      e.keywords?.some(k => k.toLowerCase().includes(search.toLowerCase()));
    const matchCat = filterCategory === "all" || e.category === filterCategory;
    const matchLang = filterLang === "all" || e.language === "all" || e.language === filterLang;
    return matchSearch && matchCat && matchLang;
  });

  const openNew = () => {
    setEditing(null);
    setForm({ question: "", answer: "", category: "general", language: "all", keywords: [], is_active: true, sort_order: 0 });
    setKeywordInput("");
    setDialogOpen(true);
  };

  const openEdit = (entry) => {
    setEditing(entry);
    setForm({
      question: entry.question || "",
      answer: entry.answer || "",
      category: entry.category || "general",
      language: entry.language || "all",
      keywords: entry.keywords || [],
      is_active: entry.is_active !== false,
      sort_order: entry.sort_order || 0,
    });
    setKeywordInput("");
    setDialogOpen(true);
  };

  const addKeyword = () => {
    const kw = keywordInput.trim();
    if (kw && !form.keywords.includes(kw)) {
      setForm({ ...form, keywords: [...form.keywords, kw] });
      setKeywordInput("");
    }
  };

  const removeKeyword = (kw) => {
    setForm({ ...form, keywords: form.keywords.filter(k => k !== kw) });
  };

  const handleSave = async () => {
    if (!form.question.trim() || !form.answer.trim()) return;
    setSaving(true);
    try {
      if (editing) {
        await base44.entities.EyaKnowledge.update(editing.id, form);
      } else {
        await base44.entities.EyaKnowledge.create(form);
      }
      setDialogOpen(false);
      loadEntries();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Naozaj zmazať tento záznam?")) return;
    try {
      await base44.entities.EyaKnowledge.delete(id);
      loadEntries();
    } catch (e) { console.error(e); }
  };

  const toggleActive = async (entry) => {
    try {
      await base44.entities.EyaKnowledge.update(entry.id, { is_active: !entry.is_active });
      loadEntries();
    } catch (e) { console.error(e); }
  };

  const getCategoryLabel = (val) => CATEGORIES.find(c => c.value === val)?.label || val;
  const getLangLabel = (val) => LANGUAGES.find(l => l.value === val)?.label || val;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#c9a84c] to-[#a88950] flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-[#0a1628]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#0a1628]">Vedomostná báza EYA</h1>
            <p className="text-sm text-gray-500">Vzorové odpovede na časté otázky klientov</p>
          </div>
        </div>
        <Button onClick={openNew} className="bg-[#0a1628] hover:bg-[#132039]">
          <Plus className="w-4 h-4" /> Pridať záznam
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center"><BookOpen className="w-5 h-5 text-blue-600" /></div>
            <div>
              <p className="text-2xl font-bold text-[#0a1628]">{entries.length}</p>
              <p className="text-xs text-gray-500">Celkom záznamov</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center"><Sparkles className="w-5 h-5 text-emerald-600" /></div>
            <div>
              <p className="text-2xl font-bold text-[#0a1628]">{entries.filter(e => e.is_active).length}</p>
              <p className="text-xs text-gray-500">Aktívne</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center"><BookOpen className="w-5 h-5 text-amber-600" /></div>
            <div>
              <p className="text-2xl font-bold text-[#0a1628]">{entries.filter(e => e.is_active === false).length}</p>
              <p className="text-xs text-gray-500">Neaktívne</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center"><BookOpen className="w-5 h-5 text-purple-600" /></div>
            <div>
              <p className="text-2xl font-bold text-[#0a1628]">{new Set(entries.map(e => e.category)).size}</p>
              <p className="text-xs text-gray-500">Kategórií</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input placeholder="Hľadať v otázkach, odpovediach, kľúčových slovách..."
                value={search} onChange={e => setSearch(e.target.value)}
                className="pl-9" />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger><SelectValue placeholder="Kategória" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Všetky kategórie</SelectItem>
                {CATEGORIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filterLang} onValueChange={setFilterLang}>
              <SelectTrigger><SelectValue placeholder="Jazyk" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Všetky jazyky</SelectItem>
                {LANGUAGES.map(l => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-[#c9a84c] animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-4">{entries.length === 0 ? "Zatiaľ nie sú vytvorené žiadne záznamy." : "Žiadne záznamy nezodpovedajú filtrom."}</p>
            {entries.length === 0 && <Button onClick={openNew} className="bg-[#0a1628] hover:bg-[#132039]"><Plus className="w-4 h-4" /> Vytvoriť prvý záznam</Button>}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map(entry => (
            <Card key={entry.id} className={`transition-all ${entry.is_active === false ? "opacity-60" : "hover:shadow-md"}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <Badge className={CATEGORY_COLORS[entry.category] || CATEGORY_COLORS.general}>{getCategoryLabel(entry.category)}</Badge>
                      <Badge variant="outline">{getLangLabel(entry.language)}</Badge>
                      {entry.sort_order > 0 && <Badge variant="outline" className="text-xs">Priorita: {entry.sort_order}</Badge>}
                      {entry.is_active === false && <Badge variant="destructive">Neaktívne</Badge>}
                    </div>
                    <h3 className="font-semibold text-[#0a1628] mb-1">{entry.question}</h3>
                    <p className="text-sm text-gray-600 line-clamp-3 whitespace-pre-wrap">{entry.answer}</p>
                    {entry.keywords?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {entry.keywords.map(kw => (
                          <span key={kw} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{kw}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-1 flex-shrink-0">
                    <Button size="icon" variant="ghost" onClick={() => openEdit(entry)} title="Upraviť">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => toggleActive(entry)} title={entry.is_active ? "Deaktivovať" : "Aktivovať"}>
                      <Sparkles className={`w-4 h-4 ${entry.is_active ? "text-emerald-600" : "text-gray-400"}`} />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(entry.id)} title="Zmazať" className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Upraviť záznam" : "Nový záznam do vedomostnej bázy"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Otázka klienta *</label>
              <Input value={form.question} onChange={e => setForm({ ...form, question: e.target.value })}
                placeholder="Napr.: Aké sú kroky pri nákupe v Dubaji?" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Vzorová odpoveď *</label>
              <Textarea value={form.answer} onChange={e => setForm({ ...form, answer: e.target.value })}
                placeholder="Sem napíšte odpoveď, ktorú má EYA použiť..."
                rows={6} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Kategória</label>
                <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Jazyk</label>
                <Select value={form.language} onValueChange={v => setForm({ ...form, language: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map(l => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Kľúčové slová</label>
              <div className="flex gap-2">
                <Input value={keywordInput} onChange={e => setKeywordInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addKeyword(); } }}
                  placeholder="Pridať kľúčové slovo..." />
                <Button type="button" variant="outline" onClick={addKeyword}>Pridať</Button>
              </div>
              {form.keywords.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {form.keywords.map(kw => (
                    <span key={kw} className="text-xs bg-[#c9a84c]/15 text-[#a88950] px-2 py-1 rounded flex items-center gap-1">
                      {kw}
                      <button onClick={() => removeKeyword(kw)} className="text-[#a88950]/60 hover:text-[#a88950]">×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Priorita (0 = najvyššia)</label>
                <Input type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: Number(e.target.value) })} />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer pb-2">
                  <input type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300" />
                  Aktívny záznam
                </label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Zrušiť</Button>
            <Button onClick={handleSave} disabled={saving || !form.question.trim() || !form.answer.trim()} className="bg-[#0a1628] hover:bg-[#132039]">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {editing ? "Uložiť zmeny" : "Vytvoriť záznam"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}