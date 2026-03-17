import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Eye, MapPin, Bed, Maximize, User, Mail, Phone, Globe } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const LANG_LABELS = { sk: "🇸🇰 SK", en: "🇬🇧 EN", cs: "🇨🇿 CS", de: "🇩🇪 DE", pl: "🇵🇱 PL", hu: "🇭🇺 HU", ru: "🇷🇺 RU", ar: "🇦🇪 AR", tr: "🇹🇷 TR" };

export default function PendingApprovals() {
  const queryClient = useQueryClient();
  const [preview, setPreview] = useState(null);

  const { data: pending = [] } = useQuery({
    queryKey: ["pending-properties"],
    queryFn: () => base44.entities.Property.filter({ approval_status: "pending_review" }, "-created_date", 50),
  });

  const approve = async (prop) => {
    await base44.entities.Property.update(prop.id, { approval_status: "approved", is_public: true });
    toast.success(`"${prop.title}" schválená a zverejnená`);
    queryClient.invalidateQueries({ queryKey: ["pending-properties"] });
    queryClient.invalidateQueries({ queryKey: ["properties"] });
    setPreview(null);
  };

  const reject = async (prop) => {
    await base44.entities.Property.update(prop.id, { approval_status: "rejected", is_public: false });
    toast.success(`"${prop.title}" zamietnutá`);
    queryClient.invalidateQueries({ queryKey: ["pending-properties"] });
    queryClient.invalidateQueries({ queryKey: ["properties"] });
    setPreview(null);
  };

  if (pending.length === 0) return null;

  return (
    <>
      <Card className="border-0 shadow-sm border-l-4 border-l-amber-400 bg-amber-50">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-amber-900 text-lg">⏳ Čakajú na schválenie</h3>
              <p className="text-amber-700 text-sm">{pending.length} {pending.length === 1 ? "nehnuteľnosť odoslaná" : "nehnuteľností odoslaných"} vlastníkmi</p>
            </div>
          </div>
          <div className="space-y-3">
            {pending.map(prop => (
              <div key={prop.id} className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {prop.images?.[0] && (
                    <img src={prop.images[0]} alt="" className="w-16 h-12 rounded-lg object-cover flex-shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{prop.title}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-1 flex-wrap">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{prop.country}{prop.city ? `, ${prop.city}` : ""}</span>
                      <span className="font-semibold text-emerald-600">€{prop.price?.toLocaleString()}</span>
                      {prop.original_language && <Badge variant="outline" className="text-[10px]">{LANG_LABELS[prop.original_language] || prop.original_language}</Badge>}
                      {prop.owner_name && <span className="flex items-center gap-1"><User className="w-3 h-3" />{prop.owner_name}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                  <Button size="sm" variant="outline" onClick={() => setPreview(prop)} className="h-8 text-xs gap-1">
                    <Eye className="w-3 h-3" /> Náhľad
                  </Button>
                  <Button size="sm" onClick={() => approve(prop)} className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1">
                    <Check className="w-3 h-3" /> Schváliť
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => reject(prop)} className="h-8 text-xs gap-1">
                    <X className="w-3 h-3" /> Zamietnuť
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      {preview && (
        <Dialog open={!!preview} onOpenChange={() => setPreview(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {preview.title}
                <Badge variant="outline" className="text-xs">{LANG_LABELS[preview.original_language] || preview.original_language}</Badge>
              </DialogTitle>
            </DialogHeader>
            {preview.images?.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {preview.images.slice(0, 5).map((img, i) => (
                  <img key={i} src={img} alt="" className="h-40 w-64 object-cover rounded-lg flex-shrink-0" />
                ))}
              </div>
            )}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Krajina / Mesto</p><p className="font-medium">{preview.country}{preview.city ? `, ${preview.city}` : ""}</p></div>
              <div><p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Cena</p><p className="font-bold text-emerald-600 text-lg">€{preview.price?.toLocaleString()}</p></div>
              {preview.area_sqm && <div><p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Plocha</p><p>{preview.area_sqm} m²</p></div>}
              {preview.bedrooms && <div><p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Spálne</p><p>{preview.bedrooms}</p></div>}
            </div>
            {/* Owner contact */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Kontakt vlastníka</p>
              {preview.owner_name && <p className="flex items-center gap-2 text-sm"><User className="w-4 h-4 text-gray-400" />{preview.owner_name}</p>}
              {preview.owner_email && <p className="flex items-center gap-2 text-sm"><Mail className="w-4 h-4 text-gray-400" /><a href={`mailto:${preview.owner_email}`} className="text-blue-600 hover:underline">{preview.owner_email}</a></p>}
              {preview.owner_phone && <p className="flex items-center gap-2 text-sm"><Phone className="w-4 h-4 text-gray-400" />{preview.owner_phone}</p>}
            </div>
            {/* Descriptions */}
            <div className="space-y-3">
              <div><p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">🇸🇰 Popis (SK)</p><p className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 rounded-lg p-3">{preview.description}</p></div>
              {preview.description_en && <div><p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">🇬🇧 Description (EN)</p><p className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 rounded-lg p-3">{preview.description_en}</p></div>}
            </div>
            <div className="flex gap-3 pt-2">
              <Button onClick={() => approve(preview)} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                <Check className="w-4 h-4" /> Schváliť a zverejniť
              </Button>
              <Button variant="destructive" onClick={() => reject(preview)} className="flex-1 gap-2">
                <X className="w-4 h-4" /> Zamietnuť
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}