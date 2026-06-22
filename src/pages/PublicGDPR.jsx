import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Logo from "@/components/Logo";
import { createPageUrl } from "@/utils";
import { PublicLanguageProvider, usePublicLang } from "@/components/PublicLanguageContext";
import PublicLangSwitcher from "@/components/PublicLangSwitcher";

const gdprContent = {
  sk: {
    title: "Zásady ochrany osobných údajov",
    updated: "Prevádzkovateľ: NVZ s. r. o., Palárikova 2311/6, 052 01 Spišská Nová Ves, IČO: 57013659",
    sections: [
      {
        heading: "1. Základné informácie, cieľ spracovania osobných údajov a vymedzenie pojmov",
        text: "Cieľom zásad ochrany osobných údajov spoločnosti NVZ s. r. o., so sídlom Palárikova 2311/6, 052 01 Spišská Nová Ves, IČO: 57013659, zapísaná v Obchodnom registri Mestského súdu Košice, vložka č. 62596/V, oddiel: Sro (ďalej len „Zásady“), je poskytnúť Klientom, spolupracujúcim realitným maklérom, uchádzačom o zamestnanie a zamestnancom, prípadne iným dotknutým osobám informácie o tom:\n\naké osobné údaje sú zo strany spoločnosti NVZ s. r. o. spracovávané o Klientoch – fyzických osobách pri poskytovaní služieb sprostredkovania predaja či kúpy nehnuteľností, prenájme nehnuteľností, správy nehnuteľností a ďalších a pri sprostredkovaní iných služieb súvisiacich s nehnuteľnosťami a pri kontakte s potencionálnymi Klientmi, o záujemcoch o zamestnanie, o Spolupracujúcich realitných makléroch a o iných dotknutých osobách;\n\naký je účel spracovávania osobných údajov;\n\nako dlho dochádza k spracovávaniu osobných údajov a\n\naké práva osobám, ktorých osobné údaje sú spracovávané (ďalej len „Dotknuté osoby“) prináležia v súvislosti so spracovaním ich osobných údajov.\n\nTieto Zásady sa týkajú spracovania osobných údajov Klientov a zodpovedajúcim spôsobom aj ich zástupcov, či kontaktných osôb, potencionálnych Klientov a záujemcov o služby spoločnosti NVZ s. r. o., Spolupracujúcich realitných maklérov a uchádzačov o zamestnanie a iných Dotknutých osôb, a to vždy v rozsahu osobných údajov zodpovedajúcim ich vzťahu so spoločnosťou NVZ s. r. o.\n\nKlientom sa rozumie fyzická alebo právnická osoba, ktorá prejavila záujem prostredníctvom NVZ s. r. o. realizovať obchodný prípad, napr. kúpa, či prenájom nehnuteľností. Spravidla sa jedná o osoby, ktoré dopytujú viac informácií o nehnuteľnostiach, podmienkach transakcie a o službách spoločnosti NVZ s. r. o. Tiež sa jedná o osoby, ktoré dopytujú u spoločnosti NVZ s. r. o. sprostredkovanie rokovaní s budúcou zmluvnou protistranou alebo žiadajú rokovanie s protistranou priamo od spoločnosti NVZ s. r. o. a to v mene Klienta.\n\nSpolupracujúci realitný maklér je fyzický alebo právnická osoba, ktorá pre spoločnosť NVZ s. r. o. pravidelne alebo príležitostne obstaráva Klientov – záujemcov o kúpu alebo prenájom nehnuteľností, a to za podmienok dohodnutých v zmluvnom vzťahu medzi spoločnosťou NVZ s. r. o. a Spolupracujúcim realitným maklérom.\n\nUchádzačom o zamestnanie je fyzická osoba, ktorá má záujem vykonávať pre spoločnosť NVZ s. r. o. závislú prácu podľa pracovnoprávnych predpisov na voľnej pracovnej pozícii a poskytla spoločnosti osobné údaje za účelom posúdenia vhodnosti na voľnú pracovnú pozíciu. Zamestnancom je fyzická osoba, ktorá vykonáva pre spoločnosť NVZ s. r. o. závislú prácu na základe pracovnoprávneho vzťahu.\n\nObchodným partnerom sa rozumie fyzická alebo právnická osoba, ktorá prejavila záujem prostredníctvom NVZ s. r. o. realizovať obchodný prípad, napr. predaj nehnuteľností, či prenájom nehnuteľností. Spravidla sa jedná o osoby, ktoré ponúkajú na predaj a prenájom nehnuteľností prostredníctvom spoločnosti NVZ s. r. o. za účelom uzatvorenia zmluvných vzťahov s tretími osobami, ktoré majú záujem o kúpu alebo prenájom nehnuteľností (napr. Klienti)."
      },
      {
        heading: "2. Kto spracováva osobné údaje",
        text: "Prevádzkovateľom je spoločnosť NVZ s. r. o., so sídlom Palárikova 2311/6, 052 01 Spišská Nová Ves, IČO: 57013659, zapísaná v Obchodnom registri Mestského súdu Košice, vložka č. 62596/V, oddiel: Sro (ďalej len „Prevádzkovateľ\")."
      },
      {
        heading: "3. Právny rámec spracovania osobných údajov",
        text: "Prevádzkovateľ spracováva osobné údaje na základe všeobecného Nariadenia Európskeho parlamentu a Rady (EÚ) 2016/679 z 27. apríla 2016 o ochrane osobných údajov (ďalej len „GDPR\"), zákona č. 18/2018 Z. z. o ochrane osobných údajov a ďalších súvisiacich právnych predpisov."
      },
      {
        heading: "4. Spôsob spracovania a rozsah spracúvaných údajov",
        text: "Osobné údaje sú spracovávané korektne, zákonným a transparentným spôsobom. Osobné údaje sú zhromažďované pre určité, výslovne, vyjadrené a legitímne účely.\n\nPrevádzkovateľ získava osobné údaje prostredníctvom kontaktného formulára na webe https://www.nehnutelnostivzahranici.sk alebo iných internetových stránok, prostredníctvom aplikácií, akéhokoľvek elektronického či telefonického kontaktu, osobného stretnutia, prostredníctvom Spolupracujúcich realitných maklérov Prevádzkovateľa a iným spôsobom. Osobné údaje sú poskytované vo väčšine prípadov samotnou Dotknutou osobou pri kontaktovaní Prevádzkovateľa prostredníctvom internetových stránok a aplikácií, e-mailom, telefonicky alebo osobne a inými spôsobmi alebo sú poskytované od spolupracujúcich subjektov – realitných maklérov.\n\nPrevádzkovateľ spracováva osobné údaje:\n\nz právneho dôvodu podľa čl. 6 ods. 1 písm. b) GDPR – spracovanie je nevyhnutné pre plnenie zmluvy, ktorého zmluvnou stranou je buď Klient, Spolupracujúci realitný maklér, Obchodný partner, Zamestnanec alebo pre vykonanie opatrení prijatých pred uzatvorením zmluvy na základe žiadosti Dotknutých osôb. Účelom spracovania osobných údajov z daného právneho dôvodu je uzatvorenie zmluvného vzťahu a súvisiace úkony ako komunikácia s Klientom, Spolupracujúcim realitným maklérom, Obchodným zástupcom ohľadom ponúkaných služieb a nehnuteľností a pod. Údaje sú poskytované zo strany Klienta alebo zo strany Spolupracujúceho realitného makléra Prevádzkovateľa. Pokiaľ by Klient neposkytol osobné údaje, nemožno s ním uzatvoriť zmluvu a ani jednať za účelom jej uzatvorenia a nemožno mu ani poskytnúť službu, o ktorú Klient žiadal (ďalej len ako „Plnenie zmluvy\");\n\nz právneho dôvodu podľa čl. 6 ods. 1 písm. c) GDPR – spracovanie je nevyhnutné pre splnenie právnej povinnosti Prevádzkovateľa, ako napríklad plnenie zákonných povinností vyplývajúce najmä z týchto zákonov. Účelom spracovania osobných údajov z daného právneho dôvodu je plnenie zákonných povinností Prevádzkovateľa. Údaje sú poskytované zo strany Klienta alebo Spolupracujúcich realitných maklérov. Pokiaľ by Klient neposkytol osobné údaje, nemožno s ním uzatvoriť zmluvu a ani jednať za účelom jej uzatvorenia a nemožno mu ani poskytnúť službu, o ktorú Klient žiadal (ďalej len „Právna povinnosť\");\n\nz právneho dôvodu podľa čl. 6 ods. 1 písm. f) GDPR – spracovanie je nevyhnutné pre účely oprávnených záujmov Prevádzkovateľa. Oprávneným záujmom Prevádzkovateľa je preukazovanie, uplatňovanie a obhajovanie právnych nárokov, t. j. situácia, kedy Prevádzkovateľ má právne nároky voči Dotknutým osobám z titulu neplnenia zmluvy, vzniku škody a pod., kedy z jeho strany dochádza k spracovaniu osobných údajov na účely vymáhania a obhajovania jeho právnych nárokov. Oprávneným záujmom je aj reakcia Prevádzkovateľa na dotazy potencionálnych Klientov, ktorí sa rozhodli Prevádzkovateľa kontaktovať prostredníctvom internetových stránok alebo iným už skôr spomínaným spôsobom (ďalej len „Oprávnený záujem\")."
      },
      {
        heading: "5. Prenos osobných údajov do tretích krajín",
        text: "Cezhraničný prenos osobných údajov do tretích krajín mimo Európskeho hospodárskeho priestoru (EÚ, Island, Nórsko a Lichtenštajnsko) Prevádzkovateľ neuskutočňuje, pokiaľ to nie je potrebné na uskutočnenie poskytovaných služieb alebo pokiaľ si to výslovne nevyžaduje Klient. Ide o prípad, kedy Klient Prevádzkovateľa požiada o komunikáciu s Obchodným partnerom v jeho mene a za účelom uzatvorenia zmluvného vzťahu medzi Klientom a Obchodným partnerom ohľadom kúpy, predaja alebo prenájmu nehnuteľností v zahraničí. V takom prípade Prevádzkovateľ poskytne osobné údaje Klienta zahraničnému Obchodnému partnerovi alebo Spolupracujúcim realitným maklérom v zahraničí v nevyhnutnom rozsahu na uzatvorenie a realizáciu požadovaných zmluvných vzťahov (kúpna zmluva, nájomná zmluva medzi Klientom a Obchodným partnerom) a to všetko na základe poverenia Klienta v jeho mene."
      },
      {
        heading: "6. Práva dotknutých osôb",
        text: "Dotknutým osobám v zmysle GDPR prináležia tieto práva:\n\n• Právo na prístup k osobným údajom (čl. 15 GDPR)\n• Právo na opravu nepresných alebo neúplných osobných údajov (čl. 16 GDPR)\n• Právo na vymazanie – právo byť zabudnutý (čl. 17 GDPR)\n• Právo na obmedzenie spracúvania (čl. 18 GDPR)\n• Právo na prenosnosť údajov (čl. 20 GDPR)\n• Právo namietať spracúvanie (čl. 21 GDPR)\n• Právo podať sťažnosť na dozorný orgán – Úrad na ochranu osobných údajov Slovenskej republiky\n• Právo odvolať súhlas so spracúvaním kedykoľvek, ak bolo spracúvanie založené na súhlase"
      },
      {
        heading: "7. Kontaktné údaje",
        text: "Otázky ohľadom spracovávania osobných údajov možno podať alebo uplatnenie práv je možné vykonať u Prevádzkovateľa zaslaním listu na adresu sídla Prevádzkovateľa alebo zaslaním e-mailu na e-mailovú adresu Prevádzkovateľa: nehnutelnostivzahranici@gmail.com.\n\nNVZ s. r. o.\nPalárikova 2311/6\n052 01 Spišská Nová Ves\nIČO: 57013659"
      },
      {
        heading: "8. Zmena podmienok ochrany osobných údajov",
        text: "Ochrana osobných údajov nie je jednorazovou záležitosťou. Informácie, ktoré je Prevádzkovateľ povinný poskytnúť vzhľadom na jeho spracovávanie osobných údajov sa môžu meniť alebo prestať byť aktuálne. Z daného dôvodu si Prevádzkovateľ vyhradzuje právo kedykoľvek tieto podmienky ochrany osobných údajov upraviť a zmeniť v akomkoľvek rozsahu. V prípade, ak dôjde k zmene týchto podmienok podstatným spôsobom, túto zmenu dá Prevádzkovateľ do pozornosti oznámením na jeho webovom sídle alebo oznámením Dotknutým osobám prostredníctvom e-mailu."
      }
    ]
  },
  en: {
    title: "Privacy Policy (GDPR)",
    updated: "Effective from: 25 May 2018. Last updated: 1 January 2024",
    sections: [
      {
        heading: "1. Data Controller",
        text: "The controller of your personal data is:\n\nNehnuteľnosti v zahraničí\nSlovak Republic\nEmail: info@nehnutelnostivzahranici.sk\nPhone: +421 951 094 706\nWebsite: www.nehnutelnostivzahranici.sk\n\nAs the controller, we determine the purposes and means of processing your personal data in accordance with Regulation (EU) 2016/679 (GDPR)."
      },
      {
        heading: "2. Personal Data We Process",
        text: "Depending on the purpose, we may process the following categories of personal data:\n\na) Identification data:\n• Full name\n• Nationality\n\nb) Contact data:\n• Email address\n• Phone number\n\nc) Financial and preference data:\n• Budget and investment range\n• Property preferences (type, location, amenities)\n• Preferred countries or regions\n\nd) Communication data:\n• Content of messages and inquiries submitted via contact form\n• History of communication between you and our team\n\ne) Technical data (when visiting our website):\n• IP address\n• Browser and device type\n• Website behavior (cookies – see section 8)"
      },
      {
        heading: "3. Purposes and Legal Basis of Processing",
        text: "We process your personal data exclusively for the following purposes:\n\na) Handling inquiries and communication\nLegal basis: Art. 6(1)(b) GDPR – performance of a contract or pre-contractual relations\n\nb) Sending property offers\nLegal basis: Art. 6(1)(a) GDPR – your consent\nWith your consent, we send you current property offers and news.\n\nc) Managing client database (CRM)\nLegal basis: Art. 6(1)(f) GDPR – legitimate interest\nWe maintain a client database to efficiently manage business relationships.\n\nd) Fulfilling legal obligations\nLegal basis: Art. 6(1)(c) GDPR – legal obligation\nWe process data necessary to fulfill tax, accounting, and other legal requirements.\n\ne) Protecting legitimate interests\nLegal basis: Art. 6(1)(f) GDPR – legitimate interest\nWe process data to protect our legal claims and prevent fraud."
      },
      {
        heading: "4. Retention Period",
        text: "We retain your personal data only for as long as necessary:\n\n• Inquiries and communication: 3 years from last contact\n• Contracts and transaction documents: 10 years (legal obligation)\n• Data processed based on consent: until consent is withdrawn\n• Marketing data: until unsubscribed or consent withdrawn\n• Technical logs and cookies: typically 12 months\n\nAfter the retention period, data is securely deleted or anonymized."
      },
      {
        heading: "5. Recipients and Processors",
        text: "We may share your personal data with the following categories of recipients:\n\na) Verified developers and real estate partners\nOnly data necessary for your specific request (e.g. name and contact for sending a brochure or organizing a viewing).\n\nb) External IT and marketing service providers\nE.g. email system providers, CRM systems, web hosting – all bound by data processing agreements.\n\nc) Public authorities\nOnly when required by law (e.g. tax authorities, courts).\n\nWe do NOT sell your personal data to third parties for commercial purposes. Transfer to third countries outside the EU/EEA is only done based on appropriate safeguards (e.g. EU standard contractual clauses)."
      },
      {
        heading: "6. Your Rights as a Data Subject",
        text: "As a data subject, you have the following rights:\n\na) Right of access (Art. 15 GDPR)\nYou have the right to know whether we process your data and to obtain a copy.\n\nb) Right to rectification (Art. 16 GDPR)\nYou have the right to request correction of inaccurate or incomplete data.\n\nc) Right to erasure – 'right to be forgotten' (Art. 17 GDPR)\nYou may request deletion of your data when the purpose has ended or you withdraw consent.\n\nd) Right to restriction of processing (Art. 18 GDPR)\nYou may request restriction while data accuracy is being verified.\n\ne) Right to data portability (Art. 20 GDPR)\nYou have the right to receive your data in a structured, machine-readable format.\n\nf) Right to object (Art. 21 GDPR)\nYou may object to processing based on legitimate interest, including profiling and direct marketing.\n\ng) Right to withdraw consent\nYou may withdraw consent at any time without affecting the lawfulness of prior processing.\n\nh) Right to lodge a complaint\nYou may contact the Slovak Data Protection Authority:\nÚrad na ochranu osobných údajov SR\nHraničná 12, 820 07 Bratislava\nweb: dataprotection.gov.sk\ntel: +421 2 3231 3214\n\nTo exercise your rights, contact us at: info@nehnutelnostivzahranici.sk"
      },
      {
        heading: "7. Security of Personal Data",
        text: "We have implemented appropriate technical and organizational measures to protect your personal data:\n\n• Encryption of data in transit (SSL/TLS)\n• Access to personal data limited to authorized staff only\n• Regular employee training on data protection\n• Secure data storage on servers within the EU\n• Regular security audits and backups\n\nIn the event of a security incident that may affect your rights, we will notify you in accordance with GDPR."
      },
      {
        heading: "8. Cookies and Tracking Technologies",
        text: "Our website uses cookies and similar technologies.\n\nTypes of cookies we use:\n\na) Essential cookies – ensure basic website functions (e.g. login, security). These cannot be refused.\n\nb) Analytical cookies – help us understand how visitors use the site (e.g. Google Analytics). Used only with your consent.\n\nc) Marketing cookies – used to display relevant ads. Used only with your consent.\n\nYou can manage cookies in your browser settings or via our cookie banner."
      },
      {
        heading: "9. Changes to This Policy",
        text: "We reserve the right to update this privacy policy in line with changes in legislation or our processing activities. We will inform you of significant changes via our website. We recommend checking this document regularly."
      },
      {
        heading: "10. Contact",
        text: "For any questions, requests or complaints regarding the protection of your personal data:\n\nNehnuteľnosti v zahraničí\nEmail: info@nehnutelnostivzahranici.sk\nPhone: +421 951 094 706\nWebsite: www.nehnutelnostivzahranici.sk\n\nWe respond to all requests without undue delay, within 30 days of receipt."
      }
    ]
  },
  de: {
    title: "Datenschutzrichtlinie (DSGVO)",
    updated: "Gültig ab: 25. Mai 2018. Letzte Aktualisierung: 1. Januar 2024",
    sections: [
      {
        heading: "1. Verantwortlicher",
        text: "Der Verantwortliche für Ihre personenbezogenen Daten ist:\n\nNehnuteľnosti v zahraničí\nSlowakische Republik\nE-Mail: info@nehnutelnostivzahranici.sk\nTelefon: +421 951 094 706\nWebseite: www.nehnutelnostivzahranici.sk"
      },
      {
        heading: "2. Welche Daten wir verarbeiten",
        text: "Je nach Zweck verarbeiten wir folgende Kategorien personenbezogener Daten:\n\na) Identifikationsdaten:\n• Vor- und Nachname\n• Staatsangehörigkeit\n\nb) Kontaktdaten:\n• E-Mail-Adresse\n• Telefonnummer\n\nc) Finanz- und Präferenzdaten:\n• Budget und Investitionsrahmen\n• Immobilienpräferenzen (Typ, Lage, Ausstattung)\n• Bevorzugte Länder oder Regionen\n\nd) Kommunikationsdaten:\n• Inhalt der über das Kontaktformular gesendeten Nachrichten\n• Kommunikationshistorie\n\ne) Technische Daten (bei Website-Besuch):\n• IP-Adresse\n• Browser- und Gerätetyp\n• Website-Verhalten (Cookies – siehe Abschnitt 8)"
      },
      {
        heading: "3. Zwecke und Rechtsgrundlagen",
        text: "Wir verarbeiten Ihre personenbezogenen Daten ausschließlich für folgende Zwecke:\n\na) Bearbeitung von Anfragen und Kommunikation\nRechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO\n\nb) Zusendung von Immobilienangeboten\nRechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO – Ihre Einwilligung\n\nc) Verwaltung der Kundendatenbank (CRM)\nRechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO – berechtigte Interessen\n\nd) Erfüllung gesetzlicher Pflichten\nRechtsgrundlage: Art. 6 Abs. 1 lit. c DSGVO\n\ne) Schutz berechtigter Interessen\nRechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO"
      },
      {
        heading: "4. Speicherdauer",
        text: "Wir bewahren Ihre personenbezogenen Daten nur so lange auf, wie es notwendig ist:\n\n• Anfragen und Kommunikation: 3 Jahre ab letztem Kontakt\n• Verträge und Transaktionsdokumente: 10 Jahre (gesetzliche Pflicht)\n• Daten auf Einwilligungsbasis: bis zum Widerruf\n• Marketingdaten: bis zur Abmeldung oder zum Widerruf\n• Technische Logs und Cookies: in der Regel 12 Monate\n\nNach Ablauf der Speicherfrist werden die Daten sicher gelöscht oder anonymisiert."
      },
      {
        heading: "5. Empfänger und Auftragsverarbeiter",
        text: "Wir können Ihre personenbezogenen Daten mit folgenden Kategorien von Empfängern teilen:\n\na) Geprüfte Entwickler und Immobilienpartner\nNur die für Ihre Anfrage erforderlichen Daten.\n\nb) Externe IT- und Marketingdienstleister\nAlle durch Datenverarbeitungsverträge gebunden.\n\nc) Behörden\nNur wenn gesetzlich vorgeschrieben.\n\nWir VERKAUFEN Ihre Daten NICHT an Dritte zu kommerziellen Zwecken. Übertragungen in Drittländer erfolgen nur mit geeigneten Garantien (z.B. EU-Standardvertragsklauseln)."
      },
      {
        heading: "6. Ihre Rechte",
        text: "Als betroffene Person haben Sie folgende Rechte:\n\na) Auskunftsrecht (Art. 15 DSGVO)\nb) Recht auf Berichtigung (Art. 16 DSGVO)\nc) Recht auf Löschung (Art. 17 DSGVO)\nd) Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)\ne) Recht auf Datenübertragbarkeit (Art. 20 DSGVO)\nf) Widerspruchsrecht (Art. 21 DSGVO)\ng) Recht auf Widerruf der Einwilligung\nh) Beschwerderecht bei der slowakischen Datenschutzbehörde:\n\nÚrad na ochranu osobných údajov SR\nHraničná 12, 820 07 Bratislava\nweb: dataprotection.gov.sk\n\nKontakt: info@nehnutelnostivzahranici.sk"
      },
      {
        heading: "7. Datensicherheit",
        text: "Wir haben angemessene technische und organisatorische Maßnahmen zum Schutz Ihrer Daten ergriffen:\n\n• Verschlüsselung bei der Übertragung (SSL/TLS)\n• Zugang nur für autorisierte Mitarbeiter\n• Regelmäßige Schulungen\n• Sichere Datenspeicherung auf Servern innerhalb der EU\n• Regelmäßige Sicherheitsaudits"
      },
      {
        heading: "8. Cookies",
        text: "Unsere Website verwendet Cookies:\n\na) Notwendige Cookies – grundlegende Funktionen\nb) Analytische Cookies – nur mit Einwilligung (z.B. Google Analytics)\nc) Marketing-Cookies – nur mit Einwilligung\n\nSie können Cookies in Ihren Browsereinstellungen verwalten."
      },
      {
        heading: "9. Änderungen dieser Richtlinie",
        text: "Wir behalten uns das Recht vor, diese Datenschutzrichtlinie zu aktualisieren. Wir empfehlen, dieses Dokument regelmäßig zu überprüfen."
      },
      {
        heading: "10. Kontakt",
        text: "Nehnuteľnosti v zahraničí\nE-Mail: info@nehnutelnostivzahranici.sk\nTelefon: +421 951 094 706\nWebseite: www.nehnutelnostivzahranici.sk\n\nWir antworten auf alle Anfragen innerhalb von 30 Tagen."
      }
    ]
  },
  fr: {
    title: "Politique de confidentialité (RGPD)",
    updated: "En vigueur à partir du : 25 mai 2018. Dernière mise à jour : 1er janvier 2024",
    sections: [
      {
        heading: "1. Responsable du traitement",
        text: "Le responsable du traitement de vos données personnelles est :\n\nNehnuteľnosti v zahraničí\nRépublique slovaque\nE-mail : info@nehnutelnostivzahranici.sk\nTél : +421 951 094 706\nSite web : www.nehnutelnostivzahranici.sk"
      },
      {
        heading: "2. Données que nous traitons",
        text: "Selon l'objectif, nous pouvons traiter les catégories suivantes de données personnelles :\n\na) Données d'identification : nom, prénom, nationalité\nb) Données de contact : adresse e-mail, numéro de téléphone\nc) Données financières et de préférence : budget, préférences immobilières, pays souhaités\nd) Données de communication : contenu des messages, historique des échanges\ne) Données techniques : adresse IP, type de navigateur, comportement sur le site (cookies – voir section 8)"
      },
      {
        heading: "3. Finalités et bases juridiques",
        text: "Nous traitons vos données personnelles exclusivement aux fins suivantes :\n\na) Traitement des demandes – Art. 6(1)(b) RGPD\nb) Envoi d'offres immobilières – Art. 6(1)(a) RGPD (consentement)\nc) Gestion de la base de données clients (CRM) – Art. 6(1)(f) RGPD\nd) Obligations légales – Art. 6(1)(c) RGPD\ne) Protection des intérêts légitimes – Art. 6(1)(f) RGPD"
      },
      {
        heading: "4. Durée de conservation",
        text: "• Demandes et communication : 3 ans depuis le dernier contact\n• Contrats et documents : 10 ans (obligation légale)\n• Données sur base du consentement : jusqu'au retrait\n• Données marketing : jusqu'au désabonnement\n• Logs techniques et cookies : généralement 12 mois"
      },
      {
        heading: "5. Destinataires des données",
        text: "Nous pouvons partager vos données avec :\n\na) Des promoteurs et partenaires immobiliers vérifiés\nb) Des prestataires de services IT et marketing (liés par des contrats de traitement)\nc) Les autorités publiques (si requis par la loi)\n\nNous NE VENDONS PAS vos données à des tiers à des fins commerciales."
      },
      {
        heading: "6. Vos droits",
        text: "En tant que personne concernée, vous disposez des droits suivants :\n\na) Droit d'accès (Art. 15 RGPD)\nb) Droit de rectification (Art. 16 RGPD)\nc) Droit à l'effacement (Art. 17 RGPD)\nd) Droit à la limitation du traitement (Art. 18 RGPD)\ne) Droit à la portabilité des données (Art. 20 RGPD)\nf) Droit d'opposition (Art. 21 RGPD)\ng) Droit de retirer votre consentement à tout moment\nh) Droit de déposer une plainte auprès de l'autorité slovaque de protection des données :\n\nÚrad na ochranu osobných údajov SR, Hraničná 12, 820 07 Bratislava\nweb : dataprotection.gov.sk\n\nContact : info@nehnutelnostivzahranici.sk"
      },
      {
        heading: "7. Sécurité des données",
        text: "Nous avons mis en place des mesures techniques et organisationnelles appropriées :\n\n• Chiffrement des données en transit (SSL/TLS)\n• Accès limité au personnel autorisé\n• Formation régulière des employés\n• Stockage sécurisé sur des serveurs au sein de l'UE\n• Audits de sécurité réguliers"
      },
      {
        heading: "8. Cookies",
        text: "Notre site utilise des cookies :\n\na) Cookies essentiels – fonctions de base du site\nb) Cookies analytiques – uniquement avec votre consentement\nc) Cookies marketing – uniquement avec votre consentement\n\nVous pouvez gérer les cookies dans les paramètres de votre navigateur."
      },
      {
        heading: "9. Modifications",
        text: "Nous nous réservons le droit de mettre à jour cette politique. Nous vous recommandons de vérifier ce document régulièrement."
      },
      {
        heading: "10. Contact",
        text: "Nehnuteľnosti v zahraničí\nE-mail : info@nehnutelnostivzahranici.sk\nTél : +421 951 094 706\n\nNous répondons à toutes les demandes dans un délai de 30 jours."
      }
    ]
  },
  it: {
    title: "Informativa sulla privacy (GDPR)",
    updated: "In vigore dal: 25 maggio 2018. Ultimo aggiornamento: 1° gennaio 2024",
    sections: [
      {
        heading: "1. Titolare del trattamento",
        text: "Il titolare del trattamento dei tuoi dati personali è:\n\nNehnuteľnosti v zahraničí\nRepubblica Slovacca\nEmail: info@nehnutelnostivzahranici.sk\nTel: +421 951 094 706\nSito web: www.nehnutelnostivzahranici.sk"
      },
      {
        heading: "2. Dati che trattiamo",
        text: "A seconda dello scopo, possiamo trattare le seguenti categorie di dati personali:\n\na) Dati identificativi: nome, cognome, nazionalità\nb) Dati di contatto: indirizzo email, numero di telefono\nc) Dati finanziari e preferenze: budget, preferenze immobiliari, paesi preferiti\nd) Dati di comunicazione: contenuto dei messaggi, storico comunicazioni\ne) Dati tecnici: indirizzo IP, tipo di browser, comportamento sul sito (cookie – vedi sezione 8)"
      },
      {
        heading: "3. Finalità e basi giuridiche",
        text: "Trattiamo i tuoi dati personali esclusivamente per i seguenti scopi:\n\na) Gestione delle richieste – Art. 6(1)(b) GDPR\nb) Invio di offerte immobiliari – Art. 6(1)(a) GDPR (consenso)\nc) Gestione del database clienti (CRM) – Art. 6(1)(f) GDPR\nd) Obblighi legali – Art. 6(1)(c) GDPR\ne) Protezione degli interessi legittimi – Art. 6(1)(f) GDPR"
      },
      {
        heading: "4. Periodo di conservazione",
        text: "• Richieste e comunicazioni: 3 anni dall'ultimo contatto\n• Contratti e documenti: 10 anni (obbligo legale)\n• Dati basati sul consenso: fino alla revoca\n• Dati di marketing: fino alla cancellazione\n• Log tecnici e cookie: generalmente 12 mesi"
      },
      {
        heading: "5. Destinatari dei dati",
        text: "Possiamo condividere i tuoi dati con:\n\na) Sviluppatori e partner immobiliari verificati\nb) Fornitori di servizi IT e marketing (vincolati da accordi di trattamento)\nc) Autorità pubbliche (se richiesto dalla legge)\n\nNon VENDIAMO i tuoi dati a terzi per scopi commerciali."
      },
      {
        heading: "6. I tuoi diritti",
        text: "In qualità di interessato, hai i seguenti diritti:\n\na) Diritto di accesso (Art. 15 GDPR)\nb) Diritto di rettifica (Art. 16 GDPR)\nc) Diritto alla cancellazione (Art. 17 GDPR)\nd) Diritto alla limitazione del trattamento (Art. 18 GDPR)\ne) Diritto alla portabilità dei dati (Art. 20 GDPR)\nf) Diritto di opposizione (Art. 21 GDPR)\ng) Diritto di revocare il consenso in qualsiasi momento\nh) Diritto di presentare un reclamo all'autorità slovacca per la protezione dei dati:\n\nÚrad na ochranu osobných údajov SR, Hraničná 12, 820 07 Bratislava\nweb: dataprotection.gov.sk\n\nContatto: info@nehnutelnostivzahranici.sk"
      },
      {
        heading: "7. Sicurezza dei dati",
        text: "Abbiamo adottato misure tecniche e organizzative adeguate:\n\n• Crittografia dei dati in transito (SSL/TLS)\n• Accesso limitato al personale autorizzato\n• Formazione regolare del personale\n• Archiviazione sicura su server nell'UE\n• Audit di sicurezza regolari"
      },
      {
        heading: "8. Cookie",
        text: "Il nostro sito utilizza cookie:\n\na) Cookie essenziali – funzioni di base del sito\nb) Cookie analitici – solo con il tuo consenso\nc) Cookie di marketing – solo con il tuo consenso\n\nPuoi gestire i cookie nelle impostazioni del tuo browser."
      },
      {
        heading: "9. Modifiche",
        text: "Ci riserviamo il diritto di aggiornare questa informativa. Ti consigliamo di controllare questo documento regolarmente."
      },
      {
        heading: "10. Contatto",
        text: "Nehnuteľnosti v zahraničí\nEmail: info@nehnutelnostivzahranici.sk\nTel: +421 951 094 706\n\nRispondiamo a tutte le richieste entro 30 giorni."
      }
    ]
  },
  ru: {
    title: "Политика конфиденциальности (GDPR)",
    updated: "Действует с: 25 мая 2018 года. Последнее обновление: 1 января 2024 года",
    sections: [
      {
        heading: "1. Оператор персональных данных",
        text: "Оператором ваших персональных данных является:\n\nNehnuteľnosti v zahraničí\nСловацкая Республика\nЭл. почта: info@nehnutelnostivzahranici.sk\nТелефон: +421 951 094 706\nСайт: www.nehnutelnostivzahranici.sk"
      },
      {
        heading: "2. Какие данные мы обрабатываем",
        text: "В зависимости от цели мы можем обрабатывать следующие категории персональных данных:\n\na) Идентификационные данные: имя, фамилия, гражданство\nb) Контактные данные: адрес эл. почты, номер телефона\nc) Финансовые данные и предпочтения: бюджет, предпочтения по недвижимости, предпочтительные страны\nd) Коммуникационные данные: содержание сообщений, история переписки\ne) Технические данные: IP-адрес, тип браузера, поведение на сайте (cookies – см. раздел 8)"
      },
      {
        heading: "3. Цели и правовые основания обработки",
        text: "Мы обрабатываем ваши персональные данные исключительно в следующих целях:\n\na) Обработка запросов – ст. 6(1)(b) GDPR\nb) Отправка предложений по недвижимости – ст. 6(1)(a) GDPR (согласие)\nc) Управление базой клиентов (CRM) – ст. 6(1)(f) GDPR\nd) Исполнение правовых обязательств – ст. 6(1)(c) GDPR\ne) Защита законных интересов – ст. 6(1)(f) GDPR"
      },
      {
        heading: "4. Сроки хранения данных",
        text: "• Запросы и коммуникация: 3 года с момента последнего контакта\n• Договоры и документы: 10 лет (законодательное требование)\n• Данные на основе согласия: до его отзыва\n• Маркетинговые данные: до отписки\n• Технические логи и cookies: как правило, 12 месяцев"
      },
      {
        heading: "5. Получатели данных",
        text: "Мы можем передавать ваши данные следующим категориям получателей:\n\na) Проверенным застройщикам и партнёрам по недвижимости\nb) Внешним поставщикам IT и маркетинговых услуг (связанным договором)\nc) Государственным органам (только по требованию закона)\n\nМы НЕ ПРОДАЁМ ваши данные третьим лицам в коммерческих целях."
      },
      {
        heading: "6. Ваши права",
        text: "Как субъект данных, вы имеете следующие права:\n\na) Право на доступ (ст. 15 GDPR)\nb) Право на исправление (ст. 16 GDPR)\nc) Право на удаление – «право быть забытым» (ст. 17 GDPR)\nd) Право на ограничение обработки (ст. 18 GDPR)\ne) Право на переносимость данных (ст. 20 GDPR)\nf) Право на возражение (ст. 21 GDPR)\ng) Право отозвать согласие в любое время\nh) Право подать жалобу в словацкий орган по защите данных:\n\nÚrad na ochranu osobných údajov SR, Hraničná 12, 820 07 Bratislava\nweb: dataprotection.gov.sk\n\nКонтакт: info@nehnutelnostivzahranici.sk"
      },
      {
        heading: "7. Безопасность данных",
        text: "Мы приняли соответствующие технические и организационные меры:\n\n• Шифрование данных при передаче (SSL/TLS)\n• Доступ только для уполномоченных сотрудников\n• Регулярное обучение персонала\n• Безопасное хранение данных на серверах в ЕС\n• Регулярные аудиты безопасности"
      },
      {
        heading: "8. Cookies",
        text: "Наш сайт использует cookies:\n\na) Необходимые cookies – основные функции сайта\nb) Аналитические cookies – только с вашего согласия\nc) Маркетинговые cookies – только с вашего согласия\n\nВы можете управлять cookies в настройках браузера."
      },
      {
        heading: "9. Изменения политики",
        text: "Мы оставляем за собой право обновлять данную политику. Рекомендуем регулярно проверять этот документ."
      },
      {
        heading: "10. Контакт",
        text: "Nehnuteľnosti v zahraničí\nЭл. почта: info@nehnutelnostivzahranici.sk\nТелефон: +421 951 094 706\n\nМы отвечаем на все запросы в течение 30 дней."
      }
    ]
  },
  pl: {
    title: "Polityka prywatności (RODO)",
    updated: "Obowiązuje od: 25 maja 2018. Ostatnia aktualizacja: 1 stycznia 2024",
    sections: [
      {
        heading: "1. Administrator danych",
        text: "Administratorem Twoich danych osobowych jest:\n\nNehnuteľnosti v zahraničí\nRepublika Słowacka\nE-mail: info@nehnutelnostivzahranici.sk\nTel: +421 951 094 706\nStrona: www.nehnutelnostivzahranici.sk"
      },
      {
        heading: "2. Jakie dane przetwarzamy",
        text: "W zależności od celu możemy przetwarzać następujące kategorie danych:\n\na) Dane identyfikacyjne: imię, nazwisko, obywatelstwo\nb) Dane kontaktowe: adres e-mail, numer telefonu\nc) Dane finansowe i preferencje: budżet, preferencje dotyczące nieruchomości, preferowane kraje\nd) Dane komunikacyjne: treść wiadomości, historia korespondencji\ne) Dane techniczne: adres IP, typ przeglądarki, zachowanie na stronie (cookies – patrz sekcja 8)"
      },
      {
        heading: "3. Cele i podstawy prawne",
        text: "Przetwarzamy Twoje dane wyłącznie w następujących celach:\n\na) Obsługa zapytań – art. 6(1)(b) RODO\nb) Wysyłka ofert nieruchomości – art. 6(1)(a) RODO (zgoda)\nc) Zarządzanie bazą klientów (CRM) – art. 6(1)(f) RODO\nd) Obowiązki prawne – art. 6(1)(c) RODO\ne) Ochrona uzasadnionych interesów – art. 6(1)(f) RODO"
      },
      {
        heading: "4. Okres przechowywania",
        text: "• Zapytania i komunikacja: 3 lata od ostatniego kontaktu\n• Umowy i dokumenty: 10 lat (obowiązek prawny)\n• Dane oparte na zgodzie: do odwołania\n• Dane marketingowe: do rezygnacji\n• Logi techniczne i cookies: zazwyczaj 12 miesięcy"
      },
      {
        heading: "5. Odbiorcy danych",
        text: "Możemy udostępniać Twoje dane:\n\na) Zweryfikowanym deweloperom i partnerom nieruchomości\nb) Zewnętrznym dostawcom usług IT i marketingowych (związanym umowami)\nc) Organom publicznym (tylko gdy wymagane przez prawo)\n\nNie SPRZEDAJEMY Twoich danych osobom trzecim w celach komercyjnych."
      },
      {
        heading: "6. Twoje prawa",
        text: "Jako osoba, której dane dotyczą, masz następujące prawa:\n\na) Prawo dostępu (art. 15 RODO)\nb) Prawo do sprostowania (art. 16 RODO)\nc) Prawo do usunięcia (art. 17 RODO)\nd) Prawo do ograniczenia przetwarzania (art. 18 RODO)\ne) Prawo do przenoszenia danych (art. 20 RODO)\nf) Prawo do sprzeciwu (art. 21 RODO)\ng) Prawo do cofnięcia zgody w dowolnym momencie\nh) Prawo do złożenia skargi do słowackiego organu ochrony danych:\n\nÚrad na ochranu osobných údajov SR, Hraničná 12, 820 07 Bratislava\nweb: dataprotection.gov.sk\n\nKontakt: info@nehnutelnostivzahranici.sk"
      },
      {
        heading: "7. Bezpieczeństwo danych",
        text: "Wdrożyliśmy odpowiednie środki techniczne i organizacyjne:\n\n• Szyfrowanie danych w transmisji (SSL/TLS)\n• Dostęp tylko dla upoważnionych pracowników\n• Regularne szkolenia pracowników\n• Bezpieczne przechowywanie danych na serwerach w UE\n• Regularne audyty bezpieczeństwa"
      },
      {
        heading: "8. Cookies",
        text: "Nasza strona używa plików cookies:\n\na) Niezbędne cookies – podstawowe funkcje strony\nb) Analityczne cookies – tylko za Twoją zgodą\nc) Marketingowe cookies – tylko za Twoją zgodą\n\nMożesz zarządzać cookies w ustawieniach przeglądarki."
      },
      {
        heading: "9. Zmiany polityki",
        text: "Zastrzegamy sobie prawo do aktualizacji niniejszej polityki. Zalecamy regularne sprawdzanie tego dokumentu."
      },
      {
        heading: "10. Kontakt",
        text: "Nehnuteľnosti v zahraničí\nE-mail: info@nehnutelnostivzahranici.sk\nTel: +421 951 094 706\n\nOdpowiadamy na wszystkie zapytania w ciągu 30 dni."
      }
    ]
  },
  hu: {
    title: "Adatvédelmi irányelvek (GDPR)",
    updated: "Hatályos: 2018. május 25-től. Utolsó frissítés: 2024. január 1.",
    sections: [
      {
        heading: "1. Adatkezelő",
        text: "Személyes adatainak kezelője:\n\nNehnuteľnosti v zahraničí\nSzlovák Köztársaság\nE-mail: info@nehnutelnostivzahranici.sk\nTelefon: +421 951 094 706\nWeboldal: www.nehnutelnostivzahranici.sk"
      },
      {
        heading: "2. Milyen adatokat kezelünk",
        text: "A céltól függően a következő kategóriájú személyes adatokat kezelhetjük:\n\na) Azonosító adatok: teljes név, állampolgárság\nb) Kapcsolattartási adatok: e-mail cím, telefonszám\nc) Pénzügyi adatok és preferenciák: költségvetés, ingatlanpreferenciák, preferált országok\nd) Kommunikációs adatok: üzenetek tartalma, levelezési előzmények\ne) Technikai adatok: IP-cím, böngésző típusa, webhelyen való viselkedés (sütik – lásd 8. szakasz)"
      },
      {
        heading: "3. Célok és jogalapok",
        text: "Személyes adatait kizárólag a következő célokra dolgozzuk fel:\n\na) Megkeresések kezelése – GDPR 6. cikk (1) bek. b) pont\nb) Ingatlanajánlatok küldése – GDPR 6. cikk (1) bek. a) pont (hozzájárulás)\nc) Ügyféladatbázis kezelése (CRM) – GDPR 6. cikk (1) bek. f) pont\nd) Jogi kötelezettségek teljesítése – GDPR 6. cikk (1) bek. c) pont\ne) Jogos érdekek védelme – GDPR 6. cikk (1) bek. f) pont"
      },
      {
        heading: "4. Megőrzési idő",
        text: "• Megkeresések és kommunikáció: 3 év az utolsó kapcsolatfelvételtől\n• Szerződések és dokumentumok: 10 év (törvényi kötelezettség)\n• Hozzájáruláson alapuló adatok: a visszavonásig\n• Marketingadatok: a leiratkozásig\n• Technikai naplók és sütik: általában 12 hónap"
      },
      {
        heading: "5. Adatok címzettjei",
        text: "Adatait megoszthatjuk a következőkkel:\n\na) Ellenőrzött fejlesztőkkel és ingatlanpartnerekkel\nb) Külső IT és marketing szolgáltatókkal (adatfeldolgozási szerződéssel kötve)\nc) Hatóságokkal (csak jogszabályi kötelezettség esetén)\n\nAdatait NEM ADJUK EL harmadik félnek kereskedelmi célból."
      },
      {
        heading: "6. Az Ön jogai",
        text: "Érintettként az alábbi jogokat gyakorolhatja:\n\na) Hozzáférési jog (GDPR 15. cikk)\nb) Helyesbítési jog (GDPR 16. cikk)\nc) Törlési jog - elfeledtetéshez való jog (GDPR 17. cikk)\nd) Az adatkezelés korlátozásához való jog (GDPR 18. cikk)\ne) Adathordozhatósághoz való jog (GDPR 20. cikk)\nf) Tiltakozáshoz való jog (GDPR 21. cikk)\ng) Hozzájárulás visszavonásának joga\nh) Panasztételi jog a szlovák adatvédelmi hatóságnál:\n\nÚrad na ochranu osobných údajov SR, Hraničná 12, 820 07 Bratislava\nweb: dataprotection.gov.sk\n\nKapcsolat: info@nehnutelnostivzahranici.sk"
      },
      {
        heading: "7. Adatbiztonság",
        text: "Megfelelő technikai és szervezeti intézkedéseket vezettünk be:\n\n• Adattitkosítás átvitel közben (SSL/TLS)\n• Hozzáférés csak jogosult alkalmazottak számára\n• Rendszeres munkavállalói képzések\n• Biztonságos adattárolás EU-n belüli szervereken\n• Rendszeres biztonsági auditok"
      },
      {
        heading: "8. Sütik (Cookies)",
        text: "Weboldalunk sütiket használ:\n\na) Szükséges sütik – az oldal alapvető funkciói\nb) Analitikai sütik – csak az Ön hozzájárulásával\nc) Marketing sütik – csak az Ön hozzájárulásával\n\nA sütiket a böngésző beállításaiban kezelheti."
      },
      {
        heading: "9. Az irányelvek módosítása",
        text: "Fenntartjuk a jogot, hogy frissítsük ezt az adatvédelmi irányelvet. Javasoljuk, hogy rendszeresen ellenőrizze ezt a dokumentumot."
      },
      {
        heading: "10. Kapcsolat",
        text: "Nehnuteľnosti v zahraničí\nE-mail: info@nehnutelnostivzahranici.sk\nTelefon: +421 951 094 706\n\nMinden megkeresésre 30 napon belül válaszolunk."
      }
    ]
  }
};

function PublicGDPRInner() {
  const { lang } = usePublicLang();
  const content = gdprContent[lang] || gdprContent.en;

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

      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* Title block */}
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-10 border border-white/10 mb-10">
          <p className="text-[#c9a84c] text-xs uppercase tracking-widest font-semibold mb-4">GDPR</p>
          <h1 className="text-4xl font-bold text-white mb-3">{content.title}</h1>
          <p className="text-white/50 text-sm">{content.updated}</p>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {content.sections.map((section, i) => (
            <div key={i} className="bg-white rounded-2xl p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-3">{section.heading}</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm">{section.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function PublicGDPR() {
  return (
    <PublicLanguageProvider>
      <PublicGDPRInner />
    </PublicLanguageProvider>
  );
}