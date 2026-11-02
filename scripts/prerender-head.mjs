// Writes one HTML file per public route with route-specific <head> tags, so crawlers and
// link previews (Telegram, Facebook, Yandex) see the right title/description without running JS.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { loadEnv } from 'vite';

const modeIndex = process.argv.indexOf('--mode');
const mode = modeIndex >= 0 ? process.argv[modeIndex + 1] : 'production';
const env = { ...loadEnv(mode, process.cwd(), ''), ...process.env };

const siteUrl = (env.VITE_SITE_URL || 'https://ecocompany.uz').replace(/\/$/, '');
const apiUrl = (env.SITEMAP_API_URL || env.VITE_API_URL || `${siteUrl}/api/v1`).replace(/\/$/, '');
const distDir = path.resolve(process.cwd(), env.PRERENDER_DIST_DIR || 'dist');
const SITE_NAME = 'ECO COMPANY';
const LANGS = ['uz', 'ru', 'en'];
const DEFAULT_IMAGE = `${siteUrl}/images/about.jpg`;

const staticRoutes = [
  { path: '/', title: `Premium Tozalangan Suv | ${SITE_NAME}`, description: "ECO COMPANY — O'zbekistondagi premium tozalangan ichimlik suvi ishlab chiqaruvchisi. Zamonaviy texnologiyalar yordamida tozalangan, sifat sertifikatlangan suv." },
  { path: '/products', title: `Mahsulotlar | ${SITE_NAME}`, description: "ECO COMPANY mahsulotlari katalogi: premium tozalangan ichimlik suvi, suv filtrlari va suv tozalash uskunalari." },
  { path: '/about', title: `Kompaniya haqida | ${SITE_NAME}`, description: "ECO COMPANY haqida: sifatli suv — sog'lom hayot kafolati. Kompaniya tarixi, qadriyatlari va ishlab chiqarish jarayoni." },
  { path: '/certificates', title: `Sertifikatlar | ${SITE_NAME}`, description: "ECO COMPANY sertifikatlari va sifatni tasdiqlovchi hujjatlar ro'yxati." },
  { path: '/gallery', title: `Galereya | ${SITE_NAME}`, description: "ECO COMPANY galereyasi, o'rnatish jarayonlari va kompaniya faoliyatidan lavhalar." },
  { path: '/contact', title: `Biz bilan bog'laning | ${SITE_NAME}`, description: "ECO COMPANY bilan bog'lanish uchun telefon, email va manzil ma'lumotlari." },
];

