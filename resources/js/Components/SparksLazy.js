// The particle canvas, fetched only on devices with a mouse (phones never draw it) and only once
// the page has painted, so it is never part of the first download.
import { defineAsyncComponent, h } from 'vue';
import { afterFirstPaint } from '@/lib/img';
import { finePointer, reducedMotion } from '@/lib/motion';

export default defineAsyncComponent({
    loader: () =>
        new Promise((resolve) => {
            if (typeof window === 'undefined' || !finePointer() || reducedMotion()) return resolve({ render: () => h('div') });
            afterFirstPaint(() => import('./Sparks.vue').then(resolve));
        }),
    // Server and first client render agree on an empty box.
    loadingComponent: { render: () => h('div') },
    delay: 0,
});
