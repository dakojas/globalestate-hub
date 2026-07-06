import React, { useState, useEffect, useCallback } from "react";
import { usePublicLang } from "@/components/PublicLanguageContext";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";

const TESTIMONIALS = {
  sk: {
    sectionLabel: "REFERENCIE",
    sectionTitle: "Čo hovoria naši klienti",
    sectionSubtitle: "Skutočné príbehy skutočných investícií",
    items: [
      { title: "Veľká spokojnosť", text: "Veľká spokojnosť s vybavovaním nie jednoduchej kúpy nehnuteľnosti v zahraničí. Všetky moje otázky boli zodpovedané a aj komplikované overovanie na jednotlivých úradoch vybavila realitná spoločnosť za mňa. Vďaka tomu prebehla kúpa bez zbytočného stresu a celý proces bol profesionálny od začiatku až do konca.", name: "Viktória", role: "Farmaceutka" },
      { title: "Profesionálny prístup", text: "Chcel by som vyzdvihnúť profesionálny prístup a špičkový servis pri kúpe nehnuteľnosti v Egypte. Všetko mi bolo podrobne a zrozumiteľne vysvetlené. Oceňujem aj rýchlosť komunikácie a podporu pri riešení akýchkoľvek otázok. Ako zákazník som nadmieru spokojný a služby Davida a jeho tímu určite využijem znova.", name: "Filip", role: "Podnikateľ" },
      { title: "Sme spokojní", text: "Chceli by sme veľmi pekne poďakovať za skvelú prácu, ktorú ste odviedli pri kúpe bytu v zahraničí. Váš profesionálny prístup nám pomohol splniť si sen o kúpe nie jednej, ale rovno dvoch nehnuteľností. Určite sa na vás obrátime aj pri ďalších investíciách.", name: "Renáta", role: "Personalistka" },
      { title: "Najlepšia kúpa", text: "Kúpa nehnuteľnosti v Dubaji bola jednou z najlepších investícií, aké som kedy urobil. Oceňujem profesionálny prístup, detailné poradenstvo a transparentnú komunikáciu počas celého procesu. Moje očakávania boli nielen splnené, ale dokonca prekonané.", name: "Igor", role: "Projektový manažér" },
      { title: "Bez starostí", text: "Od prvého telefonátu až po odovzdanie apartmánu prebehlo všetko bez problémov. Veľmi oceňujem profesionálny prístup, transparentnú komunikáciu a právne preverenie celej kúpy. Určite odporúčam každému, kto uvažuje o investícii v zahraničí.", name: "Martin", role: "Podnikateľ" },
      { title: "Výborná komunikácia", text: "Najviac ma prekvapila rýchlosť odpovedí a ochota pomôcť s každou otázkou. Všetko bolo vysvetlené zrozumiteľne a počas celého procesu som sa cítila bezpečne.", name: "Lucia", role: "Účtovníčka" },
      { title: "Profesionálny tím", text: "Výborný servis od začiatku až do konca. Oceňujem, že sa postarali o administratívu, komunikáciu s developerom aj právne náležitosti. Ušetrili mi veľa času.", name: "Peter", role: "IT konzultant" },
      { title: "Investícia, ktorá dáva zmysel", text: "Hľadal som apartmán pri mori ako dlhodobú investíciu. Dostal som viacero možností s vysvetlením výhod aj rizík. Nakoniec som vybral projekt, s ktorým som maximálne spokojný.", name: "Tomáš", role: "Finančný poradca" },
      { title: "Skvelé poradenstvo", text: "Nikdy som predtým nekupovala nehnuteľnosť v zahraničí, preto som mala množstvo otázok. Na každú som dostala jasnú odpoveď a celý proces prebehol bez stresu.", name: "Monika", role: "Lekárka" },
      { title: "Komplexné služby", text: "Veľkou výhodou bolo, že všetko vybavili na jednom mieste – od výberu apartmánu až po právny servis. Nemusel som riešiť žiadne komplikácie.", name: "Juraj", role: "Stavebný inžinier" },
      { title: "Odporúčam každému", text: "Profesionálny prístup, výborná komunikácia a ľudský prístup. Po kúpe sa o mňa naďalej zaujímali a pomohli mi aj so zariadením apartmánu.", name: "Andrea", role: "Manažérka" },
      { title: "Spoľahlivý partner", text: "Veľmi oceňujem transparentnosť počas celého procesu. Nikto ma netlačil do rozhodnutia a všetko bolo podložené reálnymi informáciami.", name: "Marek", role: "Advokát" },
      { title: "Výborná skúsenosť", text: "Kúpa prebehla presne podľa dohody. Komunikácia bola rýchla, profesionálna a vždy som vedel, čo bude nasledovať. Takto si predstavujem kvalitné služby.", name: "Roman", role: "Architekt" },
      { title: "Maximálna spokojnosť", text: "Odporúčam každému, kto chce bezpečne investovať do nehnuteľnosti v zahraničí. Oceňujem hlavne skúsenosti tímu, ochotu pomôcť a podporu aj po dokončení kúpy.", name: "Katarína", role: "Majiteľka e-shopu" },
    ]
  },
  en: {
    sectionLabel: "TESTIMONIALS",
    sectionTitle: "What our clients say",
    sectionSubtitle: "Real stories of real investments",
    items: [
      { title: "Great satisfaction", text: "Great satisfaction with the handling of a complex property purchase abroad. All my questions were answered and even the complicated verification at various offices was handled by the real estate company for me. Thanks to this, the purchase went through without unnecessary stress and the whole process was professional from start to finish.", name: "Viktória", role: "Pharmacist" },
      { title: "Professional approach", text: "I would like to highlight the professional approach and top-notch service when buying a property in Egypt. Everything was explained to me in detail and clearly. I also appreciate the speed of communication and support with any questions. As a customer, I am extremely satisfied and will definitely use the services of David and his team again.", name: "Filip", role: "Entrepreneur" },
      { title: "We are satisfied", text: "We would like to thank you very much for the great work you did when buying an apartment abroad. Your professional approach helped us fulfill our dream of buying not one, but two properties. We will definitely come back to you for future investments.", name: "Renáta", role: "HR Manager" },
      { title: "Best purchase", text: "Buying a property in Dubai was one of the best investments I have ever made. I appreciate the professional approach, detailed advice, and transparent communication throughout the entire process. My expectations were not only met but even exceeded.", name: "Igor", role: "Project Manager" },
      { title: "Worry-free", text: "From the first phone call to the handover of the apartment, everything went smoothly. I really appreciate the professional approach, transparent communication, and legal verification of the entire purchase. I definitely recommend it to anyone considering investing abroad.", name: "Martin", role: "Entrepreneur" },
      { title: "Excellent communication", text: "What surprised me the most was the speed of responses and willingness to help with every question. Everything was explained clearly and I felt safe throughout the entire process.", name: "Lucia", role: "Accountant" },
      { title: "Professional team", text: "Excellent service from start to finish. I appreciate that they took care of the paperwork, communication with the developer, and legal requirements. They saved me a lot of time.", name: "Peter", role: "IT Consultant" },
      { title: "Investment that makes sense", text: "I was looking for an apartment by the sea as a long-term investment. I received several options with an explanation of the advantages and risks. In the end, I chose a project that I am maximally satisfied with.", name: "Tomáš", role: "Financial Advisor" },
      { title: "Great advice", text: "I had never bought a property abroad before, so I had many questions. I got a clear answer to each one and the whole process went without stress.", name: "Monika", role: "Doctor" },
      { title: "Comprehensive services", text: "A big advantage was that everything was handled in one place – from selecting the apartment to legal services. I didn't have to deal with any complications.", name: "Juraj", role: "Civil Engineer" },
      { title: "I recommend to everyone", text: "Professional approach, excellent communication, and a human touch. After the purchase, they continued to care about me and helped me with furnishing the apartment.", name: "Andrea", role: "Manager" },
      { title: "Reliable partner", text: "I really appreciate the transparency throughout the entire process. No one pressured me into a decision and everything was backed by real information.", name: "Marek", role: "Lawyer" },
      { title: "Great experience", text: "The purchase went exactly as agreed. Communication was fast, professional, and I always knew what would happen next. This is what I call quality service.", name: "Roman", role: "Architect" },
      { title: "Maximum satisfaction", text: "I recommend it to anyone who wants to safely invest in property abroad. I especially appreciate the team's experience, willingness to help, and support even after the purchase was completed.", name: "Katarína", role: "E-shop Owner" },
    ]
  },
  de: {
    sectionLabel: "REFERENZEN",
    sectionTitle: "Was unsere Kunden sagen",
    sectionSubtitle: "Echte Geschichten echter Investitionen",
    items: [
      { title: "Große Zufriedenheit", text: "Große Zufriedenheit mit der Abwicklung eines nicht einfachen Immobilienkaufs im Ausland. Alle meine Fragen wurden beantwortet und auch die komplizierte Prüfung bei den einzelnen Ämtern wurde von der Immobilienfirma für mich erledigt. Dank dessen verlief der Kauf ohne unnötigen Stress und der gesamte Prozess war von Anfang bis Ende professionell.", name: "Viktória", role: "Apothekerin" },
      { title: "Professioneller Ansatz", text: "Ich möchte den professionellen Ansatz und den erstklassigen Service beim Kauf einer Immobilie in Ägypten hervorheben. Mir wurde alles detailliert und verständlich erklärt. Ich schätze auch die Kommunikationsgeschwindigkeit und die Unterstützung bei Fragen. Als Kunde bin ich überaus zufrieden und werde die Dienste von David und seinem Team definitiv wieder nutzen.", name: "Filip", role: "Unternehmer" },
      { title: "Wir sind zufrieden", text: "Wir möchten uns sehr für die großartige Arbeit bedanken, die Sie beim Kauf einer Wohnung im Ausland geleistet haben. Ihr professioneller Ansatz hat uns geholfen, den Traum vom Kauf nicht nur einer, sondern gleich zweier Immobilien zu erfüllen. Wir werden uns bei weiteren Investitionen definitiv wieder an Sie wenden.", name: "Renáta", role: "Personalmanagerin" },
      { title: "Bester Kauf", text: "Der Kauf einer Immobilie in Dubai war eine der besten Investitionen, die ich je getätigt habe. Ich schätze den professionellen Ansatz, die detaillierte Beratung und die transparente Kommunikation während des gesamten Prozesses. Meine Erwartungen wurden nicht nur erfüllt, sondern sogar übertroffen.", name: "Igor", role: "Projektmanager" },
      { title: "Sorgenfrei", text: "Vom ersten Telefonat bis zur Übergabe der Wohnung verlief alles reibungslos. Ich schätze den professionellen Ansatz, die transparente Kommunikation und die rechtliche Prüfung des gesamten Kaufs sehr. Ich empfehle es jedem, der eine Investition im Ausland in Betracht zieht.", name: "Martin", role: "Unternehmer" },
      { title: "Ausgezeichnete Kommunikation", text: "Am meisten hat mich die Geschwindigkeit der Antworten und die Bereitschaft, bei jeder Frage zu helfen, überrascht. Alles wurde verständlich erklärt und ich fühlte mich während des gesamten Prozesses sicher.", name: "Lucia", role: "Buchhalterin" },
      { title: "Professionelles Team", text: "Hervorragender Service von Anfang bis Ende. Ich schätze, dass sie sich um die Verwaltung, die Kommunikation mit dem Entwickler und die rechtlichen Anforderungen gekümmert haben. Sie haben mir viel Zeit gespart.", name: "Peter", role: "IT-Berater" },
      { title: "Sinnvolle Investition", text: "Ich suchte eine Wohnung am Meer als langfristige Investition. Ich erhielt mehrere Optionen mit einer Erklärung der Vorteile und Risiken. Am Ende wählte ich ein Projekt, mit dem ich maximal zufrieden bin.", name: "Tomáš", role: "Finanzberater" },
      { title: "Großartige Beratung", text: "Ich hatte zuvor noch nie eine Immobilie im Ausland gekauft, daher hatte ich viele Fragen. Auf jede Frage erhielt ich eine klare Antwort und der gesamte Prozess verlief stressfrei.", name: "Monika", role: "Ärztin" },
      { title: "Umfassende Dienstleistungen", text: "Ein großer Vorteil war, dass alles an einem Ort erledigt wurde – von der Auswahl der Wohnung bis zum Rechtservice. Ich musste mich um keine Komplikationen kümmern.", name: "Juraj", role: "Bauingenieur" },
      { title: "Ich empfehle jedem", text: "Professioneller Ansatz, ausgezeichnete Kommunikation und ein menschlicher Ansatz. Nach dem Kauf kümmerten sie sich weiterhin um mich und halfen mir bei der Einrichtung der Wohnung.", name: "Andrea", role: "Managerin" },
      { title: "Zuverlässiger Partner", text: "Ich schätze die Transparenz während des gesamten Prozesses sehr. Niemand hat mich zu einer Entscheidung gedrängt und alles war durch reale Informationen belegt.", name: "Marek", role: "Anwalt" },
      { title: "Großartige Erfahrung", text: "Der Kauf verlief genau nach Vereinbarung. Die Kommunikation war schnell, professionell und ich wusste immer, was als Nächstes kommt. So stelle ich mir qualitativ hochwertigen Service vor.", name: "Roman", role: "Architekt" },
      { title: "Maximale Zufriedenheit", text: "Ich empfehle es jedem, der sicher in Immobilien im Ausland investieren möchte. Ich schätze besonders die Erfahrung des Teams, die Hilfsbereitschaft und die Unterstützung auch nach Abschluss des Kaufs.", name: "Katarína", role: "E-Shop-Inhaberin" },
    ]
  },
  fr: {
    sectionLabel: "TÉMOIGNAGES",
    sectionTitle: "Ce que disent nos clients",
    sectionSubtitle: "De vraies histoires de vrais investissements",
    items: [
      { title: "Grande satisfaction", text: "Grande satisfaction avec la gestion d'un achat immobilier à l'étranger non simple. Toutes mes questions ont trouvé réponse et même les vérifications complexes auprès des différents bureaux ont été prises en charge par l'agence immobilière pour moi. Grâce à cela, l'achat s'est fait sans stress inutile et tout le processus a été professionnel du début à la fin.", name: "Viktória", role: "Pharmacienne" },
      { title: "Approche professionnelle", text: "Je tiens à souligner l'approche professionnelle et le service de premier ordre lors de l'achat d'un bien immobilier en Égypte. Tout m'a été expliqué en détail et de manière compréhensible. J'apprécie également la rapidité de communication et le soutien pour toute question. En tant que client, je suis extrêmement satisfait et utiliserai à nouveau les services de David et de son équipe.", name: "Filip", role: "Entrepreneur" },
      { title: "Nous sommes satisfaits", text: "Nous tenons à vous remercier très sincèrement pour l'excellent travail que vous avez accompli lors de l'achat d'un appartement à l'étranger. Votre approche professionnelle nous a aidés à réaliser notre rêve d'acheter non pas une, mais deux propriétés. Nous ferons définitivement appel à vous pour nos futurs investissements.", name: "Renáta", role: "Responsable RH" },
      { title: "Meilleur achat", text: "L'achat d'un bien immobilier à Dubaï a été l'un des meilleurs investissements que j'aie jamais réalisés. J'apprécie l'approche professionnelle, les conseils détaillés et la communication transparente tout au long du processus. Mes attentes ont non seulement été atteintes, mais même dépassées.", name: "Igor", role: "Chef de projet" },
      { title: "Sans souci", text: "Du premier appel jusqu'à la remise de l'appartement, tout s'est déroulé sans problème. J'apprécie vraiment l'approche professionnelle, la communication transparente et la vérification juridique de tout l'achat. Je le recommande définitivement à toute personne envisageant d'investir à l'étranger.", name: "Martin", role: "Entrepreneur" },
      { title: "Excellente communication", text: "Ce qui m'a le plus surpris, c'est la rapidité des réponses et la volonté d'aider pour chaque question. Tout a été expliqué clairement et je me suis sentie en sécurité tout au long du processus.", name: "Lucia", role: "Comptable" },
      { title: "Équipe professionnelle", text: "Excellent service du début à la fin. J'apprécie qu'ils se soient occupés de l'administration, de la communication avec le promoteur et des formalités juridiques. Ils m'ont fait gagner beaucoup de temps.", name: "Peter", role: "Consultant IT" },
      { title: "Un investissement qui a du sens", text: "Je cherchais un appartement au bord de la mer comme investissement à long terme. J'ai reçu plusieurs options avec une explication des avantages et des risques. Finalement, j'ai choisi un projet dont je suis totalement satisfait.", name: "Tomáš", role: "Conseiller financier" },
      { title: "Excellent conseil", text: "Je n'avais jamais acheté de bien immobilier à l'étranger auparavant, j'avais donc beaucoup de questions. J'ai reçu une réponse claire à chacune et tout le processus s'est déroulé sans stress.", name: "Monika", role: "Médecin" },
      { title: "Services complets", text: "Un grand avantage a été que tout a été géré au même endroit – de la sélection de l'appartement au service juridique. Je n'ai eu à gérer aucune complication.", name: "Juraj", role: "Ingénieur civil" },
      { title: "Je recommande à tous", text: "Approche professionnelle, excellente communication et côté humain. Après l'achat, ils ont continué à se soucier de moi et m'ont aidé à meubler l'appartement.", name: "Andrea", role: "Manager" },
      { title: "Partenaire fiable", text: "J'apprécie vraiment la transparence tout au long du processus. Personne ne m'a poussé à prendre une décision et tout était étayé par des informations réelles.", name: "Marek", role: "Avocat" },
      { title: "Excellente expérience", text: "L'achat s'est déroulé exactement comme convenu. La communication a été rapide, professionnelle et je savais toujours ce qui allait suivre. C'est ce que j'appelle un service de qualité.", name: "Roman", role: "Architecte" },
      { title: "Satisfaction maximale", text: "Je le recommande à tous ceux qui veulent investir en toute sécurité dans l'immobilier à l'étranger. J'apprécie particulièrement l'expérience de l'équipe, la volonté d'aider et le soutien même après l'achat.", name: "Katarína", role: "Propriétaire de e-shop" },
    ]
  },
  it: {
    sectionLabel: "TESTIMONIANZE",
    sectionTitle: "Cosa dicono i nostri clienti",
    sectionSubtitle: "Storie vere di investimenti veri",
    items: [
      { title: "Grande soddisfazione", text: "Grande soddisfazione per la gestione di un acquisto immobiliare all'estero non semplice. Tutte le mie domande hanno avuto risposta e anche le complicate verifiche presso i vari uffici sono state gestite dall'agenzia immobiliare per me. Grazie a questo, l'acquisto è avvenuto senza stress inutile e l'intero processo è stato professionale dall'inizio alla fine.", name: "Viktória", role: "Farmacista" },
      { title: "Approccio professionale", text: "Vorrei sottolineare l'approccio professionale e il servizio di altissima qualità nell'acquisto di una proprietà in Egitto. Mi è stato spiegato tutto in modo dettagliato e comprensibile. Apprezzo anche la velocità di comunicazione e il supporto per qualsiasi domanda. Come cliente sono estremamente soddisfatto e utilizzerò sicuramente di nuovo i servizi di David e del suo team.", name: "Filip", role: "Imprenditore" },
      { title: "Siamo soddisfatti", text: "Vorremmo ringraziarvi molto per l'ottimo lavoro che avete svolto nell'acquisto di un appartamento all'estero. Il vostro approccio professionale ci ha aiutato a realizzare il sogno di acquistare non una, ma ben due proprietà. Ci rivolgeremo sicuramente a voi anche per futuri investimenti.", name: "Renáta", role: "Responsabile Risorse Umane" },
      { title: "Miglior acquisto", text: "L'acquisto di una proprietà a Dubai è stato uno dei migliori investimenti che io abbia mai fatto. Apprezzo l'approccio professionale, i consigli dettagliati e la comunicazione trasparente durante tutto il processo. Le mie aspettative non solo sono state soddisfatte, ma addirittura superate.", name: "Igor", role: "Project Manager" },
      { title: "Senza pensieri", text: "Dalla prima telefonata fino alla consegna dell'appartamento è andato tutto liscio. Apprezzo molto l'approccio professionale, la comunicazione trasparente e la verifica legale dell'intero acquisto. Lo consiglio decisamente a chiunque stia pensando di investire all'estero.", name: "Martin", role: "Imprenditore" },
      { title: "Eccellente comunicazione", text: "Ciò che mi ha sorpreso di più è stata la velocità delle risposte e la disponibilità ad aiutare per ogni domanda. Tutto è stato spiegato in modo chiaro e mi sono sentita al sicuro durante tutto il processo.", name: "Lucia", role: "Contabile" },
      { title: "Team professionale", text: "Servizio eccellente dall'inizio alla fine. Apprezzo che si siano occupati dell'amministrazione, della comunicazione con lo sviluppatore e degli adempimenti legali. Mi hanno fatto risparmiare molto tempo.", name: "Peter", role: "Consulente IT" },
      { title: "Investimento che ha senso", text: "Cercavo un appartamento al mare come investimento a lungo termine. Ho ricevuto diverse opzioni con la spiegazione dei vantaggi e dei rischi. Alla fine ho scelto un progetto con cui sono massimamente soddisfatto.", name: "Tomáš", role: "Consulente finanziario" },
      { title: "Ottimi consigli", text: "Non avevo mai comprato una proprietà all'estero prima, quindi avevo molte domande. Ho ricevuto una risposta chiara a ciascuna e l'intero processo si è svolto senza stress.", name: "Monika", role: "Medico" },
      { title: "Servizi completi", text: "Un grande vantaggio è stato che tutto è stato gestito in un unico posto – dalla selezione dell'appartamento al servizio legale. Non ho dovuto gestire alcuna complicazione.", name: "Juraj", role: "Ingegnere civile" },
      { title: "Lo consiglio a tutti", text: "Approccio professionale, eccellente comunicazione e tocco umano. Dopo l'acquisto hanno continuato a interessarsi a me e mi hanno aiutato con l'arredamento dell'appartamento.", name: "Andrea", role: "Manager" },
      { title: "Partner affidabile", text: "Apprezzo molto la trasparenza durante tutto il processo. Nessuno mi ha pressato nella decisione e tutto era supportato da informazioni reali.", name: "Marek", role: "Avvocato" },
      { title: "Ottima esperienza", text: "L'acquisto è avvenuto esattamente come concordato. La comunicazione è stata rapida, professionale e sapevo sempre cosa sarebbe successo dopo. Questo è ciò che chiamo un servizio di qualità.", name: "Roman", role: "Architetto" },
      { title: "Soddisfazione massima", text: "Lo consiglio a chiunque voglia investire in modo sicuro in immobili all'estero. Apprezzo soprattutto l'esperienza del team, la disponibilità ad aiutare e il supporto anche dopo l'acquisto.", name: "Katarína", role: "Proprietaria di e-shop" },
    ]
  },
  ru: {
    sectionLabel: "ОТЗЫВЫ",
    sectionTitle: "Что говорят наши клиенты",
    sectionSubtitle: "Реальные истории реальных инвестиций",
    items: [
      { title: "Большое удовлетворение", text: "Большое удовлетворение от оформления непростой покупки недвижимости за границей. Все мои вопросы были отвечены, и даже сложные проверки в различных инстанциях были оформлены риелторской компанией за меня. Благодаря этому покупка прошла без лишнего стресса, и весь процесс был профессиональным от начала до конца.", name: "Виктория", role: "Фармацевт" },
      { title: "Профессиональный подход", text: "Хочу подчеркнуть профессиональный подход и первоклассный сервис при покупке недвижимости в Египте. Всё было подробно и понятно объяснено. Также ценю скорость общения и поддержку по любым вопросам. Как клиент я крайне доволен и обязательно воспользуюсь услугами Давида и его команды снова.", name: "Филип", role: "Предприниматель" },
      { title: "Мы довольны", text: "Хотим очень поблагодарить за отличную работу, которую вы проделали при покупке квартиры за границей. Ваш профессиональный подход помог нам осуществить мечту о покупке не одной, а сразу двух недвижимостей. Обязательно обратимся к вам и при дальнейших инвестициях.", name: "Рената", role: "HR-менеджер" },
      { title: "Лучшая покупка", text: "Покупка недвижимости в Дубае была одной из лучших инвестиций, которые я когда-либо делал. Ценю профессиональный подход, детальные консультации и прозрачное общение на протяжении всего процесса. Мои ожидания не только были оправданы, но и превзойдены.", name: "Игорь", role: "Проектный менеджер" },
      { title: "Без забот", text: "От первого телефонного звонка до передачи квартиры всё прошло без проблем. Очень ценю профессиональный подход, прозрачное общение и юридическую проверку всей покупки. Определённо рекомендую всем, кто рассматривает инвестиции за границей.", name: "Мартин", role: "Предприниматель" },
      { title: "Отличное общение", text: "Больше всего меня удивила скорость ответов и готовность помочь с любым вопросом. Всё было объяснено понятно, и во время всего процесса я чувствовала себя в безопасности.", name: "Люсия", role: "Бухгалтер" },
      { title: "Профессиональная команда", text: "Отличный сервис от начала до конца. Ценю, что они позаботились об административных делах, общении с застройщиком и юридических требованиях. Они сэкономили мне много времени.", name: "Петер", role: "IT-консультант" },
      { title: "Осмысленная инвестиция", text: "Я искал квартиру у моря как долгосрочную инвестицию. Мне предложили несколько вариантов с объяснением преимуществ и рисков. В итоге я выбрал проект, которым максимально доволен.", name: "Томаш", role: "Финансовый консультант" },
      { title: "Отличные консультации", text: "Раньше я никогда не покупала недвижимость за границей, поэтому у меня было множество вопросов. На каждый я получила чёткий ответ, и весь процесс прошёл без стресса.", name: "Моника", role: "Врач" },
      { title: "Комплексные услуги", text: "Большим преимуществом было то, что всё оформили в одном месте – от выбора квартиры до юридического обслуживания. Мне не пришлось решать никаких сложностей.", name: "Юрай", role: "Инженер-строитель" },
      { title: "Рекомендую всем", text: "Профессиональный подход, отличное общение и человеческое отношение. После покупки они продолжали интересоваться мной и помогли мне с меблировкой квартиры.", name: "Андреа", role: "Менеджер" },
      { title: "Надёжный партнёр", text: "Очень ценю прозрачность на протяжении всего процесса. Никто не давил на меня в принятии решения, и всё было подкреплено реальной информацией.", name: "Марек", role: "Адвокат" },
      { title: "Отличный опыт", text: "Покупка прошла точно по договорённости. Общение было быстрым, профессиональным, и я всегда знал, что будет дальше. Вот так я представляю качественный сервис.", name: "Роман", role: "Архитектор" },
      { title: "Максимальное удовлетворение", text: "Рекомендую всем, кто хочет безопасно инвестировать в недвижимость за границей. Особенно ценю опыт команды, готовность помочь и поддержку даже после завершения покупки.", name: "Катарина", role: "Владелица интернет-магазина" },
    ]
  },
  pl: {
    sectionLabel: "REFERENCJE",
    sectionTitle: "Co mówią nasi klienci",
    sectionSubtitle: "Prawdziwe historie prawdziwych inwestycji",
    items: [
      { title: "Duże zadowolenie", text: "Duże zadowolenie z załatwiania nie prostego zakupu nieruchomości za granicą. Wszystkie moje pytania zostały odpowiedziane, a nawet skomplikowane weryfikacje w różnych urzędach zostały załatwione przez firmę nieruchomości za mnie. Dzięki temu zakup przebiegł bez niepotrzebnego stresu, a cały proces był profesjonalny od początku do końca.", name: "Viktória", role: "Farmaceutka" },
      { title: "Profesjonalne podejście", text: "Chciałbym podkreślić profesjonalne podejście i obsługę najwyższej klasy przy zakupie nieruchomości w Egipcie. Wszystko zostało mi szczegółowo i zrozumiale wyjaśnione. Cenię również szybkość komunikacji i wsparcie przy wszelkich pytaniach. Jako klient jestem ponad miarę zadowolony i z pewnością skorzystam z usług Davida i jego zespołu ponownie.", name: "Filip", role: "Przedsiębiorca" },
      { title: "Jesteśmy zadowoleni", text: "Chcielibyśmy bardzo podziękować za świetną pracę, którą wykonaliście przy zakupie mieszkania za granicą. Wasze profesjonalne podejście pomogło nam spełnić marzenie o zakupie nie jednej, ale aż dwóch nieruchomości. Z pewnością zwrócimy się do Was również przy kolejnych inwestycjach.", name: "Renáta", role: "Specjalista HR" },
      { title: "Najlepszy zakup", text: "Zakup nieruchomości w Dubaju był jedną z najlepszych inwestycji, jakie kiedykolwiek zrobiłem. Cenię profesjonalne podejście, szczegółowe doradztwo i przejrzystą komunikację podczas całego procesu. Moje oczekiwania zostały nie tylko spełnione, ale nawet przekroczone.", name: "Igor", role: "Menedżer projektu" },
      { title: "Bez zmartwień", text: "Od pierwszego telefonu aż do przekazania apartamentu wszystko przebiegło bez problemów. Bardzo cenię profesjonalne podejście, przejrzystą komunikację i weryfikację prawną całego zakupu. Zdecydowanie polecam każdemu, kto rozważa inwestycję za granicą.", name: "Martin", role: "Przedsiębiorca" },
      { title: "Doskonała komunikacja", text: "Najbardziej zaskoczyła mnie szybkość odpowiedzi i gotowość pomocy z każdym pytaniem. Wszystko było wyjaśnione zrozumiale i podczas całego procesu czułam się bezpiecznie.", name: "Lucia", role: "Księgowa" },
      { title: "Profesjonalny zespół", text: "Doskonała obsługa od początku do końca. Cenię to, że zajęli się administracją, komunikacją z deweloperem i wymogami prawnymi. Zaoszczędzili mi dużo czasu.", name: "Peter", role: "Konsultant IT" },
      { title: "Inwestycja, która ma sens", text: "Szukałem apartamentu nad morzem jako inwestycji długoterminowej. Otrzymałem kilka opcji z wyjaśnieniem zalet i ryzyk. Ostatecznie wybrałem projekt, z którym jestem maksymalnie zadowolony.", name: "Tomáš", role: "Doradca finansowy" },
      { title: "Świetne doradztwo", text: "Nigdy wcześniej nie kupowałam nieruchomości za granicą, dlatego miałam mnóstwo pytań. Na każde otrzymałam jasną odpowiedź, a cały proces przebiegł bez stresu.", name: "Monika", role: "Lekarka" },
      { title: "Kompleksowe usługi", text: "Dużą zaletą było to, że wszystko załatwili w jednym miejscu – od wyboru apartamentu po obsługę prawną. Nie musiałem zajmować się żadnymi komplikacjami.", name: "Juraj", role: "Inżynier budownictwa" },
      { title: "Polecam każdemu", text: "Profesjonalne podejście, doskonała komunikacja i ludzkie podejście. Po zakupie nadal się mną interesowali i pomogli mi również z wyposażeniem apartamentu.", name: "Andrea", role: "Menedżerka" },
      { title: "Niezawodny partner", text: "Bardzo cenię przejrzystość podczas całego procesu. Nikt mnie nie naciskał na decyzję, a wszystko było poparte realnymi informacjami.", name: "Marek", role: "Prawnik" },
      { title: "Doskonałe doświadczenie", text: "Zakup przebiegł dokładnie zgodnie z umową. Komunikacja była szybka, profesjonalna i zawsze wiedziałem, co będzie dalej. Tak wyobrażam sobie jakość usług.", name: "Roman", role: "Architekt" },
      { title: "Maksymalne zadowolenie", text: "Polecam każdemu, kto chce bezpiecznie inwestować w nieruchomości za granicą. Cenię szczególnie doświadczenie zespołu, gotowość do pomocy i wsparcie nawet po zakończeniu zakupu.", name: "Katarína", role: "Właścicielka e-shopu" },
    ]
  },
  hu: {
    sectionLabel: "REFERENCIÁK",
    sectionTitle: "Mit mondanak az ügyfeleink",
    sectionSubtitle: "Valós történetek valós befektetésekről",
    items: [
      { title: "Nagy elégedettség", text: "Nagy elégedettség a külföldi ingatlanvásárlás nem egyszerű intézésével. Minden kérdésemre választ kaptam, és még a bonyolult hivatali igazgatásokat is az ingatlaniroda intézte helyettem. Ennek köszönhetően a vásárlás felesleges stressz nélkül zajlott, és az egész folyamat kezdettől fogva professzionális volt.", name: "Viktória", role: "Gyógyszerész" },
      { title: "Professzionális hozzáállás", text: "Szeretném kiemelni a professzionális hozzáállást és a csúcsminőségű szolgáltatást az egyiptomi ingatlanvásárlásnál. Mindent részletesen és érthetően elmagyaráztak. Értékelem a kommunikáció gyorsaságát és a kérdések megoldásában nyújtott támogatást is. Ügyfélként rendkívül elégedett vagyok, és David és csapata szolgáltatásait biztosan újra igénybe veszem.", name: "Filip", role: "Vállalkozó" },
      { title: "Elégedettek vagyunk", text: "Nagyon szeretnénk köszönetet mondani a kiváló munkáért, amit egy külföldi lakás vásárlásakor végeztek. A professzionális hozzáállásuk segített teljesíteni álmainkat nem egy, hanem egyenesen két ingatlan megvásárlásával. Biztosan visszafordulunk hozzátok további befektetéseknél is.", name: "Renáta", role: "HR-menedzser" },
      { title: "Legjobb vásárlás", text: "A dubaji ingatlanvásárlás az egyik legjobb befektetés volt, amit valaha tettem. Értékelem a professzionális hozzáállást, a részletes tanácsadást és az átlátható kommunikációt a teljes folyamat során. Az elvárásaim nemcsak teljesültek, hanem túl is szárnyalták.", name: "Igor", role: "Projektmenedzser" },
      { title: "Gondtalan", text: "Az első telefonhívástól a lakás átadásáig minden probléma nélkül zajlott. Nagyon értékelem a professzionális hozzáállást, az átlátható kommunikációt és a teljes vásárlás jogi ellenőrzését. Mindenképpen ajánlom mindenkinek, aki külföldi befektetést fontolgat.", name: "Martin", role: "Vállalkozó" },
      { title: "Kiváló kommunikáció", text: "A leginkább a válaszok gyorsasága és a segítségnyújtás minden kérdésnél lepett meg. Mindent érthetően elmagyaráztak, és a teljes folyamat során biztonságban éreztem magam.", name: "Lucia", role: "Könyvelő" },
      { title: "Professzionális csapat", text: "Kiváló szolgáltatás kezdettől a végéig. Értékelem, hogy intézték az adminisztrációt, a fejlesztővel való kommunikációt és a jogi követelményeket. Sok időt megtakarítottak nekem.", name: "Peter", role: "IT-tanácsadó" },
      { title: "Értelmes befektetés", text: "Tengerparti lakást kerestem hosszú távú befektetésként. Több opciót kaptam az előnyök és kockázatok magyarázatával. Végül olyan projektet választottam, amely maximálisan elégedett vagyok.", name: "Tomáš", role: "Pénzügyi tanácsadó" },
      { title: "Kiváló tanácsadás", text: "Még soha nem vettem ingatlant külföldön, ezért sok kérdésem volt. Mindegyikre világos választ kaptam, és az egész folyamat stresszmentesen zajlott.", name: "Monika", role: "Orvos" },
      { title: "Átfogó szolgáltatások", text: "Nagy előny volt, hogy mindent egy helyen intéztek – a lakás kiválasztásától a jogi szolgáltatásig. Nem kellett semmilyen komplikációval foglalkoznom.", name: "Juraj", role: "Építőmérnök" },
      { title: "Mindenkinek ajánlom", text: "Professzionális hozzáállás, kiváló kommunikáció és emberi megközelítés. A vásárlás után is tovább érdeklődtek irántam, és segítettek a lakás berendezésében is.", name: "Andrea", role: "Menedzser" },
      { title: "Megbízható partner", text: "Nagyon értékelem az átláthatóságot a teljes folyamat során. Senki sem sürgetett a döntésben, és mindent valós információk támasztottak alá.", name: "Marek", role: "Ügyvéd" },
      { title: "Kiváló tapasztalat", text: "A vásárlás pontosan a megállapodás szerint zajlott. A kommunikáció gyors, professzionális volt, és mindig tudtam, mi fog következni. Így képzelem el a minőségi szolgáltatást.", name: "Roman", role: "Építész" },
      { title: "Maximális elégedettség", text: "Ajánlom mindenkinek, aki biztonságosan szeretne ingatlanba fektetni külföldön. Különösen értékelem a csapat tapasztalatát, a segítségnyújtást és a támogatást a vásárlás befejezése után is.", name: "Katarína", role: "Webáruház-tulajdonos" },
    ]
  },
};

