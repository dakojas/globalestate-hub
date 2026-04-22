import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import { createPageUrl } from "@/utils";
import { PublicLanguageProvider, usePublicLang } from "@/components/PublicLanguageContext";
import PublicLangSwitcher from "@/components/PublicLangSwitcher";
import Logo from "@/components/Logo";

const FAQ_DATA = {
  sk: {
    title: "Najčastejšie otázky — FAQ",
    subtitle: "Všetko čo potrebujete vedieť pred kúpou nehnuteľnosti v zahraničí.",
    contact_cta: "Nenašli ste odpoveď na svoju otázku?",
    contact_sub: "Napíšte nám priamo — radi odpovieme.",
    sections: [
      {
        title: "KÚPA NEHNUTEĽNOSTI",
        items: [
          { q: "Ako začať — čo je prvý krok?", a: "Stačí nás kontaktovať — cez WhatsApp, email alebo formulár na webe. Povieme si čo hľadáte: destinácia, rozpočet, účel (vlastné bývanie alebo investícia). Na základe toho vám do 24 hodín pošleme výber projektov šitých na mieru. Konzultácia je vždy zadarmo a nezáväzná." },
          { q: "Čo potrebujem na kúpu nehnuteľnosti v zahraničí?", a: "V drvivej väčšine krajín kde pôsobíme stačí platný cestovný pas. Náš tím sa postará o zvyšok — právnu dokumentáciu, overenie developera, podpis zmluvy aj komunikáciu s úradmi. Nemusíte vycestovať, nemusíte sa učiť miestne zákony. My sme tu práve preto." },
          { q: "Musím osobne navštíviť nehnuteľnosť pred kúpou?", a: "Nie je to nutné, hoci je to vítané. Väčšinu transakcií, najmä pri rozostavaných projektoch, vieme zrealizovať kompletne na diaľku — vrátane virtuálnej prehliadky, podpisu zmluvy a platby. Ak sa chcete pozrieť osobne, v každej krajine máme partnerov, ktorí vás prevedú priamo na mieste." },
          { q: "Môžem kúpiť nehnuteľnosť v zahraničí na splátky?", a: "Áno. Väčšina developerov v našom portfóliu ponúka splátkový kalendár priamo bez banky — zvyčajne 20–30 % pri podpise a zvyšok počas výstavby. V niektorých krajinách (napr. SAE, Egypt, Turecko) sú dostupné aj bankové hypotéky pre cudzincov. Konkrétne možnosti vám vysvetlíme pre každý projekt zvlášť." },
          { q: "Ako overujete developerov a projekty?", a: "Do nášho portfólia zaraďujeme iba projekty, ktoré sme osobne preverili — právny titul k pozemku, história developera, bankové záruky, povolenia na stavbu. Spolupracujeme len s developermi s preukázateľnou históriou dokončených projektov. Váš kapitál musí byť v bezpečí." },
        ]
      },
      {
        title: "INVESTÍCIE A VÝNOSY",
        items: [
          { q: "Aký výnos môžem očakávať z prenájmu?", a: "Závisí to od krajiny a lokality. Orientačné hodnoty z nášho portfólia: Egypt (Hurghada) 6–8 %, Dubaj 5–7 %, Albánsko 4–6 %, Bulharsko 4–5 % ročne. Tieto čísla sú realistické — nie marketingové. Na konzultácii vám ukážeme konkrétne výpočty pre každý projekt." },
          { q: "Ako je to s daňami pri kúpe a prenájme v zahraničí?", a: "Daňové zákony sa líšia v každej krajine. Niektoré destinácie (napr. SAE) nemajú daň z príjmu ani daň z nehnuteľnosti pre cudzincov vôbec. Pre každú krajinu vám poskytneme prehľad daňových povinností a v prípade potreby vás nasmerujeme na miestneho daňového poradcu." },
          { q: "Môžem nehnuteľnosť neskôr predať?", a: "Áno. Väčšina krajín kde pôsobíme umožňuje cudzincom voľný predaj nehnuteľnosti. V niektorých trhoch (napr. Egypt, Albánsko) rastú ceny rýchlo — klienti, ktorí kúpili pred 2–3 rokmi, dnes predávajú so ziskom 20–40 %. Aj s následným predajom vám radi pomôžeme." },
        ]
      },
      {
        title: "ZARIADENIE APARTMÁNU",
        items: [
          { q: "Pomáhate aj so zariadením apartmánu?", a: "Áno, to je jedna z našich obľúbených služieb. Postaráme sa o kompletné zariadenie apartmánu — od návrhu interiéru a výberu nábytku, cez spotrebiče a dekorácie, až po finálnu vizualizáciu. Začíname konzultáciou kde si spoločne nastavíme štýl, rozpočet a účel. Vy nemusíte byť prítomní — všetko zvládneme na diaľku." },
          { q: "Ako prebieha zariadenie apartmánu na diaľku?", a: "Po úvodnej konzultácii vám pripravíme návrh interiéru s vizualizáciou. Po schválení zabezpečíme nákup, dopravu aj montáž na mieste. Koordinujeme všetko s lokálnymi partnermi priamo v danej krajine. Vy dostanete fotky a správu o dokončení — apartmán bude pripravený na bývanie alebo prenájom." },
        ]
      },
      {
        title: "PRENÁJOM A SPRÁVA NEHNUTEĽNOSTI",
        items: [
          { q: "Pomôžete mi s prenájmom po kúpe?", a: "Určite. Buď vás prepojíme s overenými správcami nehnuteľností priamo v danej krajine, ktorí sa postarajú o krátkodobý aj dlhodobý prenájom, alebo vám poradíme ako nehnuteľnosť zaradiť na platformy ako Airbnb či Booking. Cieľom je aby váš apartmán generoval príjem čo najskôr po odovzdaní." },
          { q: "Čo je property management a potrebujem ho?", a: "Property management je správa nehnuteľnosti na kľúč — komunikácia s hosťami, check-in a check-out, upratovanie, drobná údržba, platby. Ak nechcete riešiť nič, je to ideálne riešenie. Spolupracujeme s overenými správcami v každej krajine nášho portfólia. Poplatky sú štandardne 15–25 % z výnosu z prenájmu." },
          { q: "Čo ak nastane problém so nehnuteľnosťou po kúpe?", a: "Naša podpora nekončí podpisom zmluvy. Sme k dispozícii aj po kúpe — či ide o technický problém, komunikáciu s developerom, alebo hľadanie správcu. V každej krajine máme lokálnych partnerov ktorí vedia zasiahnuť rýchlo. Vy ste ďaleko — my sme bližšie." },
        ]
      },
      {
        title: "O NÁS A SPOLUPRÁCI",
        items: [
          { q: "Koľko stojia vaše služby?", a: "Naša maklérska provízia je 4 % z predajnej ceny a hradí ju kupujúci. Pri projektoch s hodnotou pod 100 000 EUR je provízia stanovená fixne na 4 000 EUR. Zariadenie apartmánov a property management sú spoplatnené samostatne — cenu určujeme vždy individuálne podľa rozsahu." },
          { q: "V akých krajinách pôsobíte?", a: "Aktuálne máme projekty v Egypte, Dubaji, Albánsku, Bulharsku, Turecku, Chorvátsku, Španielsku, Taliansku, Thajsku, Bali, Gruzínsku, Maďarsku, Mauríciu, Ománe a ďalších. Ak hľadáte konkrétnu krajinu ktorú tu nevidíte — napíšte nám, veľmi pravdepodobne vám vieme pomôcť aj tam." },
          { q: "Môžem sa na vás spoľahnúť — ste overená firma?", a: "Sme slovenská firma s reálnymi klientmi a reálnymi referenciami. Stovky spokojných klientov, overené recenzie na Google a Facebooku, tím maklérov s osobnou zodpovednosťou. Nie sme anonymná platforma — za každým obchodom stojí konkrétny človek s tvárou a menom. To je náš záväzok od prvého dňa." },
        ]
      },
    ]
  },
  en: {
    title: "Frequently Asked Questions — FAQ",
    subtitle: "Everything you need to know before buying property abroad.",
    contact_cta: "Didn't find the answer to your question?",
    contact_sub: "Write to us directly — we'll be happy to answer.",
    sections: [
      {
        title: "BUYING PROPERTY",
        items: [
          { q: "How to start — what is the first step?", a: "Just contact us — via WhatsApp, email or the contact form on our website. Tell us what you're looking for: destination, budget, purpose (own residence or investment). Based on that, within 24 hours we'll send you a selection of tailored projects. Consultation is always free and non-binding." },
          { q: "What do I need to buy property abroad?", a: "In the vast majority of countries where we operate, a valid passport is sufficient. Our team takes care of the rest — legal documentation, developer verification, contract signing and communication with authorities. You don't need to travel, you don't need to learn local laws. That's exactly why we're here." },
          { q: "Do I need to personally visit the property before buying?", a: "It's not necessary, though it's welcome. Most transactions, especially for off-plan projects, can be completed entirely remotely — including virtual tours, contract signing and payment. If you'd like to visit in person, we have partners in each country who will guide you on-site." },
          { q: "Can I buy property abroad in installments?", a: "Yes. Most developers in our portfolio offer a payment plan directly without a bank — typically 20–30% upon signing and the rest during construction. In some countries (e.g. UAE, Egypt, Turkey), bank mortgages are also available for foreigners. We'll explain specific options for each project." },
          { q: "How do you verify developers and projects?", a: "We only include projects in our portfolio that we have personally verified — legal title to the land, developer history, bank guarantees, building permits. We only work with developers with a proven track record of completed projects. Your capital must be safe." },
        ]
      },
      {
        title: "INVESTMENTS & RETURNS",
        items: [
          { q: "What return can I expect from rental income?", a: "It depends on the country and location. Indicative figures from our portfolio: Egypt (Hurghada) 6–8%, Dubai 5–7%, Albania 4–6%, Bulgaria 4–5% per year. These figures are realistic — not marketing numbers. At consultation we'll show you specific calculations for each project." },
          { q: "What about taxes when buying and renting abroad?", a: "Tax laws differ in each country. Some destinations (e.g. UAE) have no income tax or property tax for foreigners at all. For each country we'll provide an overview of tax obligations and if needed, point you to a local tax advisor." },
          { q: "Can I sell the property later?", a: "Yes. Most countries where we operate allow foreigners to freely sell property. In some markets (e.g. Egypt, Albania) prices are rising fast — clients who bought 2–3 years ago are now selling with 20–40% profit. We'll gladly help you with the eventual resale as well." },
        ]
      },
      {
        title: "APARTMENT FURNISHING",
        items: [
          { q: "Do you also help with furnishing the apartment?", a: "Yes, that's one of our favorite services. We take care of complete apartment furnishing — from interior design and furniture selection, through appliances and decorations, to final visualization. We start with a consultation where we together set the style, budget and purpose. You don't need to be present — we handle everything remotely." },
          { q: "How does remote apartment furnishing work?", a: "After the initial consultation, we prepare an interior design proposal with visualization. After approval, we arrange purchase, transport and installation on-site. We coordinate everything with local partners directly in the country. You receive photos and a completion report — the apartment will be ready for living or rental." },
        ]
      },
      {
        title: "RENTAL & PROPERTY MANAGEMENT",
        items: [
          { q: "Will you help me with renting after purchase?", a: "Absolutely. We'll either connect you with verified property managers directly in the country, who will handle both short-term and long-term rental, or advise you on how to list the property on platforms like Airbnb or Booking. The goal is for your apartment to generate income as soon as possible after handover." },
          { q: "What is property management and do I need it?", a: "Property management is turnkey property management — guest communication, check-in and check-out, cleaning, minor maintenance, payments. If you don't want to deal with anything, it's the ideal solution. We work with verified managers in every country in our portfolio. Fees are typically 15–25% of rental income." },
          { q: "What if a problem occurs with the property after purchase?", a: "Our support doesn't end with the contract signing. We're available even after purchase — whether it's a technical problem, communication with the developer, or finding a property manager. In every country we have local partners who can act quickly. You're far away — we're closer." },
        ]
      },
      {
        title: "ABOUT US & COOPERATION",
        items: [
          { q: "How much do your services cost?", a: "For buyers, our real estate services are free of charge. Our fee comes from the developer as a standard broker commission. Apartment furnishing and property management are charged separately — we always determine the price individually based on scope." },
          { q: "In which countries do you operate?", a: "We currently have projects in Egypt, Dubai, Albania, Bulgaria, Turkey, Croatia, Spain, Italy, Thailand, Bali, Georgia, Hungary, Mauritius, Oman and others. If you're looking for a specific country you don't see here — write to us, we can very likely help you there too." },
          { q: "Can I trust you — are you a verified company?", a: "We are a Slovak company with real clients and real references. Hundreds of satisfied clients, verified reviews on Google and Facebook, a team of brokers with personal accountability. We're not an anonymous platform — every deal has a specific person with a face and a name behind it. That's been our commitment from day one." },
        ]
      },
    ]
  },
  de: {
    title: "Häufig gestellte Fragen — FAQ",
    subtitle: "Alles was Sie vor dem Kauf einer Immobilie im Ausland wissen müssen.",
    contact_cta: "Haben Sie die Antwort auf Ihre Frage nicht gefunden?",
    contact_sub: "Schreiben Sie uns direkt — wir antworten gerne.",
    sections: [
      {
        title: "IMMOBILIENKAUF",
        items: [
          { q: "Wie beginnt man — was ist der erste Schritt?", a: "Kontaktieren Sie uns einfach — per WhatsApp, E-Mail oder Kontaktformular auf unserer Website. Sagen Sie uns was Sie suchen: Ziel, Budget, Zweck (Eigennutzung oder Investition). Daraufhin schicken wir Ihnen innerhalb von 24 Stunden eine maßgeschneiderte Projektauswahl. Die Beratung ist immer kostenlos und unverbindlich." },
          { q: "Was brauche ich, um eine Immobilie im Ausland zu kaufen?", a: "In der überwältigenden Mehrheit der Länder, in denen wir tätig sind, reicht ein gültiger Reisepass. Unser Team kümmert sich um den Rest — rechtliche Dokumentation, Entwicklerprüfung, Vertragsunterzeichnung und Kommunikation mit Behörden. Sie müssen nicht reisen, Sie müssen keine lokalen Gesetze lernen. Genau dafür sind wir hier." },
          { q: "Muss ich die Immobilie vor dem Kauf persönlich besichtigen?", a: "Das ist nicht notwendig, obwohl es willkommen ist. Die meisten Transaktionen, insbesondere bei Off-Plan-Projekten, können vollständig aus der Ferne abgewickelt werden — einschließlich virtueller Besichtigungen, Vertragsunterzeichnung und Zahlung." },
          { q: "Kann ich eine Immobilie im Ausland in Raten kaufen?", a: "Ja. Die meisten Entwickler in unserem Portfolio bieten direkt ohne Bank einen Zahlungsplan an — typischerweise 20–30% bei Unterzeichnung und der Rest während der Bauphase. In einigen Ländern (z.B. VAE, Ägypten, Türkei) sind auch Bankhypotheken für Ausländer verfügbar." },
          { q: "Wie überprüfen Sie Entwickler und Projekte?", a: "Wir nehmen nur Projekte in unser Portfolio auf, die wir persönlich geprüft haben — rechtlicher Titel zum Grundstück, Entwicklerhistorie, Bankgarantien, Baugenehmigungen. Wir arbeiten nur mit Entwicklern mit nachgewiesener Erfolgsbilanz abgeschlossener Projekte." },
        ]
      },
      {
        title: "INVESTITIONEN & RENDITEN",
        items: [
          { q: "Welche Rendite kann ich aus Mieteinnahmen erwarten?", a: "Es hängt vom Land und der Lage ab. Richtwerte aus unserem Portfolio: Ägypten (Hurghada) 6–8%, Dubai 5–7%, Albanien 4–6%, Bulgarien 4–5% pro Jahr. Diese Zahlen sind realistisch — keine Marketingzahlen." },
          { q: "Wie sieht es mit Steuern beim Kauf und der Vermietung im Ausland aus?", a: "Steuergesetze unterscheiden sich in jedem Land. Einige Destinationen (z.B. VAE) haben überhaupt keine Einkommens- oder Immobiliensteuer für Ausländer. Für jedes Land geben wir einen Überblick über Steuerpflichten." },
          { q: "Kann ich die Immobilie später verkaufen?", a: "Ja. Die meisten Länder, in denen wir tätig sind, erlauben Ausländern den freien Verkauf von Immobilien. In einigen Märkten (z.B. Ägypten, Albanien) steigen die Preise schnell — Kunden, die vor 2–3 Jahren gekauft haben, verkaufen heute mit 20–40% Gewinn." },
        ]
      },
      {
        title: "WOHNUNGSEINRICHTUNG",
        items: [
          { q: "Helfen Sie auch bei der Einrichtung der Wohnung?", a: "Ja, das ist einer unserer beliebtesten Services. Wir kümmern uns um die komplette Wohnungseinrichtung — vom Innendesign und Möbelauswahl über Geräte und Dekorationen bis hin zur finalen Visualisierung." },
          { q: "Wie läuft die Ferneinrichtung einer Wohnung ab?", a: "Nach der ersten Beratung bereiten wir einen Innendesignvorschlag mit Visualisierung vor. Nach Genehmigung arrangieren wir Kauf, Transport und Montage vor Ort. Sie erhalten Fotos und einen Fertigstellungsbericht." },
        ]
      },
      {
        title: "VERMIETUNG & IMMOBILIENVERWALTUNG",
        items: [
          { q: "Helfen Sie mir nach dem Kauf mit der Vermietung?", a: "Auf jeden Fall. Wir verbinden Sie entweder mit verifizierten Immobilienverwaltern direkt im Land, oder beraten Sie, wie Sie die Immobilie auf Plattformen wie Airbnb oder Booking eintragen können." },
          { q: "Was ist Property Management und brauche ich es?", a: "Property Management ist die schlüsselfertige Immobilienverwaltung — Gästekommunikation, Check-in und Check-out, Reinigung, kleinere Wartung, Zahlungen. Gebühren liegen typischerweise bei 15–25% der Mieteinnahmen." },
          { q: "Was wenn nach dem Kauf ein Problem mit der Immobilie auftritt?", a: "Unser Support endet nicht mit der Vertragsunterzeichnung. Wir sind auch nach dem Kauf verfügbar — ob technisches Problem, Kommunikation mit dem Entwickler oder Suche nach einem Verwalter." },
        ]
      },
      {
        title: "ÜBER UNS & ZUSAMMENARBEIT",
        items: [
          { q: "Was kosten Ihre Dienstleistungen?", a: "Für Käufer sind unsere Immobiliendienstleistungen kostenlos. Unsere Vergütung stammt vom Entwickler als Standard-Maklerprovision. Wohnungseinrichtung und Property Management werden separat berechnet." },
          { q: "In welchen Ländern sind Sie tätig?", a: "Wir haben aktuell Projekte in Ägypten, Dubai, Albanien, Bulgarien, der Türkei, Kroatien, Spanien, Italien, Thailand, Bali, Georgien, Ungarn, Mauritius, Oman und weiteren Ländern." },
          { q: "Kann ich Ihnen vertrauen — sind Sie ein verifiziertes Unternehmen?", a: "Wir sind ein slowakisches Unternehmen mit echten Kunden und echten Referenzen. Hunderte zufriedene Kunden, verifizierte Bewertungen bei Google und Facebook, ein Team von Maklern mit persönlicher Verantwortung." },
        ]
      },
    ]
  },
  fr: {
    title: "Questions fréquentes — FAQ",
    subtitle: "Tout ce que vous devez savoir avant d'acheter une propriété à l'étranger.",
    contact_cta: "Vous n'avez pas trouvé la réponse à votre question ?",
    contact_sub: "Écrivez-nous directement — nous répondrons volontiers.",
    sections: [
      {
        title: "ACHAT IMMOBILIER",
        items: [
          { q: "Comment commencer — quelle est la première étape ?", a: "Il suffit de nous contacter — via WhatsApp, e-mail ou le formulaire de contact sur notre site. Dites-nous ce que vous cherchez : destination, budget, objectif (résidence propre ou investissement). Sur cette base, nous vous enverrons dans les 24 heures une sélection de projets sur mesure. La consultation est toujours gratuite et sans engagement." },
          { q: "De quoi ai-je besoin pour acheter une propriété à l'étranger ?", a: "Dans la grande majorité des pays où nous opérons, un passeport valide suffit. Notre équipe s'occupe du reste — documentation juridique, vérification du promoteur, signature du contrat et communication avec les autorités." },
          { q: "Dois-je visiter personnellement la propriété avant l'achat ?", a: "Ce n'est pas obligatoire, bien que ce soit le bienvenu. La plupart des transactions, notamment pour les projets en construction, peuvent être réalisées entièrement à distance." },
          { q: "Puis-je acheter une propriété à l'étranger en versements ?", a: "Oui. La plupart des promoteurs de notre portefeuille proposent un plan de paiement directement sans banque — généralement 20–30% à la signature et le reste pendant la construction." },
          { q: "Comment vérifiez-vous les promoteurs et les projets ?", a: "Nous n'incluons dans notre portefeuille que des projets que nous avons personnellement vérifiés — titre légal du terrain, historique du promoteur, garanties bancaires, permis de construire." },
        ]
      },
      {
        title: "INVESTISSEMENTS & RENDEMENTS",
        items: [
          { q: "Quel rendement puis-je attendre des revenus locatifs ?", a: "Cela dépend du pays et de la localité. Valeurs indicatives de notre portefeuille : Égypte (Hurghada) 6–8%, Dubaï 5–7%, Albanie 4–6%, Bulgarie 4–5% par an." },
          { q: "Qu'en est-il des impôts lors de l'achat et de la location à l'étranger ?", a: "Les lois fiscales diffèrent dans chaque pays. Certaines destinations (ex. EAU) n'ont pas du tout d'impôt sur le revenu ni de taxe foncière pour les étrangers." },
          { q: "Puis-je vendre la propriété plus tard ?", a: "Oui. La plupart des pays où nous opérons permettent aux étrangers de vendre librement. Dans certains marchés (ex. Égypte, Albanie), les prix augmentent rapidement — des clients qui ont acheté il y a 2–3 ans vendent aujourd'hui avec 20–40% de bénéfice." },
        ]
      },
      {
        title: "AMEUBLEMENT DE L'APPARTEMENT",
        items: [
          { q: "Aidez-vous également à meubler l'appartement ?", a: "Oui, c'est l'un de nos services préférés. Nous nous occupons de l'ameublement complet de l'appartement — de la conception intérieure au choix des meubles, en passant par les appareils et décorations jusqu'à la visualisation finale." },
          { q: "Comment se déroule l'ameublement à distance d'un appartement ?", a: "Après la consultation initiale, nous préparons une proposition de design intérieur avec visualisation. Après approbation, nous organisons l'achat, le transport et l'installation sur place." },
        ]
      },
      {
        title: "LOCATION & GESTION IMMOBILIÈRE",
        items: [
          { q: "M'aiderez-vous avec la location après l'achat ?", a: "Absolument. Nous vous mettrons en contact avec des gestionnaires immobiliers vérifiés directement dans le pays, ou vous conseillerons sur la façon d'inscrire la propriété sur des plateformes comme Airbnb ou Booking." },
          { q: "Qu'est-ce que la gestion immobilière et en ai-je besoin ?", a: "La gestion immobilière est la gestion clé en main — communication avec les hôtes, check-in et check-out, nettoyage, petite maintenance, paiements. Les frais sont généralement de 15–25% des revenus locatifs." },
          { q: "Que faire si un problème survient avec la propriété après l'achat ?", a: "Notre assistance ne s'arrête pas à la signature du contrat. Nous sommes disponibles même après l'achat — qu'il s'agisse d'un problème technique, de communication avec le promoteur, ou de recherche d'un gestionnaire." },
        ]
      },
      {
        title: "À PROPOS DE NOUS & COOPÉRATION",
        items: [
          { q: "Combien coûtent vos services ?", a: "Pour les acheteurs, nos services immobiliers sont gratuits. Notre rémunération provient du promoteur sous forme de commission standard de courtage. L'ameublement et la gestion immobilière sont facturés séparément." },
          { q: "Dans quels pays opérez-vous ?", a: "Nous avons actuellement des projets en Égypte, Dubaï, Albanie, Bulgarie, Turquie, Croatie, Espagne, Italie, Thaïlande, Bali, Géorgie, Hongrie, Maurice, Oman et d'autres pays." },
          { q: "Puis-je vous faire confiance — êtes-vous une entreprise vérifiée ?", a: "Nous sommes une entreprise slovaque avec de vrais clients et de vraies références. Des centaines de clients satisfaits, des avis vérifiés sur Google et Facebook, une équipe de courtiers avec une responsabilité personnelle." },
        ]
      },
    ]
  },
  it: {
    title: "Domande frequenti — FAQ",
    subtitle: "Tutto quello che devi sapere prima di acquistare una proprietà all'estero.",
    contact_cta: "Non hai trovato la risposta alla tua domanda?",
    contact_sub: "Scrivici direttamente — risponderemo volentieri.",
    sections: [
      {
        title: "ACQUISTO IMMOBILIARE",
        items: [
          { q: "Come iniziare — qual è il primo passo?", a: "Basta contattarci — tramite WhatsApp, email o il modulo di contatto sul sito. Dicci cosa cerchi: destinazione, budget, scopo (residenza propria o investimento). Entro 24 ore ti invieremo una selezione di progetti su misura. La consulenza è sempre gratuita e senza impegno." },
          { q: "Di cosa ho bisogno per acquistare una proprietà all'estero?", a: "Nella stragrande maggioranza dei paesi in cui operiamo, è sufficiente un passaporto valido. Il nostro team si occupa del resto — documentazione legale, verifica dello sviluppatore, firma del contratto e comunicazione con le autorità." },
          { q: "Devo visitare personalmente la proprietà prima dell'acquisto?", a: "Non è necessario, sebbene sia gradito. La maggior parte delle transazioni, soprattutto per i progetti in costruzione, può essere completata interamente a distanza." },
          { q: "Posso acquistare una proprietà all'estero a rate?", a: "Sì. La maggior parte degli sviluppatori nel nostro portafoglio offre un piano di pagamento diretto senza banca — tipicamente 20–30% alla firma e il resto durante la costruzione." },
          { q: "Come verificate gli sviluppatori e i progetti?", a: "Includiamo nel nostro portafoglio solo progetti che abbiamo verificato personalmente — titolo legale del terreno, storia dello sviluppatore, garanzie bancarie, permessi edilizi." },
        ]
      },
      {
        title: "INVESTIMENTI & RENDIMENTI",
        items: [
          { q: "Quale rendimento posso aspettarmi dal reddito da locazione?", a: "Dipende dal paese e dalla località. Valori indicativi del nostro portafoglio: Egitto (Hurghada) 6–8%, Dubai 5–7%, Albania 4–6%, Bulgaria 4–5% all'anno." },
          { q: "Come funziona la tassazione per acquisto e affitto all'estero?", a: "Le leggi fiscali differiscono in ogni paese. Alcune destinazioni (es. EAU) non hanno alcuna imposta sul reddito né tassa sulla proprietà per gli stranieri." },
          { q: "Posso vendere la proprietà in seguito?", a: "Sì. La maggior parte dei paesi in cui operiamo consente agli stranieri la vendita libera. In alcuni mercati (es. Egitto, Albania) i prezzi crescono rapidamente — clienti che hanno acquistato 2–3 anni fa oggi vendono con profitti del 20–40%." },
        ]
      },
      {
        title: "ARREDAMENTO DELL'APPARTAMENTO",
        items: [
          { q: "Aiutate anche con l'arredamento dell'appartamento?", a: "Sì, è uno dei nostri servizi preferiti. Ci occupiamo dell'arredamento completo — dal design degli interni alla scelta dei mobili, dagli elettrodomestici alle decorazioni, fino alla visualizzazione finale." },
          { q: "Come funziona l'arredamento a distanza?", a: "Dopo la consulenza iniziale prepariamo una proposta di design con visualizzazione. Dopo l'approvazione, organizziamo acquisto, trasporto e installazione in loco." },
        ]
      },
      {
        title: "AFFITTO & GESTIONE IMMOBILIARE",
        items: [
          { q: "Mi aiuterete con l'affitto dopo l'acquisto?", a: "Certamente. Ti metteremo in contatto con gestori immobiliari verificati nel paese, o ti consiglieremo come inserire la proprietà su piattaforme come Airbnb o Booking." },
          { q: "Cos'è il property management e ne ho bisogno?", a: "Il property management è la gestione chiavi in mano — comunicazione con gli ospiti, check-in e check-out, pulizie, manutenzione ordinaria, pagamenti. Le commissioni sono tipicamente del 15–25% dei proventi da affitto." },
          { q: "Cosa succede se si verifica un problema dopo l'acquisto?", a: "Il nostro supporto non finisce con la firma del contratto. Siamo disponibili anche dopo l'acquisto — che si tratti di un problema tecnico, comunicazione con lo sviluppatore, o ricerca di un gestore." },
        ]
      },
      {
        title: "CHI SIAMO & COLLABORAZIONE",
        items: [
          { q: "Quanto costano i vostri servizi?", a: "Per gli acquirenti i nostri servizi immobiliari sono gratuiti. Il nostro compenso proviene dallo sviluppatore come commissione standard di intermediazione. L'arredamento e il property management sono addebitati separatamente." },
          { q: "In quali paesi operate?", a: "Attualmente abbiamo progetti in Egitto, Dubai, Albania, Bulgaria, Turchia, Croazia, Spagna, Italia, Tailandia, Bali, Georgia, Ungheria, Mauritius, Oman e altri." },
          { q: "Posso fidarmi di voi — siete un'azienda verificata?", a: "Siamo un'azienda slovacca con clienti reali e referenze reali. Centinaia di clienti soddisfatti, recensioni verificate su Google e Facebook, un team di agenti con responsabilità personale." },
        ]
      },
    ]
  },
  ru: {
    title: "Часто задаваемые вопросы — FAQ",
    subtitle: "Всё, что вам нужно знать перед покупкой недвижимости за рубежом.",
    contact_cta: "Не нашли ответ на свой вопрос?",
    contact_sub: "Напишите нам напрямую — мы с удовольствием ответим.",
    sections: [
      {
        title: "ПОКУПКА НЕДВИЖИМОСТИ",
        items: [
          { q: "С чего начать — каков первый шаг?", a: "Просто свяжитесь с нами — через WhatsApp, электронную почту или контактную форму на сайте. Скажите нам что вы ищете: направление, бюджет, цель (собственное жильё или инвестиция). Исходя из этого, в течение 24 часов мы вышлем вам подборку проектов, подобранных специально для вас. Консультация всегда бесплатна и ни к чему не обязывает." },
          { q: "Что мне нужно для покупки недвижимости за рубежом?", a: "В подавляющем большинстве стран, где мы работаем, достаточно действующего паспорта. Наша команда берёт на себя остальное — юридическую документацию, проверку застройщика, подписание договора и общение с органами власти." },
          { q: "Нужно ли мне лично посещать объект перед покупкой?", a: "Это необязательно, хотя и приветствуется. Большинство сделок, особенно по строящимся проектам, можно провести полностью дистанционно." },
          { q: "Могу ли я купить недвижимость за рубежом в рассрочку?", a: "Да. Большинство застройщиков в нашем портфеле предлагают план платежей напрямую без банка — обычно 20–30% при подписании и остаток в процессе строительства." },
          { q: "Как вы проверяете застройщиков и проекты?", a: "В наш портфель включаются только проекты, которые мы лично проверили — права на земельный участок, история застройщика, банковские гарантии, разрешения на строительство." },
        ]
      },
      {
        title: "ИНВЕСТИЦИИ И ДОХОДНОСТЬ",
        items: [
          { q: "Какую доходность от аренды я могу ожидать?", a: "Зависит от страны и местоположения. Ориентировочные показатели из нашего портфеля: Египет (Хургада) 6–8%, Дубай 5–7%, Албания 4–6%, Болгария 4–5% в год." },
          { q: "Как обстоит дело с налогами при покупке и аренде за рубежом?", a: "Налоговое законодательство различается в каждой стране. В некоторых направлениях (например, ОАЭ) нет ни налога на доходы, ни налога на имущество для иностранцев вообще." },
          { q: "Могу ли я продать недвижимость позже?", a: "Да. В большинстве стран, где мы работаем, иностранцам разрешена свободная продажа. На некоторых рынках (например, Египет, Албания) цены растут быстро — клиенты, купившие 2–3 года назад, сегодня продают с прибылью 20–40%." },
        ]
      },
      {
        title: "МЕБЛИРОВКА КВАРТИРЫ",
        items: [
          { q: "Помогаете ли вы с меблировкой квартиры?", a: "Да, это одна из наших любимых услуг. Мы берём на себя полную меблировку квартиры — от дизайна интерьера и выбора мебели до техники и декора, вплоть до финальной визуализации." },
          { q: "Как происходит дистанционная меблировка квартиры?", a: "После первичной консультации мы подготовим предложение по дизайну интерьера с визуализацией. После согласования организуем покупку, доставку и установку на месте." },
        ]
      },
      {
        title: "АРЕНДА И УПРАВЛЕНИЕ НЕДВИЖИМОСТЬЮ",
        items: [
          { q: "Поможете ли вы с арендой после покупки?", a: "Конечно. Мы либо свяжем вас с проверенными управляющими компаниями непосредственно в стране, либо посоветуем как разместить объект на платформах типа Airbnb или Booking." },
          { q: "Что такое property management и нужен ли он мне?", a: "Property management — это управление недвижимостью под ключ: общение с гостями, заезд и выезд, уборка, мелкий ремонт, платежи. Комиссии обычно составляют 15–25% от доходов от аренды." },
          { q: "Что если после покупки возникнет проблема с недвижимостью?", a: "Наша поддержка не заканчивается подписанием договора. Мы доступны и после покупки — будь то технические проблемы, общение с застройщиком или поиск управляющего." },
        ]
      },
      {
        title: "О НАС И СОТРУДНИЧЕСТВЕ",
        items: [
          { q: "Сколько стоят ваши услуги?", a: "Для покупателей наши услуги в сфере недвижимости бесплатны. Наше вознаграждение поступает от застройщика в виде стандартной брокерской комиссии. Меблировка и управление имуществом оплачиваются отдельно." },
          { q: "В каких странах вы работаете?", a: "В настоящее время у нас есть проекты в Египте, Дубае, Албании, Болгарии, Турции, Хорватии, Испании, Италии, Таиланде, Бали, Грузии, Венгрии, Маврикии, Омане и других странах." },
          { q: "Можно ли вам доверять — вы проверенная компания?", a: "Мы словацкая компания с реальными клиентами и реальными рекомендациями. Сотни довольных клиентов, проверенные отзывы в Google и Facebook, команда брокеров с личной ответственностью." },
        ]
      },
    ]
  },
  pl: {
    title: "Najczęściej zadawane pytania — FAQ",
    subtitle: "Wszystko, co musisz wiedzieć przed zakupem nieruchomości za granicą.",
    contact_cta: "Nie znalazłeś odpowiedzi na swoje pytanie?",
    contact_sub: "Napisz do nas bezpośrednio — chętnie odpowiemy.",
    sections: [
      {
        title: "ZAKUP NIERUCHOMOŚCI",
        items: [
          { q: "Jak zacząć — co jest pierwszym krokiem?", a: "Wystarczy się z nami skontaktować — przez WhatsApp, email lub formularz kontaktowy na stronie. Powiedz nam czego szukasz: cel, budżet, przeznaczenie (własne mieszkanie lub inwestycja). Na tej podstawie w ciągu 24 godzin wyślemy Ci wybór projektów skrojonych na miarę. Konsultacja jest zawsze bezpłatna i niezobowiązująca." },
          { q: "Czego potrzebuję, aby kupić nieruchomość za granicą?", a: "W zdecydowanej większości krajów, w których działamy, wystarczy ważny paszport. Nasz zespół zajmuje się resztą — dokumentacją prawną, weryfikacją dewelopera, podpisaniem umowy i komunikacją z urzędami." },
          { q: "Czy muszę osobiście odwiedzić nieruchomość przed zakupem?", a: "Nie jest to konieczne, choć jest mile widziane. Większość transakcji, zwłaszcza przy projektach w budowie, można zrealizować całkowicie zdalnie." },
          { q: "Czy mogę kupić nieruchomość za granicą na raty?", a: "Tak. Większość deweloperów w naszym portfelu oferuje plan płatności bezpośrednio bez banku — zazwyczaj 20–30% przy podpisaniu i reszta podczas budowy." },
          { q: "Jak weryfikujecie deweloperów i projekty?", a: "Do naszego portfela włączamy tylko projekty, które osobiście zweryfikowaliśmy — tytuł prawny do działki, historia dewelopera, gwarancje bankowe, pozwolenia na budowę." },
        ]
      },
      {
        title: "INWESTYCJE I ZWROTY",
        items: [
          { q: "Jakiego zwrotu mogę oczekiwać z dochodów z najmu?", a: "Zależy od kraju i lokalizacji. Orientacyjne wartości z naszego portfela: Egipt (Hurghada) 6–8%, Dubaj 5–7%, Albania 4–6%, Bułgaria 4–5% rocznie." },
          { q: "Jak wygląda kwestia podatków przy zakupie i wynajmie za granicą?", a: "Prawo podatkowe różni się w każdym kraju. Niektóre destynacje (np. ZEA) nie mają w ogóle podatku dochodowego ani podatku od nieruchomości dla obcokrajowców." },
          { q: "Czy mogę sprzedać nieruchomość później?", a: "Tak. Większość krajów, w których działamy, pozwala obcokrajowcom na swobodną sprzedaż. Na niektórych rynkach (np. Egipt, Albania) ceny rosną szybko — klienci, którzy kupili 2–3 lata temu, dziś sprzedają z zyskiem 20–40%." },
        ]
      },
      {
        title: "UMEBLOWANIE MIESZKANIA",
        items: [
          { q: "Pomagacie również z umeblowaniem mieszkania?", a: "Tak, to jedna z naszych ulubionych usług. Zajmujemy się kompletnym umeblowaniem — od projektu wnętrza i wyboru mebli, przez sprzęt AGD i dekoracje, aż po finalną wizualizację." },
          { q: "Jak przebiega zdalne umeblowanie mieszkania?", a: "Po wstępnej konsultacji przygotowujemy projekt wnętrza z wizualizacją. Po akceptacji organizujemy zakup, transport i montaż na miejscu." },
        ]
      },
      {
        title: "WYNAJEM I ZARZĄDZANIE NIERUCHOMOŚCIĄ",
        items: [
          { q: "Pomożecie mi z wynajmem po zakupie?", a: "Oczywiście. Połączymy Cię ze sprawdzonymi zarządcami nieruchomości bezpośrednio w danym kraju, lub doradzimy jak umieścić nieruchomość na platformach takich jak Airbnb czy Booking." },
          { q: "Czym jest property management i czy go potrzebuję?", a: "Property management to zarządzanie nieruchomością pod klucz — komunikacja z gośćmi, check-in i check-out, sprzątanie, drobne naprawy, płatności. Opłaty wynoszą zazwyczaj 15–25% dochodów z najmu." },
          { q: "Co jeśli po zakupie wystąpi problem z nieruchomością?", a: "Nasze wsparcie nie kończy się na podpisaniu umowy. Jesteśmy dostępni również po zakupie — czy to problem techniczny, komunikacja z deweloperem, czy szukanie zarządcy." },
        ]
      },
      {
        title: "O NAS I WSPÓŁPRACY",
        items: [
          { q: "Ile kosztują wasze usługi?", a: "Dla kupujących nasze usługi nieruchomościowe są bezpłatne. Nasze wynagrodzenie pochodzi od dewelopera jako standardowa prowizja maklerska. Umeblowanie i property management są naliczane oddzielnie." },
          { q: "W jakich krajach działacie?", a: "Mamy aktualnie projekty w Egipcie, Dubaju, Albanii, Bułgarii, Turcji, Chorwacji, Hiszpanii, Włoszech, Tajlandii, Bali, Gruzji, Węgrzech, Mauritiusie, Omanie i innych." },
          { q: "Czy mogę wam zaufać — jesteście sprawdzoną firmą?", a: "Jesteśmy słowacką firmą z prawdziwymi klientami i prawdziwymi referencjami. Setki zadowolonych klientów, zweryfikowane opinie na Google i Facebooku, zespół maklerów z osobistą odpowiedzialnością." },
        ]
      },
    ]
  },
  hu: {
    title: "Gyakran ismételt kérdések — FAQ",
    subtitle: "Minden, amit tudni kell külföldi ingatlan vásárlása előtt.",
    contact_cta: "Nem találta meg a kérdésére a választ?",
    contact_sub: "Írjon nekünk közvetlenül — szívesen válaszolunk.",
    sections: [
      {
        title: "INGATLANVÁSÁRLÁS",
        items: [
          { q: "Hogyan kezdjük — mi az első lépés?", a: "Csak vegye fel velünk a kapcsolatot — WhatsApp-on, e-mailben vagy a weboldalon lévő kapcsolatfelvételi űrlapon. Mondja el mit keres: célállomás, költségvetés, cél (saját lakás vagy befektetés). 24 órán belül testreszabott projektjavaslatokat küldünk. A konzultáció mindig ingyenes és kötelezettségmentes." },
          { q: "Mire van szükségem külföldi ingatlan vásárlásához?", a: "Az általunk működő országok túlnyomó többségében elegendő az érvényes útlevél. Csapatunk intézi a többit — jogi dokumentáció, fejlesztő ellenőrzése, szerződés aláírása és hatóságokkal való kommunikáció." },
          { q: "Személyesen kell meglátogatnom az ingatlant vásárlás előtt?", a: "Nem kötelező, bár szívesen látott. A legtöbb tranzakció, különösen az építés alatt álló projekteknél, teljesen távolról is lebonyolítható." },
          { q: "Vásárolhatok külföldi ingatlant részletekben?", a: "Igen. Portfóliónk legtöbb fejlesztője bank nélkül kínál fizetési tervet — általában 20–30% aláíráskor, a többi az építkezés során." },
          { q: "Hogyan ellenőrzik a fejlesztőket és projekteket?", a: "Csak olyan projekteket veszünk fel portfóliónkba, amelyeket személyesen ellenőriztük — a telek tulajdonjogát, a fejlesztő előéletét, banki garanciákat, építési engedélyeket." },
        ]
      },
      {
        title: "BEFEKTETÉSEK ÉS HOZAMOK",
        items: [
          { q: "Milyen bérleti hozamra számíthatok?", a: "Az ország és helyszín függvényében. Tájékoztató számok portfóliónkból: Egyiptom (Hurghada) 6–8%, Dubai 5–7%, Albánia 4–6%, Bulgária 4–5% évente." },
          { q: "Hogyan alakul az adózás külföldi vásárlásnál és bérletnél?", a: "Az adótörvények országonként eltérők. Egyes célállomásokon (pl. EAE) egyáltalán nincs jövedelemadó vagy ingatlanadó külföldieknek." },
          { q: "Eladhatom-e az ingatlant később?", a: "Igen. A legtöbb ország engedélyezi a külföldiek szabad ingatlan értékesítését. Egyes piacokon (pl. Egyiptom, Albánia) az árak gyorsan nőnek — a 2–3 éve vásárló ügyfelek ma 20–40% nyereséggel adják el." },
        ]
      },
      {
        title: "LAKÁS BERENDEZÉSE",
        items: [
          { q: "Segítenek a lakás berendezésében is?", a: "Igen, ez az egyik kedvenc szolgáltatásunk. Gondoskodunk a teljes lakásberendezésről — a belső tér tervezésétől és bútorválasztástól a háztartási gépekig és dekorációkig, egészen a végső vizualizációig." },
          { q: "Hogyan zajlik a lakás berendezése távolról?", a: "A kezdeti konzultáció után vizualizációval ellátott belsőépítészeti javaslatot készítünk. Jóváhagyás után intézzük a vásárlást, szállítást és helyszíni összeszerelést." },
        ]
      },
      {
        title: "BÉRLÉS ÉS INGATLANKEZELÉS",
        items: [
          { q: "Segítenek-e a bérlésben vásárlás után?", a: "Természetesen. Vagy összekötjük Önt ellenőrzött ingatlankezelőkkel az adott országban, vagy tanácsot adunk, hogyan helyezze el az ingatlant az Airbnb vagy Booking platformokon." },
          { q: "Mi az ingatlankezelés és szükségem van-e rá?", a: "Az ingatlankezelés kulcsrakész kezelés — vendégkommunikáció, be- és kijelentkezés, takarítás, kisebb karbantartás, fizetések. A díjak általában a bérleti bevétel 15–25%-a." },
          { q: "Mi van, ha vásárlás után probléma merül fel az ingatlannal?", a: "Támogatásunk nem ér véget a szerződés aláírásával. Vásárlás után is rendelkezésre állunk — legyen szó műszaki problémáról, fejlesztővel való kommunikációról vagy kezelő kereséséről." },
        ]
      },
      {
        title: "RÓLUNK ÉS EGYÜTTMŰKÖDÉS",
        items: [
          { q: "Mennyibe kerülnek a szolgáltatásaik?", a: "A vásárlók számára ingatlanszolgáltatásaink ingyenesek. Díjazásunkat a fejlesztőtől kapjuk standard közvetítői jutalék formájában. A lakásberendezés és ingatlankezelés külön kerül felszámlázásra." },
          { q: "Mely országokban tevékenykednek?", a: "Jelenleg van projektünk Egyiptomban, Dubaiban, Albániában, Bulgáriában, Törökországban, Horvátországban, Spanyolországban, Olaszországban, Thaiföldön, Balin, Grúziában, Magyarországon, Mauritiuson, Ománban és máshol." },
          { q: "Megbízhatnak Önökben — ellenőrzött cég?", a: "Szlovák cég vagyunk valódi ügyfelekkel és valódi referenciákkal. Több száz elégedett ügyfél, ellenőrzött értékelések a Google-on és Facebookon, személyes felelősséggel rendelkező közvetítői csapat." },
        ]
      },
    ]
  },
};

