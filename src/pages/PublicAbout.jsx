import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Logo from "@/components/Logo";
import { createPageUrl } from "@/utils";
import { PublicLanguageProvider, usePublicLang } from "@/components/PublicLanguageContext";
import PublicLangSwitcher from "@/components/PublicLangSwitcher";

const brandStory = {
  fr: {
    hero: {
      title: "Nous avons commencé comme un petit rêve slovaque.",
      subtitle: "Nous sommes devenus une porte vers le monde entier.",
    },
    chapter1: {
      label: "CHAPITRE I – DÉBUT",
      title: "Une idée. Une page. Un rêve.",
      content: "C'était simple : les Slovaques voulaient des propriétés à l'étranger, mais ne savaient pas par où commencer. La langue était étrangère. Le marché inconnu. Le paysage juridique impénétrable. Et personne ne leur parlait dans leur langue, avec leur confiance, de leur monde.\n\nAinsi est née la page Nehnuteľnosti v zahraničí – non comme une grande corporation, mais comme une réponse à un besoin spécifique de personnes spécifiques. Un portail local avec une mission claire : rapprocher le monde lointain à portée de main."
    },
    chapter2: {
      label: "CHAPITRE II – CROISSANCE",
      title: "Les clients nous ont emmenés avec eux.",
      content: "Personne n'a dû nous convaincre que le monde est petit. Nos clients nous l'ont montré.\n\nPremier achat en Égypte. Puis Dubaï. Puis Bali. Chaque client satisfait a ouvert de nouvelles portes – vers de nouveaux pays, vers de nouveaux promoteurs, vers de nouvelles communautés de personnes qui veulent investir au-delà des frontières.\n\nL'équipe a grandi. Le portefeuille a grandi. Mais l'engagement est resté le même : chaque client reçoit le même soin que le premier.",
      timeline: [
        { label: "Début", desc: "Le portail slovaque en ligne. Premiers projets, premiers clients, premiers rêves réalisés sur une terre étrangère." },
        { label: "Expansion", desc: "Égypte, Dubaï, Albanie, Turquie. L'équipe se développe. Courtiers à Dubaï. Partenaires sur le terrain. Le client n'achète pas les yeux fermés." },
        { label: "Aujourd'hui", desc: "16 pays. Des centaines de clients satisfaits. Réseau mondial. Âme locale. Chaque projet vérifié. Chaque client accueilli." },
        { label: "Demain", desc: "Croissance sans compromis. Plus de pays. Plus d'histoires. Un engagement – être pour chaque client ce que nous avons été pour le premier." }
      ]
    },
    chapter3: {
      label: "CHAPITRE III – AUJOURD'HUI",
      title: "Global. Mais toujours vôtre.",
      content: "Aujourd'hui, nous opérons dans 16 pays. Notre équipe parle plusieurs langues, connaît les marchés locaux, connaît personnellement les promoteurs. Mais une chose n'a pas changé.\n\nQuand vous nous appelez, ce n'est pas un centre d'appels qui répond. Une personne répond qui vous connaît, connaît votre budget et votre rêve. C'est ainsi que c'était au début. C'est comme ça que ça restera.\n\nNous ne sommes pas une corporation mondiale avec un bureau local. Nous sommes une entreprise locale avec une portée mondiale. C'est la différence que vous ressentez dans chaque conversation."
    },
    motto: {
      title: "Le monde est plus grand que vous ne le pensez.",
      subtitle: "Vos possibilités aussi.",
      closing: "Nous sommes là pour vous aider à les découvrir."
    }
  },
  it: {
    hero: {
      title: "Abbiamo iniziato come un piccolo sogno slovacco.",
      subtitle: "Siamo diventati un portale verso il mondo intero.",
    },
    chapter1: {
      label: "CAPITOLO I – INIZIO",
      title: "Un'idea. Una pagina. Un sogno.",
      content: "Era semplice: gli slovacchi volevano proprietà all'estero, ma non sapevano da dove iniziare. La lingua era straniera. Il mercato sconosciuto. Il panorama legale impenetrabile. E nessuno parlava loro nella loro lingua, con la loro fiducia, dal loro mondo.\n\nCosì è nata la pagina Nehnuteľnosti v zahraničí – non come una grande corporation, ma come una risposta a un bisogno specifico di persone specifiche. Un portale locale con una missione chiara: portare il mondo lontano a portata di mano."
    },
    chapter2: {
      label: "CAPITOLO II – CRESCITA",
      title: "I clienti ci hanno portato con loro.",
      content: "Nessuno doveva convincerci che il mondo è piccolo. I nostri clienti ce l'hanno mostrato.\n\nPrimo acquisto in Egitto. Poi Dubai. Poi Bali. Ogni cliente soddisfatto ha aperto nuove porte – verso nuovi paesi, verso nuovi sviluppatori, verso nuove comunità di persone che vogliono investire oltre i confini.\n\nIl team è cresciuto. Il portafoglio è cresciuto. Ma l'impegno è rimasto lo stesso: ogni cliente riceve le stesse cure del primo.",
      timeline: [
        { label: "Inizio", desc: "Il portale slovacco online. Primi progetti, primi clienti, primi sogni realizzati su terra straniera." },
        { label: "Espansione", desc: "Egitto, Dubai, Albania, Turchia. Il team cresce. Broker a Dubai. Partner sul terreno. Il cliente non compra al buio." },
        { label: "Oggi", desc: "16 paesi. Centinaia di clienti soddisfatti. Rete globale. Anima locale. Ogni progetto verificato. Ogni cliente accolto." },
        { label: "Domani", desc: "Crescita senza compromessi. Più paesi. Più storie. Un impegno – essere per ogni cliente quello che siamo stati per il primo." }
      ]
    },
    chapter3: {
      label: "CAPITOLO III – OGGI",
      title: "Globale. Ma sempre vostro.",
      content: "Oggi operiamo in 16 paesi. Il nostro team parla più lingue, conosce i mercati locali, conosce personalmente gli sviluppatori. Ma una cosa non è cambiata.\n\nQuando ci chiamate, non risponde un call center. Risponde una persona che vi conosce, conosce il vostro budget e il vostro sogno. È così che era all'inizio. È così che rimarrà.\n\nNon siamo una corporation globale con un ufficio locale. Siamo un'azienda locale con una portata globale. Questa è la differenza che sentirete in ogni conversazione."
    },
    motto: {
      title: "Il mondo è più grande di quanto pensi.",
      subtitle: "Lo sono anche le tue possibilità.",
      closing: "Siamo qui per aiutarti a scoprirle."
    }
  },
  pl: {
    hero: {
      title: "Zaczęliśmy jako mały słowacki sen.",
      subtitle: "Staliśmy się bramą do całego świata.",
    },
    chapter1: {
      label: "ROZDZIAŁ I – POCZĄTEK",
      title: "Jeden pomysł. Jedna strona. Jeden sen.",
      content: "To było proste: Słowacy chcieli nieruchomości za granicą, ale nie wiedzieli, od czego zacząć. Język był obcy. Rynek nieznany. Krajobraz prawny nieprzenikliwy. I nikt nie mówił do nich w ich języku, z ich zaufaniem, z ich świata.\n\nTak powstała strona Nehnuteľnosti v zahraničí – nie jako duża korporacja, ale jako odpowiedź na konkretną potrzebę konkretnych ludzi. Portal lokalny z jasną misją: przybliżyć odległy świat na wyciągnięcie ręki."
    },
    chapter2: {
      label: "ROZDZIAŁ II – WZROST",
      title: "Klienci zabrali nas ze sobą.",
      content: "Nikt nie musiał nas przekonywać, że świat jest mały. Nasi klienci nam to pokazali.\n\nPierwszy zakup w Egipcie. Potem Dubaj. Potem Bali. Każdy zadowolony klient otworzył nowe drzwi – do nowych krajów, do nowych deweloperów, do nowych społeczności ludzi, którzy chcą inwestować poza granicami.\n\nZespół rósł. Portfolio rosło. Ale zaangażowanie pozostało takie samo: każdy klient otrzymuje taką samą opiekę jak pierwszy.",
      timeline: [
        { label: "Początek", desc: "Słowacki portal online. Pierwsze projekty, pierwsi klienci, pierwsze spełnione marzenia na obcej ziemi." },
        { label: "Ekspansja", desc: "Egipt, Dubaj, Albania, Turcja. Zespół rośnie. Brokerzy w Dubaju. Partnerzy na terenie. Klient nie kupuje w ciemno." },
        { label: "Dzisiaj", desc: "16 krajów. Setki zadowolonych klientów. Sieć globalna. Dusza lokalna. Każdy projekt zweryfikowany. Każdy klient powitany." },
        { label: "Jutro", desc: "Wzrost bez kompromisów. Więcej krajów. Więcej historii. Jedno zobowiązanie – być dla każdego klienta tym, czym byliśmy dla pierwszego." }
      ]
    },
    chapter3: {
      label: "ROZDZIAŁ III – DZISIAJ",
      title: "Globalny. Ale wciąż wasz.",
      content: "Dzisiaj działamy w 16 krajach. Nasz zespół mówi wieloma językami, zna rynki lokalne, osobiście zna deweloperów. Ale jedna rzecz się nie zmieniła.\n\nKiedy nas zadzwonisz, nie odbiera centrum obsługi. Odbiera osoba, która Cię zna, zna Twój budżet i Twój sen. Tak było od początku. Tak zostanie.\n\nNie jesteśmy korporacją globalną z biurem lokalnym. Jesteśmy lokalną firmą z zasięgiem globalnym. To jest różnica, którą odczujesz w każdej rozmowie."
    },
    motto: {
      title: "Świat jest większy, niż myślisz.",
      subtitle: "Twoje możliwości też.",
      closing: "Jesteśmy tu, aby pomóc Ci je odkryć."
    }
  },
  en: {
    hero: {
      title: "We started as a small Slovak dream.",
      subtitle: "We became a gateway to the whole world.",
    },
    chapter1: {
      label: "CHAPTER I – BEGINNING",
      title: "One idea. One page. One dream.",
      content: "It was simple: Slovaks wanted property abroad, but didn't know where to start. The language was foreign. The market unknown. The legal landscape impenetrable. And nobody spoke to them in their language, with their trust, from their world.\n\nSo Nehnuteľnosti v zahraničí was born — not as a big corporation, but as an answer to a specific need of specific people. A local portal with a clear mission: to bring the distant world within reach."
    },
    chapter2: {
      label: "CHAPTER II – GROWTH",
      title: "Clients took us with them.",
      content: "Nobody had to convince us that the world is small. Our clients showed us.\n\nFirst purchase in Egypt. Then Dubai. Then Bali. Every satisfied client opened new doors — to new countries, to new developers, to new communities of people who want to invest beyond borders.\n\nThe team grew. The portfolio grew. But the commitment stayed the same: every client gets the same care as the first one.",
      timeline: [
        { label: "Beginning", desc: "Slovak portal goes online. First projects, first clients, first dreams fulfilled on foreign soil." },
        { label: "Expansion", desc: "Egypt, Dubai, Albania, Turkey. Team grows. Brokers in Dubai. Partners on the ground. Client doesn't buy blind." },
        { label: "Today", desc: "16 countries. Hundreds of satisfied clients. Global network. Local soul. Every project verified. Every client welcomed." },
        { label: "Tomorrow", desc: "Growth without compromise. More countries. More stories. One commitment — to be for every client what we were for the first one." }
      ]
    },
    chapter3: {
      label: "CHAPTER III – TODAY",
      title: "Global. But still yours.",
      content: "Today we operate in 16 countries. Our team speaks multiple languages, knows local markets, knows developers personally. But one thing hasn't changed.\n\nWhen you call us, a call center doesn't answer. A person answers who knows you, your budget, and your dream. That's how it was from the beginning. That's how it will stay.\n\nWe are not a global corporation with a local office. We are a local company with global reach. That is the difference you feel in every conversation."
    },
    motto: {
      title: "The world is bigger than you think.",
      subtitle: "So are your possibilities.",
      closing: "We're here to help you discover them."
    }
  },
  sk: {
    hero: {
      title: "Začali sme ako malý slovenský sen.",
      subtitle: "Stali sme sa bránou do celého sveta."
    },
    chapter1: {
      label: "KAPITOLA I – ZAČIATOK",
      title: "Jeden nápad. Jedna stránka. Jeden sen.",
      content: "Bolo to jednoduché: Slováci chceli nehnuteľnosti v zahraničí, ale nikde kde začať. Jazyk bol cudzi. Trh neznámy. Právne prostredie neprehľadné. A nikto im nehovoril v ich jazyku, s ich dôverou, z ich sveta.\n\nTak vznikla stránka Nehnuteľnosti v zahraničí — nie ako veľká korporácia, ale ako odpoveď na konkrétnu potrebu konkrétnych ľudí. Lokálny portál s jasným poslaním: pribiližiť vzdialený svet na dosah ruky."
    },
    chapter2: {
      label: "KAPITOLA II – RAST",
      title: "Klienti nás vzali so sebou.",
      content: "Nikto nás nemusel presvedčiť o tom, že svet je malý. Naši klienti nám to ukázali.\n\nPrvá kúpa v Egypte. Potom Dubaj. Potom Bali. Každý spokojný klient otvoril nové dvere — do novej krajiny, k novému developerovi, k novej komunite ľudí, ktorí chcú investovať mimo hranic.\n\nTím rástol. Portfólio rástlo. Ale závázok zostal rovnaký: každý klient dostane rovnakú starostlivosť ako ten prvý.",
      timeline: [
        { label: "Vznik", desc: "Slovenský portál ide online. Prvé projekty, prví klienti, prvé sny splnené na cudzej pôde." },
        { label: "Expanzia", desc: "Egypt, Dubaj, Albánsko, Turecko. Tím rastie. Makléri v Dubaji. Partneri na mieste. Klient nekupuje naslepo." },
        { label: "Dnes", desc: "16 krajín. Stovky spokojných klientov. Globálna sieť. Lokálna duša. Každý projekt overený. Každý klient vitaný." },
        { label: "Zajtra", desc: "Rast bez kompromisov. Viac krajín. Viac príbehov. Jeden závázok — byť pre každého klienta ako sme boli pre toho prvého." }
      ]
    },
    chapter3: {
      label: "KAPITOLA III – DNES",
      title: "Globálni. Ale stále vaši.",
      content: "Dnes pôsobíme v 16 krajinách. Náš tím hovorí viacerými jazykmi, pozná lokálne trhy, pozná developerov osobne. Ale jedno sa nezmenilo.\n\nKeď nám zavoláte, neodpovedá vám call centrum. Odpovie vám človek, ktorý pozná vás, váš rozpočet a váš sen. Tak to bolo od začiatku. Tak to zostane.\n\nNie sme globálna korporácia s lokálnou pobočkou. Sme lokálna firma s globálnym dosahom. To je rozdiel, ktorý cítite pri každom jednání."
    },
    motto: {
      title: "Svet je väčší, než si myslíte.",
      subtitle: "Vaše možnosti tiež.",
      closing: "My sme tu preto, aby ste ich objavili."
    }
  },
  en: {
    hero: {
      title: "We started as a small Slovak dream.",
      subtitle: "We became a gateway to the whole world."
    },
    chapter1: {
      label: "CHAPTER I – BEGINNING",
      title: "One idea. One page. One dream.",
      content: "It was simple: Slovaks wanted property abroad, but didn't know where to start. The language was foreign. The market unknown. The legal landscape impenetrable. And nobody spoke to them in their language, with their trust, from their world.\n\nSo Nehnuteľnosti v zahraničí was born — not as a big corporation, but as an answer to a specific need of specific people. A local portal with a clear mission: to bring the distant world within reach."
    },
    chapter2: {
      label: "CHAPTER II – GROWTH",
      title: "Clients took us with them.",
      content: "Nobody had to convince us that the world is small. Our clients showed us.\n\nFirst purchase in Egypt. Then Dubai. Then Bali. Every satisfied client opened new doors — to new countries, to new developers, to new communities of people who want to invest beyond borders.\n\nThe team grew. The portfolio grew. But the commitment stayed the same: every client gets the same care as the first one.",
      timeline: [
        { label: "Beginning", desc: "Slovak portal goes online. First projects, first clients, first dreams fulfilled on foreign soil." },
        { label: "Expansion", desc: "Egypt, Dubai, Albania, Turkey. Team grows. Brokers in Dubai. Partners on the ground. Client doesn't buy blind." },
        { label: "Today", desc: "16 countries. Hundreds of satisfied clients. Global network. Local soul. Every project verified. Every client welcomed." },
        { label: "Tomorrow", desc: "Growth without compromise. More countries. More stories. One commitment — to be for every client what we were for the first one." }
      ]
    },
    chapter3: {
      label: "CHAPTER III – TODAY",
      title: "Global. But still yours.",
      content: "Today we operate in 16 countries. Our team speaks multiple languages, knows local markets, knows developers personally. But one thing hasn't changed.\n\nWhen you call us, a call center doesn't answer. A person answers who knows you, your budget, and your dream. That's how it was from the beginning. That's how it will stay.\n\nWe are not a global corporation with a local office. We are a local company with global reach. That is the difference you feel in every conversation."
    },
    motto: {
      title: "The world is bigger than you think.",
      subtitle: "So are your possibilities.",
      closing: "We're here to help you discover them."
    }
  }
};

