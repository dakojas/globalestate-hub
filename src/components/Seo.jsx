import React, { useEffect } from "react";

/**
 * Reusable SEO component for dynamic meta tags and JSON-LD structured data.
 * Injects/updates meta tags and structured data scripts, cleans up on unmount.
 */
export default function Seo({
  title,
  description,
  image,
  url,
  type = "website",
  canonical,
  jsonLd,
  lang,
}) {
  useEffect(() => {
    if (title) document.title = title;

    const setMeta = (selector, attr, key, content) => {
      if (!content) return;
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("property", "property", "og:title", title);
    setMeta("property", "property", "og:description", description);
    setMeta("property", "property", "og:image", image);
    setMeta("property", "property", "og:url", url || canonical);
    setMeta("property", "property", "og:type", type);
    setMeta("name", "name", "twitter:card", "summary_large_image");
    setMeta("name", "name", "twitter:title", title);
    setMeta("name", "name", "twitter:description", description);
    setMeta("name", "name", "twitter:image", image);

    // Canonical link
    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      link.setAttribute("href", canonical);
    }

    // JSON-LD structured data
    let scriptEl = null;
    if (jsonLd) {
      scriptEl = document.createElement("script");
      scriptEl.setAttribute("type", "application/ld+json");
      scriptEl.setAttribute("data-seo-jsonld", "true");
      scriptEl.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(scriptEl);
    }

    return () => {
      if (scriptEl) scriptEl.remove();
    };
  }, [title, description, image, url, type, canonical, JSON.stringify(jsonLd)]);

  return null;
}