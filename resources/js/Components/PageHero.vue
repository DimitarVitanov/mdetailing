<template>
    <section class="relative isolate overflow-hidden pb-14 pt-32 md:pb-20 md:pt-44">
        <div class="absolute inset-0 -z-10">
            <img v-if="image" v-bind="photo(image)" sizes="100vw" alt="" fetchpriority="high"
                 class="h-full w-full object-cover opacity-35" />
            <div class="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/80 to-ink"></div>
            <div class="hex-grid absolute inset-x-0 top-0 h-[120%] opacity-80"></div>
            <div class="glow absolute -top-48 left-1/2 h-[36rem] w-[64rem] max-w-[200%] -translate-x-1/2"></div>
        </div>

        <div class="container-x">
            <nav v-if="crumbs?.length" aria-label="Breadcrumb" class="rise mb-8 flex flex-wrap items-center gap-2 text-xs text-white/50">
                <template v-for="(crumb, i) in crumbs" :key="crumb.href">
                    <Link :href="crumb.href" class="transition-colors hover:text-white">{{ crumb.label }}</Link>
                    <Icon v-if="i < crumbs.length - 1" name="chevron-right" :size="12" />
                </template>
            </nav>

            <span v-if="label" class="eyebrow rise">{{ label }}</span>
            <h1 class="display slide mt-6 max-w-5xl text-[clamp(2.1rem,6vw,4.8rem)]">
                <span class="chrome">{{ title }}</span>
                <template v-if="accent">{{ ' ' }}<span class="signal-text">{{ accent }}</span></template>
            </h1>
            <p v-if="subtitle" class="slide mt-6 max-w-2xl text-base leading-relaxed text-white/65 md:text-lg" style="--d: 60ms">{{ subtitle }}</p>
            <slot />
        </div>
    </section>
</template>

<script setup>
import { Link } from '@inertiajs/vue3';
import Icon from '@/Components/Icon.vue';
import { photo } from '@/lib/img.js';

defineProps({
    label: String,
    title: String,
    accent: String,
    subtitle: String,
    image: String,
    crumbs: Array,
});
</script>
