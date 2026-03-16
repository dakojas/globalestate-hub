import React, { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2, Download, FileText, MapPin, Bed, Bath, Maximize, Mail, Phone, Tag } from "lucide-react";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function PdfContent({ property, template }) {
  const images = property?.images || [];
  const mainImage = images[0];

  if (template === "luxury") {
    return (
      <div className="bg-white" style={{ width: "794px", fontFamily: "Georgia, serif" }}>
        {/* Header */}
        <div className="bg-[#0a1628] text-white p-10 text-center">
          <p className="text-xs tracking-[0.4em] uppercase text-[#c9a84c] mb-2">Nehnuteľnosti v zahraničí</p>
          <h1 className="text-4xl font-light mb-2">{property?.title}</h1>
          <p className="text-sm text-gray-300 flex items-center justify-center gap-1">
            <MapPin className="w-4 h-4" />{property?.city}, {property?.country}
          </p>
        </div>

        {/* Main image + price overlay */}
        {mainImage && (
          <div className="relative" style={{ height: "380px" }}>
            <img src={mainImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} crossOrigin="anonymous" />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(to top, rgba(0,0,0,0.75), transparent)", padding: "2rem" }}>
              <p style={{ color: "#c9a84c", fontSize: "2.5rem", fontWeight: 300 }}>€{property?.price?.toLocaleString()}</p>
              {property?.property_type && <p style={{ color: "white", fontSize: "0.9rem", opacity: 0.8 }}>{property.property_type.charAt(0).toUpperCase() + property.property_type.slice(1)}</p>}
            </div>
          </div>
        )}

        {/* Tech params */}
        <div style={{ padding: "2rem 3rem", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "center", gap: "3rem" }}>
          {property?.bedrooms && (
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: "1.75rem", fontWeight: 300, color: "#0a1628" }}>{property.bedrooms}</p>
              <p style={{ fontSize: "0.7rem", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em" }}>Spálne</p>
            </div>
          )}
          {property?.bathrooms && (
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: "1.75rem", fontWeight: 300, color: "#0a1628" }}>{property.bathrooms}</p>
              <p style={{ fontSize: "0.7rem", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em" }}>Kúpeľne</p>
            </div>
          )}
          {property?.area_sqm && (
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: "1.75rem", fontWeight: 300, color: "#0a1628" }}>{property.area_sqm}</p>
              <p style={{ fontSize: "0.7rem", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em" }}>m²</p>
            </div>
          )}
          {property?.available_units && (
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: "1.75rem", fontWeight: 300, color: "#0a1628" }}>{property.available_units}</p>
              <p style={{ fontSize: "0.7rem", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em" }}>Jednotiek</p>
            </div>
          )}
        </div>

        {/* Description */}
        {property?.description && (
          <div style={{ padding: "2rem 3rem" }}>
            <h3 style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "#c9a84c", marginBottom: "1rem" }}>Popis nehnuteľnosti</h3>
            <p style={{ color: "#4b5563", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{property.description}</p>
          </div>
        )}

        {/* Features */}
        {property?.features?.length > 0 && (
          <div style={{ padding: "0 3rem 2rem" }}>
            <h3 style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "#c9a84c", marginBottom: "1rem" }}>Vybavenie a vlastnosti</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
              {property.features.map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", color: "#6b7280" }}>
                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#c9a84c", flexShrink: 0 }} />
                  {f}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Gallery */}
        {images.length > 1 && (
          <div style={{ padding: "0 3rem 2rem", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
            {images.slice(1, 4).map((img, i) => (
              <div key={i} style={{ aspectRatio: "4/3", overflow: "hidden", borderRadius: "8px" }}>
                <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} crossOrigin="anonymous" />
              </div>
            ))}
          </div>
        )}

        {/* Tech table */}
        <div style={{ padding: "0 3rem 2rem" }}>
          <h3 style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "#c9a84c", marginBottom: "1rem" }}>Technické parametre</h3>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
            <tbody>
              {[
                ["Krajina", property?.country],
                ["Mesto", property?.city],
                ["Typ", property?.property_type],
                ["Cena", property?.price ? `€${property.price.toLocaleString()} ${property.currency || "EUR"}` : null],
                ["Plocha", property?.area_sqm ? `${property.area_sqm} m²` : null],
                ["Spálne", property?.bedrooms],
                ["Kúpeľne", property?.bathrooms],
                ["Projekt", property?.project_name],
                ["Developer", property?.developer],
                ["Účel investície", property?.investment_purpose],
              ].filter(([, v]) => v).map(([label, value], i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "#f9fafb" : "white" }}>
                  <td style={{ padding: "0.5rem 0.75rem", color: "#6b7280", fontWeight: 500 }}>{label}</td>
                  <td style={{ padding: "0.5rem 0.75rem", color: "#0a1628" }}>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div style={{ background: "#f9fafb", borderTop: "1px solid #e5e7eb", padding: "1.5rem", textAlign: "center" }}>
          <p style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.3em", color: "#c9a84c", marginBottom: "0.5rem" }}>Kontaktujte nás</p>
          <p style={{ fontSize: "0.85rem", color: "#4b5563", marginBottom: "0.25rem" }}>Nehnuteľnosti v zahraničí</p>
          <p style={{ fontSize: "0.8rem", color: "#9ca3af" }}>info@nvz.sk • +421 XXX XXX XXX</p>
        </div>
      </div>
    );
  }

  // Modern template
  return (
    <div className="bg-white" style={{ width: "794px", fontFamily: "Inter, sans-serif" }}>
      {/* Hero */}
      <div style={{ position: "relative", height: "320px", background: "#0a1628" }}>
        {mainImage && <img src={mainImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.75 }} crossOrigin="anonymous" />}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(10,22,40,0.9) 0%, rgba(10,22,40,0.4) 100%)" }} />
        <div style={{ position: "absolute", top: "2rem", left: "2.5rem" }}>
          <p style={{ color: "#c9a84c", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: "0.5rem" }}>Nehnuteľnosti v zahraničí</p>
        </div>
        <div style={{ position: "absolute", bottom: "2rem", left: "2.5rem", right: "2.5rem" }}>
          <h1 style={{ color: "white", fontSize: "2.2rem", fontWeight: 700, marginBottom: "0.5rem" }}>{property?.title}</h1>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "0.25rem" }}>📍 {property?.city}, {property?.country}</p>
        </div>
      </div>

      {/* Price bar */}
      <div style={{ background: "#c9a84c", padding: "1rem 2.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ color: "white", fontSize: "1.75rem", fontWeight: 700 }}>€{property?.price?.toLocaleString()}</p>
        <div style={{ display: "flex", gap: "2rem" }}>
          {property?.bedrooms && <span style={{ color: "white", fontSize: "0.85rem" }}>🛏 {property.bedrooms} spální</span>}
          {property?.bathrooms && <span style={{ color: "white", fontSize: "0.85rem" }}>🚿 {property.bathrooms} kúpeľní</span>}
          {property?.area_sqm && <span style={{ color: "white", fontSize: "0.85rem" }}>📐 {property.area_sqm} m²</span>}
        </div>
      </div>

      <div style={{ padding: "2rem 2.5rem" }}>
        {property?.description && (
          <div style={{ marginBottom: "1.5rem" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#0a1628", marginBottom: "0.75rem", borderLeft: "3px solid #c9a84c", paddingLeft: "0.75rem" }}>O nehnuteľnosti</h3>
            <p style={{ color: "#4b5563", lineHeight: 1.7, fontSize: "0.875rem", whiteSpace: "pre-wrap" }}>{property.description}</p>
          </div>
        )}

        {property?.features?.length > 0 && (
          <div style={{ marginBottom: "1.5rem" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#0a1628", marginBottom: "0.75rem", borderLeft: "3px solid #c9a84c", paddingLeft: "0.75rem" }}>Vlastnosti</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem" }}>
              {property.features.map((f, i) => (
                <div key={i} style={{ background: "#f9fafb", borderRadius: "6px", padding: "0.4rem 0.75rem", fontSize: "0.8rem", color: "#374151" }}>✓ {f}</div>
              ))}
            </div>
          </div>
        )}

        {images.length > 1 && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "0.5rem", marginBottom: "1.5rem" }}>
            {images.slice(1, 5).map((img, i) => (
              <div key={i} style={{ aspectRatio: "1", overflow: "hidden", borderRadius: "8px" }}>
                <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} crossOrigin="anonymous" />
              </div>
            ))}
          </div>
        )}

        <div>
          <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#0a1628", marginBottom: "0.75rem", borderLeft: "3px solid #c9a84c", paddingLeft: "0.75rem" }}>Technické parametre</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
            {[
              ["Krajina", property?.country],
              ["Typ", property?.property_type],
              ["Plocha", property?.area_sqm ? `${property.area_sqm} m²` : null],
              ["Projekt", property?.project_name],
              ["Developer", property?.developer],
              ["Investičný účel", property?.investment_purpose],
            ].filter(([, v]) => v).map(([label, value], i) => (
              <div key={i} style={{ background: "#f9fafb", borderRadius: "6px", padding: "0.5rem 0.75rem" }}>
                <p style={{ fontSize: "0.7rem", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</p>
                <p style={{ fontSize: "0.85rem", color: "#0a1628", fontWeight: 600 }}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: "#0a1628", padding: "1.25rem 2.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ color: "white", fontWeight: 600, fontSize: "0.85rem" }}>Nehnuteľnosti v zahraničí</p>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.8rem" }}>info@nvz.sk • +421 XXX XXX XXX</p>
      </div>
    </div>
  );
}

export default function PropertyPdfExport({ property, open, onClose }) {
  const [template, setTemplate] = useState("luxury");
  const [generating, setGenerating] = useState(false);
  const previewRef = useRef(null);

  const handleGenerate = async () => {
    setGenerating(true);
    toast.info("Generujem PDF, prosím čakajte...");

    const element = previewRef.current;
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      width: 794,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pdfWidth = 210;
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    let position = 0;
    const pageHeight = 297;

    if (pdfHeight <= pageHeight) {
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    } else {
      // Multi-page support
      let remaining = pdfHeight;
      while (remaining > 0) {
        pdf.addImage(imgData, "PNG", 0, -position, pdfWidth, pdfHeight);
        remaining -= pageHeight;
        position += pageHeight;
        if (remaining > 0) pdf.addPage();
      }
    }

    const fileName = `${property?.title?.replace(/[^a-z0-9]/gi, "_") || "property"}_ponuka.pdf`;
    pdf.save(fileName);
    toast.success("PDF stiahnuté!");
    setGenerating(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#c9a84c]" />
            Generovať PDF ponuku
          </DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-4 py-3 border-b">
          <div className="flex items-center gap-2">
            <Label className="text-sm whitespace-nowrap">Šablóna:</Label>
            <Select value={template} onValueChange={setTemplate}>
              <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="luxury">Luxury (zlatá)</SelectItem>
                <SelectItem value="modern">Modern (tmavá)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="ml-auto flex gap-2">
            <Button variant="outline" onClick={onClose}>Zrušiť</Button>
            <Button onClick={handleGenerate} disabled={generating} className="bg-[#0a1628] hover:bg-[#132039]">
              {generating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
              Stiahnuť PDF
            </Button>
          </div>
        </div>

        <div className="border rounded-lg overflow-auto bg-gray-100 p-4">
          <div ref={previewRef} className="mx-auto shadow-xl" style={{ width: "794px" }}>
            <PdfContent property={property} template={template} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}