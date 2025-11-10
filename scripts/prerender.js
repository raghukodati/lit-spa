// Simple Lit SSR pre-render to static HTML files
// Renders Home and About routes using service-provided templates
import {writeFile, mkdir} from 'node:fs/promises';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {html} from 'lit';
import {renderToString} from '@lit-labs/ssr';
import {getHomeTemplate, getAboutTemplate} from '../src/services/dataService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function layout({title, body}) {
  return html`<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
  </head>
  <body>
    <header style="display:flex;align-items:center;justify-content:space-between;padding:1rem 1.25rem;background:#fff;border-bottom:1px solid #e5e7eb;position:sticky;top:0;z-index:10;">
      <div>Lit SPA</div>
      <nav>
        <a style="margin-right:1rem;color:#374151;text-decoration:none;" href="/">Home</a>
        <a style="margin-right:1rem;color:#374151;text-decoration:none;" href="/about">About</a>
      </nav>
    </header>
    <main style="padding:1.25rem;max-width:960px;margin:0 auto;">
      ${body}
    </main>
    <footer style="color:#6b7280;font-size:.875rem;text-align:center;padding:2rem 1rem;">
      <div>Built with Lit and Vite</div>
    </footer>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>`;
}

async function ensureDir(path) {
  await mkdir(path, {recursive: true});
}

async function renderRoute(outPath, title, content) {
  const fullHtml = await renderToString(layout({title, body: content}));
  await ensureDir(dirname(outPath));
  await writeFile(outPath, fullHtml, 'utf-8');
  console.log(`Wrote ${outPath}`);
}

async function main() {
  const dist = join(__dirname, '..', 'dist-ssr');
  await renderRoute(join(dist, 'index.html'), 'Home • Lit SPA', await getHomeTemplate());
  await renderRoute(join(dist, 'about', 'index.html'), 'About • Lit SPA', await getAboutTemplate());
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
