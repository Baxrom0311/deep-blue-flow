import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const run = promisify(execFile);
const script = fileURLToPath(new URL('./generate-sitemap.mjs', import.meta.url));

test('loads production env, paginates and preserves the sitemap on API failure', async () => {
  const cwd = await mkdtemp(path.join(tmpdir(), 'eco-sitemap-'));
  let unavailable = false;
  const pages = [];
  const server = createServer((req, res) => {
    if (unavailable) { res.writeHead(503); res.end(); return; }
    const page = Number(new URL(req.url, 'http://localhost').searchParams.get('page'));
    pages.push(page);
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: true, data: { pages: 2, items: [{ id: `product-${page}`, name_uz: 'Water & Eco', images: ['https://media.example.com/water.png'] }] } }));
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  try {
    await writeFile(path.join(cwd, '.env.production'), `VITE_SITE_URL=https://site.example.com\nVITE_API_URL=http://127.0.0.1:${server.address().port}/api/v1\n`);
    const env = Object.fromEntries(Object.entries(process.env).filter(([key]) => !key.startsWith('VITE_') && !key.startsWith('SITEMAP_')));
    await run(process.execPath, [script], { cwd, env });
    const sitemap = await readFile(path.join(cwd, 'public/sitemap.xml'), 'utf8');
    assert.deepEqual(pages, [1, 2]);
    assert.ok(sitemap.includes('https://site.example.com/products/product-2'));
    assert.ok(sitemap.includes('Water &amp; Eco'));
    unavailable = true;
    const result = await run(process.execPath, [script], { cwd, env });
    assert.ok(result.stdout.includes('Preserved previous sitemap'));
    assert.equal(await readFile(path.join(cwd, 'public/sitemap.xml'), 'utf8'), sitemap);
  } finally {
    await new Promise(resolve => server.close(resolve));
    await rm(cwd, { recursive: true, force: true });
  }
});
