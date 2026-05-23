import { createApp, h } from 'vue';
import { createInertiaApp } from '@inertiajs/vue3';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import '../css/app.css';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
}

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
