<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { loadMotion, reducedMotion } from '@/lib/motion';
import { whenReady } from '@/lib/intro';
import { photo } from '@/lib/img.js';

// The home page's opening scene, in four beats after the intro:
//   0.0–1.8 s  the car drives in from far left, blurred, LED streaks sweep past, the camera pans with it
//   1.5–2.1 s  it brakes in the middle: nose dips, the ceiling lights flash
//   2.0–3.8 s  the LED edge sweeps across the car, dull → glossy
//   2.2–5.0 s  the camera pushes in (the headline rises meanwhile, see Home.vue)
// One requestAnimationFrame loop writes CSS variables on the root; scrolling then moves the edge on.
const props = defineProps({
    rest: { type: Number, default: 58 }, // where the LED edge settles, % of the width
    beforeLabel: { type: String, default: 'Before' },
    afterLabel: { type: String, default: 'After' },
    alt: { type: String, default: '' },
});

const emit = defineEmits(['arrived']); // the car has stopped: the words can come in
const ARRIVAL = 1800; // ms after the scene starts: when the car has stopped

const root = ref(null);
const car = ref(null);
const CAR = { src: '/img/car/ferrari-f8-1200.webp', srcset: '/img/car/ferrari-f8-800.webp 800w, /img/car/ferrari-f8-1200.webp 1200w, /img/car/ferrari-f8-1600.webp 1600w' };

let cancel = () => {};
let raf = null;
let trigger = null;
let alive = true;
let done = false;

const set = (name, value) => root.value?.style.setProperty(name, value);
const expoOut = (t) => 1 - Math.pow(2, -10 * t);
const quartInOut = (t) => (t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2);
const clamp01 = (v) => Math.min(1, Math.max(0, v));

// The LED edge is a % of the hero's width; the dull copy of the car is clipped in % of the car's
// width (the car is centred and scaled with the scene), so map one onto the other.
function edge(pos, zoom) {
    const W = root.value?.clientWidth || 1;
    const carW = (car.value?.offsetWidth || 1) * zoom;
    set('--car-pos', `${clamp01(((pos / 100) * W - (W - carW) / 2) / carW) * 100}%`);
}

function finish() {
    set('--x', '0%');
    set('--blur', '0px');
    set('--tilt', '0deg');
    set('--pan', '0%');
    set('--pos', `${props.rest}%`);
    set('--zoom', '1.1');
    set('--flash', '0');
    edge(props.rest, 1.1);
    root.value?.classList.add('is-parked');
    done = true;
    emit('arrived');
}

