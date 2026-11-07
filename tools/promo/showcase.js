// The website showcase (about a minute), built like a product film: words, the brand, the site in
// browser windows, the page flowing past in 3D, the services, a booking made with the cursor,
// phones, photos, numbers, promises, and the end card with "Изработено од nyxeon.io".
// Every element's state is a function of time (render.mjs draws frame by frame).
import { $, buildHexes, clamp01, cubic, flicker, forge, lerp, line, prog, quart, rise, show, wipe } from './lib.js';

window.DURATION = 59;

const SCALE = 1280 / 1440; // the desktop site (1440 css px) in a 1280px window
const PHONE = 300 / 390; // the phone site (390 css px) on a 300px screen
const SCREEN = { x: 320, y: 163 }; // where a flat, centred 1280px window's page starts

// Scene times (s)
const T = {
    words: 0.3, wordsOut: 2.35,
    online: 2.75, onlineOut: 4.35,
    brand: 4.45, brandWipe: 7.6, brandLeave: 8.25,
    win: 8.2, driveFrom: 8.4, driveFor: 3.5,
    stack: 12.9, stackOut: 17.8,
    flow: 17.7, flowOut: 22.7,
    svc: 22.8, svcFocus: 28.2,
    book: 29.0, click1: 31.7, inWipe: 32.0, click2: 34.4, toast: 34.6, bookOut: 35.15,
    phones: 35.7, phonesOut: 41.3,
    photos: 41.5, photosOut: 45.4,
    stats: 45.7, statsOut: 49.2,
    feats: 49.45, featEach: 1.55,
    endWipe: 54.0, endLeave: 54.65, end: 54.75, credit: 56.3,
};

let hero, data, detail, contact;
let hexes = [];
let driveFrame = -1;
const cards = [];
const phones = [];
const panels = [];
const stats = [];
const feats = [];

const el = (html) => {
    const d = document.createElement('div');
    d.innerHTML = html.trim();
    return d.firstChild;
};
const json = async (url) => (await fetch(url)).json();

window.setup = async () => {
    [hero, data, detail, contact] = await Promise.all(['hero', 'data', 'detail', 'contact'].map((n) => json(`/cap/${n}.json`)));
    hexes = buildHexes($('hexes'), { density: 0.36, seed: 5 });

    // the drive's frames sit exactly where the site's stage is
    const st = hero.stage;
    Object.assign($('drive').style, { left: `${st.x * SCALE}px`, top: `${st.y * SCALE}px`, width: `${st.width * SCALE}px`, height: `${st.height * SCALE}px` });

    // the brand bands: the services, in outline
    const band = data.services.map((s) => s.name).join(' <b>●</b> ') + ' <b>●</b> ';
    $('band1').innerHTML = band.repeat(3);
    $('band2').innerHTML = band.repeat(3);

    // service cards
    data.services.forEach((s, i) => {
        const c = el(`<div class="card"><img src="/img/opt/${s.photo}-1024.webp" alt=""><div class="body"><div class="num">${String(i + 1).padStart(2, '0')}</div><div class="name">${s.name}</div><div class="price"><span>од</span><b>€${s.from.toFixed(2)}</b></div></div></div>`);
        $('svcRow').appendChild(c);
        cards.push({ el: c, slug: s.slug });
    });

    // phones: each shows a page of the site, scrolling
    for (const [file, scroll] of [['m-home', 900], ['m-services', 700], ['m-detail', 650], ['m-portfolio', 700], ['m-contact', 750]]) {
        const p = el(`<div class="phone"><div class="screen"><span class="island"></span><img src="/cap/${file}.jpg" alt=""><div class="pin"><img src="/cap/${file}.jpg" alt=""></div></div></div>`);
        $('phRow').appendChild(p);
        phones.push({ el: p, img: p.querySelector('.screen > img'), scroll });
    }

    // photo panels, labelled with services
    const byId = Object.fromEntries(data.services.map((s, i) => [s.id, { ...s, n: i + 1 }]));
    for (const [photo, id] of [['ferrari-01', 3], ['red-audi-02', 4], ['bmw-interior-04', 2]]) {
        const s = byId[id];
        const p = el(`<div class="panel"><img src="/img/opt/${photo}-1600.webp" alt=""><div class="edge"></div><div class="label"><small>${String(s?.n ?? id).padStart(2, '0')}</small><p>${s?.name ?? ''}</p></div></div>`);
        $('photos').appendChild(p);
        panels.push({ el: p, img: p.querySelector('img'), edge: p.querySelector('.edge'), label: p.querySelector('.label') });
    }

    // the numbers: "2,400+" counts up from 0, keeping its separator, decimals and suffix
    for (const s of data.stats) {
        const m = s.value.match(/^([\d.,]+)(.*)$/) || [null, s.value, ''];
        const target = Number(m[1].replace(/,/g, ''));
        const decimals = (m[1].split('.')[1] || '').length;
        const node = el(`<div class="stat"><div class="val"><span></span><i>${m[2]}</i></div><div class="lab">${s.label}</div></div>`);
        $('stats').appendChild(node);
        stats.push({ el: node, num: node.querySelector('.val span'), target, decimals, comma: m[1].includes(',') });
    }

    // three promises: the first word in yellow, the rest underneath
    data.features.slice(0, 3).forEach((f, i, all) => {
        const words = f.trim().split(/\s+/);
        const node = el(`<div class="feat"><p class="idx">${String(i + 1).padStart(2, '0')} / ${String(all.length).padStart(2, '0')}</p><h3 class="display"><span class="mask block"><span class="inner sig">${words[0]}</span></span><span class="mask block"><span class="inner">${words.slice(1).join(' ')}.</span></span></h3></div>`);
        $('feats').appendChild(node);
        feats.push({ el: node, idx: node.querySelector('.idx'), lines: [...node.querySelectorAll('.inner')] });
    });

    $('toastTitle').textContent = 'Барањето е примено';

    await document.fonts.ready;
    await Promise.all([...document.images].map((img) => (img.complete ? img.decode().catch(() => {}) : new Promise((r) => { img.onload = img.onerror = r; }))));
    return { services: cards.length, phones: phones.length, stats: stats.length, features: feats.length, duration: window.DURATION };
};

