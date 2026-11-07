// The promo's timeline (15 s). Every element's state is a function of time, so render.mjs can draw
// any frame exactly: no CSS animations, no timers. The motion is the website's own: lines rising
// out of masks (--ease-forge), the LED page wipe (--ease-in-out-quart), hex lights flickering on.
//
//   0.0  hex lights, "Премиум нега за секој автомобил."
//   2.6  "Сега онлајн." with an LED underline, then the site's page wipe
//   4.2  the site in a browser window: the car drives in, then the page scrolls
//   9.4  "Совршен на секој екран." with three phones
//  11.8  wipe, end card: logo, tagline, button, address, "Изработено од nyxeon.io"
export const DURATION = 15;

const VIDEO_FPS = 30;
const SCALE = 1280 / 1440; // the browser window shows the desktop site (1440 css px) 1280 px wide
const PHONE = 300 / 390; // the phones show the mobile site (390 css px) 300 px wide

// ── easing ──
function bezier(x1, y1, x2, y2) {
    const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
    const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
    const x = (t) => ((ax * t + bx) * t + cx) * t;
    const dx = (t) => (3 * ax * t + 2 * bx) * t + cx;
    return (p) => {
        if (p <= 0) return 0;
        if (p >= 1) return 1;
        let t = p;
        for (let i = 0; i < 8; i++) {
            const d = dx(t);
            if (Math.abs(d) < 1e-6) break;
            t -= (x(t) - p) / d;
        }
        let lo = 0, hi = 1;
        for (let i = 0; i < 20 && Math.abs(x(t) - p) > 1e-5; i++) {
            x(t) < p ? (lo = t) : (hi = t);
            t = (lo + hi) / 2;
        }
        return ((ay * t + by) * t + cy) * t;
    };
}
const forge = bezier(0.19, 1, 0.22, 1);
const quart = bezier(0.76, 0, 0.24, 1);
const cubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp01 = (v) => Math.min(1, Math.max(0, v));
const prog = (t, from, dur) => clamp01((t - from) / dur);
const lerp = (a, b, k) => a + (b - a) * k;
const $ = (id) => document.getElementById(id);

// A mask line: rises in from below, tilted (as on the site), and leaves upwards.
function line(el, t, inAt, outAt = Infinity) {
    const i = forge(prog(t, inAt, 1.15));
    const o = quart(prog(t, outAt, 0.55));
    el.style.transform = `translateY(${(1 - i) * 110 - o * 110}%) rotate(${(1 - i) * 3}deg)`;
}

// Fades and lifts in (and optionally out).
function rise(el, t, inAt, { dur = 0.9, dy = 24, outAt = Infinity, outDur = 0.35 } = {}) {
    const i = forge(prog(t, inAt, dur));
    const o = prog(t, outAt, outDur);
    el.style.opacity = String(i * (1 - o));
    el.style.transform = `translateY(${(1 - i) * dy - o * dy * 0.6}px)`;
}

const show = (el, on) => { el.style.display = on ? '' : 'none'; };

// ── the hex lights ──
const hexes = [];
function buildHexes() {
    const svg = $('hexes');
    const R = 62;
    const w = Math.sqrt(3) * R;
    let seed = 11;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
    for (let row = -1; row * 1.5 * R < 1080 + R; row++) {
        for (let col = -1; col * w < 1920 + w; col++) {
            if (rnd() > 0.42) continue;
            const cx = col * w + (row % 2 ? w / 2 : 0);
            const cy = row * 1.5 * R;
            const pts = [];
            for (let k = 0; k < 6; k++) {
                const a = Math.PI / 6 + (k * Math.PI) / 3;
                pts.push(`${(cx + (R - 6) * Math.cos(a)).toFixed(1)},${(cy + (R - 6) * Math.sin(a)).toFixed(1)}`);
            }
            const p = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            p.setAttribute('points', pts.join(' '));
            svg.appendChild(p);
            // nearer the centre, later: the lights spread outwards
            const d = Math.hypot(cx - 960, cy - 540) / 1100;
            hexes.push({ el: p, delay: 0.05 + d * 0.5 + rnd() * 0.25 });
        }
    }
}
// the site's hex-on flicker: on, dip, on, settle dim
function flicker(u) {
    if (u < 0) return 0;
    const steps = [[0, 0], [0.36, 1], [0.5, 0.25], [0.63, 1], [0.9, 0.35]];
    let v = 0;
    for (const [at, val] of steps) if (u / 0.9 >= at) v = val;
    return v;
}

