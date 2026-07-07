import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { MessageCircle, Globe, Bot, Activity, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend
} from "recharts";

const LANGUAGE_FLAGS = {
  sk: "🇸🇰",
  en: "🇬🇧",
  de: "🇩🇪",
  fr: "🇫🇷",
  it: "🇮🇹",
  ru: "🇷🇺",
  pl: "🇵🇱",
  hu: "🇭🇺",
  other: "🌍"
};

const LANGUAGE_NAMES = {
  sk: "Slovenčina",
  en: "English",
  de: "Deutsch",
  fr: "Français",
  it: "Italiano",
  ru: "Русский",
  pl: "Polski",
  hu: "Magyar",
  other: "Iné"
};

const CHART_COLORS = ["#c9a84c", "#3b82f6", "#10b981", "#ef4444", "#8b5cf6", "#f59e0b", "#ec4899", "#14b8a6", "#64748b"];

// Simple language detection based on keywords/characters
function detectLanguage(text) {
  if (!text) return "other";
  const lower = text.toLowerCase();

  // Cyrillic → Russian
  if (/[а-яё]/i.test(text)) return "ru";

  // Hungarian special chars
  if (/[őűáéíóú]/i.test(text) && lower.match(/\b(hogy|vagy|ezt|egy|nem|igen|kér|szép|ház|lakás|ár)\b/)) return "hu";

  // Polish special chars
  if (/[łąśżźćńó]/i.test(text)) return "pl";

  // German
  if (/[äöüß]/i.test(text) || lower.match(/\b(der|die|das|ich|und|oder|mit|ist|nicht|ein|haus|wohnung|kaufen|preis)\b/)) return "de";

  // French
  if (/[àâçéèêëîïôûùü]/i.test(text) || lower.match(/\b(le|la|les|je|nous|vous|avec|sans|une|une|maison|appartement|prix|acheter)\b/)) return "fr";

  // Italian
  if (lower.match(/\b(il|la|le|che|per|con|sono|casa|appartamento|prezzo|comprare|vorrei|grazie)\b/)) return "it";

  // Slovak
  if (lower.match(/\b(som|ste|sme|alebo|ale|aby|aby|this|dň|cena|byt|dom|kúpiť|chcem|chcem|dobrý|dobrý|den|zdravím|zaujím|nehnuteľ)\b/)) return "sk";

  // English
  if (lower.match(/\b(the|is|are|i|you|we|and|or|with|without|house|apartment|price|buy|want|hello|hi|interested|property)\b/)) return "en";

  return "other";
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "práve teraz";
  if (mins < 60) return `pred ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `pred ${hours} h`;
  const days = Math.floor(hours / 24);
  return `pred ${days} dňami`;
}

export default function EyaAgentStats() {
  const { data: conversations = [], isLoading } = useQuery({
    queryKey: ["eya-conversations"],
    queryFn: async () => {
      const convs = await base44.agents.listConversations({ agent_name: "eya" });
      return convs;
    },
    refetchInterval: 30000,
  });

  const stats = useMemo(() => {
    let totalMessages = 0;
    let userMessages = 0;
    let assistantMessages = 0;
    const langCounts = {};
    const recentConvos = [];

    conversations.forEach(conv => {
      const messages = conv.messages || [];
      let convoLang = "other";
      let firstUserMsg = "";

      for (const msg of messages) {
        totalMessages++;
        if (msg.role === "user") {
          userMessages++;
          if (!firstUserMsg) {
            firstUserMsg = msg.content || "";
            convoLang = detectLanguage(msg.content || "");
          }
        } else if (msg.role === "assistant") {
          assistantMessages++;
        }
      }

      if (firstUserMsg) {
        langCounts[convoLang] = (langCounts[convoLang] || 0) + 1;
      }

      recentConvos.push({
        id: conv.id || conv._id,
        title: conv.metadata?.name || firstUserMsg?.substring(0, 60) || "Konverzácia",
        messageCount: messages.length,
        language: convoLang,
        lastUpdated: conv.updated_date || conv.created_date,
        preview: firstUserMsg?.substring(0, 100),
      });
    });

    recentConvos.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));

    const langData = Object.entries(langCounts)
      .map(([lang, count]) => ({ name: LANGUAGE_NAMES[lang] || lang, value: count, lang, flag: LANGUAGE_FLAGS[lang] || "🌍" }))
      .sort((a, b) => b.value - a.value);

    return {
      totalConversations: conversations.length,
      totalMessages,
      userMessages,
      assistantMessages,
      langData,
      recentConvos: recentConvos.slice(0, 6),
    };
  }, [conversations]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <Skeleton className="h-6 w-48 mb-4" />
        <div className="grid grid-cols-3 gap-4 mb-4">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
        <Skeleton className="h-48" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0a1628] to-[#132039] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#c9a84c]/20 flex items-center justify-center">
            <Bot className="w-5 h-5 text-[#c9a84c]" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm flex items-center gap-2">
              EYA Agent — Prehľad
              <span className="inline-flex items-center gap-1 text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                Aktívny
              </span>
            </h3>
            <p className="text-white/40 text-xs">AI asistent pre návštevníkov webu</p>
          </div>
        </div>
        <Sparkles className="w-5 h-5 text-[#c9a84c]/50" />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-100">
        <div className="p-4 text-center">
          <div className="flex items-center justify-center mb-1">
            <MessageCircle className="w-4 h-4 text-blue-500 mr-1" />
          </div>
          <div className="text-2xl font-bold text-[#0a1628]">{stats.totalConversations}</div>
          <div className="text-[11px] text-gray-500 uppercase tracking-wide">Konverzácie</div>
        </div>
        <div className="p-4 text-center">
          <div className="flex items-center justify-center mb-1">
            <Activity className="w-4 h-4 text-[#c9a84c] mr-1" />
          </div>
          <div className="text-2xl font-bold text-[#0a1628]">{stats.userMessages}</div>
          <div className="text-[11px] text-gray-500 uppercase tracking-wide">Otázok vybavených</div>
        </div>
        <div className="p-4 text-center">
          <div className="flex items-center justify-center mb-1">
            <Globe className="w-4 h-4 text-emerald-500 mr-1" />
          </div>
          <div className="text-2xl font-bold text-[#0a1628]">{stats.langData.length}</div>
          <div className="text-[11px] text-gray-500 uppercase tracking-wide">Jazykov</div>
        </div>
      </div>

      {/* Language breakdown + Recent conversations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-5">
        {/* Language pie chart */}
        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Jazyková štruktúra</h4>
          {stats.langData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={stats.langData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={65}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {stats.langData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, entry) => [`${value} konverzácií`, `${entry.payload.flag} ${entry.payload.name}`]}
                    contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "12px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-2 mt-2 justify-center">
                {stats.langData.map((lang, i) => (
                  <div key={lang.lang} className="flex items-center gap-1 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
                    <span>{lang.flag}</span>
                    <span className="text-gray-600">{lang.name}</span>
                    <span className="text-gray-400">({lang.value})</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-40 flex items-center justify-center text-gray-400 text-sm">
              Zatiaľ žiadne konverzácie
            </div>
          )}
        </div>

        {/* Recent conversations */}
        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Posledné konverzácie</h4>
          <div className="space-y-2 max-h-[200px] overflow-y-auto">
            {stats.recentConvos.length > 0 ? (
              stats.recentConvos.map((conv) => (
                <div key={conv.id} className="flex items-start gap-2 p-2.5 rounded-lg hover:bg-gray-50 transition-colors">
                  <span className="text-lg flex-shrink-0">{LANGUAGE_FLAGS[conv.language] || "🌍"}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-[#0a1628] truncate">
                      {conv.preview || conv.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-gray-400">
                        {conv.messageCount} správ · {timeAgo(conv.lastUpdated)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-32 flex items-center justify-center text-gray-400 text-sm">
                Žiadne konverzácie
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}