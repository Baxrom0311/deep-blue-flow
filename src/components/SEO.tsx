import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { DEFAULT_DESCRIPTION, DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL, absoluteUrl, localeForLang, type Lang } from '@/lib/seo';

type StructuredData = Record<string, unknown> | Array<Record<string, unknown>>;

interface SEOProps {
  title: string;
  description?: string;
  image?: string;
  type?: string;
  canonicalPath?: string;
  noindex?: boolean;
  lang?: Lang;
  structuredData?: StructuredData;
}

const upsertMeta = (selector: string, attributes: Record<string, string>) => {
  let tag = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement('meta');
    document.head.appendChild(tag);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    tag?.setAttribute(key, value);
  });
};

const upsertLink = (selector: string, attributes: Record<string, string>) => {
  let tag = document.head.querySelector(selector) as HTMLLinkElement | null;
  if (!tag) {
    tag = document.createElement('link');
    document.head.appendChild(tag);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    tag?.setAttribute(key, value);
  });
};

const SEO = ({
  title,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_OG_IMAGE,
  type = 'website',
  canonicalPath,
  noindex = false,
  lang = 'uz',
  structuredData,
}: SEOProps) => {
  const location = useLocation();

  useEffect(() => {
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
    const canonicalUrl = `${SITE_URL}${canonicalPath || location.pathname}`;
    const ogImage = absoluteUrl(image);
    const robots = noindex ? 'noindex, nofollow' : 'index, follow';
    const verification = import.meta.env.VITE_GOOGLE_SITE_VERIFICATION;

    document.title = fullTitle;
    document.documentElement.lang = lang;

    upsertMeta('meta[name="description"]', { name: 'description', content: description });
    upsertMeta('meta[name="robots"]', { name: 'robots', content: robots });
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: fullTitle });
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description });
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: type });
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonicalUrl });
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: ogImage });
    upsertMeta('meta[property="og:image:alt"]', { property: 'og:image:alt', content: fullTitle });
    upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: SITE_NAME });
    upsertMeta('meta[property="og:locale"]', { property: 'og:locale', content: localeForLang(lang) });
    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: fullTitle });
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description });
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: ogImage });
    upsertMeta('meta[name="twitter:image:alt"]', { name: 'twitter:image:alt', content: fullTitle });
    upsertLink('link[rel="canonical"]', { rel: 'canonical', href: canonicalUrl });

    if (verification) {
      upsertMeta('meta[name="google-site-verification"]', {
        name: 'google-site-verification',
        content: verification,
      });
    }

    const existingJsonLd = document.head.querySelector('#seo-structured-data');
    if (existingJsonLd) existingJsonLd.remove();

    if (structuredData) {
      const script = document.createElement('script');
      script.id = 'seo-structured-data';
      script.type = 'application/ld+json';
      script.text = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }

    return () => {
      const script = document.head.querySelector('#seo-structured-data');
      if (script) script.remove();
    };
  }, [canonicalPath, description, image, lang, location.pathname, noindex, structuredData, title, type]);

  return null;
};

export default SEO;