// Where a point of the desktop page (css px, minus scroll) lands in the flat, centred window.
const onScreen = (x, y, scroll = 0) => ({ x: SCREEN.x + x * SCALE, y: SCREEN.y + (y - scroll) * SCALE });

function fmt(n, s) {
    const v = s.decimals ? n.toFixed(s.decimals) : String(Math.round(n));
    return s.comma ? v.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : v;
}

window.renderAt = async (t) => {
    // ── background ──
    $('hexgrid').style.transform = `translate(${-t * 5}px, ${-t * 3}px)`;
    $('glowSignal').style.opacity = String(t < 8 ? 0.5 : t < 41.5 ? 1 : t < 45.5 ? 0.3 : 0.9);
    $('glowLed').style.opacity = String(0.6 + 0.4 * Math.sin(t * 0.8));

    // ── 1. the words ──
    show($('words'), t < T.wordsOut + 0.9);
    rise($('wEyebrow'), t, 0.12, { outAt: T.wordsOut });
    document.querySelectorAll('#words .w .inner').forEach((w, i) => line(w, t, T.words + i * 0.13, T.wordsOut + i * 0.05));

    // ── 2. now online ──
    show($('online'), t >= 2.6 && t < 5);
    line($('on1'), t, T.online, T.onlineOut);
    $('onLed').style.transform = `scaleX(${quart(prog(t, 3.0, 0.6)) * (1 - quart(prog(t, T.onlineOut, 0.45)))})`;
    rise($('onUrl'), t, 3.25, { dy: 14, outAt: T.onlineOut });

    // ── 3. the brand ──
    const brandOn = t >= 4.3 && t < 8.4;
    show($('brand'), brandOn);
    show($('hexes'), brandOn);
    if (brandOn) {
        const dim = 1 - 0.6 * prog(t, 6.2, 1.2);
        for (const h of hexes) h.el.style.opacity = String(flicker(t - T.brand - h.delay) * dim);
        const bandIn = forge(prog(t, 4.5, 1.2));
        $('band1').style.transform = `translateX(${-200 - (t - 4.3) * 230}px)`;
        $('band2').style.transform = `translateX(${-1600 + (t - 4.3) * 230}px)`;
        $('band1').style.opacity = $('band2').style.opacity = String(bandIn);
        const k = forge(prog(t, 4.75, 1.4));
        Object.assign($('brandLogo').style, { opacity: String(k), transform: `scale(${lerp(0.72, 1, k) + 0.012 * (t - 4.75)})` });
        rise($('brandEyebrow'), t, 5.35);
    }

    // ── 4–5. the site in browser windows ──
    const stageOn = t >= 8.1 && t < 18.6;
    show($('stage'), stageOn);
    if (stageOn) {
        const kIn = forge(prog(t, T.win, 1.7));
        const push = cubic(prog(t, 9.5, 1.6)) * (1 - cubic(prog(t, 11.95, 0.7)));
        const kSide = forge(prog(t, T.stack, 1.5));
        const kOut = quart(prog(t, T.stackOut, 0.75));
        const drift = cubic(prog(t, 13.5, 4.3));
        Object.assign($('win').style, {
            transform: `translate(-50%, -50%) translate3d(${-330 * kSide - 120 * kOut}px, ${lerp(160, 10, kIn) - 95 * push + 30 * kSide - 220 * kOut}px, 0) rotateX(${lerp(22, 6, kIn) + 3 * kSide + 45 * kOut}deg) rotateY(${lerp(-20, -4, kIn) + 16 * kSide - 6 * drift}deg) scale(${lerp(0.84, 0.95, kIn) + 0.16 * push - 0.24 * kSide - 0.1 * kOut})`,
            opacity: String(1 - kOut),
        });
        $('winGlow').style.opacity = String(forge(prog(t, 8.4, 1.2)) * (1 - kOut));

        const kS = forge(prog(t, 13.1, 1.5));
        Object.assign($('winS').style, {
            transform: `translate(-50%, -50%) translate3d(${lerp(980, 390, kS)}px, ${lerp(260, 110, kS) - 200 * kOut}px, -240px) rotateX(${lerp(12, 5, kS) + 45 * kOut}deg) rotateY(${lerp(-34, -14, kS) + 5 * drift}deg)`,
            opacity: String(kS * (1 - kOut)),
        });
        $('sScroll').style.transform = `translateY(${-cubic(prog(t, 14.0, 3.8)) * 1500 * (1000 / 1440)}px)`;
        const kP = forge(prog(t, 13.5, 1.5));
        Object.assign($('winP').style, {
            transform: `translate(-50%, -50%) translate3d(${lerp(960, 520, kP)}px, ${lerp(-520, -290, kP) - 200 * kOut}px, -560px) rotateX(${8 + 45 * kOut}deg) rotateY(-18deg)`,
            opacity: String(kP * 0.85 * (1 - kOut)),
            filter: 'blur(2.5px) brightness(0.7)',
        });

        // the hero: the drive video's frames under the page layer, then the long page scrolls
        const last = hero.frames - 1;
        const vt = lerp(0.2, last / hero.fps, prog(t, T.driveFrom, T.driveFor));
        const frame = Math.min(last, Math.max(0, Math.round(vt * hero.fps)));
        const onHero = t < 12.3;
        show($('heroLayer'), onHero);
        show($('homeLayer'), !onHero);
        if (onHero && frame !== driveFrame) {
            driveFrame = frame;
            const img = $('drive');
            img.src = `/cap/drive/${String(frame + 1).padStart(4, '0')}.jpg`;
            await img.decode().catch(() => {});
        }
        $("hScroll").style.transform = `translateY(${-cubic(prog(t, 13.3, 4.6)) * 3500 * SCALE}px)`;
    }

    // ── 6. the page flowing past in 3D ──
    const flowOn = t >= T.flow && t < 23.3;
    show($('flow'), flowOn);
    if (flowOn) {
        const kIn = forge(prog(t, T.flow, 1.6));
        const kOut = quart(prog(t, T.flowOut, 0.6));
        Object.assign($('sheets').style, {
            transform: `translate(-50%, -42%) translateY(${lerp(500, 0, kIn) - 700 * kOut}px) rotateX(${lerp(70, 54, kIn)}deg) rotateZ(-20deg) scale(${lerp(0.85, 1.08, kIn)})`,
            opacity: String(kIn * (1 - kOut)),
        });
        const p = prog(t, T.flow, 5.6);
        $('flowA').style.transform = `translateY(${-p * 2300}px)`;
        $('flowB').style.transform = `translateY(${600 - p * 1300}px)`;
    }

    // ── 7. the services ──
    const svcOn = t >= 22.6 && t < 29.8;
    show($('svc'), svcOn);
    if (svcOn) {
        rise($('svcEyebrow'), t, 22.9, { outAt: T.svcFocus });
        line($('svc1'), t, 23.0, T.svcFocus);
        line($('svc2'), t, 23.12, T.svcFocus + 0.05);
        const rowX = lerp(1060, -620, 1 - Math.pow(1 - prog(t, 22.9, 5.8), 1.6));
        $('svcRow').style.transform = `translateX(${rowX}px)`;
        const focus = quart(prog(t, T.svcFocus, 0.9));
        cards.forEach((c, i) => {
            const k = forge(prog(t, 23.0 + i * 0.09, 1.1));
            const chosen = c.slug === 'ceramic-coating';
            if (chosen) {
                const cx = rowX + i * 408 + 190;
                const cy = 480 + 236;
                const dx = (960 - cx) * focus;
                const dy = (560 - cy) * focus;
                c.el.style.transform = `translate(${dx}px, ${(1 - k) * 140 + dy}px) scale(${1 + 0.5 * focus})`;
                c.el.style.opacity = String(k * (1 - prog(t, 29.25, 0.35)));
                c.el.style.zIndex = '2';
            } else {
                c.el.style.transform = `translateY(${(1 - k) * 140 + 80 * focus}px)`;
                c.el.style.opacity = String(k * (1 - focus));
            }
        });
    }

    // ── 8. a booking, made with the cursor ──
    const bookOn = t >= 28.9 && t < 36.3;
    show($('book'), bookOn);
    show($('cursor'), t >= 30.2 && t < 35.6);
    if (bookOn) {
        const kIn = forge(prog(t, T.book, 1.1));
        const kOut = quart(prog(t, T.bookOut, 0.6));
        Object.assign($('winD').style, {
            transform: `translate(-50%, -50%) translateY(${lerp(30, 0, kIn) + 40 * kOut}px) scale(${lerp(0.5, 1, kIn) - 0.12 * kOut})`,
            opacity: String(clamp01(prog(t, T.book, 0.3)) * (1 - kOut)),
        });
        const onContact = t >= T.inWipe + 0.62;
        show($('detailLayer'), !onContact);
        show($('contactLayer'), onContact);
        $('dUrl').textContent = onContact ? 'mdetailing.mk/contact?service=3' : 'mdetailing.mk/services/ceramic-coating';
        const w = wipe(t, T.inWipe, T.inWipe + 0.7);
        $('inLed').style.transform = `translateX(${w.led}%)`;
        $('inInk').style.transform = `translateX(${w.ink}%)`;

        const scrollFrom = contact.form.y - 30;
        const scrollTo = contact.submit.y + contact.submit.height + 40 - 900;
        const scroll = lerp(scrollFrom, scrollTo, cubic(prog(t, 32.8, 1.3)));
        $('cScroll').style.transform = `translateY(${-scroll * SCALE}px)`;

        // the buttons, where the cursor goes
        const b1 = detail.button;
        const b2 = contact.submit;
        const p1 = onScreen(b1.x + b1.width * 0.45, b1.y + b1.height * 0.55);
        const p2 = onScreen(b2.x + b2.width * 0.45, b2.y + b2.height * 0.55, scrollTo);
        const start = { x: 1720, y: 1010 };
        const m1 = quart(prog(t, 30.3, 1.25));
        const m2 = quart(prog(t, 32.9, 1.3));
        const x = lerp(lerp(start.x, p1.x, m1), p2.x, m2);
        const y = lerp(lerp(start.y, p1.y, m1), p2.y, m2);
        const press = (at) => (t >= at && t < at + 0.14 ? 0.82 : 1);
        $('cursor').style.transform = `translate(${x}px, ${y}px)`;
        $('cursor').querySelector('svg').style.transform = `scale(${press(T.click1) * press(T.click2)})`;
        $('cursor').style.opacity = String(prog(t, 30.2, 0.25) * (1 - prog(t, 35.2, 0.3)));
        const ring = (at) => prog(t, at, 0.55);
        const r = t < T.click2 ? ring(T.click1) : ring(T.click2);
        Object.assign($('ring').style, { opacity: String(r > 0 && r < 1 ? 1 - r : 0), transform: `scale(${0.5 + 1.6 * r})` });

        // the light sweep over a button as it's hovered
        const hovering = t < T.inWipe ? { b: b1, at: 31.35, scroll: 0 } : { b: b2, at: 34.05, scroll: scrollTo };
        const sp = prog(t, hovering.at, 0.6);
        Object.assign($('sheen').style, {
            left: `${hovering.b.x * SCALE}px`, top: `${(hovering.b.y - hovering.scroll) * SCALE}px`, width: `${hovering.b.width * SCALE}px`, height: `${hovering.b.height * SCALE}px`,
            opacity: String(sp > 0 && sp < 1 ? 1 : 0),
        });
        $('sheen').style.setProperty('--x', `${lerp(-120, 120, sp)}%`);

        const k = forge(prog(t, T.toast, 0.8));
        Object.assign($('toast').style, { opacity: String(k), transform: `translate(-50%, ${(1 - k) * 40}px)` });
    }

    // ── 9. phones ──
    const phonesOn = t >= 35.6 && t < 41.9;
    show($('phones'), phonesOn);
    if (phonesOn) {
        const out = prog(t, T.phonesOut, 0.5);
        rise($('phEyebrow'), t, 35.85, { outAt: T.phonesOut });
        line($('ph1'), t, 35.95, T.phonesOut);
        line($('ph2'), t, 36.07, T.phonesOut + 0.05);
        $('phRow').style.transform = `translateX(${lerp(140, -980, prog(t, 35.7, 6.2))}px)`;
        $('phRail').style.opacity = String(1 - out);
        phones.forEach((p, i) => {
            const k = forge(prog(t, 35.8 + i * 0.1, 1.2));
            p.el.style.transform = `translateY(${(1 - k) * 720}px)`;
            p.img.style.transform = `translateY(${-cubic(prog(t, 36.6 + i * 0.15, 4)) * p.scroll * PHONE}px)`;
        });
    }

    // ── 10. photos ──
    const photosOn = t >= T.photos && t < 46;
    show($('photos'), photosOn);
    if (photosOn) {
        panels.forEach((p, i) => {
            const kin = quart(prog(t, 41.6 + i * 0.14, 0.9));
            const kout = quart(prog(t, T.photosOut + i * 0.08, 0.5));
            p.el.style.clipPath = `inset(${(1 - kin) * 100}% 0 ${kout * 100}% 0)`;
            p.img.style.transform = `scale(${lerp(1.18, 1.02, prog(t, 41.6, 4.2))})`;
            Object.assign(p.edge.style, { top: `calc(${(1 - kin) * 100}% - 2px)`, opacity: String(kin > 0 && kin < 1 ? 1 : 0) });
            rise(p.label, t, 42.3 + i * 0.12, { dy: 30 });
        });
    }

    // ── 11. the numbers ──
    const statsOn = t >= T.stats && t < 49.7;
    show($('stats'), statsOn);
    if (statsOn) {
        stats.forEach((s, i) => {
            rise(s.el, t, T.stats + 0.1 + i * 0.12, { dy: 40, outAt: T.statsOut + i * 0.05 });
            s.num.textContent = fmt(s.target * forge(prog(t, T.stats + 0.2 + i * 0.12, 1.9)), s);
            s.el.style.setProperty('--sep', String(prog(t, 46.1 + i * 0.1, 0.5)));
        });
    }

    // ── 12. three promises ──
    const featsOn = t >= 49.3 && t < 54.2;
    show($('feats'), featsOn);
    if (featsOn) {
        feats.forEach((f, i) => {
            const at = T.feats + i * T.featEach;
            const outAt = at + T.featEach - 0.4;
            rise(f.idx, t, at, { dy: 12, outAt });
            f.lines.forEach((l, j) => line(l, t, at + 0.05 + j * 0.1, outAt + j * 0.04));
        });
    }

    // ── 13. the end card ──
    const endOn = t >= 54.5;
    show($('end'), endOn);
    if (endOn) {
        const k = forge(prog(t, T.end, 1.2));
        Object.assign($('endLogo').style, { opacity: String(k), transform: `translateY(${lerp(24, 0, k)}px) scale(${lerp(0.86, 1, k)})` });
        line($('endTagIn'), t, T.end + 0.2);
        rise($('endBtn'), t, T.end + 0.4);
        rise($('endUrl'), t, T.end + 0.55, { dy: 14 });
        $('creditLed').style.transform = `scaleX(${quart(prog(t, T.credit, 0.6))})`;
        rise($('creditBy'), t, T.credit + 0.15, { dy: 12 });
        line($('creditNameIn'), t, T.credit + 0.25);
    }

    // ── page wipes ──
    const w = t < 20 ? wipe(t, T.brandWipe, T.brandLeave) : wipe(t, T.endWipe, T.endLeave);
    $('wipeLed').style.transform = `translateX(${w.led}%)`;
    $('wipeInk').style.transform = `translateX(${w.ink}%)`;
    $('wipeLogo').style.opacity = '0';
};

window.promoReady = true;
