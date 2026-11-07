<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { observeReveal, unobserveReveal } from '@/directives/reveal';

// A number whose digits roll into place like a mechanical counter when it scrolls in.
const props = defineProps({ value: { type: [String, Number], required: true } });

const el = ref(null);
const chars = computed(() => String(props.value).split(''));

onMounted(() => observeReveal(el.value));
onBeforeUnmount(() => unobserveReveal(el.value));
</script>

<template>
    <span ref="el" class="odometer inline-flex tabular-nums">
        <span class="sr-only">{{ value }}</span>
        <template v-for="(char, i) in chars" :key="i">
            <span v-if="/\d/.test(char)" class="relative inline-block overflow-hidden h-[1.15em] leading-[1.15em]" aria-hidden="true">
                <span class="odo-strip flex flex-col" :style="{ '--digit': char, '--i': i }">
                    <span v-for="n in 10" :key="n" class="h-[1.15em] leading-[1.15em]">{{ n - 1 }}</span>
                </span>
            </span>
            <span v-else class="leading-[1.15em]" aria-hidden="true">{{ char }}</span>
        </template>
    </span>
</template>

<style scoped>
.odo-strip { transform: translateY(0); transition: transform 2.2s var(--ease-forge); transition-delay: calc(var(--i) * 140ms); }
.is-revealed .odo-strip { transform: translateY(calc(var(--digit) * -1.15em)); }
@media (prefers-reduced-motion: reduce) {
    .odo-strip { transform: translateY(calc(var(--digit) * -1.15em)); transition: none; }
}
</style>
