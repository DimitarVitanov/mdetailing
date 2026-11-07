<script setup>
import { computed, onBeforeUnmount, onMounted, ref, useAttrs } from 'vue';
import { gsap, reducedMotion, ScrollTrigger } from '@/lib/motion';
import { observeReveal, unobserveReveal } from '@/directives/reveal';
import { afterFirstPaint } from '@/lib/img';
import { whenReady } from '@/lib/intro';

// A responsive photo that unmasks when it scrolls in and drifts with the scroll.
//   image:    { src, srcset } from lib/img.js (photo(), upload(), imageFor())
//   reveal:   'diagonal' (default) | 'up' | 'side' | 'none'
//   parallax: how far (in % of its height) the image drifts inside its frame
//   hero:     reveal after the intro / page wipe instead of on scroll
const props = defineProps({
    image: { type: Object, required: true },
    alt: { type: String, default: '' },
    sizes: { type: String, default: '100vw' },
    reveal: { type: String, default: 'diagonal' },
    parallax: { type: Number, default: 10 },
    priority: { type: Boolean, default: false },
    imgClass: { type: String, default: '' },
    position: { type: String, default: 'center' },
    hero: { type: Boolean, default: false },
    delay: { type: Number, default: 0 },
});

const attrs = useAttrs();
const positioned = computed(() => /\b(absolute|fixed|sticky)\b/.test(String(attrs.class ?? '')));

const frame = ref(null);
const img = ref(null);
let trigger = null;
let cancel = () => {};

// Photos that aren't needed for the first paint ask for their file once the page has painted.
const load = ref(props.priority);

onMounted(() => {
    if (!load.value) afterFirstPaint(() => (load.value = true));
    if (props.reveal === 'none') frame.value.classList.add('is-revealed');
    else if (props.hero) cancel = whenReady(() => setTimeout(() => frame.value?.classList.add('is-revealed'), props.delay));
    else observeReveal(frame.value);

    if (props.parallax && !reducedMotion()) {
        const tween = gsap.fromTo(img.value, { yPercent: -props.parallax / 2 }, { yPercent: props.parallax / 2, ease: 'none' });
        trigger = ScrollTrigger.create({ trigger: frame.value, start: 'top bottom', end: 'bottom top', scrub: true, animation: tween });
    }
});

onBeforeUnmount(() => {
    cancel();
    unobserveReveal(frame.value);
    trigger?.animation?.kill();
    trigger?.kill();
});
</script>

<template>
    <div ref="frame" class="photo overflow-hidden" :class="[`photo--${reveal}`, { relative: !positioned }]">
        <div class="photo-mask absolute inset-0 overflow-hidden">
            <div class="photo-zoom absolute inset-0">
                <img
                    ref="img"
                    :loading="priority ? 'eager' : 'lazy'"
                    :fetchpriority="priority ? 'high' : undefined"
                    :sizes="sizes"
                    :srcset="load ? image.srcset : undefined"
                    :src="load ? image.src : undefined"
                    :alt="alt"
                    decoding="async"
                    class="photo-img absolute left-0 w-full object-cover"
                    :class="[imgClass, parallax ? '-top-[8%] h-[116%]' : 'top-0 h-full']"
                    :style="{ objectPosition: position }"
                >
            </div>
        </div>
        <slot />
    </div>
</template>

<style scoped>
.photo--diagonal .photo-mask {
    clip-path: polygon(0 100%, 0 100%, 0 100%, 0 100%);
    transition: clip-path 1.4s var(--ease-forge);
}
.photo--diagonal.is-revealed .photo-mask { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); }
.photo--up .photo-mask { clip-path: inset(100% 0 0 0); transition: clip-path 1.3s var(--ease-forge); }
.photo--side .photo-mask { clip-path: inset(0 100% 0 0); transition: clip-path 1.3s var(--ease-forge); }
.photo--up.is-revealed .photo-mask,
.photo--side.is-revealed .photo-mask { clip-path: inset(0 0 0 0); }

.photo-zoom { transform: scale(1.25); transition: transform 1.8s var(--ease-forge); }
.is-revealed .photo-zoom,
.photo--none .photo-zoom { transform: none; }

@media (prefers-reduced-motion: reduce) {
    .photo-mask { clip-path: none !important; transition: none !important; }
    .photo-zoom { transform: none; transition: none; }
}
</style>