const escapeHtml = (value) => String(value)
  .replace(/&/g, '&amp;')
  .replace(/"/g, '&quot;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');

export const cleanText = (value, maxLength = 160) => {
  const text = String(value || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return text.length <= maxLength ? text : `${text.slice(0, maxLength - 3).trimEnd()}...`;
};

const absoluteUrl = (value) => {
  try {
    return new URL(value, `${siteUrl}/`).toString();
  } catch {
    return DEFAULT_IMAGE;
  }
};

const urlForLang = (routePath, lang) => `${siteUrl}${routePath}${lang === 'uz' ? '' : `?lang=${lang}`}`;

const setMeta = (html, attr, key, content) => {
  const tag = `<meta ${attr}="${key}" content="${escapeHtml(content)}" />`;
  const pattern = new RegExp(`<meta\\s+${attr}="${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*>`, 's');
  return pattern.test(html) ? html.replace(pattern, tag) : html.replace('</head>', `  ${tag}\n</head>`);
};

export const renderHead = (template, { path: routePath, title, description, image = DEFAULT_IMAGE, type = 'website', jsonLd, noindex = false }) => {
  let html = template.replace(/<title>.*?<\/title>/s, `<title>${escapeHtml(title)}</title>`);
  html = setMeta(html, 'name', 'description', description);
  html = setMeta(html, 'name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');
  html = setMeta(html, 'property', 'og:title', title);
  html = setMeta(html, 'property', 'og:description', description);
  html = setMeta(html, 'property', 'og:type', type);
  html = setMeta(html, 'property', 'og:image', image);
  html = setMeta(html, 'name', 'twitter:title', title);
  html = setMeta(html, 'name', 'twitter:description', description);
  html = setMeta(html, 'name', 'twitter:image', image);

  html = html.replace(/\s*<link rel="canonical"[^>]*>/, '');
  html = html.replace(/\s*<meta property="og:url"[^>]*>/, '');
  if (routePath && !noindex) {
    const links = [
      `<link rel="canonical" href="${escapeHtml(urlForLang(routePath, 'uz'))}" />`,
      `<meta property="og:url" content="${escapeHtml(urlForLang(routePath, 'uz'))}" />`,
      ...LANGS.map((lang) => `<link rel="alternate" hreflang="${lang}" href="${escapeHtml(urlForLang(routePath, lang))}" />`),
      `<link rel="alternate" hreflang="x-default" href="${escapeHtml(urlForLang(routePath, 'uz'))}" />`,
    ];
    html = html.replace('</head>', `  ${links.join('\n  ')}\n</head>`);
  }
  if (jsonLd) {
    const json = JSON.stringify(jsonLd).replace(/</g, '\\u003c');
    html = html.replace('</head>', `  <script type="application/ld+json" id="seo-structured-data">${json}</script>\n</head>`);
  }
  return html;
};

const fetchJSON = async (endpoint) => {
  const response = await fetch(`${apiUrl}${endpoint}`, { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(10000) });
  if (!response.ok) throw new Error(`Failed ${endpoint}: ${response.status}`);
  const payload = await response.json();
  return payload && typeof payload === 'object' && 'data' in payload ? payload.data : payload;
};

const fetchAllProducts = async () => {
  const products = [];
  for (let page = 1, pages = 1; page <= pages; page += 1) {
    const data = await fetchJSON(`/products?page=${page}&per_page=100`);
    products.push(...(Array.isArray(data) ? data : data?.items || []));
    pages = data?.total_pages || data?.pages || 1;
  }
  return products;
};

const organizationJsonLd = (settings) => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: siteUrl,
  logo: absoluteUrl(settings.logo_url || '/favicon.svg'),
  email: settings.email || undefined,
  telephone: settings.phone_1 || undefined,
  address: settings.address_uz ? { '@type': 'PostalAddress', streetAddress: settings.address_uz, addressCountry: 'UZ' } : undefined,
  sameAs: [settings.instagram_url, settings.telegram_url, settings.facebook_url, settings.youtube_url].filter(Boolean),
});

const productRoute = (product) => {
  const name = product.name_uz || product.name_ru || product.name_en || 'Mahsulot';
  const image = absoluteUrl(product.images?.[0] || product.image_url || DEFAULT_IMAGE);
  const description = cleanText(product.desc_uz || product.description_uz || product.desc_ru || `${name} — ${SITE_NAME}`);
  return {
    path: `/products/${product.id}`,
    title: `${name} | ${SITE_NAME}`,
    description,
    image,
    type: 'product',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name,
      description,
      image: [image],
      sku: product.id,
      brand: { '@type': 'Brand', name: SITE_NAME },
    },
  };
};

const writeRoute = async (template, route) => {
  const file = route.path === '/' ? 'index.html' : `${route.path.slice(1)}.html`;
  const target = path.join(distDir, file);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, renderHead(template, route), 'utf8');
};

const prerender = async () => {
  const template = await readFile(path.join(distDir, 'index.html'), 'utf8');
  let settings = {};
  let products = [];
  try {
    settings = (await fetchJSON('/settings/public')) || {};
    if (Array.isArray(settings)) settings = Object.fromEntries(settings.map((item) => [item.key, item.value]));
  } catch (error) {
    console.warn(`[prerender] Settings API unavailable: ${error.message}`);
  }
  try {
    products = await fetchAllProducts();
  } catch (error) {
    console.warn(`[prerender] Product API unavailable: ${error.message}`);
  }

  // SPA fallback for routes without a prerendered file (e.g. products added after this build).
  await writeFile(path.join(distDir, 'spa-fallback.html'), renderHead(template, { ...staticRoutes[0], path: null }), 'utf8');
  await writeFile(path.join(distDir, '404.html'), renderHead(template, { title: `404 | ${SITE_NAME}`, description: 'Sahifa topilmadi.', noindex: true }), 'utf8');

  for (const route of staticRoutes) {
    await writeRoute(template, route.path === '/' ? { ...route, jsonLd: organizationJsonLd(settings) } : route);
  }
  for (const product of products) {
    await writeRoute(template, productRoute(product));
  }
  console.log(`[prerender] Wrote ${staticRoutes.length + products.length} pages`);
};

if (import.meta.url === `file://${process.argv[1]}`) {
  prerender().catch((error) => {
    console.error('[prerender] Failed', error);
    process.exitCode = 1;
  });
}
