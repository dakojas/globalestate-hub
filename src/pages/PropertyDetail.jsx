import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Bed, Bath, Maximize, ArrowLeft, Pencil, Trash2, ExternalLink, Globe } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { toast } from "sonner";
import PropertyForm from "../components/properties/PropertyForm";

const statusColors = {
  available: "bg-emerald-50 text-emerald-700",
  reserved: "bg-amber-50 text-amber-700",
  sold: "bg-red-50 text-red-700",
  off_market: "bg-gray-100 text-gray-600",
};

export default function PropertyDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  const { data: property, isLoading } = useQuery({
    queryKey: ["property", id],
    queryFn: () => base44.entities.Property.filter({ id }),
    select: (data) => data[0],
    enabled: !!id,
  });

  const handleDelete = async () => {
    if (!confirm("Delete this property?")) return;
    await base44.entities.Property.delete(property.id);
    toast.success("Property deleted");
    queryClient.invalidateQueries({ queryKey: ["properties"] });
    navigate(createPageUrl("Properties"));
  };

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-96 rounded-2xl" /><Skeleton className="h-48 rounded-2xl" /></div>;
  if (!property) return <div className="text-center py-20 text-gray-400">Property not found</div>;

  const images = property.images || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link to={createPageUrl("Properties")} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Properties
        </Link>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setEditing(true)}><Pencil className="w-4 h-4 mr-1" /> Edit</Button>
          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={handleDelete}><Trash2 className="w-4 h-4 mr-1" /> Delete</Button>
        </div>
      </div>

      {/* Image gallery */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <div className="rounded-2xl overflow-hidden bg-gray-100 h-80 lg:h-[450px]">
            {images.length > 0 ? (
              <img src={images[selectedImage]} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0a1628] to-[#132039]">
                <MapPin className="w-16 h-16 text-[#c9a84c]/30" />
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
              {images.map((img, i) => (
                <button key={i} onClick={() => setSelectedImage(i)} className={`w-20 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${i === selectedImage ? "border-[#c9a84c]" : "border-transparent"}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <Badge className={`${statusColors[property.status]} mb-3`}>{property.status?.replace("_"," ")}</Badge>
              <h1 className="text-2xl font-bold text-[#0a1628] mb-2">{property.title}</h1>
              <p className="text-sm text-gray-500 flex items-center gap-1 mb-4"><MapPin className="w-4 h-4" />{property.city}, {property.country}</p>
              <p className="text-3xl font-bold text-[#c9a84c]">€{property.price?.toLocaleString()}</p>
              {property.currency !== "EUR" && <p className="text-sm text-gray-400">{property.currency}</p>}

              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
                {property.bedrooms && <div className="text-center"><Bed className="w-5 h-5 text-gray-400 mx-auto" /><p className="font-semibold mt-1">{property.bedrooms}</p><p className="text-xs text-gray-400">Beds</p></div>}
                {property.bathrooms && <div className="text-center"><Bath className="w-5 h-5 text-gray-400 mx-auto" /><p className="font-semibold mt-1">{property.bathrooms}</p><p className="text-xs text-gray-400">Baths</p></div>}
                {property.area_sqm && <div className="text-center"><Maximize className="w-5 h-5 text-gray-400 mx-auto" /><p className="font-semibold mt-1">{property.area_sqm}</p><p className="text-xs text-gray-400">m²</p></div>}
              </div>
            </CardContent>
          </Card>

          {property.project_name && (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4"><p className="text-xs text-gray-400 uppercase tracking-wider">Project</p><p className="font-semibold text-[#0a1628] mt-1">{property.project_name}</p></CardContent>
            </Card>
          )}

          {property.commission_rate && (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4"><p className="text-xs text-gray-400 uppercase tracking-wider">Commission</p><p className="font-semibold text-[#0a1628] mt-1">{property.commission_rate}%</p></CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {property.description && (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <h3 className="font-semibold text-[#0a1628] mb-3">Description</h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{property.description}</p>
              </CardContent>
            </Card>
          )}

          {property.features?.length > 0 && (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <h3 className="font-semibold text-[#0a1628] mb-3">Features</h3>
                <div className="flex flex-wrap gap-2">
                  {property.features.map((f, i) => (
                    <Badge key={i} variant="outline" className="bg-gray-50">{f}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          {property.portal_links?.length > 0 && (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <h3 className="font-semibold text-[#0a1628] mb-3 flex items-center gap-2"><Globe className="w-4 h-4" /> Portal Links</h3>
                <div className="space-y-2">
                  {property.portal_links.map((pl, i) => (
                    <a key={i} href={pl.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors">
                      <ExternalLink className="w-3.5 h-3.5" />{pl.portal_name}
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {property.latitude && property.longitude && (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <h3 className="font-semibold text-[#0a1628] mb-3 flex items-center gap-2"><MapPin className="w-4 h-4" /> Location</h3>
                <p className="text-sm text-gray-500">{property.latitude}, {property.longitude}</p>
                <a href={`https://www.google.com/maps?q=${property.latitude},${property.longitude}`} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:text-blue-800 mt-2 inline-block">Open in Google Maps →</a>
              </CardContent>
            </Card>
          )}

          {property.notes && (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <h3 className="font-semibold text-[#0a1628] mb-3">Notes</h3>
                <p className="text-sm text-gray-600">{property.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {editing && (
        <PropertyForm
          property={property}
          open={editing}
          onClose={() => setEditing(false)}
          onSaved={() => { setEditing(false); queryClient.invalidateQueries({ queryKey: ["property", id] }); queryClient.invalidateQueries({ queryKey: ["properties"] }); }}
        />
      )}
    </div>
  );
}