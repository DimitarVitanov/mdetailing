// Reduced-motion check and the desktop-only Lenis smooth scroll, loaded after the page is
// interactive so it never competes with the first paint.

export const reducedMotion = () =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let lenis = null;

export function startSmoothScroll() {
    if (typeof window === 'undefined' || lenis || reducedMotion()) return;
    // Phones and tablets scroll natively (Lenis only adds lag there).
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches || window.innerWidth < 1024) return;

    const start = () =>
        import('lenis').then(({ default: Lenis }) => {
            // lerp rather than duration/easing: it eases from wherever the page already is, so
            // the page never trails the wheel.
            lenis = new Lenis({ lerp: 0.12, smoothWheel: true });
            const raf = (time) => {
                lenis.raf(time);
                requestAnimationFrame(raf);
            };
            requestAnimationFrame(raf);
        });

    if ('requestIdleCallback' in window) window.requestIdleCallback(start, { timeout: 2500 });
    else setTimeout(start, 1200);
}

// Pause smooth scrolling while a menu or lightbox is open (the page underneath must not move).
export function lockScroll(locked) {
    if (typeof document === 'undefined') return;
    document.documentElement.style.overflow = locked ? 'hidden' : '';
    if (lenis) locked ? lenis.stop() : lenis.start();
}
