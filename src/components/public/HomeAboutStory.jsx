import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { usePublicLang } from "@/components/PublicLanguageContext";

const brandStory = {
  sk: {
    sectionLabel: "O NÁS",
    sectionTitle: "Začali sme ako malý slovenský sen.",
    sectionSubtitle: "Stali sme sa bránou do celého sveta.",
    chapter1: {
      label: "KAPITOLA I – ZAČIATOK",
      title: "Jeden nápad. Jedna stránka. Jeden sen.",
      content: "Slováci túžili po nehnuteľnostiach v zahraničí, no nevedeli, kde začať. Cudzí jazyk, neznámy trh, neprehľadné právne prostredie. A nikto k nim nepristúpil v ich jazyku — s ich dôverou, z ich sveta.\n\nTak vznikla GLOBEYA — nie ako veľká korporácia, ale ako odpoveď na konkrétnu potrebu konkrétnych ľudí."
    },
    chapter2: {
      label: "KAPITOLA II – RAST",
      title: "Klienti nás vzali so sebou.",
      content: "Prvá kúpa v Egypte. Potom Dubaj. Potom Bali. Každý spokojný klient otvoril nové dvere — do novej krajiny, k novému developerovi, k novej komunite ľudí.",
      timeline: [
        { label: "Vznik", desc: "Slovenský portál ide online. Prvé projekty, prví klienti, prvé sny splnené na cudzej pôde." },
        { label: "Expanzia", desc: "Egypt, Dubaj, Albánsko, Turecko. Tím rastie. Makléri v Dubaji. Partneri na mieste." },
        { label: "Dnes", desc: "16 krajín. Stovky spokojných klientov. Globálna sieť. Lokálna duša." },
        { label: "Zajtra", desc: "Rast bez kompromisov. Viac krajín. Viac príbehov. Jeden záväzok." }
      ]
    },
    chapter3: {
      label: "KAPITOLA III – DNES",
      title: "Globálni. Ale stále vaši.",
      content: "Dnes pôsobíme v 16 krajinách. Náš tím hovorí viacerými jazykmi, pozná lokálne trhy, pozná developerov osobne. Ale jedno sa nezmenilo.\n\nKeď nám zavoláte, neodpovedá vám call centrum. Odpovie vám človek, ktorý pozná vás, váš rozpočet a váš sen. Nie sme globálna korporácia s lokálnou pobočkou. Sme lokálna firma s globálnym dosahom."
    },
    motto: {
      label: "NAŠE MOTTO",
      title: "Svet je väčší, než si myslíte.",
      subtitle: "Vaše možnosti tiež.",
      closing: "My sme tu preto, aby ste ich objavili."
    },
    readMore: "Prečítať celý príbeh",
  },
  en: {
    sectionLabel: "ABOUT US",
    sectionTitle: "We started as a small Slovak dream.",
    sectionSubtitle: "We became a gateway to the whole world.",
    chapter1: {
      label: "CHAPTER I – BEGINNING",
      title: "One idea. One page. One dream.",
      content: "Slovaks wanted property abroad, but didn't know where to start. The language was foreign. The market unknown. The legal landscape impenetrable. And nobody spoke to them in their language, with their trust, from their world.\n\nSo GLOBEYA was born — not as a big corporation, but as an answer to a specific need of specific people."
    },
    chapter2: {
      label: "CHAPTER II – GROWTH",
      title: "Clients took us with them.",
      content: "First purchase in Egypt. Then Dubai. Then Bali. Every satisfied client opened new doors — to new countries, to new developers, to new communities.",
      timeline: [
        { label: "Beginning", desc: "Slovak portal goes online. First projects, first clients, first dreams fulfilled on foreign soil." },
        { label: "Expansion", desc: "Egypt, Dubai, Albania, Turkey. Team grows. Brokers in Dubai. Partners on the ground." },
        { label: "Today", desc: "16 countries. Hundreds of satisfied clients. Global network. Local soul." },
        { label: "Tomorrow", desc: "Growth without compromise. More countries. More stories. One commitment." }
      ]
    },
    chapter3: {
      label: "CHAPTER III – TODAY",
      title: "Global. But still yours.",
      content: "Today we operate in 16 countries. Our team speaks multiple languages, knows local markets, knows developers personally. But one thing hasn't changed.\n\nWhen you call us, a call center doesn't answer. A person answers who knows you, your budget, and your dream. We are not a global corporation with a local office. We are a local company with global reach."
    },
    motto: {
      label: "OUR MOTTO",
      title: "The world is bigger than you think.",
      subtitle: "So are your possibilities.",
      closing: "We're here to help you discover them."
    },
    readMore: "Read the full story",
  },
  de: {
    sectionLabel: "ÜBER UNS",
    sectionTitle: "Wir haben als kleiner slowakischer Traum begonnen.",
    sectionSubtitle: "Wir wurden zu einem Tor zur ganzen Welt.",
    chapter1: { label: "KAPITEL I – ANFANG", title: "Eine Idee. Eine Seite. Ein Traum.", content: "Slowaken wollten Immobilien im Ausland, wussten aber nicht, wo sie anfangen sollten. Die Sprache war fremd. Der Markt unbekannt. Das rechtliche Umfeld undurchdringlich. Und niemand sprach mit ihnen in ihrer Sprache, mit ihrem Vertrauen, aus ihrer Welt.\n\nSo entstand GLOBEYA – nicht als großes Unternehmen, sondern als Antwort auf einen spezifischen Bedarf von spezifischen Menschen." },
    chapter2: { label: "KAPITEL II – WACHSTUM", title: "Die Kunden haben uns mitgenommen.", content: "Erster Kauf in Ägypten. Dann Dubai. Dann Bali. Jeder zufriedene Kunde öffnete neue Türen – in neue Länder, zu neuen Entwicklern, zu neuen Gemeinschaften.", timeline: [
      { label: "Gründung", desc: "Slowakisches Portal geht online. Erste Projekte, erste Kunden, erste Träume auf fremdem Boden erfüllt." },
      { label: "Expansion", desc: "Ägypten, Dubai, Albanien, Türkei. Team wächst. Makler in Dubai. Partner vor Ort." },
      { label: "Heute", desc: "16 Länder. Hunderte zufriedene Kunden. Globales Netzwerk. Lokale Seele." },
      { label: "Morgen", desc: "Wachstum ohne Kompromisse. Mehr Länder. Mehr Geschichten. Ein Engagement." }
    ]},
    chapter3: { label: "KAPITEL III – HEUTE", title: "Global. Aber immer noch Ihres.", content: "Heute sind wir in 16 Ländern tätig. Unser Team spricht mehrere Sprachen, kennt die lokalen Märkte, kennt Entwickler persönlich. Aber eines hat sich nicht geändert.\n\nWenn Sie uns anrufen, antwortet kein Callcenter. Es antwortet ein Mensch, der Sie kennt, Ihr Budget und Ihren Traum. Wir sind kein globales Unternehmen mit einer lokalen Niederlassung. Wir sind ein lokales Unternehmen mit globaler Reichweite." },
    motto: { label: "UNSER MOTTO", title: "Die Welt ist größer als Sie denken.", subtitle: "Ihre Möglichkeiten auch.", closing: "Wir sind hier, um Ihnen zu helfen, sie zu entdecken." },
    readMore: "Die ganze Geschichte lesen",
  },
  fr: {
    sectionLabel: "À PROPOS",
    sectionTitle: "Nous avons commencé comme un petit rêve slovaque.",
    sectionSubtitle: "Nous sommes devenus une porte vers le monde entier.",
    chapter1: { label: "CHAPITRE I – DÉBUT", title: "Une idée. Une page. Un rêve.", content: "Les Slovaques voulaient des propriétés à l'étranger, mais ne savaient pas par où commencer. La langue était étrangère. Le marché inconnu. Le paysage juridique impénétrable. Et personne ne leur parlait dans leur langue, avec leur confiance, de leur monde.\n\nAinsi est née GLOBEYA – non comme une grande corporation, mais comme une réponse à un besoin spécifique de personnes spécifiques." },
    chapter2: { label: "CHAPITRE II – CROISSANCE", title: "Les clients nous ont emmenés avec eux.", content: "Premier achat en Égypte. Puis Dubaï. Puis Bali. Chaque client satisfait a ouvert de nouvelles portes – vers de nouveaux pays, vers de nouveaux promoteurs, vers de nouvelles communautés.", timeline: [
      { label: "Début", desc: "Le portail slovaque en ligne. Premiers projets, premiers clients, premiers rêves réalisés sur une terre étrangère." },
      { label: "Expansion", desc: "Égypte, Dubaï, Albanie, Turquie. L'équipe se développe. Courtiers à Dubaï. Partenaires sur le terrain." },
      { label: "Aujourd'hui", desc: "16 pays. Des centaines de clients satisfaits. Réseau mondial. Âme locale." },
      { label: "Demain", desc: "Croissance sans compromis. Plus de pays. Plus d'histoires. Un engagement." }
    ]},
    chapter3: { label: "CHAPITRE III – AUJOURD'HUI", title: "Global. Mais toujours vôtre.", content: "Aujourd'hui, nous opérons dans 16 pays. Notre équipe parle plusieurs langues, connaît les marchés locaux, connaît personnellement les promoteurs. Mais une chose n'a pas changé.\n\nQuand vous nous appelez, ce n'est pas un centre d'appels qui répond. Une personne répond qui vous connaît, connaît votre budget et votre rêve. Nous ne sommes pas une corporation mondiale avec un bureau local. Nous sommes une entreprise locale avec une portée mondiale." },
    motto: { label: "NOTRE DEVISE", title: "Le monde est plus grand que vous ne le pensez.", subtitle: "Vos possibilités aussi.", closing: "Nous sommes là pour vous aider à les découvrir." },
    readMore: "Lire l'histoire complète",
  },
  it: {
    sectionLabel: "CHI SIAMO",
    sectionTitle: "Abbiamo iniziato come un piccolo sogno slovacco.",
    sectionSubtitle: "Siamo diventati un portale verso il mondo intero.",
    chapter1: { label: "CAPITOLO I – INIZIO", title: "Un'idea. Una pagina. Un sogno.", content: "Gli slovacchi volevano proprietà all'estero, ma non sapevano da dove iniziare. La lingua era straniera. Il mercato sconosciuto. Il panorama legale impenetrabile. E nessuno parlava loro nella loro lingua, con la loro fiducia, dal loro mondo.\n\nCosì è nata GLOBEYA – non come una grande corporation, ma come una risposta a un bisogno specifico di persone specifiche." },
    chapter2: { label: "CAPITOLO II – CRESCITA", title: "I clienti ci hanno portato con loro.", content: "Primo acquisto in Egitto. Poi Dubai. Poi Bali. Ogni cliente soddisfatto ha aperto nuove porte – verso nuovi paesi, verso nuovi sviluppatori, verso nuove comunità.", timeline: [
      { label: "Inizio", desc: "Il portale slovacco online. Primi progetti, primi clienti, primi sogni realizzati su terra straniera." },
      { label: "Espansione", desc: "Egitto, Dubai, Albania, Turchia. Il team cresce. Broker a Dubai. Partner sul terreno." },
      { label: "Oggi", desc: "16 paesi. Centinaia di clienti soddisfatti. Rete globale. Anima locale." },
      { label: "Domani", desc: "Crescita senza compromessi. Più paesi. Più storie. Un impegno." }
    ]},
    chapter3: { label: "CAPITOLO III – OGGI", title: "Globale. Ma sempre vostro.", content: "Oggi operiamo in 16 paesi. Il nostro team parla più lingue, conosce i mercati locali, conosce personalmente gli sviluppatori. Ma una cosa non è cambiata.\n\nQuando ci chiamate, non risponde un call center. Risponde una persona che vi conosce, conosce il vostro budget e il vostro sogno. Non siamo una corporation globale con un ufficio locale. Siamo un'azienda locale con una portata globale." },
    motto: { label: "IL NOSTRO MOTTO", title: "Il mondo è più grande di quanto pensi.", subtitle: "Lo sono anche le tue possibilità.", closing: "Siamo qui per aiutarti a scoprirle." },
    readMore: "Leggi la storia completa",
  },
  ru: {
    sectionLabel: "О НАС",
    sectionTitle: "Мы начали как маленькая словацкая мечта.",
    sectionSubtitle: "Мы стали воротами в целый мир.",
    chapter1: { label: "ГЛАВА I – НАЧАЛО", title: "Одна идея. Одна страница. Одна мечта.", content: "Словаки хотели недвижимость за рубежом, но не знали, с чего начать. Язык был чужим. Рынок — неизвестным. Правовая среда — непроходимой. И никто не говорил с ними на их языке, с их доверием, из их мира.\n\nТак появилась GLOBEYA — не как большая корпорация, а как ответ на конкретную потребность конкретных людей." },
    chapter2: { label: "ГЛАВА II – РОСТ", title: "Клиенты взяли нас с собой.", content: "Первая покупка в Египте. Потом Дубай. Потом Бали. Каждый довольный клиент открывал новые двери — в новые страны, к новым застройщикам, к новым сообществам.", timeline: [
      { label: "Основание", desc: "Словацкий портал выходит в онлайн. Первые проекты, первые клиенты, первые мечты, осуществлённые на чужой земле." },
      { label: "Расширение", desc: "Египет, Дубай, Албания, Турция. Команда растёт. Брокеры в Дубае. Партнёры на месте." },
      { label: "Сегодня", desc: "16 стран. Сотни довольных клиентов. Глобальная сеть. Локальная душа." },
      { label: "Завтра", desc: "Рост без компромиссов. Больше стран. Больше историй. Одно обязательство." }
    ]},
    chapter3: { label: "ГЛАВА III – СЕГОДНЯ", title: "Глобальные. Но всё равно ваши.", content: "Сегодня мы работаем в 16 странах. Наша команда говорит на нескольких языках, знает местные рынки, знает застройщиков лично. Но одно не изменилось.\n\nКогда вы нам звоните, отвечает не колл-центр. Отвечает человек, который знает вас, ваш бюджет и вашу мечту. Мы не глобальная корпорация с местным офисом. Мы местная компания с глобальным охватом." },
    motto: { label: "НАШ ДЕВИЗ", title: "Мир больше, чем вы думаете.", subtitle: "Ваши возможности тоже.", closing: "Мы здесь, чтобы помочь вам их открыть." },
    readMore: "Прочитать всю историю",
  },
  pl: {
    sectionLabel: "O NAS",
    sectionTitle: "Zaczęliśmy jako mały słowacki sen.",
    sectionSubtitle: "Staliśmy się bramą do całego świata.",
    chapter1: { label: "ROZDZIAŁ I – POCZĄTEK", title: "Jeden pomysł. Jedna strona. Jeden sen.", content: "Słowacy chcieli nieruchomości za granicą, ale nie wiedzieli, od czego zacząć. Język był obcy. Rynek nieznany. Krajobraz prawny nieprzenikliwy. I nikt nie mówił do nich w ich języku, z ich zaufaniem, z ich świata.\n\nTak powstała GLOBEYA – nie jako duża korporacja, ale jako odpowiedź na konkretną potrzebę konkretnych ludzi." },
    chapter2: { label: "ROZDZIAŁ II – WZROST", title: "Klienci zabrali nas ze sobą.", content: "Pierwszy zakup w Egipcie. Potem Dubaj. Potem Bali. Każdy zadowolony klient otworzył nowe drzwi – do nowych krajów, do nowych deweloperów, do nowych społeczności.", timeline: [
      { label: "Początek", desc: "Słowacki portal online. Pierwsze projekty, pierwsi klienci, pierwsze spełnione marzenia na obcej ziemi." },
      { label: "Ekspansja", desc: "Egipt, Dubaj, Albania, Turcja. Zespół rośnie. Brokerzy w Dubaju. Partnerzy na terenie." },
      { label: "Dzisiaj", desc: "16 krajów. Setki zadowolonych klientów. Sieć globalna. Dusza lokalna." },
      { label: "Jutro", desc: "Wzrost bez kompromisów. Więcej krajów. Więcej historii. Jedno zobowiązanie." }
    ]},
    chapter3: { label: "ROZDZIAŁ III – DZISIAJ", title: "Globalny. Ale wciąż wasz.", content: "Dzisiaj działamy w 16 krajach. Nasz zespół mówi wieloma językami, zna rynki lokalne, osobiście zna deweloperów. Ale jedna rzecz się nie zmieniła.\n\nKiedy nas zadzwonisz, nie odbiera centrum obsługi. Odbiera osoba, która Cię zna, zna Twój budżet i Twój sen. Nie jesteśmy korporacją globalną z biurem lokalnym. Jesteśmy lokalną firmą z zasięgiem globalnym." },
    motto: { label: "NASZE MOTTO", title: "Świat jest większy, niż myślisz.", subtitle: "Twoje możliwości też.", closing: "Jesteśmy tu, aby pomóc Ci je odkryć." },
    readMore: "Przeczytaj całą historię",
  },
  hu: {
    sectionLabel: "RÓLUNK",
    sectionTitle: "Kis szlovák álomként kezdtük.",
    sectionSubtitle: "Az egész világ kapujává váltunk.",
    chapter1: { label: "I. FEJEZET – KEZDETEK", title: "Egy ötlet. Egy oldal. Egy álom.", content: "A szlovákok külföldön akartak ingatlant vásárolni, de nem tudták, hol kezdjék. A nyelv idegen volt. A piac ismeretlen. A jogi környezet átláthatatlan. És senki sem szólt hozzájuk a saját nyelvükön, a saját bizalmukkal, a saját világukból.\n\nÍgy született meg a GLOBEYA – nem nagy vállalatként, hanem konkrét emberek konkrét szükségletére adott válaszként." },
    chapter2: { label: "II. FEJEZET – NÖVEKEDÉS", title: "Az ügyfelek magukkal vittek minket.", content: "Első vétel Egyiptomban. Aztán Dubai. Aztán Bali. Minden elégedett ügyfél új ajtókat nyitott meg – új országokba, új fejlesztőkhöz, új közösségekhez.", timeline: [
      { label: "Alapítás", desc: "A szlovák portál elindul. Első projektek, első ügyfelek, első megvalósított álmok idegen földön." },
      { label: "Terjeszkedés", desc: "Egyiptom, Dubai, Albánia, Törökország. A csapat nő. Brókerek Dubaiban. Partnerek helyszínen." },
      { label: "Ma", desc: "16 ország. Több száz elégedett ügyfél. Globális hálózat. Helyi lélek." },
      { label: "Holnap", desc: "Kompromisszum nélküli növekedés. Több ország. Több történet. Egy elkötelezettség." }
    ]},
    chapter3: { label: "III. FEJEZET – MA", title: "Globális. De mindig a tiétek.", content: "Ma 16 országban tevékenykedünk. Csapatunk több nyelven beszél, ismeri a helyi piacokat, személyesen ismeri a fejlesztőket. De egy dolog nem változott.\n\nHa felhívnak minket, nem egy call center válaszol. Egy ember válaszol, aki ismeri Önt, a költségvetését és az álmát. Nem egy helyi irodával rendelkező globális vállalat vagyunk. Helyi cég vagyunk globális hatósugarral." },
    motto: { label: "MOTTÓNK", title: "A világ nagyobb, mint gondolja.", subtitle: "A lehetőségei is.", closing: "Azért vagyunk itt, hogy segítsünk megtalálni őket." },
    readMore: "Olvassa el a teljes történetet",
  },
};

