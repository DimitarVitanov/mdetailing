// Optional server-side rendering: sends every first visit as finished HTML.
//   npm run build:ssr                 builds public/build and bootstrap/ssr
//   php artisan inertia:start-ssr     keeps the renderer running (Supervisor/PM2 in production)
// Laravel uses it automatically while it runs and falls back to client rendering if it stops.
import { createSSRApp, h } from 'vue';
import { renderToString } from '@vue/server-renderer';
import { createInertiaApp } from '@inertiajs/vue3';
import createServer from '@inertiajs/vue3/server';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import PageWipe from './Components/PageWipe.vue';
import { reveal } from './directives/reveal';

const BRAND = 'MDetailing';

createServer((page) =>
    createInertiaApp({
        page,
        render: renderToString,
        title: (title) => (!title ? 'MDetailing Premium Car Care' : title.includes(BRAND) ? title : `${title} | ${BRAND}`),
        resolve: (name) => resolvePageComponent(`./Pages/${name}.vue`, import.meta.glob('./Pages/**/*.vue')),
        // PageWipe renders empty on the server and only plays after mount; it is here so the server
        // and client trees match for hydration.
        setup({ App, props, plugin }) {
            return createSSRApp({ render: () => [h(App, props), h(PageWipe)] })
                .use(plugin)
                .directive('reveal', reveal);
        },
    }),
);
