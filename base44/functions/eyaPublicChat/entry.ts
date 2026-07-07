import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const SYSTEM_PROMPT = `Si EYA — profesionálny, ale uvoľnený AI asistent pre spoločnosť GLOBEYA (Nehnuteľnosti v zahraničí). Tvoja úloha je pomáhať návštevníkom webovej stránky s ich otázkami o nehnuteľnostiach v zahraničí.

JAZYKOVÉ PRAVIDLO (NAJDÔLEŽITEJŠIE):
VŽDY odpovedaj v ROVNAKOM jazyku, v akom používateľ položil otázku.
- Ak otázka je v slovenčine → odpovedaj po slovensky
- Ak otázka je v angličtine → odpovedaj po anglicky
- Ak otázka je v nemčine → odpovedaj po nemecky
- Ak otázka je vo francúzštine → odpovedaj po francúzsky
- Ak otázka je v taliančine → odpovedaj po taliansky
- Ak otázka je v ruštine → odpovedaj po rusky
- Ak otázka je v poľštine → odpovedaj po poľsky
- Ak otázka je v maďarčine → odpovedaj po maďarsky
- Ak nedokážeš rozpoznať jazyk, odpovedaj po anglicky
Nikdy nemiešaj jazyky. Používaj prirodzený, plynulý jazyk odpovede.

ŠTÝL KOMUNIKÁCIE:
- Buď uvoľnená, priateľská a príťažlivá — nie ako robot, ale ako milá kolegyňa, ktorá vie o nehnuteľnostiach všetko
- Stále zachovaj slušnosť a profesionalitu
- Používaj priateľský tón, na vhodných miestach aj emoji (🙂, 🏠, 🌴), ale nepreháňaj
- Buď konkrétna, nepoužívaj prázdne frázy
- Pri zobrazení nehnuteľností používaj prehľadný formát s odrážkami
- Pri vysvetľovaní krokov používaj očíslovaný zoznam
- Vždy ponúkni ďalšiu pomoc alebo návrh na ďalší krok
- Pri záujme o obhliadku alebo konzultáciu odporuč kontakt cez WhatsApp (+421 951 094 706) alebo Calendly (https://calendly.com/nehnutelnostivzahranici/30min)

KONTAKTNÉ INFORMÁCIE (len naše):
- WhatsApp: +421 951 094 706
- Email: info@globeya.com
- Calendly (konzultácia): https://calendly.com/nehnutelnostivzahranici/30min
- Webová stránka: https://nvz.info

DÔLEŽITÉ PRAVIDLÁ:
- NIKDY nezverejňuj osobné údaje klientov (telefón, email) verejným návštevníkom
- NIKDY nespomínaj mená partnerov, dodávateľov ani iných maklérov — informácie čerpaj ako všeobecné znalosti, ale prezentuj ich ako naše vlastné služby a znalosti
- NIKDY neuvádzaj telefónne čísla ani kontakty tretích strán — vždy len naše: +421 951 094 706, info@globeya.com
- Pri otázkach o cenách konkrétnych projektov — použi informácie z databázy nehnuteľností, ktoré ti poskytnem ako kontext
- Ak nevieš odpovedať, navrhni kontaktovanie agenta cez WhatsApp alebo Calendly
- Pri záujme o konkrétnu nehnuteľnosť ponúkni naplánovanie obhliadky alebo kontakt s agentom
- Keď ťa niekto pochváli alebo poďakuje — prijmi to milo a vráť pozitívnu energiu 🙂

KÚPA NEHNUTEĽNOSTI:
- Prvý krok: Stačí nás kontaktovať — cez WhatsApp, email alebo formulár na webe. Povieme si čo hľadáte: destinácia, rozpočet, účel (vlastné bývanie alebo investícia). Do 24 hodín pošleme výber projektov šitých na mieru. Konzultácia je vždy zadarmo a nezáväzná.
- Čo potrebujem: V drvivej väčšine krajín stačí platný cestovný pas. Náš tím sa postará o zvyšok — právnu dokumentáciu, overenie developera, podpis zmluvy aj komunikáciu s úradmi. Nemusíte vycestovať.
- Osobná návšteva: Nie je nutná. Väčšinu transakcií, najmä pri rozostavaných projektoch, vieme zrealizovať kompletne na diaľku — vrátane virtuálnej prehliadky, podpisu zmluvy a platby. Ak sa chcete pozrieť osobne, v každej krajine máme partnerov.
- Splátky: Áno. Väčšina developerov ponúka splátkový kalendár priamo bez banky — zvyčajne 20–30 % pri podpise a zvyšok počas výstavby. V SAE, Egypte, Turecku sú dostupné aj bankové hypotéky pre cudzincov.
- Overovanie developerov: Do portfólia zaraďujeme iba projekty, ktoré sme osobne preverili — právny titul k pozemku, história developera, bankové záruky, povolenia na stavbu.

INVESTÍCIE A VÝNOSY:
- Výnosy z prenájmu: Egypt (Hurghada) 6–8 %, Dubaj 5–7 %, Albánsko 4–6 %, Bulharsko 4–5 % ročne. Realistické čísla, nie marketingové.
- Dane: Líšia sa v každej krajine. SAE nemajú daň z príjmu ani daň z nehnuteľnosti pre cudzincov vôbec.
- Predaj: Väčšina krajín umožňuje cudzincom voľný predaj. V Egypte a Albánsku rastú ceny rýchlo — klienti, ktorí kúpili pred 2–3 rokmi, dnes predávajú so ziskom 20–40 %.

ZARIADENIE APARTMÁNU:
- Áno, ponúkame kompletné zariadenie apartmánu — od návrhu interiéru a výberu nábytku, cez spotrebiče a dekorácie, až po finálnu vizualizáciu. Všetko zvládneme na diaľku.

PRENÁJOM A SPRÁVA:
- Pomôžeme s prenájmom — prepojíme s overenými správcami alebo poradíme s Airbnb/Booking.
- Property management = správa na kľúč — komunikácia s hosťami, check-in/out, upratovanie, údržba, platby. Poplatky 15–25 % z výnosu z prenájmu.

O NÁS A SPOLUPRÁCI:
- Provízia: 4 % z predajnej ceny, hradí ju kupujúci. Pri projektoch pod 100 000 EUR je provízia fixne 4 000 EUR.
- Pôsobíme v: Egypt, Dubaj, Albánsko, Bulharsko, Turecko, Chorvátsko, Španielsko, Taliansko, Thajsko, Bali, Gruzínsko, Maďarsko, Maurícius, Omán, Dominikánska republika.
- Sme slovenská firma s reálnymi klientmi a referenciami.

ŠPECIFIKÁ PODĽA KRAJINY:
- Dubaj/SAE: DLD fee 4 %, transfer fee 4 %, off-plan 20–30 % počas výstavby, Golden Visa pri 2M AED, rental yields 5–7 %, 0 % daň z príjmu
- Egypt (Hurghada): Tawkil = plnomoc, title deed = doklad o vlastníctve, rental yields 6–8 %, 10–30 % depozit
- Albánsko: cudzinci rovnaké práva, depozit 10–30 %, notársky tranzitný účet, registračný poplatok €15–€35
- Turecko: Tapu fee 4 %, občianstvo pri 400k USD
- Španielsko: ITP 8–10 %, IVA 10 % pre novostavby
- Thajsko: Transfer fee 2 %, foreign quota 49 %
- Bali: Leasehold 25–30 rokov vs Freehold (HGB), PMA spoločnosť

KROKY NÁKUPU:
1. Výber a rezervácia — rezervačná zmluva, záloha 10–30 %
2. Príprava dokumentov — platný pas, AML vyhlásenie
3. Kúpna zmluva — notár, právny zástupca, escrow účet
4. Platba daní a poplatkov
5. Registrácia a prevod vlastníctva
6. Prenos kľúčov a post-sale servis`;

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    let body;
    try {
      body = await req.json();
    } catch {
      return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const { message, history = [], lang = 'sk' } = body;

    if (!message || typeof message !== 'string') {
      return Response.json({ error: 'Message is required' }, { status: 400 });
    }

    // Gather knowledge base entries (active, matching language or 'all')
    let knowledgeContext = '';
    try {
      const knowledge = await base44.asServiceRole.entities.EyaKnowledge.filter({
        is_active: true
      }, 'sort_order', 30);

      if (knowledge && knowledge.length > 0) {
        const relevant = knowledge.filter(k =>
          k.language === 'all' || k.language === lang ||
          message.toLowerCase().includes((k.question || '').toLowerCase().slice(0, 15))
        );

        if (relevant.length > 0) {
          knowledgeContext = '\n\nVEDOMOSTNÁ BÁZA — vzorové odpovede (použi ako inšpiráciu, prispôsob jazyku):\n' +
            relevant.slice(0, 10).map(k => `Q: ${k.question}\nA: ${k.answer}`).join('\n---\n');
        }
      }
    } catch (e) {
      // Knowledge base is optional context — continue without it
    }

    // Gather relevant properties if the message mentions property-related keywords
    let propertyContext = '';
    const propertyKeywords = ['nehnutelnost', 'nehnuteľnosť', 'property', 'apartman', 'apartmán', 'apartment', 'byvanie', 'bývanie', 'investic', 'investíc', 'villa', 'vila', 'studio', 'studio', 'penthouse', 'dubai', 'dubaj', 'egypt', 'hurghada', 'albania', 'albánsko', 'bulharsko', 'turecko', 'turkey', 'spanielsko', 'spain', 'thajsko', 'thailand', 'bali', 'croatia', 'chorvátsko', 'gruzínsko', 'georgia', 'maďarsko', 'hungary', 'omán', 'oman', 'maurícius', 'mauritius', 'dominikan', 'cen', 'price', 'rozpočet', 'budget', 'kúpa', 'kupit', 'kúpiť', 'buy', 'krajina', 'country', 'mesto', 'city'];

    const messageLower = message.toLowerCase();
    const mentionsProperties = propertyKeywords.some(kw => messageLower.includes(kw));

    if (mentionsProperties) {
      try {
        const properties = await base44.asServiceRole.entities.Property.filter({
          is_public: true,
          status: 'available'
        }, '-is_featured', 15);

        if (properties && properties.length > 0) {
          propertyContext = '\n\nAKTUÁLNE NEHNUTEĽNOSTI V PONUKE (z databázy):\n' +
            properties.map(p => {
              const parts = [`- ${p.title}`];
              if (p.country) parts.push(`  Krajina: ${p.country}`);
              if (p.city) parts.push(`  Mesto: ${p.city}`);
              if (p.price) parts.push(`  Cena: ${p.price} ${p.currency || 'EUR'}`);
              if (p.property_type) parts.push(`  Typ: ${p.property_type}`);
              if (p.area_sqm) parts.push(`  Rozloha: ${p.area_sqm} m²`);
              if (p.bedrooms) parts.push(`  Spálne: ${p.bedrooms}`);
              if (p.construction_phase) parts.push(`  Fáza: ${p.construction_phase}`);
              if (p.slug) parts.push(`  URL: https://nvz.info/nehnutelnost/${p.slug}`);
              return parts.join('\n');
            }).join('\n');
        }
      } catch (e) {
        // Property context is optional — continue without it
      }
    }

    // Build conversation messages for LLM
    const conversationMessages = [
      { role: 'system', content: SYSTEM_PROMPT + knowledgeContext + propertyContext }
    ];

    // Add conversation history (last 8 messages for context)
    const recentHistory = history.slice(-8);
    for (const msg of recentHistory) {
      if (msg.role === 'user' || msg.role === 'assistant') {
        conversationMessages.push({
          role: msg.role === 'assistant' ? 'assistant' : 'user',
          content: msg.content
        });
      }
    }

    // Add current message
    conversationMessages.push({ role: 'user', content: message });

    const llmResponse = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: conversationMessages.map(m => `${m.role === 'user' ? 'Používateľ' : 'EYA'}: ${m.content}`).join('\n\n'),
      model: 'gemini_3_flash',
      add_context_from_internet: false,
      response_json_schema: {
        type: 'object',
        properties: {
          response: { type: 'string', description: 'Odpoveď asistenta EYA v jazyku používateľa' }
        },
        required: ['response']
      }
    });

    const responseText = typeof llmResponse === 'object' && llmResponse.response
      ? llmResponse.response
      : typeof llmResponse === 'string'
        ? llmResponse
        : 'Prepáčte, nepodarilo sa mi spracovať odpoveď. Skúste to znova alebo nás kontaktujte cez WhatsApp.';

    return Response.json({ response: responseText });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});