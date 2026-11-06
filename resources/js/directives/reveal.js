// v-reveal — the element plays its entrance once it scrolls into view.
//   v-reveal             rise up             v-reveal="'fade'" / "'scale'"
//   v-reveal:120         with a 120 ms delay
// Styles are in app.css under [data-reveal]. Reduced motion shows everything.
//
// Nothing is measured on mount (reading positions while the page renders forces a layout per
// element): the observer's first report decides. Already on screen → never hidden, so the first
// screen doesn't wait for JavaScript; below the fold → hidden until it scrolls in.
import { reducedMotion } from '@/lib/motion';

let observer = null;

function getObserver() {
    observer ??= new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                const el = entry.target;
                if (entry.isIntersecting) {
                    if (el.dataset.reveal) el.classList.add('is-revealed');
                    observer.unobserve(el);
                } else if (!el.dataset.reveal) {
                    el.dataset.reveal = el._reveal;
                }
            }
        },
        { rootMargin: '0px 0px -4% 0px', threshold: 0.01 },
    );
    return observer;
}

export const reveal = {
    mounted(el, binding) {
        if (reducedMotion() || typeof IntersectionObserver === 'undefined') return;

        el._reveal = binding.value || 'up';
        if (binding.arg) el.style.setProperty('--reveal-delay', `${binding.arg}ms`);
        getObserver().observe(el);
    },
    unmounted(el) {
        observer?.unobserve(el);
    },
    // Nothing to add to server-rendered HTML.
    getSSRProps: () => ({}),
};
