<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { router } from '@inertiajs/vue3';
import { loadMotion, reducedMotion, scrollToTop } from '@/lib/motion';
import { markBusy, markReady } from '@/lib/intro';

// One overlay, two jobs, both plain CSS transitions (no script library on the first screen):
//  1. The intro on the first page of a visit: the studio's hex lights flicker on one by one,
//     the logo appears, then the shutter rolls up.
//  2. Between public pages, an LED sweep crosses the screen while the page swaps.
// Admin and login pages skip both.

const root = ref(null);
const intro = ref(false);
const introPhase = ref(''); // '' | 'leaving' | 'open'
const wiping = ref(false);
const wipePhase = ref(''); // '' | 'cover' | 'leave'

// A square honeycomb, cropped to the screen, each light with its own switch-on delay.
const COLS = 10;
const ROWS = 11;
const hexes = Array.from({ length: COLS * ROWS }, (_, i) => ({ col: i % COLS, row: Math.floor(i / COLS), delay: Math.random() * 0.6 }));

const isApp = (path) => /^\/(admin|login)/.test(path);
const pathOf = (url) => new URL(url, window.location.origin).pathname;

let covered = null;
const timers = [];
const offs = [];
const after = (ms, fn) => timers.push(setTimeout(fn, ms));

function playIntro() {
    let seen = false;
    try {
        seen = sessionStorage.getItem('md-intro') === '1';
        sessionStorage.setItem('md-intro', '1');
    } catch {}

    // The server printed the intro's first frame (#intro-shell in app.blade.php); this overlay
    // continues from it.
    const shell = document.getElementById('intro-shell');

    if (seen || reducedMotion() || isApp(window.location.pathname)) {
        shell?.remove();
        markReady();
        return;
    }

    intro.value = true;
    document.documentElement.style.overflow = 'hidden';
    // The server's logo stays exactly where it is (moving or redrawing it would count as a new,
    // later largest-contentful-paint); this overlay draws the lights behind it and fades it out.
    if (shell) Object.assign(shell.style, { background: 'transparent', animation: 'none', transition: 'opacity 0.25s ease-in' });
    after(1300, () => {
        introPhase.value = 'leaving';
        if (shell) shell.style.opacity = '0';
    });
    after(1450, () => {
        markReady();
        introPhase.value = 'open';
    });
    after(2650, () => {
        shell?.remove();
        intro.value = false;
        document.documentElement.style.overflow = '';
        loadMotion().then(({ ScrollTrigger }) => ScrollTrigger.refresh());
    });
}

function cover() {
    wiping.value = true;
    markBusy();
    covered = new Promise((resolve) => {
        requestAnimationFrame(() => {
            wipePhase.value = 'cover';
            after(620, resolve);
        });
    });
}

async function uncover() {
    if (!covered) return;
    await covered;
    covered = null;
    scrollToTop();
    loadMotion().then(({ ScrollTrigger }) => ScrollTrigger.refresh());
    wipePhase.value = 'leave';
    after(200, markReady);
    after(900, () => {
        wiping.value = false;
        wipePhase.value = '';
    });
}

onMounted(() => {
    playIntro();
    offs.push(router.on('start', (event) => {
        const visit = event.detail.visit;
        if (visit.method !== 'get' || reducedMotion() || covered) return;
        const from = window.location.pathname;
        const to = visit.url.pathname ?? pathOf(visit.url);
        if (from === to || isApp(from) || isApp(to)) return;
        cover();
    }));
    offs.push(router.on('navigate', () => { if (covered) uncover(); }));
    offs.push(router.on('finish', () => { if (covered) setTimeout(() => { if (covered) uncover(); }, 60); }));
});

onBeforeUnmount(() => {
    offs.forEach((off) => off());
    timers.forEach(clearTimeout);
});
</script>

<template>
    <div ref="root" aria-hidden="true">
        <!-- Intro: lights on, then the shutter rolls up -->
        <!-- z-index just under #intro-shell (199), so the lights show behind the server's logo -->
        <div v-if="intro" class="fixed inset-0 z-[198] overflow-hidden">
            <div class="intro-shutter absolute inset-0 bg-ink" :class="introPhase">
                <div class="absolute inset-0 opacity-60" style="background-image: repeating-linear-gradient(180deg, transparent 0 46px, rgb(255 255 255 / 0.05) 46px 48px);"></div>
                <svg class="absolute inset-0 w-full h-full" viewBox="0 0 960 960" preserveAspectRatio="xMidYMid slice">
                    <g v-for="(h, i) in hexes" :key="i" :transform="`translate(${30 + h.col * 96 + (h.row % 2 ? 48 : 0)} ${40 + h.row * 84})`">
                        <polygon class="intro-hex" points="0,-50 43,-25 43,25 0,50 -43,25 -43,-25" fill="none" stroke="#bfe9ff" stroke-width="2" :style="{ animationDelay: `${h.delay}s`, filter: 'drop-shadow(0 0 6px #bfe9ff)' }" />
                    </g>
                </svg>
                <div class="led-signal absolute bottom-0 inset-x-0"></div>
            </div>
        </div>

        <!-- Page sweep -->
        <div v-show="wiping" class="fixed inset-0 z-[190] pointer-events-none overflow-hidden" :class="wipePhase">
            <div class="wipe-panel wipe-led absolute inset-0 bg-led"></div>
            <div class="wipe-panel wipe-dark absolute inset-0 bg-ink grain flex items-center justify-center">
                <picture>
                    <source type="image/avif" srcset="/img/brand/logo-480.avif 480w, /img/brand/logo-720.avif 720w" sizes="(min-width: 640px) 10rem, 8rem">
                    <img class="wipe-logo w-32 sm:w-40 h-auto" src="/img/brand/logo-240.webp" srcset="/img/brand/logo-240.webp 240w, /img/brand/logo-480.webp 480w, /img/brand/logo-720.webp 720w" sizes="(min-width: 640px) 10rem, 8rem" alt="" width="240" height="180" fetchpriority="low">
                </picture>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* intro */
@keyframes hex-on { 0% { opacity: 0; } 40% { opacity: 1; } 55% { opacity: 0.25; } 70% { opacity: 1; } 100% { opacity: 0.35; } }
.intro-hex { opacity: 0; animation: hex-on 0.9s steps(1, end) forwards; }
/* The logo is visible from the first frame (it is the page's first contentful paint); only its scale settles. */

.intro-shutter { transition: transform 1.1s var(--ease-in-out-quart); }
.intro-shutter.open { transform: translateY(-102%); }

/* page sweep */
.wipe-panel { transform: translateX(-102%); transition: transform 0.55s var(--ease-in-out-quart); }
.wipe-dark { transition-delay: 0.07s; }
.wipe-logo { opacity: 0; transform: scale(0.85); transition: opacity 0.35s var(--ease-forge) 0.35s, transform 0.35s var(--ease-forge) 0.35s; }
.cover .wipe-panel { transform: translateX(0); }
.cover .wipe-logo { opacity: 1; transform: none; }
.leave .wipe-panel { transform: translateX(102%); transition-duration: 0.7s; }
.leave .wipe-dark { transition-delay: 0s; }
.leave .wipe-led { transition-delay: 0.07s; }
.leave .wipe-logo { opacity: 0; transform: scale(1.1); transition-delay: 0s; transition-duration: 0.25s; }
</style>
