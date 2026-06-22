import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { property_id, client_id, language, custom_message } = await req.json();

    if (!property_id) return Response.json({ error: 'property_id is required' }, { status: 400 });

    const property = await base44.entities.Property.get(property_id);
    const client = client_id && client_id !== "none" ? await base44.entities.Client.get(client_id) : null;

    if (client && !client.email) {
      return Response.json({ error: 'Klient nemá zadaný email' }, { status: 400 });
    }

    // Pripočítame províziu 6000 EUR ku všetkým cenám
    const COMMISSION = 6000;
    const finalPrice = (property.price || 0) + COMMISSION;
    const originalPrice = property.price || 0;
    const pricePerSqm = property.area_sqm ? Math.round(finalPrice / property.area_sqm) : null;

    const languageNames = {
      sk: "slovenčina", en: "English", de: "Deutsch", fr: "Français",
      it: "Italiano", ru: "Русский", pl: "Polski", hu: "Magyar", cs: "Čeština"
    };
    const langName = languageNames[language] || "English";

    const propertyTypeLabels = {
      studio: "Studio", "1_bedroom": "1 Bedroom", "2_bedroom": "2 Bedroom",
      penthouse: "Penthouse", vila: "Villa"
    };

    const featuresList = (property.features || []).join(", ");
    const images = property.images || [];

    // Generujeme email cez LLM vo vybranom jazyku
    const prompt = `Si profesionálny realitný konzultant pre spoločnosť "Nehnuteľnosti v zahraničí".
Napíš personalizovaný ponukový email v jazyku: ${langName}.

Detaily nehnuteľnosti:
- Názov: ${property.title}
- Lokalita: ${property.city}, ${property.country}
- Typ: ${propertyTypeLabels[property.property_type] || property.property_type || "—"}
- Plocha: ${property.area_sqm || "—"} m²
- Spálne: ${property.bedrooms || "—"}
- Kúpeľne: ${property.bathrooms || "—"}
- Cena (vrátane provízie): ${finalPrice.toLocaleString()} ${property.currency || "EUR"}
- Projekt: ${property.project_name || "—"}
- Developer: ${property.developer || "—"}
- Výstavba: ${property.construction_phase === "vo_vystavbe" ? "Off Plan / Vo výstavbe" : "Dokončené"}
- Výbava: ${featuresList || "—"}
- Popis: ${(property.description || property.description_en || "").slice(0, 500)}

${client ? `Klient: ${client.full_name}` : "Klient: všeobecný"}

${custom_message ? `Dodatočný odkaz od agenta: ${custom_message}` : ""}

Email musí:
1. Byť profesionálny, teplý a osobný
2. Predstaviť nehnuteľnosť s kľúčovými výhodami
3. Spomenúť cenu ${finalPrice.toLocaleString()} ${property.currency || "EUR"} (vrátane všetkých poplatkov a provízie)
4. Pozvať na prehliadku alebo konzultáciu
5. Podpísať ako "Nehnuteľnosti v zahraničí"
6. Byť napísaný VÝHRADNE v jazyku: ${langName}

Vráť JSON s poliami "subject" (predmet emailu) a "body" (telo emailu).`;

    const llmResponse = await base44.integrations.Core.InvokeLLM({
      prompt: prompt,
      response_json_schema: {
        type: "object",
        properties: {
          subject: { type: "string" },
          body: { type: "string" }
        }
      }
    });

    const emailSubject = llmResponse.subject || `Exkluzívna ponuka: ${property.title}`;
    let emailBody = llmResponse.body || "";

    // Pridáme odkazy na katalóg/brožúru a cenník
    const attachments = [];
    if (property.brochure_url) {
      attachments.push(`📄 Katalóg / brožúra nehnuteľnosti: ${property.brochure_url}`);
    }
    if (images.length > 0) {
      attachments.push(`🖼️ Fotogaléria: ${images.slice(0, 5).join(" , ")}`);
    }

    if (attachments.length > 0) {
      emailBody += `\n\n---\nPrílohy a odkazy:\n${attachments.join("\n")}`;
    }

    emailBody += `\n\n---\nNehnuteľnosti v zahraničí\ninfo@nvz.sk\n+421 XXX XXX XXX`;

    let sentTo = null;
    if (client && client.email) {
      await base44.integrations.Core.SendEmail({
        to: client.email,
        subject: emailSubject,
        body: emailBody,
      });
      sentTo = client.email;

      // Zaznamenáme interakciu
      await base44.entities.Interaction.create({
        client_id: client.id,
        property_id: property.id,
        type: "email",
        summary: `AI agent odoslal profesionálnu ponuku (${langName}) – cena ${finalPrice.toLocaleString()} ${property.currency || "EUR"} (vrátane provízie 6000 EUR)`,
        date: new Date().toISOString(),
        agent_email: user.email,
        outcome: "Ponuka odoslaná klientovi",
      });
    }

    return Response.json({
      success: true,
      property_title: property.title,
      client_name: client?.full_name || null,
      sent_to: sentTo,
      language: langName,
      original_price: originalPrice,
      commission: COMMISSION,
      final_price: finalPrice,
      price_per_sqm: pricePerSqm,
      email_subject: emailSubject,
      email_body: emailBody,
      has_brochure: !!property.brochure_url,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});