export default function Testimonials() {
  const { lang } = usePublicLang();
  const data = TESTIMONIALS[lang] || TESTIMONIALS.en;
  const items = data.items;

  const [index, setIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);

  useEffect(() => {
    const updateView = () => {
      if (window.innerWidth < 640) setItemsPerView(1);
      else if (window.innerWidth < 1024) setItemsPerView(2);
      else setItemsPerView(3);
    };
    updateView();
    window.addEventListener("resize", updateView);
    return () => window.removeEventListener("resize", updateView);
  }, []);

  const maxIndex = Math.max(0, items.length - itemsPerView);

  const next = useCallback(() => setIndex(i => (i >= maxIndex ? 0 : i + 1)), [maxIndex]);
  const prev = useCallback(() => setIndex(i => (i <= 0 ? maxIndex : i - 1)), [maxIndex]);

  useEffect(() => {
    if (index > maxIndex) setIndex(maxIndex);
  }, [maxIndex, index]);

  const visible = items.slice(index, index + itemsPerView);
  while (visible.length < itemsPerView && items.length >= itemsPerView) {
    visible.push(items[index + visible.length - items.length] || items[visible.length]);
  }

  return (
    <section id="testimonials" className="px-4 sm:px-6 py-16 md:py-24" style={{ background: "transparent" }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center gap-3 justify-center mb-4">
            <div className="h-px w-12 bg-[#c5a065]/30" />
            <span className="text-[#c5a065] text-xs font-semibold tracking-[0.3em] uppercase">{data.sectionLabel}</span>
            <div className="h-px w-12 bg-[#c5a065]/30" />
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-semibold text-white mb-3 leading-tight">
            {data.sectionTitle}
          </h2>
          <p className="text-[#c5a065]/80 text-lg sm:text-xl font-heading italic">{data.sectionSubtitle}</p>
        </div>

        {/* Carousel */}
        <div className="relative">
          <div className="overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {visible.map((item, i) => (
                <div key={i}
                  className="rounded-xl border border-[#c5a065]/20 bg-[#16223a]/60 p-6 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-0.5">
                      {[0,1,2,3,4].map(s => (
                        <Star key={s} className="w-4 h-4 fill-[#c5a065] text-[#c5a065]" />
                      ))}
                    </div>
                    <Quote className="w-7 h-7 text-[#c5a065]/30" />
                  </div>
                  <h3 className="text-[#c5a065] font-semibold text-base mb-3">„{item.title}"</h3>
                  <p className="text-white/65 text-sm leading-relaxed flex-1 mb-5">{item.text}</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                    <div className="w-10 h-10 rounded-full bg-[#c5a065]/20 flex items-center justify-center">
                      <span className="text-[#c5a065] font-semibold text-sm">
                        {item.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-white text-sm font-semibold">{item.name}</p>
                      <p className="text-white/40 text-xs">{item.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <button onClick={prev}
              className="w-10 h-10 rounded-full border border-[#c5a065]/30 flex items-center justify-center text-[#c5a065] hover:bg-[#c5a065]/10 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-1.5">
              {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                <button key={i} onClick={() => setIndex(i)}
                  className={`h-2 rounded-full transition-all ${i === index ? "w-6 bg-[#c5a065]" : "w-2 bg-white/20"}`} />
              ))}
            </div>
            <button onClick={next}
              className="w-10 h-10 rounded-full border border-[#c5a065]/30 flex items-center justify-center text-[#c5a065] hover:bg-[#c5a065]/10 transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}