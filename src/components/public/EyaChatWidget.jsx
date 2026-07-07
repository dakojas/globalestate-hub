import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Send, X, Loader2, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";

const AGENT_NAME = "eya";

export default function EyaChatWidget({ lang = "sk" }) {
  const [open, setOpen] = useState(false);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);

  const UI = {
    sk: { title: "EYA — Asistent", subtitle: "Opýtajte sa na čokoľvek o nehnuteľnostiach", placeholder: "Napíšte vašu otázku...", greeting: "Ahoj! 👋 Som EYA, váš osobný asistent pre nehnuteľnosti v zahraničí. Ako vám môžem pomôcť?" },
    en: { title: "EYA — Assistant", subtitle: "Ask anything about properties", placeholder: "Type your question...", greeting: "Hi! 👋 I'm EYA, your personal assistant for international real estate. How can I help you?" },
    de: { title: "EYA — Assistent", subtitle: "Fragen Sie alles über Immobilien", placeholder: "Schreiben Sie Ihre Frage...", greeting: "Hallo! 👋 Ich bin EYA, Ihr persönlicher Assistent für Immobilien im Ausland. Wie kann ich helfen?" },
    fr: { title: "EYA — Assistant", subtitle: "Posez vos questions sur l'immobilier", placeholder: "Écrivez votre question...", greeting: "Bonjour! 👋 Je suis EYA, votre assistant personnel pour l'immobilier à l'étranger. Comment puis-je vous aider?" },
    it: { title: "EYA — Assistente", subtitle: "Chiedi qualsiasi cosa sulle proprietà", placeholder: "Scrivi la tua domanda...", greeting: "Ciao! 👋 Sono EYA, il tuo assistente personale per gli immobili all'estero. Come posso aiutarti?" },
    ru: { title: "EYA — Ассистент", subtitle: "Спросите о недвижимости", placeholder: "Напишите ваш вопрос...", greeting: "Привет! 👋 Я EYA, ваш личный помощник по зарубежной недвижимости. Чем могу помочь?" },
    pl: { title: "EYA — Asystent", subtitle: "Zapytaj o nieruchomości", placeholder: "Napisz swoje pytanie...", greeting: "Cześć! 👋 Jestem EYA, twój osobisty asystent ds. nieruchomości za granicą. Jak mogę pomóc?" },
    hu: { title: "EYA — Asszisztens", subtitle: "Kérdezzen az ingatlanokról", placeholder: "Írja kérdését...", greeting: "Szia! 👋 Én vagyok EYA, a személyes asszisztense a külföldi ingatlanokhoz. Hogyan segíthetek?" },
  };

  const t = UI[lang] || UI.en;

  useEffect(() => {
    if (!open) return;
    let unsub = () => {};
    (async () => {
      if (conversation) return;
      setLoading(true);
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
            metadata: { name: "EYA Public Chat" },
          });
          setConversation(conv);
          setMessages([{ role: "assistant", content: t.greeting }]);
          unsub = base44.agents.subscribeToConversation(conv.id, (data) => {
            setMessages(data.messages || []);
          });
        }
      } catch (e) {
        setMessages([{ role: "assistant", content: t.greeting }]);
      } finally {
        setLoading(false);
      }
    })();
    return () => unsub();
  }, [open]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    const content = input.trim();
    if (!content || sending) return;
    setInput("");
    setSending(true);

    if (!conversation) {
      setMessages(prev => [...prev, { role: "user", content }, { role: "assistant", content: "..." }]);
      try {
        const conv = await base44.agents.createConversation({
          agent_name: AGENT_NAME,
          metadata: { name: "EYA Public Chat" },
        });
        setConversation(conv);
        base44.agents.subscribeToConversation(conv.id, (data) => {
          setMessages(data.messages || []);
        });
        await base44.agents.addMessage(conv, { role: "user", content });
      } catch (e) {
        setMessages(prev => [...prev, { role: "assistant", content: "⚠️ " + (lang === "sk" ? "Prepáčte, momentálne nie je k dispozícii. Kontaktujte nás cez WhatsApp." : "Sorry, currently unavailable. Please contact us via WhatsApp.") }]);
      } finally {
        setSending(false);
      }
      return;
    }

    setMessages(prev => [...prev, { role: "user", content }]);
    try {
      await base44.agents.addMessage(conversation, { role: "user", content });
    } catch (e) {
      setMessages(prev => [...prev, { role: "assistant", content: "⚠️ " + (lang === "sk" ? "Prepáčte, vyskytla sa chyba. Skúste to znova alebo kontaktujte nás cez WhatsApp." : "Sorry, an error occurred. Please try again or contact us via WhatsApp.") }]);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 left-6 z-50 flex items-center gap-2 bg-gradient-to-br from-[#c9a84c] to-[#a88950] text-[#0a1628] font-bold px-5 py-3.5 rounded-full shadow-2xl shadow-[#c9a84c]/40 hover:scale-105 transition-all duration-300 group"
        >
          <div className="w-7 h-7 rounded-full bg-[#0a1628] flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-[#c9a84c]" />
          </div>
          <span className="text-sm">EYA</span>
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-[#c9a84c] animate-pulse" />
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-6 left-6 z-50 w-[calc(100vw-3rem)] sm:w-96 h-[550px] max-h-[75vh] flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-[#c5a065]/30"
          style={{ background: "var(--bg-card, #16223a)" }}>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10" style={{ background: "var(--bg-hero, #0a1423)" }}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#c9a84c] to-[#a88950] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[#0a1628]" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{t.title}</p>
                <p className="text-white/50 text-xs flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full" /> {t.subtitle}
                </p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/50 hover:text-white p-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3" style={{ background: "var(--bg-page, #0e1a2e)" }}>
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-6 h-6 text-[#c9a84c] animate-spin" />
              </div>
            ) : (
              <>
                {messages.length === 0 && (
                  <div className="text-white/40 text-center text-sm py-8">
                    {t.greeting}
                  </div>
                )}
                {messages.map((msg, i) => {
                  const isUser = msg.role === "user";
                  return (
                    <div key={i} className={isUser ? "flex justify-end" : "flex justify-start"}>
                      <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm ${isUser ? "bg-[#c9a84c] text-[#0a1628]" : "text-white/90"}`}
                        style={!isUser ? { background: "var(--bg-card-alt, rgba(22,34,58,0.6))" } : {}}>
                        {isUser ? (
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                        ) : (
                          <ReactMarkdown className="prose prose-sm prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">{msg.content}</ReactMarkdown>
                        )}
                      </div>
                    </div>
                  );
                })}
                {sending && (
                  <div className="flex justify-start">
                    <div className="rounded-2xl px-4 py-3" style={{ background: "var(--bg-card-alt, rgba(22,34,58,0.6))" }}>
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-white/10" style={{ background: "var(--bg-card, #16223a)" }}>
            <div className="flex gap-2 items-end">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder={t.placeholder}
                rows={1}
                className="flex-1 resize-none bg-white/10 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#c5a065]/50 max-h-24"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || sending}
                className="w-10 h-10 rounded-xl bg-[#c9a84c] hover:bg-[#a88950] text-[#0a1628] flex items-center justify-center disabled:opacity-40 transition-colors flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}