// Generates one Open Graph image per built page. Titles and descriptions are
// read back out of the built HTML rather than re-derived, so the card always
// matches what the page actually says.
import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { chromium } from 'playwright';
import { ogSlug } from '../src/config/og-slug.mjs';

const DIST = 'dist';
const OUT = join(DIST, 'og');
const SKIP = new Set(['404']);

async function findPages(dir) {
  const pages = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'og' || entry.name === '_astro') continue;
      pages.push(...(await findPages(full)));
    } else if (entry.name === 'index.html' || entry.name === '404.html') {
      pages.push(full);
    }
  }
  return pages;
}

function extract(html) {
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '';
  const description = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '';
  return { title: decode(title), description: decode(description) };
}

const decode = (s) =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

const escapeHtml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// The card reuses the site's palette, type, and spine so a shared link is
// recognisably from the same place as the page it opens.
function template({ title, description, label }) {
  return `<!doctype html><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500&family=IBM+Plex+Sans+Condensed:wght@600&family=IBM+Plex+Sans:wght@400&display=swap">
<style>
  * { box-sizing: border-box; margin: 0; }
  body {
    width: 1200px; height: 630px; background: #fbfbfa; color: #16181c;
    font-family: 'IBM Plex Sans', system-ui, sans-serif;
    display: flex; flex-direction: column; justify-content: space-between;
    padding: 76px 84px; overflow: hidden;
  }
  .top { display: flex; align-items: center; gap: 20px; }
  .plate { width: 56px; height: 56px; background: #16181c; color: #fbfbfa;
    font-family: 'IBM Plex Sans Condensed', sans-serif; font-weight: 600;
    font-size: 30px; display: flex; align-items: center; justify-content: center;
    letter-spacing: -0.02em; }
  .label { font-family: 'IBM Plex Mono', monospace; font-weight: 500;
    font-size: 17px; letter-spacing: 0.16em; text-transform: uppercase; color: #8b9099; }
  .body { display: flex; gap: 34px; align-items: flex-start; }
  .spine { width: 11px; flex: none; padding-top: 26px; display: flex;
    flex-direction: column; align-items: center; gap: 0; align-self: stretch; }
  .node { width: 11px; height: 11px; background: #2e38c9; flex: none; }
  .rail { width: 1px; flex: 1; background: #dededa; }
  h1 { font-family: 'IBM Plex Sans Condensed', sans-serif; font-weight: 600;
    font-size: 84px; line-height: 1.03; letter-spacing: -0.02em; max-width: 17ch; }
  p { font-size: 29px; line-height: 1.45; color: #5c6169; max-width: 30ch; margin-top: 26px;
    display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 4; overflow: hidden; }
  h1 { -webkit-line-clamp: 3; display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden; }
  .body { overflow: hidden; min-height: 0; }
  .foot { flex: none; display: flex; justify-content: space-between; align-items: baseline;
    font-family: 'IBM Plex Mono', monospace; font-size: 19px; color: #8b9099;
    border-top: 1px solid #dededa; padding-top: 24px; }
</style>
<div class="top">
  <div class="plate">MT</div>
  <div class="label">${escapeHtml(label)}</div>
</div>
<div class="body">
  <div class="spine"><div class="node"></div><div class="rail"></div></div>
  <div>
    <h1>${escapeHtml(title)}</h1>
    ${description ? `<p>${escapeHtml(description)}</p>` : ''}
  </div>
</div>
<div class="foot"><span>matthewtowles.com</span><span>Matthew Towles</span></div>`;
}

// Titles carry a suffix for search results that would waste space on a card.
function cardTitle(title) {
  return title
    .replace(/, a project by Matthew Towles$/, '')
    .replace(/^Resume, /, '')
    .replace(/, software engineer$/, '');
}

function cardLabel(slug) {
  if (slug === 'index') return 'Portfolio';
  if (slug === 'resume') return 'Resume';
  if (slug.startsWith('projects-')) return 'Project';
  return 'matthewtowles.com';
}

const pages = await findPages(DIST);
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch(
  process.env.MERMAID_CHROME_CHANNEL ? { channel: process.env.MERMAID_CHROME_CHANNEL } : {},
);
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });

let count = 0;
for (const file of pages) {
  const rel = relative(DIST, file);
  const pathname = '/' + rel.replace(/index\.html$/, '').replace(/404\.html$/, '404');
  const slug = ogSlug(pathname);
  if (SKIP.has(slug)) continue;

  const html = await readFile(file, 'utf8');
  const { title, description } = extract(html);

  await page.setContent(
    template({ title: cardTitle(title), description, label: cardLabel(slug) }),
    { waitUntil: 'networkidle' },
  );
  await page.evaluate(() => document.fonts.ready);
  const png = await page.screenshot({ type: 'png' });
  await writeFile(join(OUT, `${slug}.png`), png);
  count += 1;
}

await browser.close();
console.log(`og: wrote ${count} images to ${OUT}`);
