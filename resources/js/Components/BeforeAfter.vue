<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { loadMotion, reducedMotion } from '@/lib/motion';
import { whenReady } from '@/lib/intro';

// A full-bleed photo that wipes from "before" (dull, grey) to "after" (glossy) behind a
// vertical LED line. After the intro the line sweeps to `rest`; scrolling the section moves it on.
const props = defineProps({
    image: { type: Object, required: true },
    alt: { type: String, default: '' },
    position: { type: String, default: 'center' },
    rest: { type: Number, default: 62 }, // % of the width the line settles at
    beforeLabel: { type: String, default: 'Before' },
    afterLabel: { type: String, default: 'After' },
});

const root = ref(null);
let cancel = () => {};
let trigger = null;
let raf = null;
let sweeping = true;
let alive = true;

const paint = (pos) => root.value?.style.setProperty('--pos', `${pos}%`);

// The first sweep, in script (a transition on a custom property isn't reliable on every phone).
function sweep(to, duration) {
    const start = performance.now();
    const ease = (t) => (t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2);
    const step = (now) => {
        const t = Math.min(1, (now - start) / duration);
        paint(to * ease(t));
        if (t < 1) raf = requestAnimationFrame(step);
        else sweeping = false;
    };
    raf = requestAnimationFrame(step);
}

onMounted(() => {
    if (reducedMotion()) {
        paint(props.rest);
        return;
    }
    cancel = whenReady(async () => {
        setTimeout(() => sweep(props.rest, 2200), 250);
        const { ScrollTrigger } = await loadMotion();
        if (!alive) return;
        trigger = ScrollTrigger.create({
            trigger: root.value,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.6,
            onUpdate: (self) => {
                if (sweeping) return;
                paint(props.rest + (100 - props.rest) * self.progress);
            },
        });
    });
});

onBeforeUnmount(() => {
    alive = false;
    cancel();
    if (raf) cancelAnimationFrame(raf);
    trigger?.kill();
});
</script>

<template>
    <div ref="root" class="overflow-hidden" style="--pos: 0%">
        <!-- after: the full photo -->
        <img v-bind="image" :alt="alt" sizes="100vw" fetchpriority="high" decoding="async" class="absolute inset-0 w-full h-full object-cover" :style="{ objectPosition: position }">
        <!-- before: the same photo, dull, clipped to the left of the line -->
        <img v-bind="image" alt="" sizes="100vw" fetchpriority="high" decoding="async" aria-hidden="true" class="absolute inset-0 w-full h-full object-cover grayscale contrast-[0.78] brightness-[0.62]" :style="{ objectPosition: position, clipPath: 'inset(0 calc(100% - var(--pos)) 0 0)' }">
        <!-- the LED edge -->
        <div class="absolute inset-y-0 led-v -translate-x-1/2 z-[2]" :style="{ left: 'var(--pos)' }"></div>
        <div class="absolute inset-y-0 w-40 -translate-x-full z-[1] bg-gradient-to-r from-transparent to-led/15 pointer-events-none" :style="{ left: 'var(--pos)' }"></div>
        <!-- labels -->
        <span class="absolute left-5 sm:left-8 bottom-6 font-display text-[10px] tracking-[0.3em] text-white/50 z-[2]">{{ beforeLabel }}</span>
        <span class="absolute right-5 sm:right-8 bottom-6 font-display text-[10px] tracking-[0.3em] text-led z-[2]">{{ afterLabel }}</span>
        <slot />
    </div>
</template>