// ── the page wipe (PageWipe.vue): LED panel, then the dark one; both cross from left to right ──
function wipe(t, start, leaveAt) {
    const coverLed = quart(prog(t, start, 0.55));
    const coverInk = quart(prog(t, start + 0.07, 0.55));
    const leaveInk = quart(prog(t, leaveAt, 0.7));
    const leaveLed = quart(prog(t, leaveAt + 0.07, 0.7));
    return {
        led: -102 + 102 * coverLed + 102 * leaveLed,
        ink: -102 + 102 * coverInk + 102 * leaveInk,
        logo: forge(prog(t, start + 0.35, 0.35)) * (1 - prog(t, leaveAt, 0.25)),
        logoScale: lerp(0.85, 1, forge(prog(t, start + 0.35, 0.35))) + 0.1 * prog(t, leaveAt, 0.25),
    };
}

let hero = null;
let driveFrame = -1;

window.setup = async () => {
    buildHexes();
    hero = await (await fetch('/cap/hero.json')).json();
    const top = hero.stage.y * SCALE;
    Object.assign($('drive').style, { top: `${top}px`, height: `${hero.stage.height * SCALE}px` });
    await document.fonts.ready;
    await Promise.all([...document.images].map((img) => (img.complete ? img.decode().catch(() => {}) : new Promise((r) => { img.onload = img.onerror = r; }))));
    return { hexes: hexes.length };
};