function play() {
    root.value?.classList.add('is-driving');
    // The clock starts on the first frame, not now: if the browser is busy and the first frame
    // comes late, the drive still plays from the beginning instead of skipping ahead.
    let start = null;
    const step = () => {
        // performance.now(), not the frame's timestamp: that can lag seconds behind on a busy device.
        const now = performance.now();
        start ??= now;
        const t = now - start;
        // drive
        const d = clamp01(t / ARRIVAL);
        const e = expoOut(d);
        set('--x', `${-140 + 140 * e}%`);
        set('--blur', `${10 * (1 - e)}px`);
        set('--pan', `${4 * (1 - e)}%`);
        // brake: the nose dips around 80–100 % of the drive, then settles
        const brake = d < 0.8 ? 0 : Math.sin(clamp01((d - 0.8) / 0.25) * Math.PI);
        set('--tilt', `${-1.6 * brake}deg`);
        if (d >= 1 && !root.value?.classList.contains('is-parked')) {
            root.value?.classList.add('is-parked');
            root.value?.classList.remove('is-driving');
            emit('arrived');
        }
        // flash of the ceiling lights as it stops
        const f = clamp01((t - 1550) / 450);
        set('--flash', `${Math.sin(f * Math.PI) * 0.55}`);
        // sweep
        const s = clamp01((t - 2000) / 1800);
        const pos = props.rest * quartInOut(s);
        set('--pos', `${pos}%`);
        // push in
        const z = clamp01((t - 2200) / 2800);
        const zoom = 1 + 0.1 * expoOut(z);
        set('--zoom', `${zoom}`);
        edge(pos, zoom);
        if (t < 5000) raf = requestAnimationFrame(step);
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
        setTimeout(play, 150);
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
                const zoom = 1.1 + 0.1 * self.progress;
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
    <div ref="root" class="hero-drive absolute inset-0 overflow-hidden" style="--x: -140%; --blur: 0px; --tilt: 0deg; --pan: 4%; --pos: 0%; --zoom: 1; --flash: 0; --car-pos: 0%">
        <!-- the scene: backdrop + car, pushed in together -->
        <div class="absolute inset-0 origin-[50%_72%] will-change-transform" :style="{ transform: 'scale(var(--zoom))' }">
            <img v-bind="photo('hero-studio')" sizes="100vw" alt="" fetchpriority="high" decoding="async" class="absolute -inset-x-[5%] inset-y-0 w-[110%] h-full object-cover object-[50%_60%] will-change-transform" :style="{ transform: 'translateX(var(--pan))' }">
            <div class="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-ink/55"></div>

            <!-- LED speed streaks, only while driving -->
            <div class="absolute inset-x-0 bottom-[12%] sm:bottom-[8%] h-[46%] pointer-events-none" aria-hidden="true">
                <span v-for="n in 5" :key="n" class="streak absolute h-px w-[38vw] bg-gradient-to-r from-transparent via-led to-transparent opacity-0" :style="{ top: `${12 + n * 15}%`, animationDelay: `${n * 90}ms` }"></span>
            </div>

            <!-- the car: two copies, dull to the left of the LED edge, glossy to the right -->
            <div ref="car" class="car absolute bottom-[10%] sm:bottom-[6%] lg:bottom-[3%] left-1/2 w-[122vw] sm:w-[92vw] lg:w-[66vw] max-w-[1280px] will-change-transform"
                 :style="{ transform: 'translateX(calc(-50% + var(--x))) rotate(var(--tilt))', filter: 'blur(var(--blur))' }">
                <div class="absolute left-[6%] right-[6%] bottom-[1%] h-[16%] rounded-[50%] bg-black/75 blur-xl"></div>
                <img v-bind="CAR" sizes="(min-width: 1024px) 66vw, 120vw" alt="" aria-hidden="true" decoding="async" class="absolute left-0 top-[96%] w-full -scale-y-100 opacity-30 [mask-image:linear-gradient(to_bottom,rgba(0,0,0,.6),transparent_55%)] pointer-events-none">
                <img v-bind="CAR" sizes="(min-width: 1024px) 66vw, 120vw" :alt="alt" fetchpriority="high" decoding="async" class="relative block w-full h-auto">
                <img v-bind="CAR" sizes="(min-width: 1024px) 66vw, 120vw" alt="" aria-hidden="true" decoding="async" class="dull absolute inset-0 w-full h-auto grayscale contrast-[0.8] brightness-[0.55]" :style="{ clipPath: 'inset(0 calc(100% - var(--car-pos)) 0 0)' }">
            </div>
        </div>

        <!-- the ceiling lights flare as the car stops -->
        <div class="absolute inset-0 bg-led pointer-events-none mix-blend-screen" :style="{ opacity: 'var(--flash)' }"></div>

        <!-- the LED edge, over everything -->
        <div class="absolute inset-y-0 led-v -translate-x-1/2 z-[2]" :style="{ left: 'var(--pos)' }"></div>
        <div class="absolute inset-y-0 w-40 -translate-x-full z-[1] bg-gradient-to-r from-transparent to-led/15 pointer-events-none" :style="{ left: 'var(--pos)' }"></div>
        <span class="absolute left-5 sm:left-8 bottom-6 font-display text-[10px] tracking-[0.3em] text-white/50 z-[2]">{{ beforeLabel }}</span>
        <span class="absolute right-5 sm:right-8 bottom-6 font-display text-[10px] tracking-[0.3em] text-led z-[2]">{{ afterLabel }}</span>
    </div>
</template>

<style scoped>
/* While driving the whole car is "before"; the clip only matters once it is parked. */
.hero-drive:not(.is-parked) .dull { clip-path: none !important; }

@keyframes streak {
    0% { transform: translateX(-60vw); opacity: 0; }
    15% { opacity: 1; }
    100% { transform: translateX(140vw); opacity: 0; }
}
.is-driving .streak { animation: streak 1.1s cubic-bezier(0.2, 0.7, 0.3, 1) both; }
</style>
