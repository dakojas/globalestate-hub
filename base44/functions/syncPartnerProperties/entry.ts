import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const VALID_COUNTRIES = ["Albania", "Bali", "Hungary", "Bulgaria", "Croatia", "Dominican Republic", "Egypt", "Georgia", "Mauritius", "Oman", "UAE", "Spain", "Italy", "Thailand", "Turkey"];
const VALID_TYPES = ["studio", "1_bedroom", "2_bedroom", "penthouse", "vila"];
const VALID_CURRENCIES = ["EUR", "USD", "GBP", "AED", "THB", "EGP", "IDR"];

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json().catch(() => ({}));
    const { partner_id } = body;

    let partners;
    if (partner_id) {
      const p = await base44.asServiceRole.entities.PartnerSource.get(partner_id);
      partners = [p];
    } else {
      partners = await base44.asServiceRole.entities.PartnerSource.filter({ is_active: true });
    }

    const results = [];

    for (const partner of partners) {
      try {
        // Check if due (skip when manual sync via partner_id)
        if (!partner_id && partner.frequency_days && partner.last_synced) {
          const lastSync = new Date(partner.last_synced);
          const dueDate = new Date(lastSync.getTime() + (partner.frequency_days || 7) * 86400000);
          if (new Date() < dueDate) {
            results.push({ partner: partner.name, skipped: 'not due yet' });
            continue;
          }
        }

        // Fetch listings page HTML
        const resp = await fetch(partner.website_url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'text/html,application/xhtml+xml',
            'Accept-Language': 'en-US,en;q=0.9,sk;q=0.8'
          },
          signal: AbortSignal.timeout(30000)
        });
        if (!resp.ok) throw new Error(`Failed to fetch page: ${resp.status}`);
        const html = await resp.text();
        const truncatedHtml = html.slice(0, 80000);

        // AI extraction of property listings
        const llmResult = await base44.asServiceRole.integrations.Core.InvokeLLM({
          prompt: `You are a real estate data extractor. Analyze the following HTML from the website "${partner.website_url}" (partner: ${partner.name}). Extract ALL property/project listings found on the page.

For each property extract:
- title: property title
- price: numeric price (0 if unknown)
- currency: one of ${VALID_CURRENCIES.join(', ')} (default EUR)
- country: one of ${VALID_COUNTRIES.join(', ')}${partner.default_country ? ` (default: ${partner.default_country})` : ''}
- city: city or area
- description: full description text
- property_type: one of ${VALID_TYPES.join(', ')} (default studio)
- bedrooms: number (0 if unknown)
- bathrooms: number (0 if unknown)
- area_sqm: number (0 if unknown)
- image_urls: array of FULL absolute image URLs found on the page for this property
- source_url: full URL of the property detail page if available, otherwise the listings page URL

Only include real property listings. Skip navigation, footer, and non-property content.
If image URLs are relative, convert them to absolute using the base URL.

HTML to analyze:
${truncatedHtml}`,
          response_json_schema: {
            type: "object",
            properties: {
              properties: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    price: { type: "number" },
                    currency: { type: "string" },
                    country: { type: "string" },
                    city: { type: "string" },
                    description: { type: "string" },
                    property_type: { type: "string" },
                    bedrooms: { type: "number" },
                    bathrooms: { type: "number" },
                    area_sqm: { type: "number" },
                    image_urls: { type: "array", items: { type: "string" } },
                    source_url: { type: "string" }
                  }
                }
              }
            }
          }
        });

        const extracted = llmResult.properties || [];
        let newCount = 0;
        let skippedCount = 0;

        for (const prop of extracted) {
          if (!prop.title || prop.title.length < 3) { skippedCount++; continue; }

          // Normalize fields
          const country = VALID_COUNTRIES.includes(prop.country) ? prop.country : (partner.default_country || "Turkey");
          const propertyType = VALID_TYPES.includes(prop.property_type) ? prop.property_type : "studio";
          const currency = VALID_CURRENCIES.includes(prop.currency) ? prop.currency : "EUR";

          // Dedup by title + developer
          const existing = await base44.asServiceRole.entities.Property.filter({ title: prop.title, developer: partner.name });
          if (existing.length > 0) { skippedCount++; continue; }

          // Also dedup by source_url if present
          if (prop.source_url) {
            const byUrl = await base44.asServiceRole.entities.Property.filter({ developer: partner.name });
            const dupByUrl = byUrl.find(p => p.portal_links && p.portal_links.some(pl => pl.url === prop.source_url));
            if (dupByUrl) { skippedCount++; continue; }
          }

          // Download images
          const uploadedImages = [];
          for (const imgUrl of (prop.image_urls || []).slice(0, 10)) {
            try {
              let fullUrl = imgUrl;
              if (fullUrl.startsWith('//')) fullUrl = 'https:' + fullUrl;
              else if (fullUrl.startsWith('/')) fullUrl = new URL(partner.website_url).origin + fullUrl;
              else if (!fullUrl.startsWith('http')) continue;

              const imgResp = await fetch(fullUrl, {
                headers: {
                  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                  'Referer': partner.website_url
                },
                signal: AbortSignal.timeout(20000)
              });
              if (!imgResp.ok) continue;
              const blob = await imgResp.blob();
              if (blob.size < 5000) continue;
              const rawName = fullUrl.split('/').pop()?.split('?')[0] || 'image.jpg';
              const filename = rawName.match(/\.(jpg|jpeg|png|webp|gif)$/i) ? rawName : rawName + '.jpg';
              const file = new File([blob], filename, { type: blob.type || 'image/jpeg' });
              const uploadResult = await base44.asServiceRole.integrations.Core.UploadFile({ file });
              uploadedImages.push(uploadResult.file_url);
            } catch (e) { /* skip failed image */ }
          }

          // Create property
          await base44.asServiceRole.entities.Property.create({
            title: prop.title,
            description: prop.description || '',
            description_en: prop.description || '',
            country,
            city: prop.city || '',
            price: prop.price || 0,
            currency,
            property_type: propertyType,
            bedrooms: prop.bedrooms || null,
            bathrooms: prop.bathrooms || null,
            area_sqm: prop.area_sqm || null,
            images: uploadedImages,
            developer: partner.name,
            project_name: partner.name,
            original_language: 'sk',
            owner_submitted: false,
            is_public: partner.auto_publish || false,
            approval_status: partner.auto_publish ? 'approved' : 'pending_review',
            portal_links: [{ portal_name: partner.name, url: prop.source_url || partner.website_url }]
          });
          newCount++;
        }

        // Update partner sync info
        await base44.asServiceRole.entities.PartnerSource.update(partner.id, {
          last_synced: new Date().toISOString(),
          last_result: `Nájdených ${extracted.length} | Nových ${newCount} | Preskočených ${skippedCount}`,
          last_sync_new: newCount,
          last_sync_total: extracted.length
        });

        results.push({ partner: partner.name, found: extracted.length, new: newCount, skipped: skippedCount });
      } catch (err) {
        // Update partner with error
        try {
          await base44.asServiceRole.entities.PartnerSource.update(partner.id, {
            last_synced: new Date().toISOString(),
            last_result: `Chyba: ${err.message}`
          });
        } catch (_) {}
        results.push({ partner: partner.name, error: err.message });
      }
    }

    return Response.json({ success: true, results });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});