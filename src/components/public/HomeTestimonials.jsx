import React from "react";
import { usePublicLang } from "@/components/PublicLanguageContext";

const TESTIMONIALS = {
  sk: [
    { quote: "Celý nákup apartmánu v Hurghade prebehol na diaľku. Za tri mesiace sme mali kľúče aj prvého nájomcu.", author: "Klient, Egypt" },
    { quote: "Oceňujem úprimnosť — od projektov, ktoré vyzerali dobre na papieri, nás odhovorili. To sa dnes nevidí.", author: "Klientka, Albánsko" },
  ],
  en: [
    { quote: "The entire apartment purchase in Hurghada was done remotely. Within three months we had the keys and our first tenant.", author: "Client, Egypt" },
    { quote: "I appreciate the honesty — they talked us out of projects that looked good on paper. You don't see that nowadays.", author: "Client, Albania" },
  ],
};

export default function HomeTestimonials() {
  const { lang } = usePublicLang();
  const items = TESTIMONIALS[lang] || TESTIMONIALS.en;
  const label = lang === "sk" ? "Referencie" : "Testimonials";

  return (
    <section className="px-4 sm:px-6 py-16 md:py-24" style={{ background: "#0a121d" }}>
      <div className="max-w-4xl mx-auto">
        <p className="text-[#c5a065] text-xs uppercase tracking-[0.3em] font-semibold mb-3 text-center">{label}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {items.map((t, i) => (
            <div key={i} className="rounded-2xl p-8"
              style={{ background: "rgba(18,29,46,0.6)", border: "1px solid rgba(197,160,101,0.15)" }}>
              <p className="text-[#c5a065] text-4xl leading-none mb-2">“</p>
              <p className="text-white/80 text-sm leading-relaxed italic mb-4">{t.quote}</p>
              <p className="text-[#c5a065] text-sm font-semibold">— {t.author}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}