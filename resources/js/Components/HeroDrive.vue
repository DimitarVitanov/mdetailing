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
// Bumped whenever the videos are rendered again, so no browser keeps an old copy (the posters'
// preload in PageController::home carries the same version).
const V = '?v=4';

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
    v.src = `/video/drive-${matchMedia(WIDE).matches ? 'wide' : 'tall'}.mp4${V}`;
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
    <!-- sized by the page (Home.vue); the video covers whatever box it is given, trimming more sky
         than road when the box is shorter than the video, so the car stays whole -->
    <div class="relative bg-ink" aria-hidden="true">
        <picture>
            <source :media="WIDE" :srcset="`/video/drive-wide-${state === 'still' ? 'last' : 'first'}.webp${V}`" width="1920" height="648">
            <img :src="`/video/drive-tall-${state === 'still' ? 'last' : 'first'}.webp${V}`" width="944" height="800" alt="" fetchpriority="high" class="absolute inset-0 w-full h-full object-cover object-[50%_72%]">
        </picture>
        <!-- transparent until its first frame is in, then that frame covers the identical image -->
        <video ref="video" muted playsinline preload="auto" disablepictureinpicture disableremoteplayback tabindex="-1"
               class="absolute inset-0 w-full h-full object-cover object-[50%_72%]" :class="{ invisible: state === 'still' }"></video>
        <!-- soft edges, so the frame melts into the page; they reach 1px past it, so no sliver of the
             video shows at its edge when the stage lands between pixels -->
        <div class="absolute -inset-x-px -top-px h-[22%] bg-gradient-to-b from-ink to-transparent"></div>
        <div class="absolute -inset-x-px -bottom-px h-[26%] bg-gradient-to-t from-ink to-transparent"></div>
        <div class="absolute -inset-y-px -left-px w-[8%] bg-gradient-to-r from-ink to-transparent"></div>
        <div class="absolute -inset-y-px -right-px w-[8%] bg-gradient-to-l from-ink to-transparent"></div>
    </div>
</template>
