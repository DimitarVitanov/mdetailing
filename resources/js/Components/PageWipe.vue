<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { router } from '@inertiajs/vue3';
import { gsap, reducedMotion, scrollToTop, ScrollTrigger } from '@/lib/motion';
import { markBusy, markReady } from '@/lib/intro';

// One overlay, two jobs:
//  1. The intro on the first page of a visit: the studio's hex lights flicker on one by one,
//     the logo appears, then the shutter rolls up.
//  2. Between public pages, an LED sweep crosses the screen while the page swaps.
// Admin and login pages skip both.

const root = ref(null);
const intro = ref(false);
const wiping = ref(false);

// A square honeycomb for the intro, cropped to the screen (so phones and desktops both see a field of lights).
const COLS = 10;
const ROWS = 11;
const hexes = Array.from({ length: COLS * ROWS }, (_, i) => ({ col: i % COLS, row: Math.floor(i / COLS) }));

const isApp = (path) => /^\/(admin|login)/.test(path);
const pathOf = (url) => new URL(url, window.location.origin).pathname;

let covered = null;
let tl = null;
const offs = [];

function playIntro() {
    let seen = false;
    try {
        seen = sessionStorage.getItem('md-intro') === '1';
        sessionStorage.setItem('md-intro', '1');
    } catch {}

    if (seen || reducedMotion() || isApp(window.location.pathname)) {
        markReady();
        return;
    }

    intro.value = true;
    document.documentElement.style.overflow = 'hidden';

    requestAnimationFrame(() => {
        const el = root.value;
        tl = gsap.timeline({
            onComplete: () => {
                intro.value = false;
                document.documentElement.style.overflow = '';
                ScrollTrigger.refresh();
            },
        });
        tl.to(el.querySelectorAll('.intro-hex'), { opacity: 1, duration: 0.12, stagger: { each: 0.007, from: 'random' }, ease: 'steps(1)' })
            .to(el.querySelectorAll('.intro-hex'), { opacity: 0.35, duration: 0.3 }, 0.75)
            .from(el.querySelector('.intro-logo'), { scale: 0.7, opacity: 0, duration: 0.6, ease: 'expo.out' }, 0.55)
            .from(el.querySelector('.intro-line'), { scaleX: 0, duration: 0.7, ease: 'expo.inOut' }, 0.7)
            .to(el.querySelector('.intro-center'), { opacity: 0, duration: 0.25, ease: 'power2.in' }, 1.35)
            .add(markReady, 1.45)
            .to(el.querySelector('.intro-shutter'), { yPercent: -102, duration: 1.1, ease: 'expo.inOut' }, 1.4);
    });
}

function cover() {
    wiping.value = true;
    markBusy();
    covered = new Promise((resolve) => {
        requestAnimationFrame(() => {
            const el = root.value;
            gsap.killTweensOf(el.querySelectorAll('.wipe-panel, .wipe-logo'));
            gsap.set(el.querySelectorAll('.wipe-panel'), { xPercent: -102 });
            gsap.set(el.querySelector('.wipe-logo'), { opacity: 0, scale: 0.85 });
            gsap.timeline({ onComplete: resolve })
                .to(el.querySelector('.wipe-led'), { xPercent: 0, duration: 0.55, ease: 'expo.inOut' })
                .to(el.querySelector('.wipe-dark'), { xPercent: 0, duration: 0.55, ease: 'expo.inOut' }, 0.07)
                .to(el.querySelector('.wipe-logo'), { opacity: 1, scale: 1, duration: 0.35, ease: 'expo.out' }, 0.4);
        });
    });
}

async function uncover() {
    if (!covered) return;
    await covered;
    covered = null;
    scrollToTop();
    ScrollTrigger.refresh();
    const el = root.value;
    gsap.timeline({ onComplete: () => (wiping.value = false) })
        .to(el.querySelector('.wipe-logo'), { opacity: 0, scale: 1.1, duration: 0.25, ease: 'power2.in' })
        .add(markReady, 0.2)
        .to(el.querySelector('.wipe-dark'), { xPercent: 102, duration: 0.7, ease: 'expo.inOut' }, 0.1)
        .to(el.querySelector('.wipe-led'), { xPercent: 102, duration: 0.7, ease: 'expo.inOut' }, 0.17);
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
    tl?.kill();
});
</script>

<template>
    <div ref="root" aria-hidden="true">
        <!-- Intro: lights on, then the shutter rolls up -->
        <div v-if="intro" class="fixed inset-0 z-[200] overflow-hidden">
            <div class="intro-shutter absolute inset-0 bg-ink">
                <!-- shutter slats -->
                <div class="absolute inset-0 opacity-60" style="background-image: repeating-linear-gradient(180deg, transparent 0 46px, rgb(255 255 255 / 0.05) 46px 48px);"></div>
                <!-- honeycomb lights -->
                <svg class="absolute inset-0 w-full h-full" viewBox="0 0 960 960" preserveAspectRatio="xMidYMid slice">
                    <g v-for="(h, i) in hexes" :key="i" :transform="`translate(${30 + h.col * 96 + (h.row % 2 ? 48 : 0)} ${40 + h.row * 84})`">
                        <polygon class="intro-hex" points="0,-50 43,-25 43,25 0,50 -43,25 -43,-25" fill="none" stroke="#bfe9ff" stroke-width="2" opacity="0" style="filter: drop-shadow(0 0 6px #bfe9ff)" />
                    </g>
                </svg>
                <div class="intro-center absolute inset-0 flex flex-col items-center justify-center gap-8">
                    <img class="intro-logo w-56 sm:w-72 h-auto drop-shadow-[0_0_40px_rgba(255,198,41,0.35)]" src="/img/brand/logo-240.webp" srcset="/img/brand/logo-240.webp 1x, /img/brand/logo-480.webp 2x" alt="" width="240" height="180">
                    <span class="intro-line led w-48 origin-center"></span>
                </div>
                <div class="led-signal absolute bottom-0 inset-x-0"></div>
            </div>
        </div>

        <!-- Page sweep -->
        <div v-show="wiping" class="fixed inset-0 z-[190] pointer-events-none overflow-hidden">
            <div class="wipe-panel wipe-led absolute inset-0 bg-led"></div>
            <div class="wipe-panel wipe-dark absolute inset-0 bg-ink grain flex items-center justify-center">
                <img class="wipe-logo w-32 sm:w-40 h-auto" src="/img/brand/logo-240.webp" alt="" width="240" height="180">
            </div>
        </div>
    </div>
</template>
