import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import { relative } from 'node:path';

const output = new URL('../dist/client/', import.meta.url);
const origin = 'https://adhesivospegalo.com.ar';
const productRoot = new URL('productos/', output);
const products = (await readdir(productRoot, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

const paths = ['/', ...products.map((slug) => `/productos/${slug}/`)];
await writeFile(new URL('robots.txt', output),
  `User-agent: *\nAllow: /\nDisallow: /admin\nSitemap: ${origin}/sitemap.xml\n`);
await writeFile(new URL('sitemap.xml', output),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map((path) => `  <url><loc>${origin}${path}</loc></url>`).join('\n')}\n</urlset>\n`);

async function* files(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = new URL(entry.name + (entry.isDirectory() ? '/' : ''), directory);
    if (entry.isDirectory()) yield* files(path);
    else if (entry.name.endsWith('.html')) yield path;
  }
}

let removedPreloads = 0;
for await (const file of files(output)) {
  let html = await readFile(file, 'utf8');
  const original = html;
  for (const tag of html.matchAll(/<link\b[^>]*\brel="modulepreload"[^>]*>/g)) {
    const href = tag[0].match(/\bhref="([^"]+)"/)?.[1];
    if (!href?.startsWith('/')) continue;
    const asset = new URL(`.${href}`, output);
    try { await stat(asset); }
    catch (error) {
      if (error.code !== 'ENOENT') throw error;
      html = html.replace(tag[0], '');
      removedPreloads++;
    }
  }
  if (html !== original) await writeFile(file, html);
  for (const match of html.matchAll(/<(?:script|link)\b[^>]*\b(?:src|href)="(\/_next\/[^"?#]+)[^"]*"/g)) {
    const asset = new URL(`.${match[1]}`, output);
    try { await stat(asset); }
    catch (error) {
      if (error.code !== 'ENOENT') throw error;
      throw new Error(`Recurso faltante en ${relative(output.pathname, file.pathname)}: ${match[1]}`);
    }
  }
}

console.log(`Sitio estático listo: ${paths.length} URL en sitemap; ${removedPreloads} precargas inexistentes eliminadas.`);
