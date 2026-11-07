// Renders the promo (promo.html + promo.js) to tools/promo/out/mdetailing-promo.mp4, 1920×1080 at
// 60 fps. Run capture.mjs first: the promo shows those captures of the site.
//
//   node tools/promo/render.mjs                       the whole video
//   node tools/promo/render.mjs --preview 1,5,13.9    just those moments, as PNGs in tools/promo/out
//
// Needs Google Chrome and ffmpeg.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { startChrome } from './chrome.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const out = path.join(here, 'out');
const FPS = 60;
const DURATION = 15;

const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.jpg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.woff2': 'font/woff2' };
const routes = [
    ['/promo/', here],
    ['/cap/', path.join(here, 'captures')],
    ['/fonts/', path.join(root, 'public/fonts')],
    ['/img/', path.join(root, 'public/img')],
];
const server = http.createServer((req, res) => {
    const url = decodeURIComponent(req.url.split('?')[0]);
    let file = null;
    if (url === '/') file = path.join(here, 'promo.html');
    else if (url === '/fonts.css') file = path.join(root, 'resources/css/fonts.css');
    else for (const [prefix, dir] of routes) if (url.startsWith(prefix)) file = path.join(dir, url.slice(prefix.length));
    if (!file || !fs.existsSync(file)) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'content-type': types[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));

const previewArg = process.argv.indexOf('--preview');
const preview = previewArg > -1 ? process.argv[previewArg + 1].split(',').map(Number) : null;
fs.mkdirSync(out, { recursive: true });

const chrome = await startChrome({ port: 9351, gpu: true });
const page = await chrome.browser.newPage();
page.on('pageerror', (e) => console.log('page error:', e.message));
page.on('console', (m) => m.type() === 'error' && console.log('console:', m.text()));
await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
await page.goto(`http://127.0.0.1:${server.address().port}/`);
await page.waitForFunction('window.promoReady');
console.log('setup', await page.evaluate(() => window.setup()));

if (preview) {
    for (const t of preview) {
        await page.evaluate((s) => window.renderAt(s), t);
        await page.screenshot({ path: path.join(out, `preview-${t.toFixed(2)}.png`) });
    }
    console.log(`previews in ${out}`);
} else {
    const file = path.join(out, 'mdetailing-promo.mp4');
    const ffmpeg = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'png', '-i', '-',
        '-vf', 'scale=out_color_matrix=bt709:out_range=tv,format=yuv420p',
        '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-tune', 'film', '-movflags', '+faststart',
        '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-color_range', 'tv', file], { stdio: ['pipe', 'inherit', 'inherit'] });
    const done = new Promise((r) => ffmpeg.on('close', r));
    const frames = Math.round(DURATION * FPS);
    const started = Date.now();
    for (let i = 0; i < frames; i++) {
        await page.evaluate((s) => window.renderAt(s), i / FPS);
        const png = await page.screenshot({ type: 'png', optimizeForSpeed: true });
        if (!ffmpeg.stdin.write(png)) await new Promise((r) => ffmpeg.stdin.once('drain', r));
        if (i % 120 === 0) console.log(`  ${i}/${frames} frames, ${((Date.now() - started) / 1000).toFixed(0)} s`);
    }
    ffmpeg.stdin.end();
    await done;
    console.log(`${file}: ${(fs.statSync(file).size / 1048576).toFixed(1)} MB`);
}

await chrome.close();
server.close();
