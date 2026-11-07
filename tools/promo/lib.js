// Shared by the promo compositions (promo.js, showcase.js): the website's own motion, as pure
// functions of time, so any frame can be drawn exactly.

// ── easing ──
export function bezier(x1, y1, x2, y2) {
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
export const forge = bezier(0.19, 1, 0.22, 1); // --ease-forge
export const quart = bezier(0.76, 0, 0.24, 1); // --ease-in-out-quart
export const cubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const clamp01 = (v) => Math.min(1, Math.max(0, v));
export const prog = (t, from, dur) => clamp01((t - from) / dur);
export const lerp = (a, b, k) => a + (b - a) * k;
export const $ = (id) => document.getElementById(id);
export const show = (el, on) => { el.style.display = on ? '' : 'none'; };

// A mask line: rises in from below, tilted (as on the site), and leaves upwards.
export function line(el, t, inAt, outAt = Infinity) {
    const i = forge(prog(t, inAt, 1.15));
    const o = quart(prog(t, outAt, 0.55));
    el.style.transform = `translateY(${(1 - i) * 110 - o * 110}%) rotate(${(1 - i) * 3}deg)`;
}

// Fades and lifts in (and optionally out).
export function rise(el, t, inAt, { dur = 0.9, dy = 24, outAt = Infinity, outDur = 0.35 } = {}) {
    const i = forge(prog(t, inAt, dur));
    const o = prog(t, outAt, outDur);
    el.style.opacity = String(i * (1 - o));
    el.style.transform = `translateY(${(1 - i) * dy - o * dy * 0.6}px)`;
}

// The page wipe (PageWipe.vue): an LED panel, then a dark one, crossing left to right.
export function wipe(t, start, leaveAt) {
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

// The site intro's hex lights: a honeycomb of LED outlines, spreading out from the centre.
export function buildHexes(svg, { R = 62, density = 0.42, seed = 11 } = {}) {
    const hexes = [];
    const w = Math.sqrt(3) * R;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
    for (let row = -1; row * 1.5 * R < 1080 + R; row++) {
        for (let col = -1; col * w < 1920 + w; col++) {
            if (rnd() > density) continue;
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
            const d = Math.hypot(cx - 960, cy - 540) / 1100;
            hexes.push({ el: p, delay: 0.05 + d * 0.5 + rnd() * 0.25 });
        }
    }
    return hexes;
}
// the site's hex-on flicker: on, dip, on, settle dim (u: seconds since this hex started)
export function flicker(u) {
    if (u < 0) return 0;
    const steps = [[0, 0], [0.36, 1], [0.5, 0.25], [0.63, 1], [0.9, 0.35]];
    let v = 0;
    for (const [at, val] of steps) if (u / 0.9 >= at) v = val;
    return v;
}
