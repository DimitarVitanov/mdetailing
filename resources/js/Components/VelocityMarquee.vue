<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { reducedMotion, scrollVelocity } from '@/lib/motion';
import { whenReady } from '@/lib/intro';

// An endless band of words. It drifts on its own, speeds up and leans while the page is
// scrolled, and flips direction with the scroll direction.
const props = defineProps({
    items: { type: Array, required: true },
    speed: { type: Number, default: 1 },
    reverse: { type: Boolean, default: false },
    variant: { type: String, default: 'solid' }, // solid | outline | ink
});

const track = ref(null);
let x = 0;
let dir = props.reverse ? 1 : -1;
let skew = 0;
let width = 0;
let raf = null;
let visible = true;
let io = null;
let cancelReady = () => {};

function measure() {
    width = track.value ? track.value.scrollWidth / 2 : 0;
}

onMounted(() => {
    measure();
    if (reducedMotion()) return;
    io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    io.observe(track.value);
    window.addEventListener('resize', measure);
    document.fonts?.ready.then(measure);

    const tick = () => {
        raf = requestAnimationFrame(tick);
        if (!visible || !width) return;
        const v = scrollVelocity();
        if (Math.abs(v) > 0.4) dir = (v > 0 ? -1 : 1) * (props.reverse ? -1 : 1);
        const boost = Math.min(Math.abs(v) * 0.6, 22);
        x += dir * (props.speed + boost);
        if (x <= -width) x += width;
        if (x > 0) x -= width;
        skew += (Math.max(-12, Math.min(12, -v * 0.5)) - skew) * 0.1;
        track.value.style.transform = `translate3d(${x}px,0,0) skewX(${skew.toFixed(2)}deg)`;
    };
    cancelReady = whenReady(() => (raf = requestAnimationFrame(tick)));
});

onBeforeUnmount(() => {
    cancelReady();
    if (raf) cancelAnimationFrame(raf);
    io?.disconnect();
    window.removeEventListener('resize', measure);
});
</script>

<template>
    <div class="relative overflow-hidden select-none" aria-hidden="true">
        <div ref="track" class="flex w-max will-change-transform">
            <template v-for="copy in 2" :key="copy">
                <span v-for="(item, i) in items" :key="`${copy}-${i}`" class="flex items-center shrink-0">
                    <span class="font-display leading-none px-6 sm:px-10" :class="{ 'text-white': variant === 'solid', 'text-outline': variant === 'outline', 'text-ink': variant === 'ink' }">{{ item }}</span>
                    <span class="h-[0.45em] w-[0.45em] shrink-0 clip-hex" :class="variant === 'ink' ? 'bg-ink' : 'bg-signal'"></span>
                </span>
            </template>
        </div>
    </div>
</template>
