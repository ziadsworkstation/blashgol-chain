// Renderiza un modelo JSON a PNG (y opcionalmente STL) usando el mismo index.html.
// Uso: node tools/render.mjs models/ejemplo.json salida.png [iso|top|front|right] [--stl salida.stl]
import {createRequire} from 'node:module';
import {readFileSync, writeFileSync} from 'node:fs';
import {resolve, dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
// CommonJS require respeta NODE_PATH, donde suele estar Playwright instalado globalmente.
const {chromium} = createRequire(import.meta.url)('playwright');
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const stlIdx = args.indexOf('--stl'); const stlOut = stlIdx >= 0 ? args.splice(stlIdx, 2)[1] : null;
const [modelPath, out = 'render.png', view = 'iso'] = args;
const model = JSON.parse(readFileSync(modelPath, 'utf8'));
const browser = await chromium.launch({args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader']});
const page = await browser.newPage({viewport: {width: 1280, height: 820}});
page.on('pageerror', e => console.error('page error:', e.message));
// Sirve las librerías del CDN desde node_modules (sin red).
await page.route('https://cdn.jsdelivr.net/npm/**', r => {
  const m = new URL(r.request().url()).pathname.match(/^\/npm\/((?:@[^/]+\/)?[^@/]+)@[^/]+\/(.*)$/);
  try { r.fulfill({path: join(root, 'node_modules', m[1], m[2]), contentType: 'text/javascript'}); } catch { r.abort(); }
});
await page.route(/fonts\.(googleapis|gstatic)\.com/, r => r.fulfill({body: '', contentType: 'text/css'}));
await page.route('http://cad.local/', r => r.fulfill({path: join(root, 'index.html'), contentType: 'text/html'}));
await page.goto('http://cad.local/');
await page.waitForFunction(() => window.cadAPI);
await page.evaluate(m => cadAPI.load(m), model);
await page.evaluate(v => cadAPI.view(v), view);
await page.waitForTimeout(300);
await page.screenshot({path: out});
if (stlOut) writeFileSync(stlOut, await page.evaluate(() => cadAPI.stl()));
console.log('ok', out, stlOut || '');
await browser.close();
