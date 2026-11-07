// Shared motion setup: GSAP + ScrollTrigger, Lenis smooth scroll, and a reduced-motion flag
// every animated component checks first. Everything here is only called in the browser.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

export const reducedMotion = () =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const finePointer = () =>
    typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

let lenis = null;

export function startSmoothScroll() {
    if (lenis || typeof window === 'undefined' || reducedMotion()) return;
    // Phones and tablets scroll natively; Lenis only adds lag there.
    if (!finePointer()) return;

    import('lenis').then(({ default: Lenis }) => {
        // lerp, not duration/easing: a fixed ease restarts on every wheel tick and trails the wheel.
        lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);
    });
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
