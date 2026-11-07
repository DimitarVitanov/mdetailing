<script setup>
import { Link } from '@inertiajs/vue3';
import MaskLines from '@/Components/MaskLines.vue';
import Photo from '@/Components/Photo.vue';
import Sparks from '@/Components/Sparks.vue';
import { useI18n } from '@/i18n.js';
import { photo } from '@/lib/img.js';

// Opening section of the inner pages: a photo under a dark veil, breadcrumb, eyebrow and an
// oversized title that rises line by line.
defineProps({
    eyebrow: { type: String, required: true },
    lines: { type: Array, required: true },
    image: { type: String, default: null },
    position: { type: String, default: 'center' },
    crumb: { type: String, default: null },
});

const { t } = useI18n();
</script>

<template>
    <section class="relative min-h-[72svh] flex items-end overflow-hidden pt-32 pb-16 sm:pb-20 grain">
        <Photo v-if="image" hero priority :image="photo(image)" alt="" sizes="100vw" reveal="none" :parallax="20" :position="position" class="absolute inset-0" img-class="opacity-60" />
        <div class="absolute inset-0 bg-gradient-to-t from-ink via-ink/75 to-ink/30"></div>
        <div class="absolute inset-0 opacity-60"><Sparks :density="0.5" /></div>

        <div class="relative container-x">
            <nav class="flex items-center gap-3 font-display text-[10px] tracking-[0.25em] text-steel mb-10" aria-label="Breadcrumb">
                <Link href="/" class="hover:text-white transition-colors">{{ t('footer.home') }}</Link>
                <span class="w-6 h-px bg-signal"></span>
                <span class="text-white">{{ crumb || eyebrow }}</span>
            </nav>
            <p class="eyebrow mb-6">{{ eyebrow }}</p>
            <MaskLines tag="h1" hero :delay="100" class="font-display text-[10.5vw] sm:text-7xl lg:text-8xl xl:text-[7.5rem] leading-[0.9] max-w-5xl" :lines="lines" />
            <div v-if="$slots.default" class="mt-8 max-w-2xl text-body text-lg leading-relaxed">
                <slot />
            </div>
        </div>
        <div class="led absolute bottom-0 inset-x-0 opacity-50"></div>
    </section>
</template>
