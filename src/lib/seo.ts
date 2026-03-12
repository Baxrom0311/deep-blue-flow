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

export const pickPrimaryImage = (...candidates: Array<string | null | undefined | false>) => {
  const first = candidates.find((value) => typeof value === 'string' && value.trim().length > 0);
  return absoluteUrl(typeof first === 'string' ? first : DEFAULT_OG_IMAGE);
};

export const imageMimeType = (value?: string | null) => {
  const image = absoluteUrl(value);
  const path = image.split('?')[0].toLowerCase();
  if (path.endsWith('.png')) return 'image/png';
  if (path.endsWith('.webp')) return 'image/webp';
  if (path.endsWith('.gif')) return 'image/gif';
  if (path.endsWith('.svg')) return 'image/svg+xml';
  return 'image/jpeg';
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

const KEYWORD_SEPARATOR = /[\n,]+/;

export const parseKeywords = (value?: string | string[] | null) => {
  const rawValues = Array.isArray(value)
    ? value
    : (typeof value === 'string' ? value.split(KEYWORD_SEPARATOR) : []);

  return rawValues
    .map((item) => item.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
};

export const keywordPhrase = (...parts: Array<string | null | undefined | false>) => {
  const phrase = parts
    .map((part) => (typeof part === 'string' ? part.trim() : ''))
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  return phrase || null;
};

export const mergeKeywords = (...sources: Array<string | string[] | null | undefined | false>) => {
  const seen = new Set<string>();
  const keywords: string[] = [];

  sources.forEach((source) => {
    parseKeywords(source || undefined).forEach((keyword) => {
      const normalized = keyword.toLocaleLowerCase();
      if (!seen.has(normalized)) {
        seen.add(normalized);
        keywords.push(keyword);
      }
    });
  });

  return keywords.slice(0, 30);
};

export const defaultSeoKeywords = (lang: Lang) => {
  if (lang === 'ru') {
    return [
      'ECO COMPANY',
      'очищенная вода',
      'питьевая вода',
      'фильтры для воды',
      'оборудование для очистки воды',
    ];
  }

  if (lang === 'en') {
    return [
      'ECO COMPANY',
      'purified water',
      'drinking water',
      'water filters',
      'water treatment equipment',
    ];
  }

  return [
    'ECO COMPANY',
    'tozalangan suv',
    'ichimlik suvi',
    'suv filtrlari',
    'suv tozalash uskunalari',
  ];
};

const schemaKeywords = (keywords?: string[] | string | null) => {
  const normalized = parseKeywords(keywords || undefined);
  return normalized.length ? normalized.join(', ') : undefined;
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

export const buildWebsiteSchema = (keywords?: string[] | string) => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
  inLanguage: ['uz', 'ru', 'en'],
  keywords: schemaKeywords(keywords),
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}/products?search={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
});

export const buildOrganizationSchema = (settings: SiteSettings, lang: Lang, keywords?: string[] | string) => {
  const address = localizedField(settings, 'address', lang);
  const primaryImage = pickPrimaryImage(
    settings.hero_image_url as string | undefined,
    settings.logo_url as string | undefined,
    '/images/about.jpg',
  );
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
    image: primaryImage,
    description: sanitizeDescription(
      localizedField(settings, 'hero_subtitle', lang) || localizedField(settings, 'about_text', lang),
    ),
    keywords: schemaKeywords(keywords),
    brand: {
      '@type': 'Brand',
      name: SITE_NAME,
      logo: absoluteUrl((settings.logo_url as string | undefined) || '/favicon.svg'),
    },
    contactPoint: [
      settings.phone_1 ? {
        '@type': 'ContactPoint',
        telephone: settings.phone_1,
        contactType: 'customer support',
        availableLanguage: ['uz', 'ru', 'en'],
      } : null,
      settings.email ? {
        '@type': 'ContactPoint',
        email: settings.email,
        contactType: 'customer support',
        availableLanguage: ['uz', 'ru', 'en'],
      } : null,
    ].filter(Boolean),
    areaServed: {
      '@type': 'Country',
      name: 'Uzbekistan',
    },
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

export const buildLocalBusinessSchema = (settings: SiteSettings, lang: Lang, keywords?: string[] | string) => {
  const address = localizedField(settings, 'address', lang);
  const primaryImage = pickPrimaryImage(
    settings.hero_image_url as string | undefined,
    settings.logo_url as string | undefined,
    '/images/about.jpg',
  );

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: SITE_NAME,
    url: SITE_URL,
    image: primaryImage,
    keywords: schemaKeywords(keywords),
    telephone: settings.phone_1 || undefined,
    email: settings.email || undefined,
    sameAs: [
      settings.instagram_url,
      settings.telegram_url,
      settings.facebook_url,
      settings.youtube_url,
    ].filter(Boolean),
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

export const buildProductSchema = (product: Product, lang: Lang, keywords?: string[] | string) => {
  const name = localizedField(product, 'name', lang);
  const description = sanitizeDescription(
    localizedField(product, 'desc', lang) || localizedField(product, 'description', lang),
    `${name} - ${SITE_NAME}`,
    300,
  );
  const images = product.images?.length ? product.images : (product.image_url ? [product.image_url] : []);
  const price = priceToNumber(product.discount_price ?? product.original_price);
  const availability = product.is_active === false
    ? 'https://schema.org/OutOfStock'
    : 'https://schema.org/InStock';

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image: images.map((image) => absoluteUrl(image)),
    keywords: schemaKeywords(keywords),
    category: product.category ? localizedField(product.category, 'name', lang) : undefined,
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: SITE_NAME,
    },
    mainEntityOfPage: `${SITE_URL}/products/${product.id}`,
    offers: price ? {
      '@type': 'Offer',
      priceCurrency: 'UZS',
      price,
      availability,
      url: `${SITE_URL}/products/${product.id}`,
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: SITE_NAME,
      },
      priceValidUntil: product.discount_until || undefined,
    } : undefined,
  };
};

export const buildCollectionPageSchema = ({
  name,
  description,
  path,
  image,
  keywords,
  items,
}: {
  name: string;
  description: string;
  path: string;
  image?: string | null;
  keywords?: string[] | string | null;
  items: { name: string; path: string; image?: string | null; description?: string | null }[];
}) => ({
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name,
  description,
  url: `${SITE_URL}${path}`,
  image: image ? [absoluteUrl(image)] : undefined,
  keywords: schemaKeywords(keywords),
  mainEntity: {
    '@type': 'ItemList',
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: `${SITE_URL}${item.path}`,
      image: item.image ? absoluteUrl(item.image) : undefined,
      description: item.description ? sanitizeDescription(item.description, item.name, 220) : undefined,
    })),
  },
});

export const buildItemListSchema = ({
  name,
  path,
  items,
}: {
  name: string;
  path: string;
  items: { name: string; path: string; image?: string | null }[];
}) => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name,
  url: `${SITE_URL}${path}`,
  numberOfItems: items.length,
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    url: `${SITE_URL}${item.path}`,
    image: item.image ? absoluteUrl(item.image) : undefined,
  })),
});

export const buildSiteNavigationSchema = (items: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Site navigation',
  itemListElement: items.map((item, index) => ({
    '@type': 'SiteNavigationElement',
    position: index + 1,
    name: item.name,
    url: `${SITE_URL}${item.path}`,
  })),
});
