import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const now = new Date();
    const inTwoDays = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);

    // Start of "2 days from now" day and end of that day
    const dayStart = new Date(inTwoDays);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(inTwoDays);
    dayEnd.setHours(23, 59, 59, 999);

    // Fetch pending reminders of type viewing or contract_renewal
    const reminders = await base44.asServiceRole.entities.Reminder.filter({
      status: 'pending',
      type: { $in: ['viewing', 'contract_renewal'] }
    }, '-due_date', 500);

    // Filter to those due in 2 days
    const dueReminders = reminders.filter(r => {
      if (!r.due_date) return false;
      const d = new Date(r.due_date);
      return d >= dayStart && d <= dayEnd;
    });

    if (dueReminders.length === 0) {
      return Response.json({ message: 'No reminders due in 2 days', sent: 0 });
    }

    // Collect unique agent emails
    const agentEmails = [...new Set(dueReminders.map(r => r.assigned_to).filter(Boolean))];

    // Fetch users to get full names
    const users = await base44.asServiceRole.entities.User.list();
    const userMap = {};
    users.forEach(u => { if (u.email) userMap[u.email.toLowerCase()] = u; });

    // Fetch related clients and properties for context
    const clientIds = [...new Set(dueReminders.map(r => r.client_id).filter(Boolean))];
    const propertyIds = [...new Set(dueReminders.map(r => r.property_id).filter(Boolean))];

    let clients = [];
    let properties = [];
    if (clientIds.length) {
      clients = await base44.asServiceRole.entities.Client.filter({ id: { $in: clientIds } });
    }
    if (propertyIds.length) {
      properties = await base44.asServiceRole.entities.Property.filter({ id: { $in: propertyIds } });
    }

    const clientMap = {};
    clients.forEach(c => { clientMap[c.id] = c; });
    const propertyMap = {};
    properties.forEach(p => { propertyMap[p.id] = p; });

    const typeLabels = {
      viewing: 'Obhliadka',
      contract_renewal: 'Predĺženie zmluvy'
    };

    let sent = 0;
    const errors = [];

    // Group reminders by agent and send one email per agent
    for (const email of agentEmails) {
      const agentReminders = dueReminders.filter(r => r.assigned_to === email);
      const agentUser = userMap[email.toLowerCase()];
      const agentName = agentUser?.full_name || 'Agent';

      const rows = agentReminders.map(r => {
        const client = r.client_id ? clientMap[r.client_id] : null;
        const property = r.property_id ? propertyMap[r.property_id] : null;
        const due = new Date(r.due_date).toLocaleString('sk-SK', { dateStyle: 'full', timeStyle: 'short' });
        let details = '';
        if (client) details += `\n  Klient: ${client.full_name || '-'}${client.phone ? ' (' + client.phone + ')' : ''}`;
        if (property) details += `\n  Nehnuteľnosť: ${property.title || '-'}${property.address ? ', ' + property.address : ''}`;
        if (r.description) details += `\n  Poznámka: ${r.description}`;
        return `• ${typeLabels[r.type] || r.type}: ${r.title}\n  Termín: ${due}${details}`;
      }).join('\n\n');

      const subject = `Pripomienka: ${agentReminders.length}x termín o 2 dni (${inTwoDays.toLocaleDateString('sk-SK')})`;
      const body = `Dobrý deň ${agentName},\n\nToto je automatické pripomenutie – nasledujúce termíny sú naplánované o 2 dni:\n\n${rows}\n\nProsím, pripravte sa včas.\n\nS pozdravom\nVáš systém`;

      try {
        await base44.asServiceRole.integrations.Core.SendEmail({
          to: email,
          subject,
          body
        });
        sent++;
      } catch (e) {
        errors.push({ email, error: e.message });
      }
    }

    return Response.json({ sent, total: dueReminders.length, errors });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});