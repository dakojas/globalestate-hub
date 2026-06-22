import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const event = body.event || {};
    const data = body.data || body;

    // Only react to viewing interactions
    if (data.type !== 'viewing') {
      return Response.json({ skipped: true, reason: 'not_a_viewing' });
    }

    const clientId = data.client_id;
    const propertyId = data.property_id;
    if (!clientId) {
      return Response.json({ skipped: true, reason: 'no_client' });
    }

    // Fetch client
    const client = await base44.asServiceRole.entities.Client.get(clientId);

    // Fetch property if linked
    let property = null;
    if (propertyId) {
      try {
        property = await base44.asServiceRole.entities.Property.get(propertyId);
      } catch (e) {
        property = null;
      }
    }

    // Determine agent email
    const agentEmail = data.agent_email || client.assigned_agent || user.email;

    // Build prepared email content
    const clientName = client.full_name || 'Vážený klient';
    const viewingDate = data.date ? new Date(data.date).toLocaleDateString('sk-SK') : new Date().toLocaleDateString('sk-SK');

    let emailBody = `Dobrý deň ${clientName},\n\n`;
    emailBody += `ďakujeme Vám za Váš záujem a za návštevu obhliadky dňa ${viewingDate}.\n\n`;

    if (property) {
      emailBody += `Detaily nehnuteľnosti:\n`;
      emailBody += `• Názov: ${property.title || '-'}\n`;
      emailBody += `• Lokalita: ${[property.city, property.country].filter(Boolean).join(', ') || '-'}\n`;
      emailBody += `• Typ: ${property.property_type || '-'}\n`;
      emailBody += `• Rozloha: ${property.area_sqm ? property.area_sqm + ' m²' : '-'}\n`;
      emailBody += `• Cena: ${property.price ? new Intl.NumberFormat('sk-SK').format(property.price) + ' ' + (property.currency || 'EUR') : '-'}\n`;
      if (property.bedrooms) emailBody += `• Spálne: ${property.bedrooms}\n`;
      if (property.bathrooms) emailBody += `• Kúpeľne: ${property.bathrooms}\n`;
      if (property.features && property.features.length > 0) {
        emailBody += `• Vybavenie: ${property.features.join(', ')}\n`;
      }
      if (property.construction_phase) {
        emailBody += `• Fáza výstavby: ${property.construction_phase === 'vo_vystavbe' ? 'Vo výstavbe' : 'Dokončené'}\n`;
      }
      emailBody += `\n`;
      if (property.description) {
        emailBody += `Doplňujúce informácie:\n${property.description.substring(0, 500)}${property.description.length > 500 ? '...' : ''}\n\n`;
      }
      if (property.brochure_url) {
        emailBody += `Brožúra nehnuteľnosti: ${property.brochure_url}\n\n`;
      }
    }

    emailBody += `Ak máte akékoľvek otázky alebo záujem o ďalší krok, neváhajte nás kontaktovať.\n\n`;
    emailBody += `S pozdravom,\n${user.full_name || 'Váš maklér'}\n`;
    emailBody += user.email ? `${user.email}\n` : '';

    // Due date: next day at 9:00 AM local (Europe/Bratislava = UTC+1/+2)
    const due = new Date();
    due.setDate(due.getDate() + 1);
    due.setHours(9, 0, 0, 0);

    const propertyTitle = property ? property.title : 'nehnuteľnosti';

    // Create reminder
    const reminder = await base44.asServiceRole.entities.Reminder.create({
      title: `Po obhliadke: poslať ďakovný e-mail – ${clientName}`,
      description: `Po obhliadke ${propertyTitle} dňa ${viewingDate} pošlite klientovi ${clientName} ďakovný e-mail s aktuálnym cenníkom a doplňujúcimi informáciami.\n\n--- Pripravený e-mail ---\n${emailBody}`,
      type: 'follow_up',
      due_date: due.toISOString(),
      status: 'pending',
      priority: 'high',
      client_id: clientId,
      property_id: propertyId || null,
      assigned_to: agentEmail
    });

    return Response.json({
      success: true,
      reminder_id: reminder.id,
      client: clientName,
      property: propertyTitle,
      due_date: due.toISOString()
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});