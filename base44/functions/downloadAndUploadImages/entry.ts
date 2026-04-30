import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { imageUrls, propertyId } = await req.json();

    const uploadedUrls = [];

    for (const url of imageUrls) {
      const response = await fetch(url, {
        headers: {
          'Referer': 'https://kaletazadar.com/',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        }
      });

      if (!response.ok) {
        uploadedUrls.push(null);
        continue;
      }

      const blob = await response.blob();
      const filename = url.split('/').pop();
      const file = new File([blob], filename, { type: blob.type || 'image/jpeg' });

      const result = await base44.asServiceRole.integrations.Core.UploadFile({ file });
      uploadedUrls.push(result.file_url);
    }

    const validUrls = uploadedUrls.filter(Boolean);

    if (propertyId && validUrls.length > 0) {
      await base44.asServiceRole.entities.Property.update(propertyId, { images: validUrls });
    }

    return Response.json({ success: true, uploadedUrls: validUrls });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});