<template>
    <section class="relative isolate overflow-hidden py-24 md:py-36">
        <div class="absolute inset-0 -z-10">
            <img v-bind="photo(image)" sizes="100vw" alt="" loading="lazy" decoding="async" class="h-full w-full object-cover" />
            <div class="absolute inset-0 bg-ink/80"></div>
            <div class="absolute inset-0 bg-gradient-to-b from-ink via-transparent to-ink"></div>
            <div class="hex-grid absolute inset-0 opacity-70"></div>
        </div>

        <div class="container-x text-center">
            <div v-reveal class="mx-auto max-w-4xl">
                <div class="led-signal mx-auto mb-10 w-24"></div>
                <h2 class="display text-[clamp(2rem,5.4vw,4.4rem)]">
                    <span class="chrome">{{ title }}</span>
                    <template v-if="accent">{{ ' ' }}<span class="signal-text">{{ accent }}</span></template>
                </h2>
                <p v-if="text" class="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/65 md:text-lg">{{ text }}</p>

                <div class="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <Link href="/contact" class="btn btn-signal w-full sm:w-auto">
                        {{ button }} <Icon name="arrow-right" :size="18" class="btn-arrow" />
                    </Link>
                    <Link v-if="secondary" :href="secondaryHref" class="btn btn-ghost w-full sm:w-auto">{{ secondary }}</Link>
                    <a v-else-if="phone" :href="telHref(phone)" class="btn btn-ghost w-full sm:w-auto">
                        <Icon name="phone" :size="17" /> {{ phone }}
                    </a>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { Link } from '@inertiajs/vue3';
import Icon from '@/Components/Icon.vue';
import { telHref } from '@/i18n.js';
import { photo } from '@/lib/img.js';

defineProps({
    title: String,
    accent: String,
    text: String,
    button: String,
    secondary: String,
    secondaryHref: { type: String, default: '/services' },
    phone: String,
    image: { type: String, default: 'ferrari-02' },
});
</script>
