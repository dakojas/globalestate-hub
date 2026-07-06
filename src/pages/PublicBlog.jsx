import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeft } from "lucide-react";
import { useDayNight } from "@/hooks/useDayNight";
import ThemeToggle from "@/components/public/ThemeToggle";
import { PublicLanguageProvider, usePublicLang } from "@/components/PublicLanguageContext";
import PublicLangSwitcher from "@/components/PublicLangSwitcher";
import Logo from "@/components/Logo";
import Seo from "@/components/Seo";

const BLOG_TITLES = {
  sk: { title: "Blog a insights", subtitle: "Tipy, návody a inšpirácie pre investície do nehnuteľností v zahraničí" },
  en: { title: "Blog & Insights", subtitle: "Tips, guides and inspiration for investing in international real estate" },
  de: { title: "Blog & Einblicke", subtitle: "Tipps, Leitfäden und Inspiration für Immobilieninvestitionen im Ausland" },
  fr: { title: "Blog et insights", subtitle: "Conseils, guides et inspiration pour investir dans l'immobilier à l'étranger" },
  it: { title: "Blog e insights", subtitle: "Consigli, guide e ispirazione per investire nel settore immobiliare all'estero" },
  ru: { title: "Блог и инсайты", subtitle: "Советы, руководства и вдохновение для инвестиций в зарубежную недвижимость" },
  pl: { title: "Blog i informacje", subtitle: "Porady, przewodniki i inspiracje do inwestowania w nieruchomości za granicą" },
  hu: { title: "Blog és meglátások", subtitle: "Tippek, útmutatók és inspiráció a külföldi ingatlanbefektetésekhez" },
};

function PublicBlogInner() {
  const { lang } = usePublicLang();
  const { isDark } = useDayNight();
  const t = BLOG_TITLES[lang] || BLOG_TITLES.en;

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://app.trysoro.com/api/embed/e1ca31ce-4136-4cc0-8626-2e3b54b5a92f";
    script.defer = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  return (
    <div data-theme={isDark ? "dark" : "light"} className="min-h-screen font-body" style={{ background: "var(--bg-page)" }}>
      <Seo title={`${t.title} | GLOBEYA`} description={t.subtitle} canonical="https://nvz.info/PublicBlog" />

      <style>{`
        /* Dark mode: force Soro blog content to use light text */
        [data-theme="dark"] #soro-blog,
        [data-theme="dark"] #soro-blog * {
          color: #ffffff !important;
        }
        [data-theme="dark"] #soro-blog a,
        [data-theme="dark"] #soro-blog h1,
        [data-theme="dark"] #soro-blog h2,
        [data-theme="dark"] #soro-blog h3,
        [data-theme="dark"] #soro-blog h4,
        [data-theme="dark"] #soro-blog h5,
        [data-theme="dark"] #soro-blog h6 {
          color: #ffffff !important;
        }
        [data-theme="dark"] #soro-blog p,
        [data-theme="dark"] #soro-blog span,
        [data-theme="dark"] #soro-blog div,
        [data-theme="dark"] #soro-blog li {
          color: rgba(255,255,255,0.75) !important;
        }
        [data-theme="dark"] #soro-blog input,
        [data-theme="dark"] #soro-blog textarea {
          background: rgba(255,255,255,0.1) !important;
          border-color: rgba(255,255,255,0.2) !important;
          color: #ffffff !important;
        }
        [data-theme="dark"] #soro-blog input::placeholder,
        [data-theme="dark"] #soro-blog textarea::placeholder {
          color: rgba(255,255,255,0.4) !important;
        }

        /* Light mode: force dark text */
        [data-theme="light"] #soro-blog,
        [data-theme="light"] #soro-blog * {
          color: #1a2332 !important;
        }
        [data-theme="light"] #soro-blog a,
        [data-theme="light"] #soro-blog h1,
        [data-theme="light"] #soro-blog h2,
        [data-theme="light"] #soro-blog h3,
        [data-theme="light"] #soro-blog h4,
        [data-theme="light"] #soro-blog h5,
        [data-theme="light"] #soro-blog h6 {
          color: #1a2332 !important;
        }
        [data-theme="light"] #soro-blog p,
        [data-theme="light"] #soro-blog span,
        [data-theme="light"] #soro-blog div,
        [data-theme="light"] #soro-blog li {
          color: rgba(26,35,50,0.75) !important;
        }
      `}</style>

      {/* Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to={createPageUrl("PublicHome")} className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
            {lang === "sk" ? "Späť na úvod" : "Back to home"}
          </Link>
          <div className="flex items-center gap-4">
            <Logo className="h-10 hidden sm:flex" />
            <ThemeToggle />
            <PublicLangSwitcher />
          </div>
        </div>
      </header>

      {/* Blog content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl sm:text-4xl font-semibold text-white mb-3">{t.title}</h1>
          <p className="text-white/65 text-base max-w-2xl mx-auto">{t.subtitle}</p>
        </div>

        {/* Soro blog embed */}
        <div id="soro-blog" className="min-h-[400px]"></div>
      </div>

      {/* Footer */}
      <footer style={{ background: "var(--bg-footer)", borderTop: "1px solid rgba(197,160,101,0.2)" }} className="px-4 sm:px-6 py-8 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link to="/"><Logo className="h-8" /></Link>
          <p className="text-white/30 text-xs">© 2026 GLOBEYA. {lang === "sk" ? "Všetky práva vyhradené." : "All rights reserved."}</p>
        </div>
      </footer>
    </div>
  );
}

export default function PublicBlog() {
  return (
    <PublicLanguageProvider>
      <PublicBlogInner />
    </PublicLanguageProvider>
  );
}