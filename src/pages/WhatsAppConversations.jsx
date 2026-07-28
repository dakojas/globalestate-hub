import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { MessageCircle, Search, Phone, Mail, ArrowLeft, User, Clock, Send, Bot } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

function formatDateTime(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleString("sk-SK", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit"
  });
}

function getConversationLabel(conv) {
  // Try to extract user identity from various possible fields
  if (conv.metadata?.name) return conv.metadata.name;
  if (conv.metadata?.phone) return conv.metadata.phone;
  if (conv.metadata?.whatsapp_number) return conv.metadata.whatsapp_number;
  if (conv.metadata?.user_name) return conv.metadata.user_name;
  if (conv.metadata?.from) return conv.metadata.from;
  // Try to find first user message
  const firstUserMsg = conv.messages?.find(m => m.role === "user");
  if (firstUserMsg?.content) {
    return firstUserMsg.content.slice(0, 40) + (firstUserMsg.content.length > 40 ? "…" : "");
  }
  return `Konverzácia ${conv.id?.slice(-6) || ""}`;
}

function getPhoneNumber(conv) {
  return conv.metadata?.phone || conv.metadata?.whatsapp_number || conv.metadata?.from || null;
}

export default function WhatsAppConversations() {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [agentFilter, setAgentFilter] = useState("eya");

  const { data: conversations = [], isLoading } = useQuery({
    queryKey: ["agent-conversations", agentFilter],
    queryFn: async () => {
      const params = { sort: "-updated_date", limit: 200 };
      if (agentFilter !== "all") {
        params.q = { agent_name: agentFilter };
      }
      return await base44.agents.listConversations(params);
    }
  });

  const { data: selectedConv, isLoading: isLoadingDetail } = useQuery({
    queryKey: ["agent-conversation", selectedId],
    queryFn: async () => {
      if (!selectedId) return null;
      return await base44.agents.getConversation(selectedId);
    },
    enabled: !!selectedId
  });

  // Filter conversations by search term
  const filteredConversations = useMemo(() => {
    if (!search.trim()) return conversations;
    const term = search.toLowerCase();
    return conversations.filter(conv => {
      const label = getConversationLabel(conv).toLowerCase();
      const phone = getPhoneNumber(conv)?.toLowerCase() || "";
      const msgMatch = conv.messages?.some(m =>
        m.content?.toLowerCase().includes(term)
      );
      return label.includes(term) || phone.includes(term) || msgMatch;
    });
  }, [conversations, search]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#25D366]/15 flex items-center justify-center">
          <MessageCircle className="w-5 h-5 text-[#25D366]" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[#0a1628]">WhatsApp konverzácie</h2>
          <p className="text-sm text-gray-500">Prehľad správ a interakcií cez AI agenta</p>
        </div>
      </div>

      {/* Agent filter tabs */}
      <div className="flex gap-2">
        {["eya", "viewing_scheduler", "property_finder", "offer_generator", "property_description_generator", "all"].map(agent => (
          <button
            key={agent}
            onClick={() => setAgentFilter(agent)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              agentFilter === agent
                ? "bg-[#0a1628] text-white"
                : "bg-white text-gray-500 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            {agent === "all" ? "Všetci agenti" : agent.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 h-[calc(100vh-280px)]">
        {/* Conversation list */}
        <div className={`lg:col-span-2 ${selectedId ? "hidden lg:block" : ""}`}>
          <Card className="h-full flex flex-col">
            <div className="p-3 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Hľadať podľa mena, telefónu alebo obsahu…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">
                {filteredConversations.length} {filteredConversations.length === 1 ? "konverzácia" : "konverzácií"}
              </p>
            </div>
            <ScrollArea className="flex-1">
              {isLoading ? (
                <div className="p-8 text-center text-gray-400 text-sm">Načítavam…</div>
              ) : filteredConversations.length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-sm">
                  <MessageCircle className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                  {search ? "Žiadne výsledky vyhľadávania" : "Zatiaľ žiadne konverzácie"}
                </div>
              ) : (
                <div className="divide-y">
                  {filteredConversations.map(conv => {
                    const label = getConversationLabel(conv);
                    const phone = getPhoneNumber(conv);
                    const lastMsg = conv.messages?.[conv.messages?.length - 1];
                    const isSelected = selectedId === conv.id;
                    return (
                      <button
                        key={conv.id}
                        onClick={() => setSelectedId(conv.id)}
                        className={`w-full text-left p-3 hover:bg-gray-50 transition-colors ${
                          isSelected ? "bg-[#c9a84c]/10 border-l-4 border-[#c9a84c]" : ""
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-[#0a1628] truncate">{label}</p>
                            {phone && (
                              <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                <Phone className="w-3 h-3" /> {phone}
                              </p>
                            )}
                            {lastMsg?.content && (
                              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                <span className="text-gray-400">{lastMsg.role === "user" ? "" : "EYA: "}</span>
                                {lastMsg.content.slice(0, 80)}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-1 flex-shrink-0">
                            <span className="text-[10px] text-gray-400">
                              {conv.updated_date ? new Date(conv.updated_date).toLocaleDateString("sk-SK", { day: "2-digit", month: "2-digit" }) : ""}
                            </span>
                            {conv.messages?.length > 0 && (
                              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                {conv.messages.length}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </Card>
        </div>

        {/* Conversation detail */}
        <div className={`lg:col-span-3 ${!selectedId ? "hidden lg:block" : ""}`}>
          <Card className="h-full flex flex-col">
            {!selectedId ? (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-200" />
                  <p className="text-sm">Vyberte konverzáciu vľavo pre zobrazenie správ</p>
                </div>
              </div>
            ) : (
              <>
                {/* Detail header */}
                <div className="p-4 border-b flex items-center gap-3">
                  <button
                    onClick={() => setSelectedId(null)}
                    className="lg:hidden text-gray-500 hover:text-[#0a1628]"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  {selectedConv && !isLoadingDetail ? (
                    <div className="flex-1">
                      <p className="font-semibold text-[#0a1628]">{getConversationLabel(selectedConv)}</p>
                      <div className="flex flex-wrap items-center gap-3 mt-1">
                        {getPhoneNumber(selectedConv) && (
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Phone className="w-3 h-3" /> {getPhoneNumber(selectedConv)}
                          </span>
                        )}
                        {selectedConv.agent_name && (
                          <Badge variant="outline" className="text-[10px]">
                            {selectedConv.agent_name.replace(/_/g, " ")}
                          </Badge>
                        )}
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {formatDateTime(selectedConv.updated_date)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">Načítavam…</p>
                  )}
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1">
                  <div className="p-4 space-y-3">
                    {isLoadingDetail ? (
                      <div className="text-center text-gray-400 text-sm py-8">Načítavam správy…</div>
                    ) : selectedConv?.messages?.length ? (
                      selectedConv.messages.map((msg, i) => {
                        const isUser = msg.role === "user";
                        const isSystem = msg.role === "system";
                        if (isSystem) {
                          return (
                            <div key={i} className="text-center">
                              <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                                {msg.content?.slice(0, 100)}
                              </span>
                            </div>
                          );
                        }
                        return (
                          <div key={i} className={`flex gap-2 ${isUser ? "justify-start" : "justify-end"}`}>
                            <div className={`flex gap-2 max-w-[80%] ${isUser ? "" : "flex-row-reverse"}`}>
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                isUser ? "bg-gray-200" : "bg-[#25D366]/15"
                              }`}>
                                {isUser ? <User className="w-4 h-4 text-gray-500" /> : <Bot className="w-4 h-4 text-[#25D366]" />}
                              </div>
                              <div>
                                <div className={`rounded-2xl px-4 py-2 text-sm ${
                                  isUser
                                    ? "bg-white border border-gray-200 text-gray-800"
                                    : "bg-[#25D366] text-white"
                                }`}>
                                  <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                                  {/* Tool calls */}
                                  {msg.tool_calls?.length > 0 && (
                                    <div className="mt-2 pt-2 border-t border-white/20 space-y-1">
                                      {msg.tool_calls.map((tc, j) => (
                                        <p key={j} className="text-[10px] opacity-80">
                                          ⚙ {tc.name || tc.function?.name || "nástroj"}: {JSON.stringify(tc.arguments || tc.function?.arguments || {}).slice(0, 80)}
                                        </p>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                <p className={`text-[10px] text-gray-400 mt-1 ${isUser ? "text-left" : "text-right"}`}>
                                  {formatDateTime(msg.created_date)}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center text-gray-400 text-sm py-8">Žiadne správy</div>
                    )}
                  </div>
                </ScrollArea>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}