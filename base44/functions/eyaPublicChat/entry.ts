import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const SYSTEM_PROMPT = `Si EYA — AI asistent pre GLOBEYA (Nehnuteľnosti v zahraničí). Pomáhaš s otázkami o nehnuteľnostiach v zahraničí.

Odpovedaj VŽDY v jazyku otázky (sk/en/de/fr/it/ru/pl/hu). Buď priateľská, konkrétna, používaj emoji s mierou. Pri zoznamoch používaj odrážky. Odpovedaj STRUČNE — max 150 slov. Nepoužívaj hviezdičky pre tučné písmo.

KONTAKTY: WhatsApp +421 951 094 706 | Email: info@globeya.com | Calendly: https://calendly.com/nehnutelnostivzahranici/30min

PRAVIDLÁ: Nikdy nezverejňuj údaje klientov. Nespomínaj partnerov/maklérov — prezentuj ako naše služby. Pri cenách použi kontext nižšie. Ak nevieš, navrhni WhatsApp.

KÚPA: Kontaktuj nás → do 24h výber projektov. Konzultácia zadarmo. Potrebný pas, zvyšok vybavíme. Nákup na diaľku. Splátky 20–30 % pri podpise. Provízia 4 % (min 4000 EUR).

INVESTÍCIE: Egypt 6–8 %, Dubaj 5–7 %, Albánsko 4–6 %, Bulharsko 4–5 % ročne. SAE 0 % dane.

KRAJINY: SAE (DLD 4 %, Golden Visa 2M AED), Egypt (Tawkil=plnomoc, 10–30 % depozit), Albánsko (rovnaké práva), Turecko (Tapu 4 %), Španielsko (ITP 8–10 %), Thajsko (transfer 2 %), Bali (leasehold 25–30r).

Pôsobíme v: Egypt, Dubaj, Albánsko, Bulharsko, Turecko, Chorvátsko, Španielsko, Taliansko, Thajsko, Bali, Gruzínsko, Maďarsko, Maurícius, Omán, Dominikánska rep.

Ponúkame: zariadenie apartmánu, property management (15–25 %), prenájom.`;

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

    // Only fetch properties if message clearly asks about properties/listings
    const messageLower = message.toLowerCase();
    const propertyKeywords = ['nehnutelnost', 'nehnuteľnosť', 'apartman', 'apartmán', 'investic', 'investíc', 'villa', 'vila', 'studio', 'penthouse', 'dubai', 'dubaj', 'egypt', 'hurghada', 'albania', 'albánsko', 'bulharsko', 'turecko', 'turkey', 'spanielsko', 'spain', 'thajsko', 'thailand', 'bali', 'croatia', 'chorvátsko', 'gruzínsko', 'georgia', 'maďarsko', 'hungary', 'omán', 'oman', 'maurícius', 'mauritius', 'dominikan', 'rozpočet', 'budget', 'kúpa', 'kupit', 'kúpiť', 'buy', 'ponuk', 'offer', 'projekt', 'cena', 'price'];
    const mentionsProperties = propertyKeywords.some(kw => messageLower.includes(kw));

    let context = '';

    // Fetch properties only when relevant — keep it fast
    if (mentionsProperties) {
      try {
        const properties = await base44.asServiceRole.entities.Property.filter({
          is_public: true,
          status: 'available'
        }, '-is_featured', 6);

        if (properties?.length > 0) {
          context += '\n\nNEHNUTEĽNOSTI V PONUKE:\n' + properties.map(p => {
            const parts = [`- ${p.title}`];
            if (p.country) parts.push(`  ${p.country}${p.city ? ', ' + p.city : ''}`);
            if (p.price) parts.push(`  Cena: ${p.price} ${p.currency || 'EUR'}`);
            if (p.property_type) parts.push(`  Typ: ${p.property_type}`);
            if (p.area_sqm) parts.push(`  ${p.area_sqm} m²`);
            if (p.slug) parts.push(`  https://nvz.info/nehnutelnost/${p.slug}`);
            return parts.join('\n');
          }).join('\n');
        }
      } catch (e) {
        // Property context is optional
      }
    }

    // Build prompt — keep history short (last 3 messages)
    const recentHistory = history.slice(-3);
    const historyStr = recentHistory
      .filter(m => m.role === 'user' || m.role === 'assistant')
      .map(m => `${m.role === 'user' ? 'Používateľ' : 'EYA'}: ${m.content}`)
      .join('\n\n');

    const fullPrompt = `${SYSTEM_PROMPT}${context}\n\n${historyStr ? historyStr + '\n\n' : ''}Používateľ: ${message}\n\nEYA:`;

    const llmResponse = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: fullPrompt,
      model: 'gemini_3_flash',
      add_context_from_internet: false,
    });

    const responseText = typeof llmResponse === 'string'
      ? llmResponse
      : (llmResponse?.response || 'Prepáčte, nepodarilo sa mi odpovedať. Skúste to znova alebo nás kontaktujte cez WhatsApp.');

    return Response.json({ response: responseText });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});