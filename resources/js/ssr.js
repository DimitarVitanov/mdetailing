// Optional server-side rendering: sends every first visit as finished HTML (faster first paint,
// full content for crawlers). The site works the same without it.
//
//   npm run build:ssr                 builds public/build and bootstrap/ssr
//   php artisan inertia:start-ssr     keeps the renderer running (use Supervisor/PM2 in production)
//
// Laravel uses it automatically while it runs, and falls back to client rendering if it stops.
import { createSSRApp, h } from 'vue';
import { renderToString } from '@vue/server-renderer';
import { createInertiaApp } from '@inertiajs/vue3';
import createServer from '@inertiajs/vue3/server';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { reveal } from './directives/reveal';

const BRAND = 'MDetailing';

createServer((page) =>
    createInertiaApp({
        page,
        render: renderToString,
        title: (title) => (!title ? 'MDetailing Premium Car Care' : title.includes(BRAND) ? title : `${title} | ${BRAND}`),
        resolve: (name) => resolvePageComponent(`./Pages/${name}.vue`, import.meta.glob('./Pages/**/*.vue')),
        setup({ App, props, plugin }) {
            return createSSRApp({ render: () => h(App, props) })
                .use(plugin)
                .directive('reveal', reveal);
        },
    }),
);
