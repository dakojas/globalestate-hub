import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const VALID_COUNTRIES = ["Albania", "Bali", "Hungary", "Bulgaria", "Croatia", "Dominican Republic", "Egypt", "Georgia", "Mauritius", "Oman", "UAE", "Spain", "Italy", "Thailand", "Turkey"];
const VALID_TYPES = ["studio", "1_bedroom", "2_bedroom", "penthouse", "vila"];
const VALID_CURRENCIES = ["EUR", "USD", "GBP", "AED", "THB", "EGP", "IDR"];

// Strip partner contact info from descriptions — clients should only contact us
const CONTACT_PATTERNS = [
  /Kontakt:\s*[+\d\s\-()]+/gi,
  /Mail:\s*\S+@\S+/gi,
  /Email:\s*\S+@\S+/gi,
  /Tel[.ífonsá]*:\s*[+\d\s\-()]+/gi,
  /Telefón:\s*[+\d\s\-()]+/gi,
  /Telefon:\s*[+\d\s\-()]+/gi,
  /info@bytybudapest\.sk/gi,
  /\+421\s*\d{3}\s*\d{3}\s*\d{3}/g,
];
function stripContactInfo(text) {
  if (!text) return text;
  let cleaned = text;
  for (const p of CONTACT_PATTERNS) {
    cleaned = cleaned.replace(p, '');
  }
  return cleaned.replace(/\n\s*\n\s*\n+/g, '\n\n').trim();
}

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
        // Skip manual-mode partners during automatic scheduled scans
        if (!partner_id && partner.sync_mode === 'manual') {
          results.push({ partner: partner.name, skipped: 'manual mode — scan on demand only' });
          continue;
        }

        // Check if due (skip when manual sync via partner_id)
        if (!partner_id && partner.frequency_days && partner.last_synced) {
          const lastSync = new Date(partner.last_synced);
          const dueDate = new Date(lastSync.getTime() + (partner.frequency_days || 7) * 86400000);
          if (new Date() < dueDate) {
            results.push({ partner: partner.name, skipped: 'not due yet' });
            continue;
          }
        }

        // Normalize URL — prepend https:// if missing
        let fetchUrl = partner.website_url;
        if (!fetchUrl.startsWith('http://') && !fetchUrl.startsWith('https://')) {
          fetchUrl = 'https://' + fetchUrl;
        }

        // Fetch listings page HTML
        const resp = await fetch(fetchUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'text/html,application/xhtml+xml',
            'Accept-Language': 'en-US,en;q=0.9,sk;q=0.8'
          },
          signal: AbortSignal.timeout(30000),
          redirect: 'follow'
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
        const maxProps = partner.max_properties_per_scan || 0;

        const baseUrl = new URL(fetchUrl);

        for (const prop of extracted) {
          if (maxProps > 0 && newCount >= maxProps) { skippedCount = extracted.length - newCount; break; }
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

          // --- Fetch property detail page for richer description + more photos ---
          let fullDescription = prop.description || '';
          let allImageUrls = [...(prop.image_urls || [])];

          if (prop.source_url && prop.source_url !== partner.website_url) {
            try {
              let detailUrl = prop.source_url;
              if (detailUrl.startsWith('//')) detailUrl = 'https:' + detailUrl;
              else if (detailUrl.startsWith('/')) detailUrl = baseUrl.origin + detailUrl;
              else if (!detailUrl.startsWith('http')) detailUrl = baseUrl.origin + '/' + detailUrl;

              const detailResp = await fetch(detailUrl, {
                headers: {
                  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                  'Accept': 'text/html,application/xhtml+xml',
                  'Accept-Language': 'en-US,en;q=0.9,sk;q=0.8'
                },
                signal: AbortSignal.timeout(20000),
                redirect: 'follow'
              });
              if (detailResp.ok) {
                const detailHtml = await detailResp.text();
                const truncatedDetail = detailHtml.slice(0, 100000);

                // AI: extract full description + all images from detail page
                const detailResult = await base44.asServiceRole.integrations.Core.InvokeLLM({
                  prompt: `You are a real estate data extractor. Analyze the following HTML from a property detail page at "${detailUrl}".
Extract:
- description: the FULL and DETAILED property description text (all paragraphs, features, amenities, location info — everything descriptive). Do NOT truncate. If the page has a long description, include it all.
- image_urls: array of ALL image URLs found on the page that are property photos (gallery, slider, floor plans). Include as many as you can find. Convert relative URLs to absolute using base "${baseUrl.origin}".
- bedrooms, bathrooms, area_sqm if found on the detail page (more accurate than listing page)

HTML to analyze:
${truncatedDetail}`,
                  response_json_schema: {
                    type: "object",
                    properties: {
                      description: { type: "string" },
                      image_urls: { type: "array", items: { type: "string" } },
                      bedrooms: { type: "number" },
                      bathrooms: { type: "number" },
                      area_sqm: { type: "number" }
                    }
                  }
                });

                if (detailResult.description && detailResult.description.length > (fullDescription?.length || 0)) {
                  fullDescription = detailResult.description;
                }
                if (detailResult.image_urls && detailResult.image_urls.length > 0) {
                  // Merge + dedup
                  const merged = [...allImageUrls, ...detailResult.image_urls];
                  allImageUrls = [...new Set(merged)];
                }
                if (detailResult.bedrooms) prop.bedrooms = detailResult.bedrooms;
                if (detailResult.bathrooms) prop.bathrooms = detailResult.bathrooms;
                if (detailResult.area_sqm) prop.area_sqm = detailResult.area_sqm;
              }
            } catch (e) { /* detail page failed, continue with listing data */ }
          }

          // Download images
          const uploadedImages = [];
          for (const imgUrl of allImageUrls.slice(0, 20)) {
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

          // Strip partner contact info before saving
          fullDescription = stripContactInfo(fullDescription);

          // Create property
          await base44.asServiceRole.entities.Property.create({
            title: prop.title,
            description: fullDescription,
            description_en: fullDescription,
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
            is_public: false,
            approval_status: 'pending_review',
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