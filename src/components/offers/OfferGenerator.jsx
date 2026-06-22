import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Send, Download, Eye, FileText, Sparkles } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import OfferPreview from "./OfferPreview";

export default function OfferGenerator({ open, onClose }) {
  const [propertyId, setPropertyId] = useState("");
  const [clientId, setClientId] = useState("none");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [tab, setTab] = useState("compose");

  const { data: properties = [] } = useQuery({
    queryKey: ["properties"],
    queryFn: () => base44.entities.Property.filter({ status: "available" }, "-created_date", 200),
  });

  const { data: clients = [] } = useQuery({
    queryKey: ["clients"],
    queryFn: () => base44.entities.Client.list("-created_date", 200),
  });

  const { data: user } = useQuery({
    queryKey: ["me"],
    queryFn: () => base44.auth.me().catch(() => null),
  });

  const selectedProperty = useMemo(
    () => properties.find(p => p.id === propertyId),
    [properties, propertyId]
  );

  const selectedClient = useMemo(
    () => clients.find(c => c.id === clientId),
    [clients, clientId]
  );

  const handlePropertyChange = (id) => {
    setPropertyId(id);
    const prop = properties.find(p => p.id === id);
    if (prop) {
      setSubject(`Exkluzívna ponuka: ${prop.title} – ${prop.city}, ${prop.country}`);
    }
  };

  const handleClientChange = (id) => {
    setClientId(id);
    const client = clients.find(c => c.id === id);
    if (client && id !== "none") {
      setMessage(`Vážený/á ${client.full_name},\n\nna základe našej konzultácie Vám s potešením predkladáme ponuku na vyššie uvedenú nehnuteľnosť. Táto nehnuteľnosť spĺňa Vaše požiadavky a predstavuje vynikajúcu investičnú príležitosť.\n\nPripravili sme pre Vás kompletné informácie vrátane parametrov, fotogalérie a procesu kúpy. V prípade záujmu Vám radi zorganizujeme osobnú prehliadku alebo online prezentáciu.\n\nS pozdravom,\n${user?.full_name || "Váš tím"}\nNehnuteľnosti v zahraničí`);
    }
  };

  const generatePDF = async () => {
    const element = document.getElementById("offer-preview");
    const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= 297;
    while (heightLeft > 0) {
      position -= 297;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= 297;
    }
    return pdf.output("blob");
  };

  const handleDownload = async () => {
    if (!selectedProperty) {
      toast.error("Vyberte nehnuteľnosť");
      return;
    }
    try {
      const pdfBlob = await generatePDF();
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Ponuka_${selectedProperty.title.replace(/[^a-z0-9]/gi, '_')}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Ponuka bola stiahnutá");
    } catch (e) {
      toast.error("Chyba pri generovaní PDF");
    }
  };

  const handleSend = async () => {
    if (!selectedProperty) {
      toast.error("Vyberte nehnuteľnosť");
      return;
    }
    if (!selectedClient?.email) {
      toast.error("Vybraný klient nemá email");
      return;
    }

    setSending(true);
    try {
      const pdfBlob = await generatePDF();
      const pdfFile = new File([pdfBlob], `Ponuka_${selectedProperty.title.replace(/[^a-z0-9]/gi, '_')}.pdf`, { type: "application/pdf" });
      const { file_url } = await base44.integrations.Core.UploadFile({ file: pdfFile });

      const emailBody = `${message}\n\n---\n\nNehnuteľnosť: ${selectedProperty.title}\nLokalita: ${selectedProperty.city}, ${selectedProperty.country}\nCena: ${selectedProperty.price?.toLocaleString()} ${selectedProperty.currency || "EUR"}\n\nPonuka na stiahnutie (PDF): ${file_url}`;

      await base44.integrations.Core.SendEmail({
        to: selectedClient.email,
        subject: subject || `Exkluzívna ponuka: ${selectedProperty.title}`,
        body: emailBody,
      });

      // Log interaction
      await base44.entities.Interaction.create({
        client_id: selectedClient.id,
        property_id: selectedProperty.id,
        type: "email",
        summary: `Odoslaná profesionálna ponuka na nehnuteľnosť ${selectedProperty.title}`,
        date: new Date().toISOString(),
        agent_email: user?.email,
        outcome: "Ponuka odoslaná klientovi",
      });

      toast.success(`Ponuka odoslaná na ${selectedClient.email}`);
      onClose();
    } catch (e) {
      toast.error("Chyba pri odosielaní: " + e.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#c9a84c]" />
            Generátor profesionálnej ponuky
          </DialogTitle>
        </DialogHeader>

        <Tabs value={tab} onValueChange={setTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="compose">Nastavenie</TabsTrigger>
            <TabsTrigger value="preview">Náhľad ponuky</TabsTrigger>
          </TabsList>

          <TabsContent value="compose" className="space-y-4">
            <div>
              <Label>Nehnuteľnosť *</Label>
              <Select value={propertyId} onValueChange={handlePropertyChange}>
                <SelectTrigger><SelectValue placeholder="Vyberte nehnuteľnosť" /></SelectTrigger>
                <SelectContent>
                  {properties.map(p => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.title} – {p.city}, {p.country} ({p.price?.toLocaleString()} {p.currency || "EUR"})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Klient (príjemca)</Label>
              <Select value={clientId} onValueChange={handleClientChange}>
                <SelectTrigger><SelectValue placeholder="Vyberte klienta" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">— Bez klienta (všeobecná ponuka) —</SelectItem>
                  {clients.filter(c => c.email).map(c => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.full_name} – {c.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {clientId !== "none" && selectedClient && !selectedClient.email && (
                <p className="text-xs text-red-500 mt-1">Tento klient nemá zadaný email – ponuku nemožno odoslať.</p>
              )}
            </div>

            <div>
              <Label>Predmet emailu</Label>
              <Input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Predmet ponuky" />
            </div>

            <div>
              <Label>Osobný odkaz pre klienta</Label>
              <Textarea value={message} onChange={e => setMessage(e.target.value)} rows={6} placeholder="Napíšte personalizovaný odkaz..." />
            </div>

            {selectedProperty?.brochure_url && (
              <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <FileText className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-800">K nehnuteľnosti existuje PDF brožúra</p>
                  <p className="text-xs text-green-600">Odkaz na brožúru bude automaticky pridaný do emailu</p>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="preview">
            {selectedProperty ? (
              <>
                <div className="border rounded-lg p-4 bg-gray-100 max-h-[60vh] overflow-y-auto">
                  <div id="offer-preview">
                    <OfferPreview property={selectedProperty} client={selectedClient} agent={user} message={message} />
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <Button variant="outline" onClick={handleDownload}>
                    <Download className="w-4 h-4 mr-2" /> Stiahnuť PDF
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-16 text-gray-400">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p>Vyberte nehnuteľnosť pre zobrazenie náhľadu ponuky</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={onClose}>Zrušiť</Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setTab("preview")}>
              <Eye className="w-4 h-4 mr-2" /> Náhľad
            </Button>
            <Button onClick={handleSend} disabled={sending || !selectedProperty || (clientId !== "none" && !selectedClient?.email)} className="bg-[#0a1628] hover:bg-[#132039]">
              {sending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
              Odoslať klientovi
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}