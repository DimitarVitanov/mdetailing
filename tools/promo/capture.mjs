// Captures the website for the promo video (promo.js) from a running copy of the site:
//
//   php artisan serve --port=8123            (with a built frontend: npm run build)
//   node tools/promo/capture.mjs             → tools/promo/captures/
//
// - hero.png, hero.json  the desktop home page's first screen without the video (see-through
//                  where the car drives) and where the video stage sits; drive/NNNN.jpg its frames
// - home.jpg       the desktop home page, long, for the scrolling browser window
// - services.jpg   the desktop services page's first screen, for the second window
// - services-long.jpg, portfolio.jpg, detail.jpg (+ .json: the booking button), contact.jpg
//                  (+ .json: the form, filled in but never sent, and its button)
// - data.json      services, features, stats and texts, as the site shows them
// - m-*.jpg        the phone pages, long
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

    await revealAll(page, 8000);
    await parked(page);
    await long(page, 'home.jpg', 7600);
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

// ── desktop services: the first screen, the long page, and the data the showcase draws with ──
{
    const page = await open('/services', DESKTOP);
    await page.screenshot({ path: path.join(out, 'services.jpg'), type: 'jpeg', quality: 90 });
    console.log('  services.jpg');
    // the page's data, as the server printed it (Inertia's <script data-page> in the HTML)
    const html = await (await fetch(SITE + '/services')).text();
    const props = JSON.parse(html.match(/<script data-page="app" type="application\/json">([\s\S]*?)<\/script>/)[1]).props;
    // the photo the site shows for a service without its own image (lib/img.js)
    const photos = JSON.parse(fs.readFileSync(path.join(here, '../../resources/js/lib/img.js'), 'utf8').match(/SERVICE_PHOTOS = (\[[^\]]+\])/)[1].replaceAll("'", '"'));
    const text = (key) => props.siteContent?.[key]?.mk || props.siteContent?.[key]?.en || '';
    const data = {
        services: props.services.map((s) => ({ id: s.id, slug: s.slug, name: s.name_mk || s.name, from: Number(s.price_from), photo: photos[(s.id - 1) % photos.length] })),
        features: [1, 2, 3, 4].map((n) => text(`showcase.feature${n}.title`)).filter(Boolean),
        stats: ['cars', 'clients', 'years', 'rating'].map((k) => ({ value: text(`stats.${k}.value`), label: text(`stats.${k}.label`) })).filter((s) => s.value),
        phone: text('footer.phone'),
        tagline: text('hero.badge'),
    };
    fs.writeFileSync(path.join(out, 'data.json'), JSON.stringify(data, null, 2));
    console.log(`  data.json: ${data.services.length} services, ${data.features.length} features, ${data.stats.length} stats`);
    await revealAll(page, 4600);
    await long(page, 'services-long.jpg', 4200);
    await page.close();
}

// ── desktop portfolio: the first screen ──
{
    const page = await open('/portfolio', DESKTOP);
    await sleep(800);
    await page.screenshot({ path: path.join(out, 'portfolio.jpg'), type: 'jpeg', quality: 90 });
    console.log('  portfolio.jpg');
    await page.close();
}

// The page rectangle (css px) of the first element matching selector.
const rectOf = (page, selector) => page.evaluate((sel) => {
    const r = [...document.querySelectorAll(sel)].find((el) => el.offsetParent)?.getBoundingClientRect();
    return r && { x: r.x + scrollX, y: r.y + scrollY, width: r.width, height: r.height };
}, selector);

// ── a service's page, and where its booking button is (the showcase's cursor clicks it) ──
const DETAIL = 'ceramic-coating';
{
    const page = await open(`/services/${DETAIL}`, DESKTOP);
    await sleep(800);
    const button = await rectOf(page, 'a[href^="/contact?service="]');
    await page.screenshot({ path: path.join(out, 'detail.jpg'), type: 'jpeg', quality: 90 });
    fs.writeFileSync(path.join(out, 'detail.json'), JSON.stringify({ viewport: DESKTOP, button }, null, 2));
    console.log('  detail.jpg, detail.json');
    await page.close();
}

// ── the booking form, filled in as a visitor would (never sent) ──
{
    const page = await open('/contact?service=3', DESKTOP);
    await revealAll(page, 2600);
    for (const [id, value] of [['client_name', 'Марко Петровски'], ['client_phone', '+389 70 123 456'], ['client_email', 'marko@example.com'], ['vehicle_make', 'Audi'], ['vehicle_model', 'A6'], ['vehicle_year', '2021']]) {
        await page.type(`#${id}`, value);
    }
    await page.evaluate(() => {
        const set = (id, value, event) => { const el = document.getElementById(id); el.value = value; el.dispatchEvent(new Event(event, { bubbles: true })); };
        const d = new Date(Date.now() + 9 * 864e5);
        set('preferred_date', d.toISOString().slice(0, 10), 'input');
        const time = document.getElementById('preferred_time');
        set('preferred_time', time.options[Math.min(3, time.options.length - 1)].value, 'change');
        document.activeElement?.blur();
        window.scrollTo(0, 0);
    });
    await sleep(600);
    const submit = await rectOf(page, 'form button[type="submit"]');
    const form = await rectOf(page, 'form');
    await long(page, 'contact.jpg', 2600);
    fs.writeFileSync(path.join(out, 'contact.json'), JSON.stringify({ viewport: DESKTOP, submit, form }, null, 2));
    console.log('  contact.json');
    await page.close();
}

// ── phones ──
for (const [url, file, height] of [['/', 'm-home.jpg', 2600], ['/services', 'm-services.jpg', 2400], ['/contact', 'm-contact.jpg', 2400], [`/services/${DETAIL}`, 'm-detail.jpg', 2400], ['/portfolio', 'm-portfolio.jpg', 2400]]) {
    const page = await open(url, PHONE);
    await revealAll(page, height + 800);
    if (url === '/') await parked(page);
    await long(page, file, height);
    await page.close();
}

await chrome.close();
