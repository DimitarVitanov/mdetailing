// Captures the website for the promo video (promo.js) from a running copy of the site:
//
//   php artisan serve --port=8123            (with a built frontend: npm run build)
//   node tools/promo/capture.mjs             → tools/promo/captures/
//
// - hero.png, hero.json  the desktop home page's first screen without the video (see-through
//                  where the car drives) and where the video stage sits; drive/NNNN.jpg its frames
// - home.jpg       the desktop home page, long, for the scrolling browser window
// - services.jpg   the desktop services page's first screen, for the second window
// - m-home.jpg, m-services.jpg, m-contact.jpg  the phone pages, long
//
// The intro is skipped and every page is scrolled through once first, so all reveals are done.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { startChrome } from './chrome.mjs';

const SITE = process.env.SITE || 'http://127.0.0.1:8123';
const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(here, 'captures');
fs.mkdirSync(out, { recursive: true });

const DESKTOP = { width: 1440, height: 900, deviceScaleFactor: 4 / 3 };
const PHONE = { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true };

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const chrome = await startChrome();

async function open(url, viewport) {
    const page = await chrome.browser.newPage();
    await page.setViewport(viewport);
    await page.evaluateOnNewDocument(() => {
        try { sessionStorage.setItem('md-intro', '1'); } catch {}
    });
    await page.goto(SITE + url, { waitUntil: 'load', timeout: 60000 });
    await sleep(1800); // the hero words come in
    return page;
}

// Scroll through once so every reveal has run, then back to the top.
async function revealAll(page, height) {
    await page.evaluate(async (h) => {
        for (let y = 0; y <= h; y += 250) {
            window.scrollTo(0, y);
            await new Promise((r) => setTimeout(r, 120));
        }
        window.scrollTo(0, 0);
    }, height);
    await sleep(1600);
}

// The drive as the parked car: the video hidden, the hero's last-frame image in its place.
async function parked(page) {
    await page.evaluate(() => new Promise((resolve) => {
        document.querySelector('video').style.display = 'none';
        const img = document.querySelector('picture img');
        for (const source of document.querySelectorAll('picture source')) source.srcset = source.srcset.replace('-first', '-last');
        img.src = img.src.replace('-first', '-last');
        (img.complete ? Promise.resolve() : img.decode()).then(() => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    }));
}

async function long(page, file, height) {
    const { width } = page.viewport();
    await page.screenshot({ path: path.join(out, file), type: 'jpeg', quality: 90, clip: { x: 0, y: 0, width, height }, captureBeyondViewport: true });
    console.log(`  ${file}`);
}

// ── desktop home ──
// The hero is captured once as a see-through layer (no video, no page background) plus where its
// stage is; promo.js lays the drive video's own frames under it, so the car really drives.
{
    const page = await open('/', DESKTOP);
    await page.waitForFunction(() => document.querySelector('video')?.readyState >= 1, { timeout: 60000 });
    const stage = await page.evaluate(() => {
        const r = document.querySelector('picture').parentElement.getBoundingClientRect();
        return { x: r.x, y: r.y, width: r.width, height: r.height };
    });
    const style = await page.addStyleTag({ content: 'html, body, .bg-ink { background: transparent !important; } picture, video { visibility: hidden !important; }' });
    await sleep(300);
    await page.screenshot({ path: path.join(out, 'hero.png'), omitBackground: true });
    await style.evaluate((el) => el.remove());
    fs.writeFileSync(path.join(out, 'hero.json'), JSON.stringify({ viewport: DESKTOP, stage }, null, 2));
    console.log('  hero.png, hero.json');

    await revealAll(page, 4200);
    await parked(page);
    await long(page, 'home.jpg', 3400);
    await page.close();
}

// the drive video's frames, for under the hero layer
const drive = path.join(out, 'drive');
fs.rmSync(drive, { recursive: true, force: true });
fs.mkdirSync(drive, { recursive: true });
execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', path.join(here, '../../public/video/drive-wide.mp4'), '-q:v', '2', path.join(drive, '%04d.jpg')]);
const frames = fs.readdirSync(drive).length;
const heroInfo = JSON.parse(fs.readFileSync(path.join(out, 'hero.json')));
fs.writeFileSync(path.join(out, 'hero.json'), JSON.stringify({ ...heroInfo, frames, fps: 30 }, null, 2));
console.log(`  drive: ${frames} frames`);

// ── desktop services: the first screen ──
{
    const page = await open('/services', DESKTOP);
    await page.screenshot({ path: path.join(out, 'services.jpg'), type: 'jpeg', quality: 90 });
    console.log('  services.jpg');
    await page.close();
}

// ── phones ──
for (const [url, file, height] of [['/', 'm-home.jpg', 2600], ['/services', 'm-services.jpg', 2400], ['/contact', 'm-contact.jpg', 2400]]) {
    const page = await open(url, PHONE);
    await revealAll(page, height + 800);
    if (url === '/') await parked(page);
    await long(page, file, height);
    await page.close();
}

await chrome.close();
