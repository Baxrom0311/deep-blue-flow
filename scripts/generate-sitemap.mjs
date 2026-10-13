import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { loadEnv } from 'vite';

const modeIndex = process.argv.indexOf('--mode');
const mode = modeIndex >= 0 ? process.argv[modeIndex + 1] : 'production';
const env = { ...loadEnv(mode, process.cwd(), ''), ...process.env };

const siteUrl = (env.VITE_SITE_URL || 'https://ecocompany.boos.uz').replace(/\/$/, '');
const apiUrl = (env.SITEMAP_API_URL || env.VITE_API_URL || `${siteUrl}/api/v1`).replace(/\/$/, '');
const publicDir = path.resolve(process.cwd(), 'public');

const staticRoutes = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/products', changefreq: 'daily', priority: '0.9' },
  { path: '/about', changefreq: 'monthly', priority: '0.8' },
  { path: '/certificates', changefreq: 'weekly', priority: '0.8' },
  { path: '/gallery', changefreq: 'weekly', priority: '0.8' },
  { path: '/contact', changefreq: 'monthly', priority: '0.7' },
];

const escapeXml = (value) => String(value)
  .replace(/&/g, '&amp;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&apos;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');

const unwrapData = (payload) => (payload && typeof payload === 'object' && 'data' in payload ? payload.data : payload);

const fetchJSON = async (endpoint) => {
  const base = `${apiUrl}/`;
  const url = new URL(endpoint.replace(/^\//, ''), base);
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) {
    throw new Error(`Failed ${url}: ${response.status}`);
  }

  return unwrapData(await response.json());
};

const fetchAllProducts = async () => {
  const products = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const data = await fetchJSON(`/products?page=${page}&per_page=100`);
    const items = Array.isArray(data) ? data : data?.items || [];
    totalPages = data?.total_pages || data?.pages || 1;
    products.push(...items);
    page += 1;
  }

  return products;
};

const buildUrlEntry = ({ path: routePath, lastmod, changefreq, priority, images = [] }) => {
  const lines = [
    '  <url>',
    `    <loc>${escapeXml(`${siteUrl}${routePath}`)}</loc>`,
  ];

  if (lastmod) lines.push(`    <lastmod>${escapeXml(lastmod)}</lastmod>`);
  if (changefreq) lines.push(`    <changefreq>${changefreq}</changefreq>`);
  if (priority) lines.push(`    <priority>${priority}</priority>`);
  for (const image of images) {
    if (!image?.loc) continue;
    lines.push('    <image:image>');
    lines.push(`      <image:loc>${escapeXml(image.loc)}</image:loc>`);
    if (image.title) lines.push(`      <image:title>${escapeXml(image.title)}</image:title>`);
    if (image.caption) lines.push(`      <image:caption>${escapeXml(image.caption)}</image:caption>`);
    lines.push('    </image:image>');
  }

  lines.push('  </url>');
  return lines.join('\n');
};

const generateSitemap = async () => {
  const today = new Date().toISOString().slice(0, 10);
  const entries = [...staticRoutes];
  let previousSitemap = null;

  try {
    const products = await fetchAllProducts();
    products.forEach((product) => {
      entries.push({
        path: `/products/${product.id}`,
        lastmod: product.updated_at ? String(product.updated_at).slice(0, 10) : today,
        changefreq: 'weekly',
        priority: '0.7',
        images: (product.images || [])
          .filter(Boolean)
          .map((image) => ({
            loc: image,
            title: product.name_uz || product.name_ru || product.name_en || 'Product',
            caption: product.desc_uz || product.desc_ru || product.desc_en || product.name_uz || 'Product image',
          })),
      });
    });
  } catch (error) {
    console.warn(`[sitemap] Product API unavailable: ${error.message}`);
    try {
      const existing = await readFile(path.join(publicDir, 'sitemap.xml'), 'utf8');
      const locations = [...existing.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
      if (existing.includes('</urlset>') && locations.length && locations.every((loc) => loc.startsWith(`${escapeXml(siteUrl)}/`))) {
        previousSitemap = existing;
      }
    } catch {
      // First build: there is no last-known sitemap to preserve.
    }
  }

  const xml = previousSitemap || [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
    ...entries.map(buildUrlEntry),
    '</urlset>',
    '',
  ].join('\n');

  const robots = [
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${siteUrl}/sitemap.xml`,
    '',
  ].join('\n');

  await mkdir(publicDir, { recursive: true });
  await writeFile(path.join(publicDir, 'sitemap.xml'), xml, 'utf8');
  await writeFile(path.join(publicDir, 'robots.txt'), robots, 'utf8');

  console.log(previousSitemap ? '[sitemap] Preserved previous sitemap' : `[sitemap] Generated ${entries.length} URLs`);
};

generateSitemap().catch((error) => {
  console.error('[sitemap] Generation failed', error);
  process.exitCode = 1;
});
