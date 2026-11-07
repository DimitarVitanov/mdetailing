// Renders the home page's drive-in video from the 3D model (scene.js) with the Mac's GPU.
//
//   node tools/car-render/render.mjs                 both variants → public/video/
//   node tools/car-render/render.mjs --preview 0,3.8,6.4   just those moments, as PNGs in /tmp
//   … --only wide                                    one variant
//   … --tmp <dir>                                    where frames go (default: the system temp dir)
//
// Output per variant: drive-<variant>.mp4 (H.264), drive-<variant>-first.webp (poster) and
// drive-<variant>-last.webp (the parked car, for reduced motion and when autoplay is blocked).
// Needs Google Chrome and ffmpeg; puppeteer-core and three are dev dependencies.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const out = path.join(root, 'public/video');
const FPS = 30;
const END = 6.4;

// wide: desktop stage (≈ 2.96:1); tall: phone stage (≈ 1.18:1). fill = share of the frame the
// parked car may take (half-widths in NDC), before the final push-in.
const VARIANTS = {
    wide: { width: 1920, height: 648, fov: 22, fill: [0.5, 0.56] },
    tall: { width: 944, height: 800, fov: 38, fill: [0.74, 0.5] },
};

const types = { '.html': 'text/html', '.js': 'text/javascript', '.glb': 'model/gltf-binary', '.png': 'image/png', '.wasm': 'application/wasm', '.json': 'application/json' };
const server = http.createServer((req, res) => {
    const url = decodeURIComponent(req.url.split('?')[0]);
    const file = url.startsWith('/three/') ? path.join(root, 'node_modules', url) : url.startsWith('/tool/') ? path.join(here, url.slice(6)) : null;
    if (!file || !fs.existsSync(file)) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'content-type': types[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;

const previewArg = process.argv.indexOf('--preview');
const preview = previewArg > -1 ? process.argv[previewArg + 1].split(',').map(Number) : null;
const onlyArg = process.argv.indexOf('--only');
const only = onlyArg > -1 ? process.argv[onlyArg + 1] : null;
const tmpArg = process.argv.indexOf('--tmp');
const tmp = tmpArg > -1 ? process.argv[tmpArg + 1] : os.tmpdir();

const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: 'new',
    args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist', '--hide-scrollbars'],
});

for (const [name, v] of Object.entries(VARIANTS)) {
    if (only && name !== only) continue;
    const scale = 1.5;
    const page = await browser.newPage();
    page.on('console', (m) => ['error', 'warning'].includes(m.type()) && console.log(`  [${name}] ${m.text()}`));
    page.on('pageerror', (e) => console.log(`  [${name}] ${e.message}`));
    await page.setViewport({ width: Math.round(v.width * scale), height: Math.round(v.height * scale), deviceScaleFactor: 1 });
    await page.goto(`${base}/tool/index.html`);
    await page.waitForFunction('window.sceneReady');
    const info = await page.evaluate((o) => window.setup(o), { ...v, scale });
    console.log(`${name}: framed at ${info.fd.toFixed(2)} m`);

    const dir = fs.mkdtempSync(path.join(tmp, `drive-${name}-`));
    const times = preview ?? Array.from({ length: Math.round(END * FPS) + 1 }, (_, i) => i / FPS);
    for (const [i, t] of times.entries()) {
        await page.evaluate((s) => window.renderAt(s), t);
        await page.screenshot({ path: path.join(dir, `${String(i).padStart(4, '0')}.png`) });
    }
    await page.close();

    if (preview) {
        console.log(`${name}: preview frames in ${dir}`);
        continue;
    }

    // the darkest pixels are lifted to the page's own black (#07080a), so the frame melts into it
    const floor = "lutrgb=r='max(val,7)':g='max(val,8)':b='max(val,10)'";
    fs.mkdirSync(out, { recursive: true });
    const frames = path.join(dir, '%04d.png');
    const last = path.join(dir, `${String(times.length - 1).padStart(4, '0')}.png`);
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', frames,
        '-vf', `${floor},scale=${v.width}:${v.height}:flags=lanczos:out_color_matrix=bt709:out_range=tv,format=yuv420p`,
        '-c:v', 'libx264', '-preset', 'slow', '-crf', '25', '-tune', 'film', '-movflags', '+faststart',
        '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-color_range', 'tv', '-an',
        path.join(out, `drive-${name}.mp4`)]);
    for (const [label, src] of [['first', path.join(dir, '0000.png')], ['last', last]]) {
        execFileSync('magick', [src, '-resize', `${v.width}x${v.height}!`, '(', '+clone', '-fill', '#07080a', '-colorize', '100', ')', '-compose', 'lighten', '-composite',
            '-quality', '78', '-define', 'webp:method=6', path.join(out, `drive-${name}-${label}.webp`)]);
    }
    fs.rmSync(dir, { recursive: true, force: true });
    console.log(`${name}: ${(fs.statSync(path.join(out, `drive-${name}.mp4`)).size / 1024).toFixed(0)} KB video`);
}

await browser.close();
server.close();
