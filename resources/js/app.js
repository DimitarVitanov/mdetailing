import { createApp, h } from 'vue';
import { createInertiaApp } from '@inertiajs/vue3';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import '../css/app.css';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

const isMobile = window.innerWidth < 768;

if (!isMobile) {
    const lenis = new Lenis({
        duration: 1.0,
        easing: (t) => 1 - Math.pow(1 - t, 3),
        lerp: 0.12,
        wheelMultiplier: 1,
        touchMultiplier: 1.5,
        smooth: true,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
}

AOS.init({
    duration: 600,
    easing: 'ease-out',
    once: true,
    offset: 50,
});

createInertiaApp({
    title: (title) => title ? `${title} - MDetailing Premium Car Care` : 'MDetailing Premium Car Care',
    resolve: (name) => resolvePageComponent(`./Pages/${name}.vue`, import.meta.glob('./Pages/**/*.vue')),
    setup({ el, App, props, plugin }) {
        return createApp({ render: () => h(App, props) })
            .use(plugin)
            .mount(el);
    },
    progress: {
        color: '#C9A84C',
    },
});
