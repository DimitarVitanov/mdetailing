import { createApp, h } from 'vue';
import { createInertiaApp, router } from '@inertiajs/vue3';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import '../css/app.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

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

// Init AOS after DOM is ready
setTimeout(() => {
    AOS.init({
        duration: 600,
        easing: 'ease-out',
        once: true,
        offset: 50,
    });
}, 150);

router.on('navigate', () => {
    setTimeout(() => AOS.refresh(), 150);
});
