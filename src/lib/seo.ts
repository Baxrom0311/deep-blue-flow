import { localizedField, type Lang } from '@/lib/i18n';
import type { Product, SiteSettings } from '@/types';

export const SITE_NAME = 'ECO COMPANY';
export const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://ecocompany.boos.uz').replace(/\/$/, '');
export const DEFAULT_OG_IMAGE = `${SITE_URL}/images/about.jpg`;
export const DEFAULT_DESCRIPTION = "ECO COMPANY - O'zbekistondagi premium tozalangan suv ishlab chiqaruvchisi.";

export const absoluteUrl = (value?: string | null) => {
  if (!value) return DEFAULT_OG_IMAGE;
  try {
    return new URL(value, `${SITE_URL}/`).toString();
  } catch {
    return DEFAULT_OG_IMAGE;
  }
};

export const localeForLang = (lang: Lang) => {
  if (lang === 'ru') return 'ru_RU';
  if (lang === 'en') return 'en_US';
  return 'uz_UZ';
};

export const sanitizeDescription = (value?: string | null, fallback = DEFAULT_DESCRIPTION, maxLength = 160) => {
  const clean = String(value || fallback)
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!clean) return fallback;
  if (clean.length <= maxLength) return clean;
  return `${clean.slice(0, maxLength - 1).trimEnd()}...`;
};

export const buildBreadcrumbSchema = (items: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: `${SITE_URL}${item.path}`,
  })),
});

export const buildWebsiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}/products?search={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
});

export const buildOrganizationSchema = (settings: SiteSettings, lang: Lang) => {
  const address = localizedField(settings, 'address', lang);
  const sameAs = [
    settings.instagram_url,
    settings.telegram_url,
    settings.facebook_url,
    settings.youtube_url,
  ]
    .filter(Boolean)
    .map(String);

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl((settings.logo_url as string | undefined) || '/favicon.svg'),
    image: DEFAULT_OG_IMAGE,
    description: sanitizeDescription(
      localizedField(settings, 'hero_subtitle', lang) || localizedField(settings, 'about_text', lang),
    ),
    sameAs: sameAs.length ? sameAs : undefined,
    email: settings.email || undefined,
    telephone: settings.phone_1 || undefined,
    address: address ? {
      '@type': 'PostalAddress',
      streetAddress: address,
      addressCountry: 'UZ',
    } : undefined,
  };
};

export const buildLocalBusinessSchema = (settings: SiteSettings, lang: Lang) => {
  const address = localizedField(settings, 'address', lang);

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: SITE_NAME,
    url: SITE_URL,
    image: DEFAULT_OG_IMAGE,
    telephone: settings.phone_1 || undefined,
    email: settings.email || undefined,
    address: address ? {
      '@type': 'PostalAddress',
      streetAddress: address,
      addressCountry: 'UZ',
    } : undefined,
    openingHours: settings.working_hours || undefined,
  };
};

const priceToNumber = (value?: string | number | null) => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const normalized = Number(value);
    if (Number.isFinite(normalized)) return normalized;
  }
  return undefined;
};

export const buildProductSchema = (product: Product, lang: Lang) => {
  const name = localizedField(product, 'name', lang);
  const description = sanitizeDescription(
    localizedField(product, 'desc', lang) || localizedField(product, 'description', lang),
    `${name} - ${SITE_NAME}`,
    300,
  );
  const images = product.images?.length ? product.images : (product.image_url ? [product.image_url] : []);
  const price = priceToNumber(product.discount_price ?? product.original_price);

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image: images.map((image) => absoluteUrl(image)),
    category: product.category ? localizedField(product.category, 'name', lang) : undefined,
    sku: product.id,
    offers: price ? {
      '@type': 'Offer',
      priceCurrency: 'UZS',
      price,
      availability: 'https://schema.org/InStock',
      url: `${SITE_URL}/products/${product.id}`,
    } : undefined,
  };
};

export const buildCollectionPageSchema = ({
  name,
  description,
  path,
  items,
}: {
  name: string;
  description: string;
  path: string;
  items: { name: string; path: string }[];
}) => ({
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name,
  description,
  url: `${SITE_URL}${path}`,
  mainEntity: {
    '@type': 'ItemList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: `${SITE_URL}${item.path}`,
    })),
  },
});
