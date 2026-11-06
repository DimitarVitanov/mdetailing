<template>
    <section v-if="stats.length" class="relative border-y border-white/[0.06] bg-ink-2">
        <div class="container-x">
            <div class="grid grid-cols-2 gap-px bg-white/[0.06] lg:grid-cols-4">
                <div v-for="(stat, i) in stats" :key="i" v-reveal:[i*80] class="bg-ink-2 px-2 py-9 text-center md:py-12">
                    <div class="display chrome text-[clamp(2rem,4.4vw,3.4rem)]">{{ stat.value }}</div>
                    <div class="mt-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/50">{{ stat.label }}</div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from '@/i18n.js';

const { c } = useI18n();

// Numbers edited in the admin (Content → stats.*); a stat left empty there is hidden.
const stats = computed(() =>
    ['cars', 'clients', 'years', 'rating']
        .map((key) => ({ value: c(`stats.${key}.value`), label: c(`stats.${key}.label`) }))
        .filter((stat) => stat.value),
);
</script>