function FAQSection({ section }) {
  const [openIdx, setOpenIdx] = useState(null);
  return (
    <div className="mb-10">
      <h2 className="text-xs font-bold uppercase tracking-widest text-[#c9a84c] mb-4">{section.title}</h2>
      <div className="space-y-3">
        {section.items.map((item, i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
            <button
              className="w-full text-left px-6 py-4 flex items-center justify-between gap-4"
              onClick={() => setOpenIdx(openIdx === i ? null : i)}
            >
              <span className="text-white font-medium">{item.q}</span>
              {openIdx === i ? <ChevronUp className="w-5 h-5 text-[#c9a84c] flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-white/40 flex-shrink-0" />}
            </button>
            {openIdx === i && (
              <div className="px-6 pb-5 text-white/70 leading-relaxed border-t border-white/10 pt-4">
                {item.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function PublicFAQInner() {
  const { lang } = usePublicLang();
  const data = FAQ_DATA[lang] || FAQ_DATA.sk;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#132039] to-[#1a2844]">
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to={createPageUrl("PublicHome")} className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <Logo className="h-9 ml-2" />
          </Link>
          <PublicLangSwitcher />
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{data.title}</h1>
          <p className="text-xl text-white/60">{data.subtitle}</p>
        </div>

        {data.sections.map((section, i) => (
          <FAQSection key={i} section={section} />
        ))}

        <div className="mt-16 bg-gradient-to-br from-[#c9a84c]/10 to-transparent border border-[#c9a84c]/30 rounded-2xl p-8 text-center">
          <p className="text-xl font-semibold text-white mb-2">{data.contact_cta}</p>
          <p className="text-white/60 mb-6">{data.contact_sub}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
            <a href="https://wa.me/421951094706" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-medium transition-colors">
              💬 WhatsApp: +421 951 094 706
            </a>
            <a href="mailto:info@nehnutelnostivzahranici.sk" className="flex items-center gap-2 bg-[#c9a84c] hover:bg-[#b8973b] text-white px-6 py-3 rounded-full font-medium transition-colors">
              ✉️ info@nehnutelnostivzahranici.sk
            </a>
          </div>
        </div>
      </div>

      <footer className="border-t border-white/10 py-8 px-6 text-center">
        <p className="text-white/40 text-sm">© 2026 Nehnuteľnosti v zahraničí</p>
      </footer>
    </div>
  );
}

export default function PublicFAQ() {
  return (
    <PublicLanguageProvider>
      <PublicFAQInner />
    </PublicLanguageProvider>
  );
}