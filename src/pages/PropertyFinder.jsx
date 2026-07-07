import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Send, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import MessageBubble from "@/components/agent/MessageBubble";

const AGENT_NAME = "property_finder";

const SUGGESTIONS = [
  "Hľadám byt na Bali do 100 000 EUR na investíciu",
  "Chcem vidieť vily v Egypte s bazénom do 200 000 EUR",
  "Aké nehnuteľnosti máte v Chorvátsku pri mori?",
  "Interessuje ma penthouse v Dubaji na prenájom",
];

export default function PropertyFinder() {
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    let unsub = () => {};
    (async () => {
      try {
        const existing = await base44.agents.listConversations({ agent_name: AGENT_NAME });
        if (existing && existing.length > 0) {
          const conv = existing[0];
          setConversation(conv);
          setMessages(conv.messages || []);
          unsub = base44.agents.subscribeToConversation(conv.id, (data) => {
            setMessages(data.messages || []);
          });
        } else {
          const conv = await base44.agents.createConversation({
            agent_name: AGENT_NAME,
            metadata: { name: "Vyhľadávač nehnuteľností" },
          });
          setConversation(conv);
          setMessages([]);
          unsub = base44.agents.subscribeToConversation(conv.id, (data) => {
            setMessages(data.messages || []);
          });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
    return () => unsub();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (text) => {
    const content = (text ?? input).trim();
    if (!content || !conversation || sending) return;
    setInput("");
    setSending(true);
    try {
      await base44.agents.addMessage(conversation, { role: "user", content });
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <Loader2 className="w-8 h-8 text-[#c9a84c] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col">
      <div className="flex items-center gap-3 mb-4 px-1">
        <div className="w-10 h-10 rounded-xl bg-[#c9a84c]/15 flex items-center justify-center">
          <Search className="w-5 h-5 text-[#c9a84c]" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-[#0a1628]">Vyhľadávač nehnuteľností</h2>
          <p className="text-xs text-gray-500">Filtruje ponuky v 16 krajinách podľa preferencií a rozpočtu</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 px-1 py-4">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-10 h-10 text-[#c9a84c]/40 mx-auto mb-3" />
            <p className="text-gray-500 text-sm mb-4">Povedzte mi, akú nehnuteľnosť hľadáte — krajina, rozpočet, typ, účel.</p>
            <div className="flex flex-col gap-2 max-w-md mx-auto">
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(s)}
                  className="text-left text-sm px-4 py-2.5 rounded-lg border border-[#c9a84c]/30 bg-white hover:bg-[#c9a84c]/5 text-[#0a1628] transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} />
        ))}
        {sending && (
          <div className="flex justify-start">
            <div className="bg-[#132039] rounded-2xl px-4 py-2.5">
              <Loader2 className="w-4 h-4 text-white/60 animate-spin" />
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 pt-3">
        <div className="flex gap-2 items-end">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Popíšte svoju vysnívanú nehnuteľnosť... (Enter pre odoslanie)"
            className="resize-none min-h-[44px] max-h-32 flex-1"
            rows={1}
          />
          <Button
            onClick={() => handleSend()}
            disabled={!input.trim() || sending}
            className="bg-[#c9a84c] hover:bg-[#b8973b] text-black font-semibold h-11 px-4"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}