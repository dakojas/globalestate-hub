import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const baseUrl = 'https://nvz.info';

    // Fetch all public properties for sitemap URLs
    const properties = await base44.asServiceRole.entities.Property.filter(
      { is_public: true, approval_status: 'approved' },
      '-updated_date',
      500
    );

    const slugify = (text) =>
      (text || '')
        .toLowerCase()
        .replace(/[áàäâ]/g, 'a').replace(/[éèëê]/g, 'e').replace(/[íìïî]/g, 'i')
        .replace(/[óòöôõ]/g, 'o').replace(/[úùüû]/g, 'u').replace(/[ýÿ]/g, 'y')
        .replace(/[čć]/g, 'c').replace(/š/g, 's').replace(/ž/g, 'z').replace(/ň/g, 'n')
        .replace(/ľĺ/g, 'l').replace(/ř/g, 'r').replace(/ď/g, 'd').replace(/ť/g, 't')
        .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    const staticPages = [
      { path: '', priority: '1.0', changefreq: 'daily' },
      { path: 'PublicAbout', priority: '0.7', changefreq: 'monthly' },
      { path: 'PublicFAQ', priority: '0.6', changefreq: 'monthly' },
      { path: 'PublicSubmit', priority: '0.6', changefreq: 'monthly' },
    ];

    let urls = '';

    // Static pages
    for (const page of staticPages) {
      urls += `
  <url>
    <loc>${baseUrl}/${page.path}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
    }

    // Property pages
    for (const prop of properties) {
      const slug = prop.slug || (slugify(prop.title) + '-' + prop.id.slice(-6));
      const lastmod = prop.updated_date ? new Date(prop.updated_date).toISOString() : '';
      urls += `
  <url>
    <loc>${baseUrl}/nehnutelnost/${slug}</loc>
    ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`;

    return new Response(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});