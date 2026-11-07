// Motion setup. GSAP + ScrollTrigger (and Lenis smooth scroll on desktop) are not in the first
// download: they are fetched once the page has painted, so the first screen never waits for
// them. Components `await loadMotion()` in onMounted and bail out if they were unmounted meanwhile.
import { afterFirstPaint } from '@/lib/img';

export const reducedMotion = () =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const finePointer = () =>
    typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

let motion = null;

export function loadMotion() {
    motion ??= new Promise((resolve) => {
        afterFirstPaint(() => {
            Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([g, s]) => {
                g.gsap.registerPlugin(s.ScrollTrigger);
                resolve({ gsap: g.gsap, ScrollTrigger: s.ScrollTrigger });
            });
        });
    });
    return motion;
}

let lenis = null;

export async function startSmoothScroll() {
    if (lenis || typeof window === 'undefined' || reducedMotion() || !finePointer()) return;
    const [{ gsap, ScrollTrigger }, { default: Lenis }] = await Promise.all([loadMotion(), import('lenis')]);
    if (lenis) return;
    // lerp, not duration/easing: a fixed ease restarts on every wheel tick and trails the wheel.
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
}

export const getLenis = () => lenis;

// Scroll velocity in px/frame (0 without Lenis), for velocity-driven effects.
export const scrollVelocity = () => (lenis ? lenis.velocity : 0);

export function scrollToTop() {
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
}

// Freeze the page behind a menu or lightbox (native scroll and Lenis).
export function lockScroll(locked) {
    if (typeof document === 'undefined') return;
    document.documentElement.style.overflow = locked ? 'hidden' : '';
    locked ? lenis?.stop() : lenis?.start();
}
