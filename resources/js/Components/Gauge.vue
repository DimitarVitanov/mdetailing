<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { observeReveal, unobserveReveal } from '@/directives/reveal';
import Odometer from '@/Components/Odometer.vue';

// A dashboard gauge: a 270° arc that draws itself when it scrolls in, the number rolling into
// place inside it.
defineProps({
    value: { type: [String, Number], required: true },
    label: { type: String, default: '' },
});

const el = ref(null);
onMounted(() => observeReveal(el.value));
onBeforeUnmount(() => unobserveReveal(el.value));

// r=44 → circumference 276.5; 270° of it is 207.3
const ARC = 207.3;
</script>

<template>
    <div ref="el" class="gauge relative flex flex-col items-center">
        <svg class="w-40 h-40 sm:w-48 sm:h-48" viewBox="0 0 100 100">
            <!-- ticks -->
            <g stroke="rgba(255,255,255,0.12)" stroke-width="1">
                <line v-for="n in 13" :key="n" x1="50" y1="2" x2="50" y2="7" :transform="`rotate(${-135 + (n - 1) * 22.5} 50 50)`" />
            </g>
            <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="3" :stroke-dasharray="`${ARC} 276.5`" stroke-linecap="round" transform="rotate(135 50 50)" />
            <circle class="gauge-arc" cx="50" cy="50" r="44" fill="none" stroke="var(--color-signal)" stroke-width="3" :stroke-dasharray="`${ARC} 276.5`" :stroke-dashoffset="ARC" stroke-linecap="round" transform="rotate(135 50 50)" style="filter: drop-shadow(0 0 4px rgb(255 198 41 / 0.7))" />
        </svg>
        <div class="absolute inset-0 flex flex-col items-center justify-center">
            <p class="font-display text-3xl sm:text-4xl text-white leading-none"><Odometer :value="value" /></p>
        </div>
        <p class="mt-2 font-display text-[10px] tracking-[0.25em] text-steel text-center">{{ label }}</p>
    </div>
</template>

<style scoped>
.gauge-arc { transition: stroke-dashoffset 2.2s var(--ease-forge); }
.gauge.is-revealed .gauge-arc { stroke-dashoffset: 0; }
@media (prefers-reduced-motion: reduce) { .gauge-arc { stroke-dashoffset: 0 !important; transition: none; } }
</style>
