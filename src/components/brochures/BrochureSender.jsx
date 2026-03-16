import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Send, Eye, Download } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import BrochurePreview from "./BrochurePreview";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function BrochureSender({ property, open, onClose }) {
  const [template, setTemplate] = useState("luxury");
  const [recipients, setRecipients] = useState([]);
  const [customEmail, setCustomEmail] = useState("");
  const [subject, setSubject] = useState(`Exclusive Property: ${property?.title}`);
  const [message, setMessage] = useState(`Dear Client,\n\nWe are pleased to present this exclusive property opportunity in ${property?.city}, ${property?.country}.\n\nPlease find the detailed property brochure attached.\n\nBest regards,\nNehnuteľnosti v zahraničí`);
  const [sending, setSending] = useState(false);
  const [tab, setTab] = useState("compose");

  const { data: clients = [] } = useQuery({
    queryKey: ["clients"],
    queryFn: () => base44.entities.Client.list("-created_date", 200),
  });

  const eligibleClients = clients.filter(c => c.email && ["lead", "active", "negotiating"].includes(c.status));

  const toggleRecipient = (email) => {
    setRecipients(prev => prev.includes(email) ? prev.filter(e => e !== email) : [...prev, email]);
  };

  const generatePDF = async () => {
    const element = document.getElementById("brochure-preview");
    const canvas = await html2canvas(element, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    return pdf.output("blob");
  };

  const handleSend = async () => {
    const allRecipients = [...recipients];
    if (customEmail && !allRecipients.includes(customEmail)) {
      allRecipients.push(customEmail);
    }

    if (allRecipients.length === 0) {
      toast.error("Please select at least one recipient");
      return;
    }

    setSending(true);

    // Generate PDF
    const pdfBlob = await generatePDF();
    const pdfFile = new File([pdfBlob], `${property.title.replace(/[^a-z0-9]/gi, '_')}_brochure.pdf`, { type: "application/pdf" });
    const { file_url } = await base44.integrations.Core.UploadFile({ file: pdfFile });

    // Send emails
    for (const email of allRecipients) {
      const emailBody = `${message}\n\n---\n\nProperty: ${property.title}\nLocation: ${property.city}, ${property.country}\nPrice: €${property.price?.toLocaleString()}\n\nView brochure: ${file_url}`;
      
      await base44.integrations.Core.SendEmail({
        to: email,
        subject: subject,
        body: emailBody,
      });
    }

    toast.success(`Brochure sent to ${allRecipients.length} recipient(s)`);
    setSending(false);
    onClose();
  };

  const handleDownload = async () => {
    const pdfBlob = await generatePDF();
    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${property?.title.replace(/[^a-z0-9]/gi, '_')}_brochure.pdf`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Brochure downloaded");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Send Property Brochure</DialogTitle>
        </DialogHeader>

        <Tabs value={tab} onValueChange={setTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="compose">Compose</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="recipients">Recipients</TabsTrigger>
          </TabsList>

          <TabsContent value="compose" className="space-y-4">
            <div>
              <Label>Template Style</Label>
              <Select value={template} onValueChange={setTemplate}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="luxury">Luxury Template</SelectItem>
                  <SelectItem value="modern">Modern Template</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Email Subject</Label>
              <Input value={subject} onChange={e => setSubject(e.target.value)} />
            </div>

            <div>
              <Label>Email Message</Label>
              <Textarea value={message} onChange={e => setMessage(e.target.value)} rows={6} />
            </div>
          </TabsContent>

          <TabsContent value="preview">
            <div className="border rounded-lg p-6 bg-gray-50 max-h-[500px] overflow-y-auto">
              <div id="brochure-preview">
                <BrochurePreview property={property} template={template} />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button variant="outline" onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" /> Download PDF
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="recipients" className="space-y-4">
            <div>
              <Label>Select Clients ({recipients.length} selected)</Label>
              <div className="border rounded-lg p-4 max-h-64 overflow-y-auto mt-2 space-y-2">
                {eligibleClients.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-4">No clients with email available</p>
                ) : eligibleClients.map(client => (
                  <div key={client.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                    <Checkbox
                      checked={recipients.includes(client.email)}
                      onCheckedChange={() => toggleRecipient(client.email)}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{client.full_name}</p>
                      <p className="text-xs text-gray-500">{client.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Or Enter Custom Email</Label>
              <Input
                type="email"
                value={customEmail}
                onChange={e => setCustomEmail(e.target.value)}
                placeholder="client@example.com"
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setTab("preview")}>
              <Eye className="w-4 h-4 mr-2" /> Preview
            </Button>
            <Button onClick={handleSend} disabled={sending} className="bg-[#0a1628] hover:bg-[#132039]">
              {sending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
              Send Brochure
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}