import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Compute start of today (UTC) — 24h window
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Fetch new clients (leads/inquiries) from last 24h
    const newClients = await base44.asServiceRole.entities.Client.filter(
      { created_date: { $gte: twentyFourHoursAgo.toISOString() } },
      "-created_date",
      200
    );

    // Fetch new interactions from last 24h
    const newInteractions = await base44.asServiceRole.entities.Interaction.filter(
      { created_date: { $gte: twentyFourHoursAgo.toISOString() } },
      "-created_date",
      200
    );

    // Fetch new partner requests from last 24h
    const newPartnerRequests = await base44.asServiceRole.entities.PartnerRequest.filter(
      { created_date: { $gte: twentyFourHoursAgo.toISOString() } },
      "-created_date",
      100
    );

    // Fetch new properties submitted for approval
    const newProperties = await base44.asServiceRole.entities.Property.filter(
      { created_date: { $gte: twentyFourHoursAgo.toISOString() } },
      "-created_date",
      100
    );

    const dateStr = now.toLocaleDateString("sk-SK", { timeZone: "Europe/Bratislava", day: "2-digit", month: "2-digit", year: "numeric" });

    // Build email HTML
    const totalNew = newClients.length + newInteractions.length + newPartnerRequests.length + newProperties.length;

    let html = `
      <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; background: #f5f6fa; padding: 24px;">
        <div style="background: #0a1628; border-radius: 12px; padding: 28px; margin-bottom: 20px;">
          <h1 style="color: #c5a065; font-size: 24px; margin: 0 0 8px 0;">📊 Denný súhrn — GLOBEYA</h1>
          <p style="color: rgba(255,255,255,0.7); font-size: 14px; margin: 0;">Prehľad nových dopytov a aktivít za ${dateStr}</p>
        </div>

        <div style="display: flex; gap: 12px; margin-bottom: 20px; flex-wrap: wrap;">
          <div style="flex:1; min-width:120px; background: #fff; border-radius: 10px; padding: 16px; text-align: center; border: 1px solid #e2e8f0;">
            <div style="font-size: 28px; font-weight: bold; color: #0a1628;">${newClients.length}</div>
            <div style="font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 4px;">Noví klienti</div>
          </div>
          <div style="flex:1; min-width:120px; background: #fff; border-radius: 10px; padding: 16px; text-align: center; border: 1px solid #e2e8f0;">
            <div style="font-size: 28px; font-weight: bold; color: #0a1628;">${newInteractions.length}</div>
            <div style="font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 4px;">Interakcie</div>
          </div>
          <div style="flex:1; min-width:120px; background: #fff; border-radius: 10px; padding: 16px; text-align: center; border: 1px solid #e2e8f0;">
            <div style="font-size: 28px; font-weight: bold; color: #0a1628;">${newPartnerRequests.length}</div>
            <div style="font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 4px;">Partner requests</div>
          </div>
          <div style="flex:1; min-width:120px; background: #fff; border-radius: 10px; padding: 16px; text-align: center; border: 1px solid #e2e8f0;">
            <div style="font-size: 28px; font-weight: bold; color: #0a1628;">${newProperties.length}</div>
            <div style="font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 4px;">Nové nehnuteľnosti</div>
          </div>
        </div>
    `;

    if (totalNew === 0) {
      html += `
        <div style="background: #fff; border-radius: 10px; padding: 32px; text-align: center; border: 1px solid #e2e8f0;">
          <p style="color: #64748b; font-size: 15px; margin: 0;">Dnes bez nových aktivít. Pokojný deň! 😌</p>
        </div>
      `;
    }

    // New clients section
    if (newClients.length > 0) {
      html += `
        <div style="background: #fff; border-radius: 10px; padding: 20px; margin-bottom: 16px; border: 1px solid #e2e8f0;">
          <h2 style="color: #0a1628; font-size: 16px; margin: 0 0 12px 0; border-bottom: 2px solid #c5a065; padding-bottom: 8px;">🆕 Noví klienti (${newClients.length})</h2>
      `;
      newClients.forEach(c => {
        const time = new Date(c.created_date).toLocaleTimeString("sk-SK", { timeZone: "Europe/Bratislava", hour: "2-digit", minute: "2-digit" });
        html += `
          <div style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;">
            <div style="display: flex; justify-content: space-between; align-items: start;">
              <div>
                <strong style="color: #0a1628; font-size: 14px;">${c.full_name || "Bez mena"}</strong>
                ${c.interested_property_title ? `<div style="color: #c5a065; font-size: 12px; margin-top: 2px;">🏠 ${c.interested_property_title}</div>` : ""}
                <div style="color: #64748b; font-size: 12px; margin-top: 3px;">
                  ${c.email ? `✉️ ${c.email}` : ""}
                  ${c.phone ? ` | 📞 ${c.phone}` : ""}
                </div>
                <div style="color: #94a3b8; font-size: 11px; margin-top: 3px;">
                  Zdroj: ${c.lead_source || "—"} | Stav: ${c.status || "new_lead"}
                  ${c.preferred_countries?.length ? ` | Krajiny: ${c.preferred_countries.join(", ")}` : ""}
                  ${c.budget_max ? ` | Rozpočet: do €${c.budget_max.toLocaleString()}` : ""}
                </div>
              </div>
              <span style="color: #94a3b8; font-size: 11px; white-space: nowrap;">${time}</span>
            </div>
          </div>
        `;
      });
      html += `</div>`;
    }

    // New interactions section
    if (newInteractions.length > 0) {
      html += `
        <div style="background: #fff; border-radius: 10px; padding: 20px; margin-bottom: 16px; border: 1px solid #e2e8f0;">
          <h2 style="color: #0a1628; font-size: 16px; margin: 0 0 12px 0; border-bottom: 2px solid #c5a065; padding-bottom: 8px;">💬 Interakcie (${newInteractions.length})</h2>
      `;
      newInteractions.slice(0, 20).forEach(i => {
        const time = new Date(i.created_date).toLocaleTimeString("sk-SK", { timeZone: "Europe/Bratislava", hour: "2-digit", minute: "2-digit" });
        const typeIcons = { call: "📞", email: "✉️", viewing: "🏠", meeting: "🤝", whatsapp: "💬", note: "📝" };
        html += `
          <div style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;">
            <div style="display: flex; justify-content: space-between;">
              <div style="flex: 1;">
                <span style="font-size: 14px;">${typeIcons[i.type] || "📋"}</span>
                <strong style="color: #0a1628; font-size: 13px; margin-left: 4px;">${i.type || "note"}</strong>
                ${i.agent_email ? `<span style="color: #94a3b8; font-size: 11px; margin-left: 8px;">${i.agent_email}</span>` : ""}
                <div style="color: #64748b; font-size: 12px; margin-top: 3px;">${i.summary || ""}</div>
                ${i.outcome ? `<div style="color: #94a3b8; font-size: 11px; margin-top: 2px;">→ ${i.outcome}</div>` : ""}
              </div>
              <span style="color: #94a3b8; font-size: 11px; white-space: nowrap;">${time}</span>
            </div>
          </div>
        `;
      });
      if (newInteractions.length > 20) {
        html += `<p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 8px;">... a ${newInteractions.length - 20} ďalších</p>`;
      }
      html += `</div>`;
    }

    // Partner requests
    if (newPartnerRequests.length > 0) {
      html += `
        <div style="background: #fff; border-radius: 10px; padding: 20px; margin-bottom: 16px; border: 1px solid #e2e8f0;">
          <h2 style="color: #0a1628; font-size: 16px; margin: 0 0 12px 0; border-bottom: 2px solid #c5a065; padding-bottom: 8px;">🤝 Žiadosti o partnerstvo (${newPartnerRequests.length})</h2>
      `;
      newPartnerRequests.forEach(p => {
        html += `
          <div style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;">
            <strong style="color: #0a1628; font-size: 14px;">${p.full_name || "—"}</strong>
            ${p.organization_name ? `<span style="color: #64748b; font-size: 12px;"> — ${p.organization_name}</span>` : ""}
            ${p.email ? `<div style="color: #64748b; font-size: 12px; margin-top: 2px;">✉️ ${p.email}</div>` : ""}
            ${p.message ? `<div style="color: #94a3b8; font-size: 11px; margin-top: 3px;">${p.message.substring(0, 150)}${p.message.length > 150 ? "..." : ""}</div>` : ""}
          </div>
        `;
      });
      html += `</div>`;
    }

    // New properties
    if (newProperties.length > 0) {
      html += `
        <div style="background: #fff; border-radius: 10px; padding: 20px; margin-bottom: 16px; border: 1px solid #e2e8f0;">
          <h2 style="color: #0a1628; font-size: 16px; margin: 0 0 12px 0; border-bottom: 2px solid #c5a065; padding-bottom: 8px;">🏠 Nové nehnuteľnosti (${newProperties.length})</h2>
      `;
      newProperties.slice(0, 15).forEach(p => {
        html += `
          <div style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;">
            <strong style="color: #0a1628; font-size: 14px;">${p.title || "Bez názvu"}</strong>
            <div style="color: #64748b; font-size: 12px; margin-top: 2px;">
              ${p.country || ""} ${p.city ? `— ${p.city}` : ""} | €${(p.price || 0).toLocaleString()}
              ${p.property_type ? ` | ${p.property_type}` : ""}
              ${p.owner_submitted ? ' | <span style="color: #f59e0b;">Partner submit</span>' : ""}
            </div>
          </div>
        `;
      });
      if (newProperties.length > 15) {
        html += `<p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 8px;">... a ${newProperties.length - 15} ďalších</p>`;
      }
      html += `</div>`;
    }

    html += `
        <div style="text-align: center; margin-top: 24px;">
          <a href="https://globeya.com/Dashboard" style="display: inline-block; background: #c5a065; color: #0a0a0a; font-weight: bold; font-size: 14px; padding: 12px 32px; border-radius: 8px; text-decoration: none;">Otvoriť Dashboard</a>
        </div>
        <p style="color: #94a3b8; font-size: 11px; text-align: center; margin-top: 20px;">Tento e-mail bol vygenerovaný automaticky systémom GLOBEYA.</p>
      </div>
    `;

    const subject = totalNew > 0
      ? `📊 Denný súhrn ${dateStr} — ${totalNew} ${totalNew === 1 ? "nová aktivita" : "nové aktivity"}`
      : `📊 Denný súhrn ${dateStr} — bez nových aktivít`;

    // Send to all admin users (SendEmail only works for registered app users)
    const allUsers = await base44.asServiceRole.entities.User.list();
    const adminEmails = allUsers.filter(u => u.role === "admin").map(u => u.email);

    const results = [];
    for (const email of adminEmails) {
      try {
        await base44.asServiceRole.integrations.Core.SendEmail({
          to: email,
          subject,
          body: html,
          from_name: "GLOBEYA Súhrn"
        });
        results.push({ email, status: "sent" });
      } catch (err) {
        results.push({ email, status: "error", error: err.message });
      }
    }

    return Response.json({
      success: true,
      date: dateStr,
      recipients: results,
      summary: {
        newClients: newClients.length,
        newInteractions: newInteractions.length,
        newPartnerRequests: newPartnerRequests.length,
        newProperties: newProperties.length,
        totalNew
      }
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});