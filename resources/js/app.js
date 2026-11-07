import '../css/app.css';
import { createApp, createSSRApp, h } from 'vue';
import { createInertiaApp } from '@inertiajs/vue3';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import PageWipe from './Components/PageWipe.vue';
import { reveal } from './directives/reveal';
import { restoreSavedLocale } from './i18n';
import { startSmoothScroll } from './lib/motion';

export const BRAND = 'MDetailing';

createInertiaApp({
    // Public pages get their full title from the server (App\Support\Seo); admin pages pass a short one.
    title: (title) => (!title ? 'MDetailing Premium Car Care' : title.includes(BRAND) ? title : `${title} | ${BRAND}`),
    resolve: (name) => resolvePageComponent(`./Pages/${name}.vue`, import.meta.glob('./Pages/**/*.vue')),
    setup({ el, App, props, plugin }) {
        // Hydrate when the page was server-rendered (optional SSR, see resources/js/ssr.js).
        const create = el.hasChildNodes() ? createSSRApp : createApp;
        // PageWipe sits beside the page, so it survives navigations and can cover them.
        const app = create({ render: () => [h(App, props), h(PageWipe)] })
            .use(plugin)
            .directive('reveal', reveal);
        app.mount(el);
        restoreSavedLocale(props.initialPage.props.locale);
        return app;
    },
    progress: false,
});

startSmoothScroll();
