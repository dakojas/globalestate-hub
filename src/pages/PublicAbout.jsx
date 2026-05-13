import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Logo from "@/components/Logo";
import { createPageUrl } from "@/utils";
import { PublicLanguageProvider, usePublicLang } from "@/components/PublicLanguageContext";
import PublicLangSwitcher from "@/components/PublicLangSwitcher";

const brandStory = {
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
  },
  de: {
    hero: {
      title: "Wir haben als kleiner slowakischer Traum begonnen.",
      subtitle: "Wir wurden zu einem Tor zur ganzen Welt.",
    },
    chapter1: {
      label: "KAPITEL I – ANFANG",
      title: "Eine Idee. Eine Seite. Ein Traum.",
      content: "Es war einfach: Slowaken wollten Immobilien im Ausland, wussten aber nicht, wo sie anfangen sollten. Die Sprache war fremd. Der Markt unbekannt. Das rechtliche Umfeld undurchdringlich. Und niemand sprach mit ihnen in ihrer Sprache, mit ihrem Vertrauen, aus ihrer Welt.\n\nSo entstand die Seite Nehnuteľnosti v zahraničí – nicht als großes Unternehmen, sondern als Antwort auf einen spezifischen Bedarf von spezifischen Menschen. Ein lokales Portal mit einer klaren Mission: die ferne Welt in greifbare Nähe zu bringen."
    },
    chapter2: {
      label: "KAPITEL II – WACHSTUM",
      title: "Die Kunden haben uns mitgenommen.",
      content: "Niemand musste uns davon überzeugen, dass die Welt klein ist. Unsere Kunden haben es uns gezeigt.\n\nErster Kauf in Ägypten. Dann Dubai. Dann Bali. Jeder zufriedene Kunde öffnete neue Türen – in neue Länder, zu neuen Entwicklern, zu neuen Gemeinschaften von Menschen, die über Grenzen hinaus investieren wollen.\n\nDas Team wuchs. Das Portfolio wuchs. Aber das Engagement blieb dasselbe: Jeder Kunde erhält die gleiche Fürsorge wie der erste.",
      timeline: [
        { label: "Gründung", desc: "Slowakisches Portal geht online. Erste Projekte, erste Kunden, erste Träume auf fremdem Boden erfüllt." },
        { label: "Expansion", desc: "Ägypten, Dubai, Albanien, Türkei. Team wächst. Makler in Dubai. Partner vor Ort. Der Kunde kauft nicht blind." },
        { label: "Heute", desc: "16 Länder. Hunderte zufriedene Kunden. Globales Netzwerk. Lokale Seele. Jedes Projekt geprüft. Jeder Kunde willkommen." },
        { label: "Morgen", desc: "Wachstum ohne Kompromisse. Mehr Länder. Mehr Geschichten. Ein Engagement – für jeden Kunden das zu sein, was wir für den ersten waren." }
      ]
    },
    chapter3: {
      label: "KAPITEL III – HEUTE",
      title: "Global. Aber immer noch Ihres.",
      content: "Heute sind wir in 16 Ländern tätig. Unser Team spricht mehrere Sprachen, kennt die lokalen Märkte, kennt Entwickler persönlich. Aber eines hat sich nicht geändert.\n\nWenn Sie uns anrufen, antwortet kein Callcenter. Es antwortet ein Mensch, der Sie kennt, Ihr Budget und Ihren Traum. So war es von Anfang an. So wird es bleiben.\n\nWir sind kein globales Unternehmen mit einer lokalen Niederlassung. Wir sind ein lokales Unternehmen mit globaler Reichweite. Das ist der Unterschied, den Sie in jedem Gespräch spüren."
    },
    motto: {
      title: "Die Welt ist größer als Sie denken.",
      subtitle: "Ihre Möglichkeiten auch.",
      closing: "Wir sind hier, um Ihnen zu helfen, sie zu entdecken."
    }
  },
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
  ru: {
    hero: {
      title: "Мы начали как маленькая словацкая мечта.",
      subtitle: "Мы стали воротами в целый мир.",
    },
    chapter1: {
      label: "ГЛАВА I – НАЧАЛО",
      title: "Одна идея. Одна страница. Одна мечта.",
      content: "Всё было просто: словаки хотели недвижимость за рубежом, но не знали, с чего начать. Язык был чужим. Рынок — неизвестным. Правовая среда — непроходимой. И никто не говорил с ними на их языке, с их доверием, из их мира.\n\nТак появилась страница Nehnuteľnosti v zahraničí — не как большая корпорация, а как ответ на конкретную потребность конкретных людей. Локальный портал с чёткой миссией: приблизить далёкий мир к вашим рукам."
    },
    chapter2: {
      label: "ГЛАВА II – РОСТ",
      title: "Клиенты взяли нас с собой.",
      content: "Никому не нужно было убеждать нас в том, что мир мал. Наши клиенты показали нам это.\n\nПервая покупка в Египте. Потом Дубай. Потом Бали. Каждый довольный клиент открывал новые двери — в новые страны, к новым застройщикам, к новым сообществам людей, желающих инвестировать за пределами границ.\n\nКоманда росла. Портфель рос. Но обязательство оставалось прежним: каждый клиент получает такую же заботу, как первый.",
      timeline: [
        { label: "Основание", desc: "Словацкий портал выходит в онлайн. Первые проекты, первые клиенты, первые мечты, осуществлённые на чужой земле." },
        { label: "Расширение", desc: "Египет, Дубай, Албания, Турция. Команда растёт. Брокеры в Дубае. Партнёры на месте. Клиент не покупает вслепую." },
        { label: "Сегодня", desc: "16 стран. Сотни довольных клиентов. Глобальная сеть. Локальная душа. Каждый проект проверен. Каждый клиент приветствован." },
        { label: "Завтра", desc: "Рост без компромиссов. Больше стран. Больше историй. Одно обязательство — быть для каждого клиента тем, чем мы были для первого." }
      ]
    },
    chapter3: {
      label: "ГЛАВА III – СЕГОДНЯ",
      title: "Глобальные. Но всё равно ваши.",
      content: "Сегодня мы работаем в 16 странах. Наша команда говорит на нескольких языках, знает местные рынки, знает застройщиков лично. Но одно не изменилось.\n\nКогда вы нам звоните, отвечает не колл-центр. Отвечает человек, который знает вас, ваш бюджет и вашу мечту. Так было с самого начала. Так и останется.\n\nМы не глобальная корпорация с местным офисом. Мы местная компания с глобальным охватом. Это разница, которую вы почувствуете в каждом разговоре."
    },
    motto: {
      title: "Мир больше, чем вы думаете.",
      subtitle: "Ваши возможности тоже.",
      closing: "Мы здесь, чтобы помочь вам их открыть."
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
  hu: {
    hero: {
      title: "Kis szlovák álomként kezdtük.",
      subtitle: "Az egész világ kapujává váltunk.",
    },
    chapter1: {
      label: "I. FEJEZET – KEZDETEK",
      title: "Egy ötlet. Egy oldal. Egy álom.",
      content: "Egyszerű volt: a szlovákok külföldön akartak ingatlant vásárolni, de nem tudták, hol kezdjék. A nyelv idegen volt. A piac ismeretlen. A jogi környezet átláthatatlan. És senki sem szólt hozzájuk a saját nyelvükön, a saját bizalmukkal, a saját világukból.\n\nÍgy született meg a Nehnuteľnosti v zahraničí oldal – nem nagy vállalatként, hanem konkrét emberek konkrét szükségletére adott válaszként. Egy helyi portál egyértelmű küldetéssel: a távoli világot kézközelbe hozni."
    },
    chapter2: {
      label: "II. FEJEZET – NÖVEKEDÉS",
      title: "Az ügyfelek magukkal vittek minket.",
      content: "Senki sem kellett meggyőzni arról, hogy a világ kicsi. Ügyfeleink megmutatták nekünk.\n\nElső vétel Egyiptomban. Aztán Dubai. Aztán Bali. Minden elégedett ügyfél új ajtókat nyitott meg – új országokba, új fejlesztőkhöz, olyan emberek új közösségeihez, akik határon túl akarnak befektetni.\n\nA csapat nőtt. A portfólió nőtt. De az elkötelezettség ugyanaz maradt: minden ügyfél ugyanolyan gondoskodást kap, mint az első.",
      timeline: [
        { label: "Alapítás", desc: "A szlovák portál elindul. Első projektek, első ügyfelek, első megvalósított álmok idegen földön." },
        { label: "Terjeszkedés", desc: "Egyiptom, Dubai, Albánia, Törökország. A csapat nő. Brókerek Dubaiban. Partnerek helyszínen. Az ügyfél nem vak szemmel vásárol." },
        { label: "Ma", desc: "16 ország. Több száz elégedett ügyfél. Globális hálózat. Helyi lélek. Minden projekt ellenőrzött. Minden ügyfél üdvözölt." },
        { label: "Holnap", desc: "Kompromisszum nélküli növekedés. Több ország. Több történet. Egy elkötelezettség – minden ügyfélnek azt nyújtani, amit az elsőnek." }
      ]
    },
    chapter3: {
      label: "III. FEJEZET – MA",
      title: "Globális. De mindig a tiétek.",
      content: "Ma 16 országban tevékenykedünk. Csapatunk több nyelven beszél, ismeri a helyi piacokat, személyesen ismeri a fejlesztőket. De egy dolog nem változott.\n\nHa felhívnak minket, nem egy call center válaszol. Egy ember válaszol, aki ismeri Önt, a költségvetését és az álmát. Így volt a kezdetektől. Így marad.\n\nNem egy helyi irodával rendelkező globális vállalat vagyunk. Helyi cég vagyunk globális hatósugarral. Ezt érzik minden beszélgetésben."
    },
    motto: {
      title: "A világ nagyobb, mint gondolja.",
      subtitle: "A lehetőségei is.",
      closing: "Azért vagyunk itt, hogy segítsünk megtalálni őket."
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