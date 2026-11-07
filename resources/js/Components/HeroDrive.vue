<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { loadMotion, reducedMotion } from '@/lib/motion';
import { whenReady } from '@/lib/intro';
import { photo } from '@/lib/img.js';

// The home page's opening scene: the empty studio, and the car drives in from the left,
// brakes in the middle, the LED edge sweeps across it (dull → glossy), then the camera pushes
// in. Everything is driven by CSS variables on the root, set by one requestAnimationFrame loop:
//   --x (car offset, % of its width)  --blur  --tilt  --pos (LED edge, % of width)  --zoom
const props = defineProps({
    rest: { type: Number, default: 60 }, // where the LED edge settles, % of the width
    beforeLabel: { type: String, default: 'Before' },
    afterLabel: { type: String, default: 'After' },
    alt: { type: String, default: '' },
});

const root = ref(null);
const CAR = { src: '/img/car/ferrari-f8-1200.webp', srcset: '/img/car/ferrari-f8-800.webp 800w, /img/car/ferrari-f8-1200.webp 1200w, /img/car/ferrari-f8-1600.webp 1600w' };

let cancel = () => {};
let raf = null;
let trigger = null;
let alive = true;
let done = false;

const set = (name, value) => root.value?.style.setProperty(name, value);
const car = ref(null);

// The LED edge is a % of the hero's width; the dull copy of the car is clipped in % of the car's
// width, so map one onto the other (the car is centred, scaled by the zoom around the centre).
function edge(pos, zoom) {
    const W = root.value?.clientWidth || 1;
    const carW = (car.value?.offsetWidth || 1) * zoom;
    // the car's centre (left: 50 % / 64 %), scaled around the scene's centre by the zoom
    const centre = W / 2 + ((car.value?.offsetLeft ?? W / 2) - W / 2) * zoom;
    const inCar = ((pos / 100) * W - (centre - carW / 2)) / carW;
    set('--car-pos', `${clamp01(inCar) * 100}%`);
}
const expoOut = (t) => 1 - Math.pow(2, -10 * t);
const quartInOut = (t) => (t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2);
const clamp01 = (v) => Math.min(1, Math.max(0, v));

function finish() {
    set('--x', '0%');
    set('--blur', '0px');
    set('--tilt', '0deg');
    set('--pos', `${props.rest}%`);
    set('--zoom', '1.08');
    edge(props.rest, 1.08);
    root.value?.classList.add('is-parked');
    done = true;
}

function play() {
    const start = performance.now();
    const step = (now) => {
        const t = now - start;
        // 0–1500 ms: drive in. The blur and the nose dip ease out as it brakes.
        const d = clamp01(t / 1500);
        const e = expoOut(d);
        set('--x', `${-130 + 130 * e}%`);
        set('--blur', `${8 * (1 - e)}px`);
        // dips as it brakes (around 70–100 % of the drive), then settles.
        const brake = d < 0.7 ? 0 : Math.sin(clamp01((d - 0.7) / 0.3) * Math.PI);
        set('--tilt', `${-1.4 * brake}deg`);
        if (d >= 1) root.value?.classList.add('is-parked');
        // 1500–3300 ms: the LED edge sweeps across.
        const s = clamp01((t - 1500) / 1800);
        const pos = props.rest * quartInOut(s);
        set('--pos', `${pos}%`);
        // 1700–4500 ms: the camera pushes in.
        const z = clamp01((t - 1700) / 2800);
        const zoom = 1 + 0.08 * expoOut(z);
        set('--zoom', `${zoom}`);
        edge(pos, zoom);
        if (t < 4500) raf = requestAnimationFrame(step);
        else done = true;
    };
    raf = requestAnimationFrame(step);
}

onMounted(() => {
    if (reducedMotion()) {
        finish();
        return;
    }
    cancel = whenReady(async () => {
        setTimeout(play, 200);
        // After the scene, scrolling moves the LED edge on and eases the zoom back out.
        const { ScrollTrigger } = await loadMotion();
        if (!alive) return;
        trigger = ScrollTrigger.create({
            trigger: root.value,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.6,
            onUpdate: (self) => {
                if (!done) return;
                const pos = props.rest + (100 - props.rest) * self.progress;
                const zoom = 1.08 + 0.1 * self.progress;
                set('--pos', `${pos}%`);
                set('--zoom', `${zoom}`);
                edge(pos, zoom);
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
    <div ref="root" class="hero-drive absolute inset-0 overflow-hidden" style="--x: -130%; --blur: 0px; --tilt: 0deg; --pos: 0%; --zoom: 1; --car-pos: 0%">
        <!-- the scene: backdrop + car, pushed in together -->
        <div class="absolute inset-0 origin-[50%_70%] will-change-transform" :style="{ transform: 'scale(var(--zoom))' }">
            <img v-bind="photo('hero-studio')" sizes="100vw" alt="" fetchpriority="high" decoding="async" class="absolute inset-0 w-full h-full object-cover object-[50%_60%]">
            <div class="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-ink/40"></div>

            <!-- the car: two copies, dull to the left of the LED edge, glossy to the right -->
            <div ref="car" class="car absolute bottom-[14%] sm:bottom-[8%] lg:bottom-[5%] left-1/2 lg:left-[64%] w-[112vw] sm:w-[82vw] lg:w-[56vw] max-w-[1150px] -translate-x-1/2 will-change-transform"
                 :style="{ transform: 'translateX(calc(-50% + var(--x))) rotate(var(--tilt))', filter: 'blur(var(--blur))' }">
                <!-- shadow on the floor -->
                <div class="absolute left-[8%] right-[8%] bottom-[2%] h-[14%] rounded-[50%] bg-black/70 blur-xl"></div>
                <!-- reflection -->
                <img v-bind="CAR" sizes="(min-width: 1024px) 58vw, 100vw" alt="" aria-hidden="true" decoding="async" class="absolute left-0 top-[96%] w-full -scale-y-100 opacity-30 [mask-image:linear-gradient(to_bottom,rgba(0,0,0,.6),transparent_55%)] pointer-events-none">
                <img v-bind="CAR" sizes="(min-width: 1024px) 58vw, 100vw" :alt="alt" fetchpriority="high" decoding="async" class="relative block w-full h-auto">
                <img v-bind="CAR" sizes="(min-width: 1024px) 58vw, 100vw" alt="" aria-hidden="true" decoding="async" class="absolute inset-0 w-full h-auto grayscale contrast-[0.8] brightness-[0.55]" :style="{ clipPath: 'inset(0 calc(100% - var(--car-pos)) 0 0)' }">
            </div>
        </div>

        <!-- the LED edge, over everything -->
        <div class="absolute inset-y-0 led-v -translate-x-1/2 z-[2] transition-opacity duration-500" :style="{ left: 'var(--pos)' }"></div>
        <div class="absolute inset-y-0 w-40 -translate-x-full z-[1] bg-gradient-to-r from-transparent to-led/15 pointer-events-none" :style="{ left: 'var(--pos)' }"></div>
        <span class="absolute left-5 sm:left-8 bottom-6 font-display text-[10px] tracking-[0.3em] text-white/50 z-[2]">{{ beforeLabel }}</span>
        <span class="absolute right-5 sm:right-8 bottom-6 font-display text-[10px] tracking-[0.3em] text-led z-[2]">{{ afterLabel }}</span>
    </div>
</template>

<style scoped>
/* While driving, the whole car is "before"; the clip only matters once it is parked. */
.car > img:last-child { opacity: 1; transition: opacity 0.3s; }
.hero-drive:not(.is-parked) .car > img:last-child { clip-path: none !important; }
</style>
