import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, GripVertical } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useTranslation } from "@/components/LanguageContext";
import { toast } from "sonner";

const COLUMNS = [
  { id: "new_lead", color: "bg-blue-500" },
  { id: "contacted", color: "bg-cyan-500" },
  { id: "qualified", color: "bg-indigo-500" },
  { id: "offers_sent", color: "bg-amber-500" },
  { id: "viewing", color: "bg-purple-500" },
  { id: "reserved", color: "bg-orange-500" },
  { id: "closed", color: "bg-emerald-500" },
  { id: "lost", color: "bg-gray-400" },
];

export default function ClientsKanban({ search }) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [draggingId, setDraggingId] = useState(null);

  const { data: clients = [], isLoading } = useQuery({
    queryKey: ["clients"],
    queryFn: () => base44.entities.Client.list("-created_date", 500),
  });

  const filtered = clients.filter(c => {
    if (!search) return true;
    const s = search.toLowerCase();
    return c.full_name?.toLowerCase().includes(s) || c.email?.toLowerCase().includes(s);
  });

  const onDragEnd = async (result) => {
    setDraggingId(null);
    const { destination, source, draggableId } = result;
    if (!destination || destination.droppableId === source.droppableId) return;
    const newStatus = destination.droppableId;
    const client = clients.find(c => c.id === draggableId);
    if (!client) return;

    // Optimistic update
    queryClient.setQueryData(["clients"], (old) =>
      old.map(c => c.id === client.id ? { ...c, status: newStatus } : c)
    );

    try {
      await base44.entities.Client.update(client.id, { status: newStatus });
      toast.success(`${client.full_name} → ${t(newStatus) || newStatus}`);
    } catch (e) {
      toast.error("Chyba pri presúvaní");
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" /></div>;
  }

  return (
    <DragDropContext onDragStart={(s) => setDraggingId(s.draggableId)} onDragEnd={onDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4 -mx-1 px-1">
        {COLUMNS.map(col => {
          const colClients = filtered.filter(c => c.status === col.id);
          return (
            <div key={col.id} className="flex-shrink-0 w-72">
              <div className="flex items-center gap-2 mb-3 px-1">
                <span className={`w-2.5 h-2.5 rounded-full ${col.color}`} />
                <h3 className="text-sm font-semibold text-gray-700">{t(col.id) || col.id}</h3>
                <Badge variant="secondary" className="ml-auto text-xs">{colClients.length}</Badge>
              </div>
              <Droppable droppableId={col.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-h-[120px] space-y-2 p-2 rounded-xl transition-colors ${
                      snapshot.isDraggingOver ? "bg-slate-100" : "bg-slate-50/50"
                    }`}
                  >
                    {colClients.map((client, index) => (
                      <Draggable key={client.id} draggableId={client.id} index={index}>
                        {(p, s) => (
                          <div
                            ref={p.innerRef}
                            {...p.draggableProps}
                            {...p.dragHandleProps}
                            className={`bg-white rounded-lg border border-gray-200 p-3 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing ${
                              draggingId === client.id ? "ring-2 ring-amber-400" : ""
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              <GripVertical className="w-4 h-4 text-gray-300 flex-shrink-0 mt-0.5" />
                              <div className="flex-1 min-w-0">
                                <Link
                                  to={createPageUrl(`ClientDetail?id=${client.id}`)}
                                  className="text-sm font-semibold text-[#0a1628] hover:underline block truncate"
                                >
                                  {client.full_name}
                                </Link>
                                {client.email && (
                                  <p className="flex items-center gap-1.5 text-xs text-gray-500 mt-1 truncate">
                                    <Mail className="w-3 h-3 flex-shrink-0" />
                                    <span className="truncate">{client.email}</span>
                                  </p>
                                )}
                                {client.phone && (
                                  <p className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5 truncate">
                                    <Phone className="w-3 h-3 flex-shrink-0" />
                                    <span className="truncate">{client.phone}</span>
                                  </p>
                                )}
                                {(client.budget_min || client.budget_max) && (
                                  <p className="text-xs text-gray-400 mt-1.5">
                                    €{(client.budget_min || 0).toLocaleString()} – €{(client.budget_max || 0).toLocaleString()}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    {colClients.length === 0 && (
                      <p className="text-xs text-gray-300 text-center py-4">—</p>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}