window.renderAt = async (t) => {
    // ── background ──
    $('hexgrid').style.transform = `translate(${-t * 5}px, ${-t * 3}px)`;
    $('glowSignal').style.opacity = String(t < 4 ? 0.5 : t < 9.4 ? 1 : t < 12.4 ? 0.7 : 1);
    $('glowLed').style.opacity = String(0.6 + 0.4 * Math.sin(t * 0.8));

    // ── 1. hex lights and the headline ──
    show($('hexes'), t < 4.1);
    const dim = 1 - 0.55 * prog(t, 1.4, 1.2);
    for (const h of hexes) h.el.style.opacity = String(flicker(t - h.delay) * dim);
    show($('title'), t < 2.9);
    rise($('eyebrow'), t, 0.25, { outAt: 2.15 });
    line($('l1'), t, 0.4, 2.2);
    line($('l2'), t, 0.52, 2.27);

    show($('online'), t >= 2.4 && t < 4.2);
    line($('on1'), t, 2.6);
    $('onLed').style.transform = `scaleX(${quart(prog(t, 2.95, 0.6))})`;
    rise($('onUrl'), t, 3.1, { dy: 14 });

    // ── 2. the browser ──
    const stageOn = t >= 4.0 && t < 10.0;
    show($('stage'), stageOn);
    if (stageOn) {
        const kIn = forge(prog(t, 4.15, 1.7));
        const kDrift = cubic(prog(t, 5.6, 3.7));
        const kOut = quart(prog(t, 9.3, 0.6));
        // a push-in towards the car while it drives, back out for the scroll
        const push = cubic(prog(t, 5.3, 1.7)) * (1 - cubic(prog(t, 7.25, 0.75)));
        const rx = lerp(22, 7, kIn) - 3 * kDrift;
        const ry = lerp(-20, -6, kIn) + 12 * kDrift + 16 * kOut;
        const ty = lerp(160, 10, kIn) - 30 * kOut - 95 * push;
        const sc = lerp(0.84, 0.95, kIn) + 0.04 * kDrift - 0.12 * kOut + 0.16 * push;
        Object.assign($('win').style, {
            transform: `translate(-50%, -50%) translate3d(${-560 * kOut}px, ${ty}px, 0) rotateX(${rx}deg) rotateY(${ry}deg) scale(${sc})`,
            opacity: String(1 - kOut),
        });
        $('winGlow').style.opacity = String(forge(prog(t, 4.4, 1.2)) * (1 - kOut));

        const k2 = forge(prog(t, 6.4, 1.4));
        Object.assign($('win2').style, {
            transform: `translate(-50%, -50%) translate3d(${lerp(1050, 600, k2) - 560 * kOut}px, ${lerp(300, 190, k2)}px, -380px) rotateX(6deg) rotateY(${lerp(-34, -18, k2) + 6 * kDrift}deg)`,
            opacity: String(k2 * 0.9 * (1 - kOut)),
            filter: 'blur(2.5px) brightness(0.72)',
        });

        // the hero: the drive video's frames under the page layer, then the page scrolls
        const vt = lerp(0.5, 5.3, prog(t, 4.25, 3.2));
        const frame = Math.min(159, Math.max(0, Math.round(vt * VIDEO_FPS)));
        const onHero = t < 7.55;
        show($('heroLayer'), onHero);
        show($('homeLayer'), !onHero);
        if (onHero && frame !== driveFrame) {
            driveFrame = frame;
            const img = $('drive');
            img.src = `/cap/drive/${String(frame + 1).padStart(4, '0')}.jpg`;
            await img.decode().catch(() => {});
        }
        $('homeImg').style.transform = `translateY(${-cubic(prog(t, 7.7, 1.6)) * 1750 * SCALE}px)`;
    }

    // ── 3. phones ──
    const phonesOn = t >= 9.3 && t < 12.5;
    show($('phones'), phonesOn);
    if (phonesOn) {
        rise($('capEyebrow'), t, 9.45);
        line($('c1'), t, 9.55);
        line($('c2'), t, 9.67);
        const layout = [
            { el: $('p1'), x: 1110, y: 26, z: 1, scroll: 620 },
            { el: $('p2'), x: 1425, y: -34, z: 3, scroll: 980 },
            { el: $('p3'), x: 1740, y: 26, z: 2, scroll: 760 },
        ];
        layout.forEach((p, i) => {
            const k = forge(prog(t, 9.6 + i * 0.12, 1.3));
            Object.assign(p.el.style, {
                left: `${p.x - 160}px`,
                zIndex: String(p.z),
                transform: `translateY(${lerp(780, p.y, k)}px) rotate(${lerp(-7, 0, k)}deg)`,
            });
            const s = cubic(prog(t, 10.25 + i * 0.1, 1.5));
            p.el.querySelector('.screen > img').style.transform = `translateY(${-s * p.scroll * PHONE}px)`;
        });
    }

    // ── 4. end card ──
    const endOn = t >= 12.3;
    show($('end'), endOn);
    if (endOn) {
        const k = forge(prog(t, 12.55, 1.2));
        Object.assign($('endLogo').style, { opacity: String(k), transform: `translateY(${lerp(24, 0, k)}px) scale(${lerp(0.86, 1, k)})` });
        line($('endTagIn'), t, 12.75);
        rise($('endBtn'), t, 12.95);
        rise($('endUrl'), t, 13.1, { dy: 14 });
        $('creditLed').style.transform = `scaleX(${quart(prog(t, 13.55, 0.6))})`;
        rise($('creditBy'), t, 13.7, { dy: 12 });
        line($('creditNameIn'), t, 13.8);
    }

    // ── wipes ──
    const w = t < 8 ? wipe(t, 3.45, 4.2) : wipe(t, 11.8, 12.5);
    const withLogo = t < 8;
    $('wipeLed').style.transform = `translateX(${w.led}%)`;
    $('wipeInk').style.transform = `translateX(${w.ink}%)`;
    Object.assign($('wipeLogo').style, { opacity: String(withLogo ? w.logo : 0), transform: `scale(${w.logoScale})` });
};

window.promoReady = true;
