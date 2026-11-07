<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { loadMotion, reducedMotion } from '@/lib/motion';

// A statement whose words light up one by one as you scroll through it.
const props = defineProps({
    text: { type: String, required: true },
    highlight: { type: Array, default: () => [] },
    tag: { type: String, default: 'p' },
    highlightClass: { type: String, default: 'text-signal' },
});

const el = ref(null);
const words = computed(() => props.text.split(/\s+/).filter(Boolean));
const marked = (word) => props.highlight.includes(word.replace(/[^\p{L}'’-]/gu, '').toLowerCase());
let tween = null;
let alive = true;

onMounted(async () => {
    if (reducedMotion()) return;
    const { gsap } = await loadMotion();
    if (!alive) return;
    tween = gsap.fromTo(
        el.value.querySelectorAll('.scrub-word'),
        { opacity: 0.14 },
        { opacity: 1, ease: 'none', stagger: 0.08, scrollTrigger: { trigger: el.value, start: 'top 82%', end: 'bottom 45%', scrub: 0.6 } },
    );
});

onBeforeUnmount(() => {
    alive = false;
    tween?.scrollTrigger?.kill();
    tween?.kill();
});
</script>

<template>
    <component :is="tag" ref="el">
        <template v-for="(word, i) in words" :key="i">
            <span class="scrub-word" :class="marked(word) ? highlightClass : ''">{{ word }}</span>{{ ' ' }}
        </template>
    </component>
</template>