export default function HomeAboutStory() {
  const { lang } = usePublicLang();
  const s = brandStory[lang] || brandStory.en;

  return (
    <section id="about" className="px-4 sm:px-6 py-16 md:py-24" style={{ background: "transparent" }}>
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="flex items-center gap-3 justify-center mb-4">
            <div className="h-px w-12 bg-[#c5a065]/30" />
            <span className="text-[#c5a065] text-xs font-semibold tracking-[0.3em] uppercase">{s.sectionLabel}</span>
            <div className="h-px w-12 bg-[#c5a065]/30" />
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-semibold text-white mb-3 leading-tight">
            {s.sectionTitle}
          </h2>
          <p className="text-[#c5a065]/80 text-lg sm:text-xl font-heading italic">{s.sectionSubtitle}</p>
        </div>

        {/* Chapter 1 */}
        <div className="mb-16">
          <p className="text-[#c5a065] text-xs uppercase tracking-widest font-semibold mb-3">{s.chapter1.label}</p>
          <h3 className="font-heading text-2xl sm:text-3xl font-semibold text-white mb-5">{s.chapter1.title}</h3>
          <p className="text-white/60 leading-relaxed whitespace-pre-wrap text-base sm:text-lg">{s.chapter1.content}</p>
        </div>

        {/* Chapter 2 */}
        <div className="mb-16">
          <p className="text-[#c5a065] text-xs uppercase tracking-widest font-semibold mb-3">{s.chapter2.label}</p>
          <h3 className="font-heading text-2xl sm:text-3xl font-semibold text-white mb-5">{s.chapter2.title}</h3>
          <p className="text-white/60 leading-relaxed mb-8 text-base sm:text-lg">{s.chapter2.content}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {s.chapter2.timeline.map((item, i) => (
              <div key={i} className="border-l-2 border-[#c5a065]/30 pl-5 py-1">
                <p className="text-[#c5a065] font-semibold text-lg mb-1">{item.label}</p>
                <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Chapter 3 */}
        <div className="mb-16">
          <p className="text-[#c5a065] text-xs uppercase tracking-widest font-semibold mb-3">{s.chapter3.label}</p>
          <h3 className="font-heading text-2xl sm:text-3xl font-semibold text-white mb-5">{s.chapter3.title}</h3>
          <p className="text-white/60 leading-relaxed whitespace-pre-wrap text-base sm:text-lg">{s.chapter3.content}</p>
        </div>

        {/* Motto */}
        <div className="relative rounded-2xl border border-[#c5a065]/20 p-10 md:p-14 text-center overflow-hidden"
          style={{ background: "radial-gradient(ellipse at center, rgba(197,160,101,0.08) 0%, transparent 70%)" }}>
          <p className="text-[#c5a065] text-xs uppercase tracking-[0.3em] font-semibold mb-6">{s.motto.label}</p>
          <h3 className="font-heading text-3xl sm:text-4xl md:text-5xl font-semibold text-white mb-3 italic">
            {s.motto.title}
          </h3>
          <p className="font-heading text-xl sm:text-2xl text-[#c5a065]/90 italic mb-6">{s.motto.subtitle}</p>
          <p className="text-white/50 text-base">{s.motto.closing}</p>
        </div>

        {/* Read more link */}
        <div className="text-center mt-10">
          <Link to="/PublicAbout" className="inline-flex items-center gap-2 text-[#c5a065] hover:text-[#e8d5a0] transition-colors text-sm font-medium group">
            {s.readMore}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}