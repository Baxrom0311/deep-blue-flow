import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderHead, cleanText } from './prerender-head.mjs';

const template = `<html><head>
  <title>Old</title>
  <meta name="robots" content="index, follow" />
  <meta name="description"
    content="old" />
  <meta property="og:url" content="https://ecocompany.uz/" />
  <link rel="canonical" href="https://ecocompany.uz/" />
</head><body></body></html>`;

test('renders route-specific head tags with hreflang alternates', () => {
  const html = renderHead(template, { path: '/about', title: 'About "Eco" <x>', description: 'Desc' });
  assert.match(html, /<title>About &quot;Eco&quot; &lt;x&gt;<\/title>/);
  assert.match(html, /<meta name="description" content="Desc" \/>/);
  assert.equal((html.match(/rel="canonical"/g) || []).length, 1);
  assert.match(html, /<link rel="canonical" href="https:\/\/ecocompany.uz\/about" \/>/);
  assert.match(html, /hreflang="ru" href="https:\/\/ecocompany.uz\/about\?lang=ru"/);
  assert.match(html, /hreflang="x-default" href="https:\/\/ecocompany.uz\/about"/);
  assert.doesNotMatch(html, /content="old"/);
});

test('noindex pages drop canonical and alternates', () => {
  const html = renderHead(template, { title: '404', description: 'x', noindex: true });
  assert.match(html, /<meta name="robots" content="noindex, nofollow" \/>/);
  assert.doesNotMatch(html, /rel="canonical"|hreflang/);
});

test('json-ld cannot break out of the script tag', () => {
  const html = renderHead(template, { path: '/', title: 't', description: 'd', jsonLd: { name: '</script><b>' } });
  assert.doesNotMatch(html, /<\/script><b>/);
});

test('cleanText strips tags and truncates', () => {
  assert.equal(cleanText('<p>a   b</p>'), 'a b');
  assert.ok(cleanText('x'.repeat(200)).length <= 160);
});
