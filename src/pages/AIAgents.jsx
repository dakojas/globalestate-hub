import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Sparkles, FileText, ArrowRight, Bot, Globe, MessageCircle, CalendarClock, Search, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import PartnerSync from "@/components/dashboard/PartnerSync";

const AGENTS = [
  {
    name: "Generátor popisov",
    page: "PropertyAgent",
    icon: Sparkles,
    description: "Vytvára profesionálne popisy nehnuteľností a prekladá ich do viacerých jazykov.",
    tasks: ["Písanie popisov", "Preklady do EN/DE/FR...", "Vylepšenie textov"],
    color: "from-violet-500 to-purple-600",
    iconBg: "bg-violet-100 text-violet-600",
  },
  {
    name: "Generátor ponúk",
    page: "OfferAgent",
    icon: FileText,
    description: "Vytvára a odosiela profesionálne ponuky klientom s automatickou províziou 6000 EUR.",
    tasks: ["Ponuky v 8 jazykoch", "Odoslanie emailom", "Príloha katalógu"],
    color: "from-amber-500 to-orange-600",
    iconBg: "bg-amber-100 text-amber-600",
  },
  {
    name: "EYA",
    page: "ClientInquiryAgent",
    icon: MessageCircle,
    description: "Verejný AI asistent — odpovedá na otázky návštevníkov v ich jazyku, pomáha s výberom nehnuteľností a vysvetľuje proces nákupu v zahraničí.",
    tasks: ["Odpovede v 8 jazykoch", "Vyhľadávanie nehnuteľností", "Kroky nákupu"],
    color: "from-sky-500 to-blue-600",
    iconBg: "bg-sky-100 text-sky-600",
  },
  {
    name: "Plánovač obhliadok",
    page: "ViewingScheduler",
    icon: CalendarClock,
    description: "Spravuje harmonogram obhliadok, nastavuje pripomienky klientom a koordinuje s realitnými agentúrami.",
    tasks: ["Scheduling obhliadok", "Pripomienky klientom", "Koordinácia s agentúrami"],
    color: "from-emerald-500 to-teal-600",
    iconBg: "bg-emerald-100 text-emerald-600",
  },
  {
    name: "Vyhľadávač nehnuteľností",
    page: "PropertyFinder",
    icon: Search,
    description: "Filtruje ponuky v 16 krajinách podľa osobných preferencií, rozpočtu a účelu investície.",
    tasks: ["Filter podľa krajiny", "Rozpočet a typ", "Match s klientom"],
    color: "from-amber-500 to-orange-600",
    iconBg: "bg-amber-100 text-amber-600",
  },
  {
    name: "Vedomostná báza EYA",
    page: "EyaKnowledge",
    icon: BookOpen,
    description: "Správa vzorových odpovedí na časté otázky klientov pre presnejšiu komunikáciu agenta EYA.",
    tasks: ["Pridávanie odpovedí", "Kategorizácia", "Kľúčové slová"],
    color: "from-[#c9a84c] to-[#a88950]",
    iconBg: "bg-amber-100 text-amber-600",
  },
];

export default function AIAgents() {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-[#c9a84c]/15 flex items-center justify-center">
            <Bot className="w-5 h-5 text-[#c9a84c]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#0a1628]">AI Agenti</h2>
            <p className="text-sm text-gray-500">Vyberte si agenta, ktorý vám pomôže s konkrétnou úlohou</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {AGENTS.map((agent) => (
          <Link key={agent.page} to={createPageUrl(agent.page)}>
            <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group h-full overflow-hidden relative">
              <div className={`h-1.5 bg-gradient-to-r ${agent.color}`} />
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl ${agent.iconBg} flex items-center justify-center flex-shrink-0`}>
                    <agent.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-[#0a1628] mb-1">{agent.name}</h3>
                    <p className="text-sm text-gray-500 mb-4">{agent.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {agent.tasks.map((task, i) => (
                        <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                          {task}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-1.5 text-sm font-medium text-[#c9a84c] group-hover:gap-2.5 transition-all">
                      Spustiť agenta <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Partner Sync Agent */}
      <div>
        <div className="flex items-center gap-2.5 mb-3">
          <Globe className="w-5 h-5 text-[#c9a84c]" />
          <h3 className="font-semibold text-[#0a1628]">Synchronizácia partnerov</h3>
        </div>
        <PartnerSync />
      </div>

      <Card className="border-0 shadow-sm bg-gradient-to-br from-[#0a1628] to-[#132039]">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#c9a84c]/20 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-[#c9a84c]" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">Čo príde ďalej?</h3>
              <p className="text-sm text-white/60">
                Postupne pribudnú ďalší agenti — pre analýzu trhu, správu klientov, generovanie zmlúv a ďalšie. Ak máte nápad na nového agenta, dajte vedieť.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}