function PublicAboutInner() {
  const { lang } = usePublicLang();
  const story = brandStory[lang] || brandStory.en;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#132039] to-[#1a2844]">
      {/* Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to={createPageUrl("PublicHome")} className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <Logo className="h-9 ml-2" />
          </Link>
          <PublicLangSwitcher />
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-16 space-y-16">
        {/* Hero */}
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-10 border border-white/10">
          <p className="text-[#c9a84c] text-xs uppercase tracking-widest mb-6">{story.hero.meta}</p>
          <h1 className="text-5xl font-bold text-white mb-4">
            <em>{story.hero.title}</em>
          </h1>
          <p className="text-2xl text-white/70">
            <em>{story.hero.subtitle}</em>
          </p>
        </div>

        {/* Chapter 1 */}
        <div className="bg-white rounded-2xl p-10">
          <p className="text-[#c9a84c] text-xs uppercase tracking-widest font-semibold mb-4">{story.chapter1.label}</p>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">{story.chapter1.title}</h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{story.chapter1.content}</p>
        </div>

        {/* Chapter 2 */}
        <div className="bg-white rounded-2xl p-10">
          <p className="text-[#c9a84c] text-xs uppercase tracking-widest font-semibold mb-4">{story.chapter2.label}</p>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">{story.chapter2.title}</h2>
          <p className="text-gray-700 leading-relaxed mb-8">{story.chapter2.content}</p>
          
          <div className="space-y-4">
            {story.chapter2.timeline.map((item, i) => (
              <div key={i} className="flex gap-4">
                <div>
                  <p className="text-xl font-semibold text-[#c9a84c]">{item.label}</p>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chapter 3 */}
        <div className="bg-white rounded-2xl p-10">
          <p className="text-[#c9a84c] text-xs uppercase tracking-widest font-semibold mb-4">{story.chapter3.label}</p>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">{story.chapter3.title}</h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{story.chapter3.content}</p>
        </div>

        {/* Motto */}
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-10 border border-white/10 text-center">
          <p className="text-[#c9a84c] text-xs uppercase tracking-widest mb-6">NAŠE MOTTO</p>
          <h3 className="text-4xl font-bold text-white mb-3">
            <em>{story.motto.title}</em>
          </h3>
          <p className="text-2xl text-white/70 mb-6">
            <em>{story.motto.subtitle}</em>
          </p>
          <p className="text-white/60 italic">{story.motto.closing}</p>
        </div>
      </div>
    </div>
  );
}

export default function PublicAbout() {
  return (
    <PublicLanguageProvider>
      <PublicAboutInner />
    </PublicLanguageProvider>
  );
}