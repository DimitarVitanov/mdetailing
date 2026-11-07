<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { reducedMotion } from '@/lib/motion';
import { whenReady } from '@/lib/intro';

// The home page's opening shot: the 3D car driving in from far away down a night road, rendered
// offline into a short video (tools/car-render). The phone only plays it: hardware decoded, no
// WebGL, nothing on the main thread, the same on every device.
//
// The first frame is a plain image, preloaded by the controller. The video is fetched as soon as
// the page is up, so its own first frame (the same picture) is already on screen while the intro
// still covers the page: it is not a new, later largest paint, and the drive starts the moment
// the intro lets go, with nothing left to buffer. With reduced motion, Save-Data, a refused
// autoplay or a connection too slow to have it ready in time, the last frame (the parked car) is
// shown instead.
const WIDE = '(min-width: 1024px)';
const GIVE_UP_MS = 8000;

const video = ref(null);
const state = ref('poster'); // poster → playing, or still
let alive = true;
let cancel = () => {};
let timer = null;
let canPlay = false;
let uncovered = false;

const saveData = () => {
    const c = navigator.connection;
    return !!c && (c.saveData || /(^|-)2g$/.test(c.effectiveType || ''));
};

function still() {
    clearTimeout(timer);
    if (!alive || state.value === 'still') return;
    state.value = 'still';
    video.value?.pause();
}

function play() {
    if (!alive || !canPlay || !uncovered || state.value !== 'poster') return;
    clearTimeout(timer);
    state.value = 'playing';
    video.value.play().catch(still);
}

onMounted(() => {
    if (reducedMotion() || saveData()) {
        state.value = 'still';
        return;
    }
    const v = video.value;
    v.addEventListener('canplaythrough', () => { canPlay = true; play(); }, { once: true });
    v.addEventListener('error', still, { once: true });
    v.muted = true;
    v.src = `/video/drive-${matchMedia(WIDE).matches ? 'wide' : 'tall'}.mp4`;
    v.load();
    timer = setTimeout(still, GIVE_UP_MS);
    cancel = whenReady(() => { uncovered = true; play(); });
});

onBeforeUnmount(() => {
    alive = false;
    cancel();
    clearTimeout(timer);
    const v = video.value;
    if (v) {
        v.pause();
        v.removeAttribute('src');
        v.load();
    }
});
</script>

<template>
    <div class="relative w-full aspect-[944/800] max-h-[64vh] lg:aspect-[1920/648] lg:max-h-[70vh] overflow-hidden bg-ink" aria-hidden="true">
        <picture>
            <source :media="WIDE" :srcset="`/video/drive-wide-${state === 'still' ? 'last' : 'first'}.webp`" width="1920" height="648">
            <img :src="`/video/drive-tall-${state === 'still' ? 'last' : 'first'}.webp`" width="944" height="800" alt="" fetchpriority="high" class="absolute inset-0 w-full h-full object-cover">
        </picture>
        <!-- transparent until its first frame is in, then that frame covers the identical image -->
        <video ref="video" muted playsinline preload="auto" disablepictureinpicture disableremoteplayback tabindex="-1"
               class="absolute inset-0 w-full h-full object-cover" :class="{ invisible: state === 'still' }"></video>
        <!-- soft edges, so the frame melts into the page -->
        <div class="absolute inset-x-0 top-0 h-[22%] bg-gradient-to-b from-ink to-transparent"></div>
        <div class="absolute inset-x-0 bottom-0 h-[26%] bg-gradient-to-t from-ink to-transparent"></div>
        <div class="absolute inset-y-0 left-0 w-[8%] bg-gradient-to-r from-ink to-transparent"></div>
        <div class="absolute inset-y-0 right-0 w-[8%] bg-gradient-to-l from-ink to-transparent"></div>
    </div>
</template>
