import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Logo from "@/components/Logo";
import { createPageUrl } from "@/utils";
import { PublicLanguageProvider, usePublicLang } from "@/components/PublicLanguageContext";
import PublicLangSwitcher from "@/components/PublicLangSwitcher";

const gdprContent = {
  sk: {
    title: "Ochrana osobných údajov (GDPR)",
    updated: "Platné od: 1. januára 2024",
    sections: [
      {
        heading: "1. Prevádzkovateľ",
        text: "Prevádzkovateľom vašich osobných údajov je spoločnosť Nehnuteľnosti v zahraničí, so sídlom na Slovensku. Kontakt: info@nehnutelnostivzahranici.sk | Tel: +421 951 094 706"
      },
      {
        heading: "2. Aké údaje spracúvame",
        text: "Spracúvame nasledujúce osobné údaje, ktoré nám dobrovoľne poskytujete:\n• Meno a priezvisko\n• E-mailová adresa\n• Telefónne číslo\n• Rozpočet a preferencie nehnuteľností\n• Správy a požiadavky odoslané cez kontaktný formulár"
      },
      {
        heading: "3. Účel spracúvania",
        text: "Vaše osobné údaje spracúvame za účelom:\n• Odpovede na vaše dopyty a zabezpečenia komunikácie\n• Zasielania relevantných ponúk nehnuteľností\n• Vedenia databázy záujemcov o nehnuteľnosti\n• Plnenia zákonných povinností"
      },
      {
        heading: "4. Právny základ",
        text: "Spracúvanie vašich osobných údajov je založené na:\n• Vašom súhlase (čl. 6 ods. 1 písm. a) GDPR)\n• Plnení zmluvy alebo predzmluvných vzťahov (čl. 6 ods. 1 písm. b) GDPR)\n• Oprávnenom záujme prevádzkovateľa (čl. 6 ods. 1 písm. f) GDPR)"
      },
      {
        heading: "5. Doba uchovávania",
        text: "Vaše osobné údaje uchovávame po dobu nevyhnutnú na splnenie účelu, na ktorý boli získané, najdlhšie však 3 roky od posledného kontaktu, pokiaľ zákon nevyžaduje dlhšiu dobu uchovávania."
      },
      {
        heading: "6. Vaše práva",
        text: "Máte právo:\n• Prístupu k vašim osobným údajom\n• Opravy nepresných údajov\n• Vymazania údajov (právo byť zabudnutý)\n• Obmedzenia spracúvania\n• Prenosnosti údajov\n• Odvolania súhlasu kedykoľvek\n• Podania sťažnosti na Úrad na ochranu osobných údajov SR"
      },
      {
        heading: "7. Príjemcovia údajov",
        text: "Vaše osobné údaje nepredávame tretím stranám. Údaje môžu byť zdieľané len s overenými partnermi (napr. developeri, realitné agentúry) v rozsahu nevyhnutnom pre splnenie vašej požiadavky, vždy s primeranou ochranou."
      },
      {
        heading: "8. Kontakt",
        text: "Pre akékoľvek otázky týkajúce sa ochrany vašich osobných údajov nás kontaktujte na:\nE-mail: info@nehnutelnostivzahranici.sk\nTelefón: +421 951 094 706"
      }
    ]
  },
  en: {
    title: "Privacy Policy (GDPR)",
    updated: "Effective from: 1 January 2024",
    sections: [
      {
        heading: "1. Controller",
        text: "The controller of your personal data is Nehnuteľnosti v zahraničí, based in Slovakia. Contact: info@nehnutelnostivzahranici.sk | Tel: +421 951 094 706"
      },
      {
        heading: "2. Data we process",
        text: "We process the following personal data that you voluntarily provide:\n• Full name\n• Email address\n• Phone number\n• Budget and property preferences\n• Messages and inquiries submitted via contact form"
      },
      {
        heading: "3. Purpose of processing",
        text: "We process your personal data for the purpose of:\n• Responding to your inquiries and ensuring communication\n• Sending relevant property offers\n• Maintaining a database of property interested parties\n• Fulfilling legal obligations"
      },
      {
        heading: "4. Legal basis",
        text: "Processing your personal data is based on:\n• Your consent (Art. 6(1)(a) GDPR)\n• Performance of a contract or pre-contractual relations (Art. 6(1)(b) GDPR)\n• Legitimate interests of the controller (Art. 6(1)(f) GDPR)"
      },
      {
        heading: "5. Retention period",
        text: "We retain your personal data for the period necessary to fulfil the purpose for which they were collected, but no longer than 3 years from the last contact, unless the law requires a longer retention period."
      },
      {
        heading: "6. Your rights",
        text: "You have the right to:\n• Access your personal data\n• Rectification of inaccurate data\n• Erasure of data (right to be forgotten)\n• Restriction of processing\n• Data portability\n• Withdraw consent at any time\n• Lodge a complaint with the Slovak Data Protection Authority"
      },
      {
        heading: "7. Recipients of data",
        text: "We do not sell your personal data to third parties. Data may only be shared with verified partners (e.g. developers, real estate agencies) to the extent necessary to fulfil your request, always with adequate protection."
      },
      {
        heading: "8. Contact",
        text: "For any questions regarding the protection of your personal data, please contact us at:\nEmail: info@nehnutelnostivzahranici.sk\nPhone: +421 951 094 706"
      }
    ]
  },
  de: {
    title: "Datenschutzrichtlinie (DSGVO)",
    updated: "Gültig ab: 1. Januar 2024",
    sections: [
      {
        heading: "1. Verantwortlicher",
        text: "Der Verantwortliche für Ihre personenbezogenen Daten ist Nehnuteľnosti v zahraničí mit Sitz in der Slowakei. Kontakt: info@nehnutelnostivzahranici.sk | Tel: +421 951 094 706"
      },
      {
        heading: "2. Welche Daten wir verarbeiten",
        text: "Wir verarbeiten folgende personenbezogene Daten, die Sie freiwillig angeben:\n• Vor- und Nachname\n• E-Mail-Adresse\n• Telefonnummer\n• Budget und Immobilienpräferenzen\n• Nachrichten und Anfragen über das Kontaktformular"
      },
      {
        heading: "3. Zweck der Verarbeitung",
        text: "Wir verarbeiten Ihre personenbezogenen Daten zu folgenden Zwecken:\n• Beantwortung Ihrer Anfragen und Sicherstellung der Kommunikation\n• Zusendung relevanter Immobilienangebote\n• Führung einer Datenbank von Interessenten\n• Erfüllung gesetzlicher Verpflichtungen"
      },
      {
        heading: "4. Rechtsgrundlage",
        text: "Die Verarbeitung Ihrer personenbezogenen Daten basiert auf:\n• Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO)\n• Vertragserfüllung oder vorvertraglichen Beziehungen (Art. 6 Abs. 1 lit. b DSGVO)\n• Berechtigten Interessen des Verantwortlichen (Art. 6 Abs. 1 lit. f DSGVO)"
      },
      {
        heading: "5. Speicherdauer",
        text: "Wir bewahren Ihre personenbezogenen Daten für den zur Erfüllung des Zwecks erforderlichen Zeitraum auf, jedoch maximal 3 Jahre ab dem letzten Kontakt, sofern das Gesetz keine längere Aufbewahrungsfrist vorschreibt."
      },
      {
        heading: "6. Ihre Rechte",
        text: "Sie haben das Recht auf:\n• Auskunft über Ihre personenbezogenen Daten\n• Berichtigung ungenauer Daten\n• Löschung der Daten (Recht auf Vergessenwerden)\n• Einschränkung der Verarbeitung\n• Datenübertragbarkeit\n• Widerruf der Einwilligung jederzeit\n• Beschwerde bei der slowakischen Datenschutzbehörde"
      },
      {
        heading: "7. Empfänger der Daten",
        text: "Wir verkaufen Ihre personenbezogenen Daten nicht an Dritte. Daten können nur mit verifizierten Partnern (z.B. Entwickler, Immobilienagenturen) im erforderlichen Umfang geteilt werden, stets mit angemessenem Schutz."
      },
      {
        heading: "8. Kontakt",
        text: "Für Fragen zum Schutz Ihrer personenbezogenen Daten kontaktieren Sie uns bitte unter:\nE-Mail: info@nehnutelnostivzahranici.sk\nTelefon: +421 951 094 706"
      }
    ]
  },
  fr: {
    title: "Politique de confidentialité (RGPD)",
    updated: "En vigueur à partir du : 1er janvier 2024",
    sections: [
      {
        heading: "1. Responsable du traitement",
        text: "Le responsable du traitement de vos données personnelles est Nehnuteľnosti v zahraničí, basé en Slovaquie. Contact : info@nehnutelnostivzahranici.sk | Tél : +421 951 094 706"
      },
      {
        heading: "2. Données que nous traitons",
        text: "Nous traitons les données personnelles suivantes que vous fournissez volontairement :\n• Nom et prénom\n• Adresse e-mail\n• Numéro de téléphone\n• Budget et préférences immobilières\n• Messages et demandes soumis via le formulaire de contact"
      },
      {
        heading: "3. Finalité du traitement",
        text: "Nous traitons vos données personnelles aux fins suivantes :\n• Répondre à vos demandes et assurer la communication\n• Envoyer des offres immobilières pertinentes\n• Maintenir une base de données des personnes intéressées\n• Remplir les obligations légales"
      },
      {
        heading: "4. Base juridique",
        text: "Le traitement de vos données personnelles est fondé sur :\n• Votre consentement (Art. 6(1)(a) RGPD)\n• L'exécution d'un contrat ou de relations précontractuelles (Art. 6(1)(b) RGPD)\n• Les intérêts légitimes du responsable du traitement (Art. 6(1)(f) RGPD)"
      },
      {
        heading: "5. Durée de conservation",
        text: "Nous conservons vos données personnelles pendant la durée nécessaire à l'accomplissement de la finalité pour laquelle elles ont été collectées, mais au maximum 3 ans à compter du dernier contact, sauf si la loi exige une durée de conservation plus longue."
      },
      {
        heading: "6. Vos droits",
        text: "Vous avez le droit :\n• D'accès à vos données personnelles\n• De rectification des données inexactes\n• D'effacement des données (droit à l'oubli)\n• De limitation du traitement\n• De portabilité des données\n• De retirer votre consentement à tout moment\n• De déposer une plainte auprès de l'autorité slovaque de protection des données"
      },
      {
        heading: "7. Destinataires des données",
        text: "Nous ne vendons pas vos données personnelles à des tiers. Les données ne peuvent être partagées qu'avec des partenaires vérifiés (ex. promoteurs, agences immobilières) dans la mesure nécessaire à l'exécution de votre demande, toujours avec une protection adéquate."
      },
      {
        heading: "8. Contact",
        text: "Pour toute question concernant la protection de vos données personnelles, veuillez nous contacter à :\nE-mail : info@nehnutelnostivzahranici.sk\nTéléphone : +421 951 094 706"
      }
    ]
  },
  it: {
    title: "Informativa sulla privacy (GDPR)",
    updated: "In vigore dal: 1° gennaio 2024",
    sections: [
      {
        heading: "1. Titolare del trattamento",
        text: "Il titolare del trattamento dei tuoi dati personali è Nehnuteľnosti v zahraničí, con sede in Slovacchia. Contatto: info@nehnutelnostivzahranici.sk | Tel: +421 951 094 706"
      },
      {
        heading: "2. Dati che trattiamo",
        text: "Trattiamo i seguenti dati personali che fornisci volontariamente:\n• Nome e cognome\n• Indirizzo email\n• Numero di telefono\n• Budget e preferenze immobiliari\n• Messaggi e richieste inviati tramite il modulo di contatto"
      },
      {
        heading: "3. Finalità del trattamento",
        text: "Trattiamo i tuoi dati personali per le seguenti finalità:\n• Rispondere alle tue richieste e garantire la comunicazione\n• Inviare offerte immobiliari pertinenti\n• Mantenere un database di potenziali clienti\n• Adempiere agli obblighi di legge"
      },
      {
        heading: "4. Base giuridica",
        text: "Il trattamento dei tuoi dati personali si basa su:\n• Il tuo consenso (Art. 6(1)(a) GDPR)\n• Esecuzione di un contratto o relazioni precontrattuali (Art. 6(1)(b) GDPR)\n• Interessi legittimi del titolare (Art. 6(1)(f) GDPR)"
      },
      {
        heading: "5. Periodo di conservazione",
        text: "Conserviamo i tuoi dati personali per il periodo necessario a raggiungere lo scopo per cui sono stati raccolti, ma non più di 3 anni dall'ultimo contatto, salvo che la legge richieda un periodo di conservazione più lungo."
      },
      {
        heading: "6. I tuoi diritti",
        text: "Hai il diritto di:\n• Accesso ai tuoi dati personali\n• Rettifica di dati inesatti\n• Cancellazione dei dati (diritto all'oblio)\n• Limitazione del trattamento\n• Portabilità dei dati\n• Revocare il consenso in qualsiasi momento\n• Presentare un reclamo all'autorità slovacca per la protezione dei dati"
      },
      {
        heading: "7. Destinatari dei dati",
        text: "Non vendiamo i tuoi dati personali a terzi. I dati possono essere condivisi solo con partner verificati (es. sviluppatori, agenzie immobiliari) nella misura necessaria ad adempiere alla tua richiesta, sempre con adeguata protezione."
      },
      {
        heading: "8. Contatto",
        text: "Per qualsiasi domanda riguardante la protezione dei tuoi dati personali, contattaci a:\nEmail: info@nehnutelnostivzahranici.sk\nTelefono: +421 951 094 706"
      }
    ]
  },
  ru: {
    title: "Политика конфиденциальности (GDPR)",
    updated: "Действует с: 1 января 2024 года",
    sections: [
      {
        heading: "1. Оператор",
        text: "Оператором ваших персональных данных является компания Nehnuteľnosti v zahraničí, зарегистрированная в Словакии. Контакт: info@nehnutelnostivzahranici.sk | Тел: +421 951 094 706"
      },
      {
        heading: "2. Какие данные мы обрабатываем",
        text: "Мы обрабатываем следующие персональные данные, которые вы добровольно предоставляете:\n• Имя и фамилия\n• Адрес электронной почты\n• Номер телефона\n• Бюджет и предпочтения по недвижимости\n• Сообщения и запросы, отправленные через контактную форму"
      },
      {
        heading: "3. Цель обработки",
        text: "Мы обрабатываем ваши персональные данные в следующих целях:\n• Ответ на ваши запросы и обеспечение коммуникации\n• Отправка актуальных предложений по недвижимости\n• Ведение базы данных заинтересованных лиц\n• Выполнение законодательных обязательств"
      },
      {
        heading: "4. Правовая основа",
        text: "Обработка ваших персональных данных основана на:\n• Вашем согласии (ст. 6(1)(a) GDPR)\n• Исполнении договора или преддоговорных отношений (ст. 6(1)(b) GDPR)\n• Законных интересах оператора (ст. 6(1)(f) GDPR)"
      },
      {
        heading: "5. Срок хранения",
        text: "Мы храним ваши персональные данные в течение срока, необходимого для достижения цели, с которой они были собраны, но не более 3 лет с момента последнего контакта, если законодательство не требует более длительного срока хранения."
      },
      {
        heading: "6. Ваши права",
        text: "Вы имеете право на:\n• Доступ к вашим персональным данным\n• Исправление неточных данных\n• Удаление данных (право на забвение)\n• Ограничение обработки\n• Переносимость данных\n• Отзыв согласия в любое время\n• Подачу жалобы в словацкий орган по защите данных"
      },
      {
        heading: "7. Получатели данных",
        text: "Мы не продаём ваши персональные данные третьим лицам. Данные могут передаваться только проверенным партнёрам (например, застройщикам, агентствам недвижимости) в объёме, необходимом для выполнения вашего запроса, всегда с надлежащей защитой."
      },
      {
        heading: "8. Контакт",
        text: "По любым вопросам, связанным с защитой ваших персональных данных, свяжитесь с нами:\nЭлектронная почта: info@nehnutelnostivzahranici.sk\nТелефон: +421 951 094 706"
      }
    ]
  },
  pl: {
    title: "Polityka prywatności (RODO)",
    updated: "Obowiązuje od: 1 stycznia 2024",
    sections: [
      {
        heading: "1. Administrator",
        text: "Administratorem Twoich danych osobowych jest Nehnuteľnosti v zahraničí z siedzibą na Słowacji. Kontakt: info@nehnutelnostivzahranici.sk | Tel: +421 951 094 706"
      },
      {
        heading: "2. Jakie dane przetwarzamy",
        text: "Przetwarzamy następujące dane osobowe, które dobrowolnie podajesz:\n• Imię i nazwisko\n• Adres e-mail\n• Numer telefonu\n• Budżet i preferencje dotyczące nieruchomości\n• Wiadomości i zapytania przesłane przez formularz kontaktowy"
      },
      {
        heading: "3. Cel przetwarzania",
        text: "Przetwarzamy Twoje dane osobowe w następujących celach:\n• Odpowiadanie na Twoje zapytania i zapewnienie komunikacji\n• Wysyłanie odpowiednich ofert nieruchomości\n• Prowadzenie bazy danych zainteresowanych\n• Wypełnianie obowiązków prawnych"
      },
      {
        heading: "4. Podstawa prawna",
        text: "Przetwarzanie Twoich danych osobowych opiera się na:\n• Twojej zgodzie (art. 6(1)(a) RODO)\n• Wykonaniu umowy lub relacji przedumownych (art. 6(1)(b) RODO)\n• Uzasadnionych interesach administratora (art. 6(1)(f) RODO)"
      },
      {
        heading: "5. Okres przechowywania",
        text: "Przechowujemy Twoje dane osobowe przez okres niezbędny do realizacji celu, w jakim zostały zebrane, jednak nie dłużej niż 3 lata od ostatniego kontaktu, chyba że prawo wymaga dłuższego okresu przechowywania."
      },
      {
        heading: "6. Twoje prawa",
        text: "Masz prawo do:\n• Dostępu do swoich danych osobowych\n• Sprostowania niedokładnych danych\n• Usunięcia danych (prawo do bycia zapomnianym)\n• Ograniczenia przetwarzania\n• Przenoszenia danych\n• Cofnięcia zgody w dowolnym momencie\n• Złożenia skargi do słowackiego organu ochrony danych"
      },
      {
        heading: "7. Odbiorcy danych",
        text: "Nie sprzedajemy Twoich danych osobowych podmiotom trzecim. Dane mogą być udostępniane wyłącznie zweryfikowanym partnerom (np. deweloperom, agencjom nieruchomości) w zakresie niezbędnym do realizacji Twojego wniosku, zawsze z odpowiednią ochroną."
      },
      {
        heading: "8. Kontakt",
        text: "W przypadku jakichkolwiek pytań dotyczących ochrony Twoich danych osobowych, prosimy o kontakt:\nE-mail: info@nehnutelnostivzahranici.sk\nTelefon: +421 951 094 706"
      }
    ]
  },
  hu: {
    title: "Adatvédelmi irányelvek (GDPR)",
    updated: "Hatályos: 2024. január 1-től",
    sections: [
      {
        heading: "1. Adatkezelő",
        text: "Személyes adatainak kezelője a Nehnuteľnosti v zahraničí, amelynek székhelye Szlovákiában van. Kapcsolat: info@nehnutelnostivzahranici.sk | Tel: +421 951 094 706"
      },
      {
        heading: "2. Milyen adatokat kezelünk",
        text: "Az alábbi személyes adatokat kezeljük, amelyeket önként megad:\n• Teljes neve\n• E-mail cím\n• Telefonszám\n• Költségvetés és ingatlanpreferenciák\n• A kapcsolatfelvételi űrlapon keresztül küldött üzenetek és kérdések"
      },
      {
        heading: "3. Az adatkezelés célja",
        text: "Személyes adatait az alábbi célokból kezeljük:\n• Megkereséseire való reagálás és a kommunikáció biztosítása\n• Releváns ingatlankínálatok küldése\n• Érdeklődők adatbázisának vezetése\n• Jogi kötelezettségek teljesítése"
      },
      {
        heading: "4. Jogalap",
        text: "Személyes adatainak kezelése az alábbiakon alapul:\n• Hozzájárulása (GDPR 6. cikk (1) bekezdés a) pont)\n• Szerződés vagy szerződéskötés előtti kapcsolat teljesítése (GDPR 6. cikk (1) bekezdés b) pont)\n• Az adatkezelő jogos érdekei (GDPR 6. cikk (1) bekezdés f) pont)"
      },
      {
        heading: "5. Megőrzési idő",
        text: "Személyes adatait addig őrizzük meg, ameddig az összegyűjtés céljának megvalósításához szükséges, de legfeljebb 3 évig az utolsó kapcsolatfelvételtől számítva, kivéve, ha a jogszabály hosszabb megőrzési időt ír elő."
      },
      {
        heading: "6. Az Ön jogai",
        text: "Önnek joga van:\n• Hozzáférni személyes adataihoz\n• Pontatlan adatok helyesbítéséhez\n• Az adatok törléséhez (elfeledtetéshez való jog)\n• Az adatkezelés korlátozásához\n• Adathordozhatósághoz\n• Hozzájárulását bármikor visszavonni\n• Panaszt tenni a szlovák adatvédelmi hatóságnál"
      },
      {
        heading: "7. Az adatok címzettjei",
        text: "Személyes adatait nem adjuk el harmadik feleknek. Az adatok kizárólag ellenőrzött partnerekkel (pl. fejlesztők, ingatlanügynökségek) oszthatók meg, a kérése teljesítéséhez szükséges mértékben, mindig megfelelő védelemmel."
      },
      {
        heading: "8. Kapcsolat",
        text: "Személyes adatai védelmével kapcsolatos kérdéseivel forduljon hozzánk:\nE-mail: info@nehnutelnostivzahranici.sk\nTelefon: +421 951 094 706"
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