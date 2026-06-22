import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StickyNote } from "lucide-react";

export default function QuickNote({ leadId, onAdd, saving, t }) {
  const [note, setNote] = useState("");
  const [open, setOpen] = useState(false);

  const handleAdd = () => {
    if (!note.trim()) return;
    onAdd(note.trim());
    setNote("");
    setOpen(false);
  };

  if (!open) {
    return (
      <Button size="sm" variant="ghost" className="w-full text-xs" onClick={() => setOpen(true)}>
        <StickyNote className="w-3.5 h-3.5 mr-1" />
        {t('addNote') || "Pridať poznámku"}
      </Button>
    );
  }

  return (
    <div className="flex gap-1">
      <Input
        autoFocus
        value={note}
        onChange={e => setNote(e.target.value)}
        onKeyDown={e => { if (e.key === "Enter") handleAdd(); if (e.key === "Escape") { setOpen(false); setNote(""); } }}
        placeholder={t('notePlaceholder') || "Poznámka..."}
        className="h-8 text-xs"
      />
      <Button size="sm" onClick={handleAdd} disabled={saving || !note.trim()} className="h-8 px-2 bg-[#0a1628] hover:bg-[#132039]">
        ✓
      </Button>
    </div>
  );
}