import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import {
  LayoutDashboard, Building2, Users, CalendarClock, DollarSign,
  MapPin, Menu, X, LogOut, ChevronRight, Bell, Languages, UserPlus, BarChart3, Globe, Upload
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/components/LanguageContext";
import Logo from "@/components/Logo";

export default function Layout({ children, currentPageName }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [pendingReminders, setPendingReminders] = useState(0);
  const { t, language, changeLanguage } = useTranslation();

  const navItems = [
    { nameKey: "dashboard", icon: LayoutDashboard, page: "Dashboard" },
    { nameKey: "leads", icon: UserPlus, page: "Leads" },
    { nameKey: "properties", icon: Building2, page: "Properties" },
    { nameKey: "clients", icon: Users, page: "Clients" },
    { nameKey: "calendar", icon: CalendarClock, page: "Calendar" },
    { nameKey: "commissions", icon: DollarSign, page: "Commissions" },
    { nameKey: "referrers", icon: Users, page: "Referrers" },
    { nameKey: "partners", icon: Users, page: "Partners" },
    { nameKey: "realEstateAgencies", icon: Building2, page: "RealEstateAgencies" },
    { nameKey: "reports", icon: BarChart3, page: "Reports" },
    { nameKey: "propertyImport", icon: Upload, page: "PropertyImport" },
    { nameKey: "team", icon: Users, page: "Team", divider: true },
    { nameKey: "publicSite", icon: Globe, page: "PublicHome" },
  ];

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
    base44.entities.Reminder.filter({ status: "pending" }).then(r => setPendingReminders(r.length)).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f6fa] flex">
      <style>{`
        :root {
          --navy: #0a1628;
          --navy-light: #132039;
          --gold: #c9a84c;
          --gold-light: #e8d5a0;
        }
      `}</style>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 left-0 h-screen w-72 bg-[var(--navy)] z-50
        flex flex-col transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Logo className="h-12" />
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/60 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = currentPageName === item.page;
            return (
              <React.Fragment key={item.page}>
                {item.divider && <div className="border-t border-white/10 my-2" />}
                <Link
                  to={createPageUrl(item.page)}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                    ${isActive
                      ? "bg-[var(--gold)]/15 text-[var(--gold)]"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                    }
                  `}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span>{t(item.nameKey)}</span>
                  {item.page === "Calendar" && pendingReminders > 0 && (
                    <Badge className="ml-auto bg-red-500 text-white text-xs px-2">{pendingReminders}</Badge>
                  )}
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                </Link>
              </React.Fragment>
            );
          })}
        </nav>

        {user && (
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-9 h-9 rounded-full bg-[var(--gold)]/20 flex items-center justify-center">
                <span className="text-[var(--gold)] font-semibold text-sm">
                  {user.full_name?.charAt(0) || user.email?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{user.full_name || "Agent"}</p>
                <p className="text-white/40 text-xs truncate">{user.email}</p>
              </div>
              <button onClick={() => base44.auth.logout()} className="text-white/40 hover:text-white">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-gray-200/60 px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-600">
                <Menu className="w-6 h-6" />
              </button>
              <h2 className="text-lg font-semibold text-[var(--navy)]">
                {t(navItems.find(n => n.page === currentPageName)?.nameKey || currentPageName)}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => changeLanguage(language === 'sk' ? 'en' : 'sk')}
              title={language === 'sk' ? 'Switch to English' : 'Prepnúť na slovenčinu'}
            >
              <Languages className="w-4 h-4 text-gray-600" />
              <span className="text-xs font-semibold text-gray-700 uppercase">{language === 'sk' ? '🇸🇰 SK' : '🇬🇧 EN'}</span>
              </button>
              <Link to={createPageUrl("Calendar")} className="relative">
              <Bell className="w-5 h-5 text-gray-500 hover:text-[var(--navy)]" />
              {pendingReminders > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">
                  {pendingReminders > 9 ? "9+" : pendingReminders}
                </span>
              )}
            </Link>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}