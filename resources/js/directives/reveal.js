// v-reveal — the element waits hidden and plays its entrance once it scrolls into view.
//   v-reveal            rise up        v-reveal="'left'" / "'right'" / "'scale'" / "'clip'" / "'wipe'"
//   v-reveal:200        with a 200 ms delay
// Styles live in app.css under [data-reveal]. Reduced motion shows everything at once.
import { reducedMotion } from '@/lib/motion';

let observer = null;

function getObserver() {
    observer ??= new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                if (!entry.isIntersecting) continue;
                entry.target.classList.add('is-revealed');
                observer.unobserve(entry.target);
            }
        },
        { rootMargin: '0px 0px -10% 0px', threshold: 0.01 },
    );
    return observer;
}

export const reveal = {
    mounted(el, binding) {
        if (reducedMotion() || typeof IntersectionObserver === 'undefined') return;
        el.dataset.reveal = binding.value || 'up';
        if (binding.arg) el.style.setProperty('--reveal-delay', `${binding.arg}ms`);
        getObserver().observe(el);
    },
    unmounted(el) {
        observer?.unobserve(el);
    },
    getSSRProps: () => ({}),
};

// Same observer for components that reveal themselves.
export function observeReveal(el) {
    if (!el) return;
    if (reducedMotion() || typeof IntersectionObserver === 'undefined') {
        el.classList.add('is-revealed');
        return;
    }
    getObserver().observe(el);
}

export function unobserveReveal(el) {
    if (el) observer?.unobserve(el);
}
